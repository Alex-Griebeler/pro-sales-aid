import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-hotmart-hottok, hottok",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ACTIVATION_STATUSES = new Set(["approved", "complete", "active"]);

interface ParsedHotmartPayload {
  email: string;
  fullName: string | null;
  normalizedStatus: string;
  transactionId: string | null;
  productId: string | null;
  purchasedAt: string | null;
  accessExpiresAt: string | null;
  rawPayload: Record<string, unknown>;
}

interface ProfileRow {
  user_id: string;
  email: string;
  full_name: string | null;
  hotmart_status: string | null;
  hotmart_transaction_id: string | null;
  hotmart_product_id: string | null;
  purchased_at: string | null;
  access_expires_at: string | null;
  last_webhook_payload: Record<string, unknown> | null;
}

function jsonResponse(status: number, payload: Record<string, unknown>): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getPathString(source: Record<string, unknown>, path: string[]): string | null {
  let cursor: unknown = source;

  for (const key of path) {
    if (!isRecord(cursor)) return null;
    cursor = cursor[key];
  }

  if (typeof cursor !== "string") return null;
  const trimmed = cursor.trim();
  return trimmed ? trimmed : null;
}

function pickFirstString(source: Record<string, unknown>, candidates: string[][]): string | null {
  for (const candidate of candidates) {
    const value = getPathString(source, candidate);
    if (value) return value;
  }
  return null;
}

function normalizeStatus(rawStatus: string | null): string {
  return rawStatus?.trim().toLowerCase() ?? "";
}

function parseIsoDate(input: string | null): string | null {
  if (!input) return null;
  const millis = Date.parse(input);
  if (Number.isNaN(millis)) return null;
  return new Date(millis).toISOString();
}

function sanitizeBaseUrl(value: string | null): string {
  if (!value) return "http://localhost:5173";
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

async function readRequestPayload(req: Request): Promise<Record<string, unknown>> {
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = await req.json();
    return isRecord(body) ? body : {};
  }

  const raw = await req.text();
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return isRecord(parsed) ? parsed : {};
  } catch {
    const asForm = new URLSearchParams(raw);
    const formObject: Record<string, unknown> = {};
    for (const [key, value] of asForm.entries()) {
      formObject[key] = value;
    }
    return formObject;
  }
}

function parsePayload(payload: Record<string, unknown>): ParsedHotmartPayload | null {
  const email = pickFirstString(payload, [
    ["data", "buyer", "email"],
    ["buyer", "email"],
    ["purchase", "buyer", "email"],
    ["email"],
  ]);

  if (!email) return null;

  const fullName = pickFirstString(payload, [
    ["data", "buyer", "name"],
    ["buyer", "name"],
    ["name"],
  ]);

  const status = normalizeStatus(
    pickFirstString(payload, [
      ["data", "purchase", "status"],
      ["purchase", "status"],
      ["status"],
    ]),
  );

  const transactionId = pickFirstString(payload, [
    ["data", "purchase", "transaction"],
    ["purchase", "transaction"],
    ["data", "purchase", "order_id"],
    ["order_id"],
    ["transaction"],
  ]);

  const productId = pickFirstString(payload, [
    ["data", "product", "id"],
    ["product", "id"],
    ["data", "purchase", "offer", "code"],
    ["offer", "code"],
    ["product_id"],
  ]);

  const purchasedAt = parseIsoDate(
    pickFirstString(payload, [
      ["data", "purchase", "approved_date"],
      ["purchase", "approved_date"],
      ["data", "purchase", "purchase_date"],
      ["purchase_date"],
    ]),
  );

  const accessExpiresAt = parseIsoDate(
    pickFirstString(payload, [
      ["data", "subscription", "next_charge_date"],
      ["subscription", "next_charge_date"],
      ["access_expires_at"],
      ["expires_at"],
    ]),
  );

  return {
    email: email.toLowerCase(),
    fullName,
    normalizedStatus: status,
    transactionId,
    productId,
    purchasedAt,
    accessExpiresAt,
    rawPayload: payload,
  };
}

function readHotmartToken(req: Request, payload: Record<string, unknown>): string | null {
  const headerToken = req.headers.get("x-hotmart-hottok") ?? req.headers.get("hottok");
  if (headerToken?.trim()) return headerToken.trim();

  const bodyToken = pickFirstString(payload, [["hottok"], ["data", "hottok"]]);
  return bodyToken?.trim() ?? null;
}

async function findAuthUserIdByEmail(
  supabaseAdmin: ReturnType<typeof createClient>,
  email: string,
): Promise<string | null> {
  const normalizedEmail = email.toLowerCase();
  const perPage = 200;

  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw new Error(`Falha ao listar usuários: ${error.message}`);
    }

    const users = data?.users ?? [];
    const matched = users.find((item) => item.email?.toLowerCase() === normalizedEmail);
    if (matched) {
      return matched.id;
    }

    if (users.length < perPage) {
      break;
    }
  }

  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed. Use POST." });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const hotmartHottok = Deno.env.get("HOTMART_HOTTOK");
    const appPublicUrl = sanitizeBaseUrl(Deno.env.get("APP_PUBLIC_URL"));

    if (!supabaseUrl || !serviceRoleKey || !hotmartHottok) {
      return jsonResponse(500, {
        error: "Missing server configuration. Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, HOTMART_HOTTOK.",
      });
    }

    const payload = await readRequestPayload(req);
    const receivedToken = readHotmartToken(req, payload);

    if (!receivedToken || receivedToken !== hotmartHottok) {
      return jsonResponse(401, { error: "Invalid hottok." });
    }

    const parsed = parsePayload(payload);
    if (!parsed) {
      return jsonResponse(400, { error: "Buyer email not found in payload." });
    }

    if (!ACTIVATION_STATUSES.has(parsed.normalizedStatus)) {
      return jsonResponse(200, {
        ok: true,
        ignored: true,
        reason: "status_not_eligible",
        status: parsed.normalizedStatus || "unknown",
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let userId = await findAuthUserIdByEmail(supabaseAdmin, parsed.email);
    let authEmailDispatch = "none";

    if (!userId) {
      const inviteResult = await supabaseAdmin.auth.admin.inviteUserByEmail(parsed.email, {
        redirectTo: `${appPublicUrl}/login`,
        data: {
          full_name: parsed.fullName,
          source: "hotmart_webhook",
        },
      });

      if (inviteResult.error) {
        const alreadyRegistered = /already registered/i.test(inviteResult.error.message);
        if (!alreadyRegistered) {
          throw new Error(`Falha ao enviar convite de onboarding: ${inviteResult.error.message}`);
        }

        const existingUserId = await findAuthUserIdByEmail(supabaseAdmin, parsed.email);
        if (!existingUserId) {
          throw new Error("Usuário já existe, mas não foi encontrado no Auth admin.");
        }

        userId = existingUserId;
      } else {
        authEmailDispatch = "invite";
        userId = inviteResult.data.user?.id ?? await findAuthUserIdByEmail(supabaseAdmin, parsed.email);
      }
    }

    if (!userId) {
      throw new Error("Não foi possível resolver o usuário no Supabase Auth.");
    }

    if (authEmailDispatch === "none") {
      const recoveryResult = await supabaseAdmin.auth.resetPasswordForEmail(parsed.email, {
        redirectTo: `${appPublicUrl}/login`,
      });
      if (recoveryResult.error) {
        throw new Error(`Falha ao enviar email de recuperação: ${recoveryResult.error.message}`);
      }
      authEmailDispatch = "recovery";
    }

    const { data: existingProfileRaw, error: profileReadError } = await supabaseAdmin
      .from("profiles")
      .select("user_id, email, full_name, hotmart_status, hotmart_transaction_id, hotmart_product_id, purchased_at, access_expires_at, last_webhook_payload")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileReadError) {
      throw new Error(`Falha ao ler profile: ${profileReadError.message}`);
    }

    const existingProfile = (existingProfileRaw as ProfileRow | null) ?? null;

    const isPaid = true;
    const upsertPayload: ProfileRow = {
      user_id: userId,
      email: parsed.email,
      full_name: parsed.fullName ?? existingProfile?.full_name ?? null,
      hotmart_status: parsed.normalizedStatus || existingProfile?.hotmart_status ?? null,
      hotmart_transaction_id: parsed.transactionId ?? existingProfile?.hotmart_transaction_id ?? null,
      hotmart_product_id: parsed.productId ?? existingProfile?.hotmart_product_id ?? null,
      purchased_at: parsed.purchasedAt ?? existingProfile?.purchased_at ?? (isPaid ? new Date().toISOString() : null),
      access_expires_at: parsed.accessExpiresAt ?? existingProfile?.access_expires_at ?? null,
      last_webhook_payload: parsed.rawPayload,
    };

    const { error: profileWriteError } = await supabaseAdmin
      .from("profiles")
      .upsert(upsertPayload, { onConflict: "user_id" });

    if (profileWriteError) {
      throw new Error(`Falha ao salvar profile: ${profileWriteError.message}`);
    }

    return jsonResponse(200, {
      ok: true,
      user_id: userId,
      email: parsed.email,
      status: parsed.normalizedStatus || "unknown",
      paid_access: isPaid,
      auth_email_dispatch: authEmailDispatch,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.error("webhook-hotmart error:", message);
    return jsonResponse(500, { error: message });
  }
});

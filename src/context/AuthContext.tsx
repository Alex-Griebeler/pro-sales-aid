import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const ACTIVE_LICENSE_STATUSES = new Set(["active", "approved", "complete"]);

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hasActiveLicense: boolean;
  licenseLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasActiveLicense, setHasActiveLicense] = useState(false);
  const [licenseLoading, setLicenseLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    };

    bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadLicenseStatus = async () => {
      if (!user) {
        if (!mounted) return;
        setHasActiveLicense(false);
        setLicenseLoading(false);
        return;
      }

      setLicenseLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("hotmart_status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        console.error("Erro ao validar licença no profile:", error.message);
        setHasActiveLicense(false);
        setLicenseLoading(false);
        return;
      }

      const normalizedStatus = data?.hotmart_status?.toLowerCase() ?? "";
      const isActive = ACTIVE_LICENSE_STATUSES.has(normalizedStatus);

      setHasActiveLicense(isActive);
      setLicenseLoading(false);
    };

    void loadLicenseStatus();

    return () => {
      mounted = false;
    };
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      hasActiveLicense,
      licenseLoading,
      signIn: async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [hasActiveLicense, licenseLoading, loading, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

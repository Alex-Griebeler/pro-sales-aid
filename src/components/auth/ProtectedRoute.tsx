import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const HOTMART_CHECKOUT_URL = "https://hotmart.com/product/REPLACE_WITH_PRODUCT_ID";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { user, loading, hasActiveLicense, licenseLoading } = useAuth();
  const location = useLocation();
  const isPreviewMode = new URLSearchParams(location.search).get("preview") === "true";

  if (loading || (Boolean(user) && licenseLoading)) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isPreviewMode && !hasActiveLicense) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 sm:p-8 shadow-xl space-y-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Acesso bloqueado</h1>
          <p className="text-sm text-muted-foreground">
            Sua licença não está ativa no momento. Finalize a compra para liberar o acesso completo.
          </p>
          <a
            href={HOTMART_CHECKOUT_URL}
            target="_blank"
            rel="noreferrer"
            className="w-full h-11 rounded-md bg-foreground text-background text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors inline-flex items-center justify-center"
          >
            Ativar acesso na Hotmart
          </a>
          <p className="text-xs text-muted-foreground">
            Para testes internos, use <code>?preview=true</code> na URL.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

type LocationState = {
  from?: string;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as LocationState | null)?.from ?? "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [from, navigate, user]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    const action = isSignUp ? signUp : signIn;
    const { error } = await action(email.trim(), password);

    if (error) {
      toast.error(error);
      setSubmitting(false);
      return;
    }

    if (isSignUp) {
      toast.success("Cadastro realizado. Verifique seu email para confirmar a conta.");
    } else {
      toast.success("Login realizado com sucesso.");
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 sm:p-8 shadow-xl">
        <div className="space-y-2 mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            {isSignUp ? "Criar conta" : "Entrar"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp
              ? "Cadastre-se para acessar a área de membros."
              : "Faça login para acessar seu conteúdo."}
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="voce@exemplo.com"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Mínimo 6 caracteres"
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 rounded-md bg-foreground text-background text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isSignUp ? "Criar conta" : "Entrar"}
          </button>
        </form>

        <div className="mt-5 text-sm text-muted-foreground">
          {isSignUp ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp((prev) => !prev)}
            className="text-foreground hover:text-accent underline underline-offset-4 transition-colors"
          >
            {isSignUp ? "Entrar" : "Criar conta"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

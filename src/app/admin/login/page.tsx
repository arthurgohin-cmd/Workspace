import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm rounded-sm border border-paper/10 bg-paper p-8">
        <span className="font-display text-xl tracking-wide text-ink">
          CARVER<span className="text-terracotta"> INVEST</span>
        </span>
        <h1 className="mt-1 text-sm text-stone-400">Administration</h1>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

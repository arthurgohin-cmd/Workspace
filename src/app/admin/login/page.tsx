import Image from "next/image";
import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm rounded-sm border border-paper/10 bg-paper p-8">
        <Image
          src="/brand/lockup-ink.png"
          alt="CARVER INVEST"
          width={568}
          height={553}
          className="mx-auto h-24 w-auto"
          priority
        />
        <h1 className="mt-4 text-center text-sm text-stone-400">Administration</h1>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

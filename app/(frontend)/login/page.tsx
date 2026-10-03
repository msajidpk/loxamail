import { auth, signOut } from "@/auth";
import LoginForm from "@/components/auth/LoginForm";
export default async function LoginPage() {
  const session = await auth();

  if (session?.user?.id) {
    async function logout() {
      "use server";

      await signOut({ redirectTo: "/login" });
    }

    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-500">Signed in as</p>

          <p className="mt-2 font-medium text-slate-950">
            {session.user.email}
          </p>

          <form action={logout} className="mt-6">
            <button
              type="submit"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 font-medium text-slate-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium tracking-[0.16em] text-slate-500 uppercase">
            LoxaMail
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Sign in
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Access your LoxaMail account.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}

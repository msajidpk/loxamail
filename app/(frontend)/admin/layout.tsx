import type { ReactNode } from "react";
import { signOut } from "@/auth";
import { requireInternalUser } from "@/lib/auth-guards";
import AdminSidebar from "@/components/admin/AdminSidebar";
export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await requireInternalUser();

  async function logout() {
    "use server";

    await signOut({ redirectTo: "/login" });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
            <div>
              <p className="text-sm font-medium text-slate-950">
                Administration
              </p>
              <p className="text-xs text-slate-500">
                LoxaMail management system
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-900">
                  {session.user.email}
                </p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>

              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                >
                  Sign out
                </button>
              </form>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

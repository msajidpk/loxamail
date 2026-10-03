import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-blue-600 text-sm font-bold text-white">
                L
              </span>

              <span className="text-xl font-semibold tracking-[-.04em] text-slate-950">
                LoxaMail
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">
              Business email and Microsoft 365 solutions with professional
              setup, migration, security and ongoing support.
            </p>

            <p className="mt-5 text-xs text-slate-400">
              A product of ONLYZER.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-950">
              Services
            </h2>

            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <Link
                className="block hover:text-slate-950"
                href="/microsoft-365"
              >
                Microsoft 365
              </Link>

              <Link
                className="block hover:text-slate-950"
                href="/business-email"
              >
                Business Email
              </Link>

              <Link
                className="block hover:text-slate-950"
                href="/migration"
              >
                Migration
              </Link>

              <Link
                className="block hover:text-slate-950"
                href="/security"
              >
                Security
              </Link>

              <Link
                className="block hover:text-slate-950"
                href="/support"
              >
                Support
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-950">
              Company
            </h2>

            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <Link className="block hover:text-slate-950" href="/about">
                About
              </Link>

              <Link className="block hover:text-slate-950" href="/contact">
                Contact
              </Link>

              <Link className="block hover:text-slate-950" href="/privacy">
                Privacy
              </Link>

              <Link className="block hover:text-slate-950" href="/terms">
                Terms
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-950">
              LoxaMail
            </h2>

            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <Link className="block hover:text-slate-950" href="/login">
                Client Login
              </Link>

              <a
                className="block hover:text-slate-950"
                href="mailto:hello@loxamail.com"
              >
                hello@loxamail.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} LoxaMail. A product of ONLYZER.</p>

          <p>Microsoft 365 &amp; business email solutions.</p>
        </div>
      </div>
    </footer>
  );
}
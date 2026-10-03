import Link from "next/link";

const navigation = [
  ["Microsoft 365", "/microsoft-365"],
  ["Business Email", "/business-email"],
  ["Migration", "/migration"],
  ["Security", "/security"],
  ["Support", "/support"],
  ["About", "/about"],
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-blue-600 text-sm font-bold text-white">
            L
          </span>

          <span className="text-xl font-semibold tracking-[-.04em] text-slate-950">
            LoxaMail
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navigation.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-[13px] font-medium text-slate-600 transition hover:text-slate-950"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-[13px] font-semibold text-slate-600 hover:text-slate-950 sm:block"
          >
            Client Login
          </Link>

          <Link
            href="/contact"
            className="rounded-full bg-slate-950 px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-blue-600"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
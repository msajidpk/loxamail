import Link from "next/link";

const navigation = [
  { label: "Dashboard", href: "/admin" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Leads", href: "/admin/leads" },
  { label: "Products", href: "/admin/products" },
  { label: "Vendors", href: "/admin/vendors" },
  { label: "Quotes", href: "/admin/quotes" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Services", href: "/admin/services" },
  { label: "Subscriptions", href: "/admin/subscriptions" },
  { label: "Invoices", href: "/admin/invoices" },
  { label: "Payments", href: "/admin/payments" },
  { label: "Tickets", href: "/admin/tickets" },
  { label: "Reports", href: "/admin/reports" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-full min-h-screen flex-col">
        <div className="border-b border-slate-200 px-6 py-5">
          <Link href="/admin" className="block">
            <div className="text-lg font-semibold tracking-tight text-slate-950">
              LoxaMail
            </div>
            <div className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
              Administration
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-200 px-6 py-5">
          <p className="text-xs text-slate-400">
            Business technology services
          </p>
          <p className="mt-1 text-xs font-medium text-slate-600">
            by ONLYZER
          </p>
        </div>
      </div>
    </aside>
  );
}

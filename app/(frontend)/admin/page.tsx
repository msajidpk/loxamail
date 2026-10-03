import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [
    customers,
    products,
    orders,
    services,
    subscriptions,
    invoices,
    payments,
    tickets,
  ] = await Promise.all([
    prisma.customerAccount.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.service.count(),
    prisma.subscription.count(),
    prisma.invoice.count(),
    prisma.payment.count(),
    prisma.ticket.count(),
  ]);

  const stats = [
    {
      label: "Customers",
      value: customers,
      href: "/admin/customers",
    },
    {
      label: "Products",
      value: products,
      href: "/admin/products",
    },
    {
      label: "Orders",
      value: orders,
      href: "/admin/orders",
    },
    {
      label: "Services",
      value: services,
      href: "/admin/services",
    },
    {
      label: "Subscriptions",
      value: subscriptions,
      href: "/admin/subscriptions",
    },
    {
      label: "Invoices",
      value: invoices,
      href: "/admin/invoices",
    },
    {
      label: "Payments",
      value: payments,
      href: "/admin/payments",
    },
    {
      label: "Tickets",
      value: tickets,
      href: "/admin/tickets",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500">
          Overview
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage customers, products, services, billing and operations from
          one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {stat.label}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {stat.value}
            </p>

            <p className="mt-3 text-xs font-medium text-slate-400">
              View {stat.label.toLowerCase()}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-950">
            Business workflow
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            LoxaMail follows the core lifecycle from customer acquisition
            through ordering, service delivery and billing.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Customer",
              "Product",
              "Order",
              "Service",
              "Subscription",
              "Invoice",
              "Payment",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-950">
            Quick actions
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              href="/admin/customers"
              className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Manage customers
            </Link>

            <Link
              href="/admin/products"
              className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Manage products
            </Link>

            <Link
              href="/admin/orders"
              className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              View orders
            </Link>

            <Link
              href="/admin/invoices"
              className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              View invoices
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

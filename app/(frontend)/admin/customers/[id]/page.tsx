import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ContactsClient from "@/components/admin/customers/ContactsClient";

function formatDate(value: Date | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
  }).format(value);
}

function formatAmount(value: unknown, currency: string) {
  if (value === null || value === undefined) return "—";

  return `${currency} ${Number(value).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.customerAccount.findUnique({
    where: { id },
    select: {
      id: true,
      type: true,
      displayName: true,
      status: true,
      createdAt: true,

      contacts: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          displayName: true,
          email: true,
          userId: true,
        },
      },

      memberships: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          role: {
            select: {
              name: true,
              key: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              status: true,
            },
          },
        },
      },

      orders: {
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          status: true,
          placedAt: true,
          createdAt: true,
        },
      },

      services: {
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          productCodeSnapshot: true,
          productNameSnapshot: true,
          status: true,
          createdAt: true,
          subscriptions: {
            select: {
              id: true,
              status: true,
              startedAt: true,
              endedAt: true,
            },
          },
        },
      },

      invoices: {
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          status: true,
          currency: true,
          issueDate: true,
          dueDate: true,
          total: true,
        },
      },

      payments: {
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          status: true,
          amount: true,
          currency: true,
          paymentMethod: true,
          receivedAt: true,
        },
      },

      tickets: {
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          subject: true,
          status: true,
          priority: true,
          createdAt: true,
        },
      },

      _count: {
        select: {
          contacts: true,
          memberships: true,
          leads: true,
          opportunities: true,
          quotes: true,
          orders: true,
          services: true,
          invoices: true,
          payments: true,
          tickets: true,
          documents: true,
        },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  const subscriptionCount = await prisma.subscription.count({
    where: {
      service: {
        customerAccountId: id,
      },
    },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <Link
          href="/admin/customers"
          className="text-sm font-medium text-slate-500 hover:text-slate-950"
        >
          ← Customers
        </Link>
      </div>

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              {customer.displayName}
            </h1>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {customer.type === "COMPANY" ? "Company" : "Individual"}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Customer since {formatDate(customer.createdAt)}
          </p>
        </div>

        <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          {customer.status}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Contacts", customer._count.contacts],
          ["Orders", customer._count.orders],
          ["Services", customer._count.services],
          ["Subscriptions", subscriptionCount],
          ["Invoices", customer._count.invoices],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ContactsClient
          customerId={customer.id}
          contacts={customer.contacts}
        />

        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Customer users
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Users who have access to this customer account.
            </p>
          </div>

          {customer.memberships.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              No customer users yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {customer.memberships.map((membership) => (
                <div
                  key={membership.id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div>
                    <p className="font-medium text-slate-950">
                      {membership.user.email}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {membership.role?.name ?? "Customer user"} ·{" "}
                      {membership.status}
                    </p>
                  </div>

                  <span className="text-xs text-slate-400">
                    User
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <DataSection title="Orders" empty="No orders yet.">
          {customer.orders.map((order) => (
            <DataRow
              key={order.id}
              title={`Order ${order.id.slice(0, 8)}`}
              meta={order.status}
              right={formatDate(order.placedAt ?? order.createdAt)}
            />
          ))}
        </DataSection>

        <DataSection title="Services" empty="No services yet.">
          {customer.services.map((service) => (
            <div key={service.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-950">
                    {service.productNameSnapshot}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {service.productCodeSnapshot} · {service.status}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {service.subscriptions.length} subscription
                  {service.subscriptions.length === 1 ? "" : "s"}
                </span>
              </div>

              {service.subscriptions.length > 0 ? (
                <div className="mt-4 space-y-2 border-l-2 border-slate-200 pl-4">
                  {service.subscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="flex items-center justify-between gap-4 text-sm"
                    >
                      <div>
                        <p className="font-medium text-slate-700">
                          Subscription {subscription.id.slice(0, 8)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Started {formatDate(subscription.startedAt)}
                          {subscription.endedAt
                            ? ` · Ended ${formatDate(subscription.endedAt)}`
                            : ""}
                        </p>
                      </div>

                      <span className="shrink-0 text-xs font-medium text-slate-500">
                        {subscription.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </DataSection>

        <DataSection title="Invoices" empty="No invoices yet.">
          {customer.invoices.map((invoice) => (
            <DataRow
              key={invoice.id}
              title={`Invoice ${invoice.id.slice(0, 8)}`}
              meta={invoice.status}
              right={formatAmount(invoice.total, invoice.currency)}
            />
          ))}
        </DataSection>

        <DataSection title="Payments" empty="No payments yet.">
          {customer.payments.map((payment) => (
            <DataRow
              key={payment.id}
              title={formatAmount(payment.amount, payment.currency)}
              meta={`${payment.status}${
                payment.paymentMethod
                  ? ` · ${payment.paymentMethod}`
                  : ""
              }`}
              right={formatDate(payment.receivedAt)}
            />
          ))}
        </DataSection>

        <DataSection title="Tickets" empty="No tickets yet.">
          {customer.tickets.map((ticket) => (
            <DataRow
              key={ticket.id}
              title={ticket.subject}
              meta={`${ticket.status} · ${ticket.priority}`}
              right={formatDate(ticket.createdAt)}
            />
          ))}
        </DataSection>

        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Customer activity
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-px bg-slate-200">
            {[
              ["Leads", customer._count.leads],
              ["Opportunities", customer._count.opportunities],
              ["Quotes", customer._count.quotes],
              ["Payments", customer._count.payments],
              ["Tickets", customer._count.tickets],
              ["Documents", customer._count.documents],
            ].map(([label, value]) => (
              <div key={String(label)} className="bg-white p-5">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-1 text-xl font-semibold text-slate-950">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function DataSection({
  title,
  empty,
  children,
}: {
  title: string;
  empty: string;
  children: React.ReactNode;
}) {
  const hasChildren = Array.isArray(children)
    ? children.length > 0
    : Boolean(children);

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      </div>

      {!hasChildren ? (
        <div className="p-6 text-sm text-slate-500">{empty}</div>
      ) : (
        <div className="divide-y divide-slate-100">{children}</div>
      )}
    </section>
  );
}

function DataRow({
  title,
  meta,
  right,
}: {
  title: string;
  meta: string;
  right: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-5">
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-950">{title}</p>
        <p className="mt-1 truncate text-xs text-slate-500">{meta}</p>
      </div>

      <p className="shrink-0 text-xs text-slate-400">{right}</p>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import CustomerModal from "./CustomerModal";

type Customer = {
  id: string;
  type: "COMPANY" | "INDIVIDUAL";
  displayName: string;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  createdAt: string;
  _count: {
    contacts: number;
    memberships: number;
    orders: number;
    services: number;
    subscriptions: number;
    invoices: number;
  };
};

function statusClass(status: Customer["status"]) {
  if (status === "ACTIVE") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "SUSPENDED") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-slate-100 text-slate-600";
}

export default function CustomersClient() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/customers?search=${encodeURIComponent(search)}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to load customers.");
      }

      setCustomers(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load customers.",
      );
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(loadCustomers, 250);

    return () => clearTimeout(timer);
  }, [loadCustomers]);

  function openCreate() {
    setEditingCustomer(null);
    setModalOpen(true);
  }

  function openEdit(customer: Customer) {
    setEditingCustomer(customer);
    setModalOpen(true);
  }

  async function deleteCustomer(customer: Customer) {
    const confirmed = window.confirm(
      `Delete "${customer.displayName}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch(
      `/api/admin/customers/${customer.id}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      window.alert(data.error ?? "Unable to delete customer.");
      return;
    }

    await loadCustomers();
  }

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Customer accounts
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Companies and individuals managed by LoxaMail.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-medium text-white"
          >
            Add customer
          </button>
        </div>

        <div className="border-b border-slate-200 p-5">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customers..."
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-700 md:max-w-md"
          />
        </div>

        {error ? (
          <div className="p-5">
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Customer
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Activity
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center"
                  >
                    <p className="text-sm font-medium text-slate-700">
                      No customers found
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Add your first customer account to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <a
                        href={`/admin/customers/${customer.id}`}
                        className="font-medium text-slate-950 hover:text-slate-600"
                      >
                        {customer.displayName}
                      </a>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {customer.type === "COMPANY"
                        ? "Company"
                        : "Individual"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
                          customer.status,
                        )}`}
                      >
                        {customer.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {customer._count.contacts} contacts ·{" "}
                      {customer._count.orders} orders ·{" "}
                      {customer._count.services} services
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(customer)}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteCustomer(customer)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen ? (
        <CustomerModal
          customer={editingCustomer}
          onClose={() => setModalOpen(false)}
          onSaved={async () => {
            setModalOpen(false);
            await loadCustomers();
          }}
        />
      ) : null}
    </>
  );
}

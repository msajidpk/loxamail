"use client";

import { useState } from "react";

type Customer = {
  id: string;
  type: "COMPANY" | "INDIVIDUAL";
  displayName: string;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
};

type CustomerModalProps = {
  customer?: Customer | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function CustomerModal({
  customer,
  onClose,
  onSaved,
}: CustomerModalProps) {
  const [type, setType] = useState<"COMPANY" | "INDIVIDUAL">(
    customer?.type ?? "COMPANY",
  );
  const [displayName, setDisplayName] = useState(
    customer?.displayName ?? "",
  );
  const [status, setStatus] = useState<
    "ACTIVE" | "SUSPENDED" | "INACTIVE"
  >(customer?.status ?? "ACTIVE");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(customer);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        isEdit
          ? `/api/admin/customers/${customer!.id}`
          : "/api/admin/customers",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            displayName,
            status,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save customer.");
      }

      onSaved();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save customer.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              {isEdit ? "Edit Customer" : "Add Customer"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage the customer account.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Customer Type
            </label>
            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value as "COMPANY" | "INDIVIDUAL")
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="COMPANY">Company</option>
              <option value="INDIVIDUAL">Individual</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Display Name
            </label>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as
                    | "ACTIVE"
                    | "SUSPENDED"
                    | "INACTIVE",
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

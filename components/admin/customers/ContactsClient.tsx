"use client";

import { useState } from "react";
import ContactModal from "./ContactModal";

type Contact = {
  id: string;
  displayName: string;
  email: string | null;
  userId: string | null;
};

export default function ContactsClient({
  customerId,
  contacts,
}: {
  customerId: string;
  contacts: Contact[];
}) {
  const [items, setItems] = useState(contacts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);

  async function reload() {
    window.location.reload();
  }

  async function remove(contact: Contact) {
    if (contact.userId) {
      window.alert(
        "This contact is linked to a user and cannot be deleted.",
      );
      return;
    }

    if (!window.confirm(`Delete "${contact.displayName}"?`)) {
      return;
    }

    const response = await fetch(
      `/api/admin/customers/${customerId}/contacts/${contact.id}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      window.alert(data.error ?? "Unable to delete contact.");
      return;
    }

    setItems((current) =>
      current.filter((item) => item.id !== contact.id),
    );
  }

  return (
    <>
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Contacts
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              People associated with this customer.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-medium text-white"
          >
            Add contact
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            No contacts yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-950">
                    {contact.displayName}
                  </p>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {contact.email ?? "No email"}
                  </p>

                  {contact.userId ? (
                    <p className="mt-1 text-xs text-emerald-600">
                      Customer portal user
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(contact);
                      setModalOpen(true);
                    }}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(contact)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {modalOpen ? (
        <ContactModal
          customerId={customerId}
          contact={editing}
          onClose={() => setModalOpen(false)}
          onSaved={reload}
        />
      ) : null}
    </>
  );
}

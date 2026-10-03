import CustomersClient from "@/components/admin/customers/CustomersClient";
export default function CustomersPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500">
          Administration
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
          Customers
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage company and individual customer accounts.
        </p>
      </div>

      <CustomersClient />
    </div>
  );
}

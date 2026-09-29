# LoxaMail Master Specification

**Status:** Initial approved foundation. Details marked TBD require a later decision.
**Brand:** LoxaMail
**Owner:** ONLYZER

This is the authoritative project specification. Read it before every LoxaMail development task. Future approved architectural decisions must be recorded here.

## 1. Business identity and purpose

LoxaMail is a product and brand of ONLYZER. It is not a separate legal entity. LoxaMail is intended to become a business technology services platform for domains, business email, Microsoft 365, web hosting, professional IT services, managed services, cloud/server products, and other business technology services. The catalogue will expand only through controlled specification changes.

The platform may combine relevant concepts from WHMCS and Odoo. It is not a clone of either system. Implement only the capabilities relevant to LoxaMail.

## 2. Customer architecture (locked)

Use one unified Customer Account architecture. Each account has type `COMPANY` or `INDIVIDUAL`; these are not separate customer systems. An account may own or be associated with Contacts, Users through account membership, Orders, purchased Services (which reference catalogue Products), Subscriptions, domains, quotes, invoices, payments, tickets, documents, activities, and customer history.

**Contact/Person is not the same as User.** A Contact represents a real person associated with a Customer Account and may exist without login access. A User represents an authenticated identity. Where appropriate, a User may be related to a Contact and may access one or more Customer Accounts through membership and roles. Customer and internal LoxaMail identity contexts are separate; staff are not customer contacts merely because they can access the platform. Customer users are limited to data in their authorized account context; internal access follows internal roles. An individual customer may be represented as both a contact and a user without creating a separate customer system.

Customer Account status is distinct from Service, Subscription, Invoice, and Payment statuses. The architecture supports multiple users per Customer Account and **supports future multi-account membership for one User**; the exact UI and permission behavior remain TBD. The complete conceptual profile, ownership hierarchy, role concepts, customer portal and admin capabilities, audit expectations, and open decisions are documented in [`docs/business/customer-identity-v1.md`](docs/business/customer-identity-v1.md). No database relationships or authentication/authorization implementation are defined by that document.

## 3. Product-independent commercial architecture

Sales may start directly from a Customer Account or use the optional CRM and quotation path. A Lead may exist before a Customer Account is identified; where the customer is known, CRM may associate it with an existing or newly created Customer Account. The optional quote path is:

`Lead / Opportunity (where applicable) → Customer Account association (when identified) → Quote (optional) → Customer Approval (where required) → Order → Order Items → Service Creation → Provisioning → Active Service`

Direct purchases may start at `Customer Account → Order`; not every sale requires CRM or a Quote.

Commercial billing and settlement remain distinct: `Order → Financial Obligation → Invoice / Payment`. An Order is not a Payment. An Order Item records the Product and commercial terms selected for that purchase; the Service is the purchased/delivered instance owned by the Customer Account. One Order can contain multiple items and may be fulfilled partially. An item may create one or more Services, a Service with a Subscription for recurring terms, or a one-time work/service record. See [`docs/business/sales-order-lifecycle-v1.md`](docs/business/sales-order-lifecycle-v1.md) for the conceptual V1 lifecycle.

The core must support different product/provider implementations and must not be built specifically around Microsoft 365.

- A **Product** is a catalogue definition.
- A **Service** is the actual purchased/delivered instance belonging to a Customer Account. Supplier assignment and provisioning operations target this Service, not the catalogue Product.
- A **Subscription** is the recurring commercial commitment associated with a recurring Service when applicable; it is distinct from the Service. A Service may exist without a Subscription.
- Product types eventually include recurring products, one-time services, recurring managed services, and configurable products.

The intended high-level order and service lifecycle is:

`Order → Order Approval → Service Creation → Provisioning → Active → Renewal / Change → Suspension / Cancellation`

Quote and Order states are separate from Service, Subscription, Invoice, Payment, and Provisioning states. A product-independent commercial profile, fulfillment profile, and provisioning strategy guide handling; core Order processing must not branch on named product families such as Microsoft 365, domains, or hosting. Approval, payment gating, cancellation, and failure handling vary only through future approved product/service rules and remain unimplemented.

Service and Subscription concepts, lifecycle states, renewal, changes, suspension, cancellation, expiry, and their boundaries are documented in [`docs/business/service-subscription-lifecycle-v1.md`](docs/business/service-subscription-lifecycle-v1.md). This is business architecture only; final fields, transitions, billing, and provisioning implementation remain deferred.

## 4. Proposed LoxaMail Launch Product Catalogue V1

The following is the proposed V1 launch catalogue. Inclusion identifies a proposed catalogue offering; it does not approve its technical specification, supplier, price, billing cycle, or operational rules. Family purposes, product categories, known information, undecided information, and the per-product commercial definition register are documented in [`docs/products/launch-catalogue-v1.md`](docs/products/launch-catalogue-v1.md). The product-level supplier/provisioning categories and conceptual fulfillment flows are in [`docs/products/supplier-provisioning-v1.md`](docs/products/supplier-provisioning-v1.md).

### Domains

Purpose: offer domain registration, transfer, and renewal services.

- Domain Registration
- Domain Transfer
- Domain Renewal

Potential initial TLDs mentioned in the current direction are `.com`, `.net`, `.org`, `.pk`, and `.com.pk`; neither the supplier/registrar nor final TLD list is approved.

### Business Email

Purpose: offer LoxaMail-branded business email packages.

- LoxaMail Business Email Basic
- LoxaMail Business Email Professional
- LoxaMail Business Email Enterprise

### Microsoft 365

Purpose: offer the named Microsoft 365 business packages as one provider/product family within the product-independent platform.

- Microsoft 365 Business Basic
- Microsoft 365 Business Standard
- Microsoft 365 Business Premium

### Hosting

Purpose: offer the named business hosting packages.

- Business Hosting
- WordPress Hosting

### Professional Services

Purpose: offer the named professional implementation, migration, and configuration services.

- Microsoft 365 Deployment
- Email Migration
- DNS / Email Configuration
- Microsoft 365 Security Configuration
- Website / Hosting Migration

### Managed Services

Purpose: offer the named ongoing managed-service families; specific service scope and terms are TBD.

- Managed Microsoft 365
- Managed Email
- Managed Hosting
- Managed IT Support

### Product definition versus purchased Customer Service

A Product is a catalogue definition. A purchased Customer Service is the customer's instance of a product. The V1 catalogue lists proposed Product definitions only; it creates no customer purchases or service instances. Customer Account remains one unified architecture with account type `COMPANY` or `INDIVIDUAL`; no separate company and individual customer systems are to be introduced.

### Phase 2 candidates

Google Workspace, Zoho Workplace, VPS, cloud servers, managed VPS, backup, Microsoft 365 backup, cloud storage, reseller hosting, SSL, dedicated servers.

### Future candidates

AWS, Azure, Google Cloud, enterprise infrastructure, software development, mobile applications, ERP/CRM, AI automation, SEO, and digital marketing.

These are potential product areas only. Do not invent features or implement the entire catalogue. Product-specific commercial definitions remain pending as recorded in the V1 catalogue documentation.

## 5. Billing direction

The platform will eventually support one-time, monthly, quarterly, semi-annual, annual, or approved custom intervals where appropriate; recurring billing; renewal; suspension; cancellation; reactivation; credits; refunds; and taxes. A Product will define which billing options are allowed; no interval is assumed for every Product. Exact product rules and values are TBD and must not be invented.

The commercial model is product-independent. Pricing may distinguish supplier cost, selling price, one-time/setup charges, and recurring charges; quantity, currency, tax, discounts, proration, renewal, cancellation, refund, payment fee, and credit handling are configurable commercial concepts whose rules remain pending. No prices, supplier costs, currency, margin target, tax jurisdiction/rate, payment gateway, fee, or policy is approved here. See [`docs/business/commercial-model-v1.md`](docs/business/commercial-model-v1.md) for the V1 commercial concepts and decision register.

Keep Product (catalogue definition), Order, Service (purchased/delivered instance), Subscription (recurring commercial relationship when applicable), Invoice (issued financial snapshot), and Payment (settlement record) distinct. A price change must not silently alter an existing subscription or previously issued invoice; effective dates and renewal-price handling require explicit rules. Credit balances and financial adjustments must be traceable. These are architecture requirements for future design, not implementation approval.

Billing is product-independent and distinguishes charges/invoice lines, invoices, payments, customer credits, credit notes, and refunds. Issued invoice snapshots must not be silently rewritten. The conceptual billing and invoice architecture, including unresolved rules, is documented in [`docs/business/billing-invoice-v1.md`](docs/business/billing-invoice-v1.md); it does not approve financial values, tax/legal policy, a gateway, accounting integration, or implementation.

## 6. Selected WHMCS and Odoo concepts

WHMCS-inspired capabilities: products/services, orders, subscriptions, recurring billing, invoices, payments, renewals, provisioning, domains, customer portal, and support.

Odoo-inspired capabilities: customer management, companies, contacts, CRM, leads, opportunities, quotations, sales orders, activities, vendors, purchasing, documents, and reporting.

CRM & Sales Pipeline V1 adopts a focused set of internal CRM concepts—Leads, Opportunities, Activities, and a configurable pipeline—without making CRM the Customer Account, Product Catalogue, Quote/Order, Support, Billing, or Provisioning system. Its conceptual architecture and unresolved decisions are documented in [`docs/business/crm-sales-pipeline-v1.md`](docs/business/crm-sales-pipeline-v1.md). CRM automation, marketing, forecasting, and reporting implementation remain out of scope.

Support & Ticketing V1 is a focused Customer Account-owned support module. Ticketing remains distinct from CRM, Orders, Services, billing, and provisioning; its conceptual lifecycle and module boundaries are documented in [`docs/business/support-ticketing-v1.md`](docs/business/support-ticketing-v1.md). SLA, support hours, notification channels, and integration policies remain TBD.

Documents & Notifications V1 defines shared, product-independent Document and Notification business capabilities across customer, CRM, sales, service, billing, support, vendor, and purchasing records. Physical storage remains separate from the Document business object; Email is one possible Notification delivery channel. Ownership, visibility, and access follow Customer Account membership and permissions, while internal records remain internal by default. Providers, retention, policies, and implementation remain TBD; see [`docs/business/documents-notifications-v1.md`](docs/business/documents-notifications-v1.md).

## 7. Technology stack (locked)

- Frontend: Next.js 16, React, TypeScript, Tailwind CSS, shadcn/ui.
- Backend: Next.js server architecture, Route Handlers, Server Actions where appropriate, and a TypeScript business/service layer. No separate backend framework.
- Database: MariaDB and Prisma ORM.
- Authentication: Auth.js.
- Validation and forms: Zod, React Hook Form, and Zod integration.
- Testing: Vitest and Playwright.
- Code quality: ESLint and Prettier.
- Package manager: npm.
- Version control: Git and GitHub.

## 8. Architecture and integrations

Use a modular monolith. Do not introduce microservices, Kubernetes, distributed architecture, or multiple backend applications unless explicitly approved. Keep business modules separated and add modules only when needed.

Supplier and provisioning architecture is product-independent:

`LoxaMail Product → Supplier/Provider Assignment → Provisioning Adapter → External Provider`

The assignment is resolved for a purchased Service. The supplier/provisioning system operates on that Service, which belongs to its unified Customer Account; it does not provision the catalogue Product itself. A supplier can be changed through the assignment/adapter boundary without redesigning Product, Order, Service, Subscription, Billing, or Customer architecture. Internal manual and hybrid fulfillment are also valid provisioning categories. Provider-specific behavior must not be scattered through the core.

V1 provisioning categories are `EXTERNAL_PROVIDER`, `INTERNAL_MANUAL`, `HYBRID`, and `FUTURE_INTEGRATION`. Product assignments and their conceptual flows are documented in [`docs/products/supplier-provisioning-v1.md`](docs/products/supplier-provisioning-v1.md). Supplier names and API/integration choices remain TBD. Microsoft Graph, registrar/hosting APIs, payment gateways, transactional email, S3-compatible storage, and Redis/BullMQ are not part of this documentation task or an implementation approval.

Vendor & Purchasing V1 keeps Vendors/Suppliers and Supplier Offerings separate from Customer Accounts and the public Product Catalogue. Purchase Requests/Orders and Vendor Invoices/Payments are internal purchasing records, distinct from customer Orders and Billing. Supplier assignment remains replaceable and separate from the Provisioning Strategy; see [`docs/business/vendor-purchasing-v1.md`](docs/business/vendor-purchasing-v1.md). No supplier, cost, contract, payment term, integration, or automatic supplier selection is approved.

Documents & Notifications V1 are cross-platform business capabilities. The Document is separate from physical file storage, and a Notification is separate from its delivery channel. Both follow the unified Customer Account and internal/customer access boundaries; see [`docs/business/documents-notifications-v1.md`](docs/business/documents-notifications-v1.md). No storage/email provider, retention/security/marketing policy, delivery infrastructure, or implementation is approved.

## 9. Development and environments

Development is local on the user's Mac: Next.js at `localhost:3000` and a new local MariaDB database when database work begins. Do not reuse the previous LoxaMail database.

Staging and production must use separate databases. The desired flow is feature branch → `develop` → automatic staging deployment (`staging.loxamail.com`) → testing/approval → `main` → production (`loxamail.com`). Do not configure production or invent hosting infrastructure during initialization.

## 10. Product and operational decisions still TBD

Supplier; final TLD list and registrar; business email features/supplier/pricing; all prices, costs, currencies, and margin targets; product billing/quantity/setup rules; tax jurisdiction and treatment; payment gateway and fees; discount, proration, renewal, cancellation, refund, and credit policies; hosting supplier; UI design; production server; provisioning workflow; and hosting/deployment infrastructure. The commercial decision register is in [`docs/business/commercial-model-v1.md`](docs/business/commercial-model-v1.md).

## 11. Initialization boundary

Initialization creates the clean Next.js foundation, documentation, baseline tooling, and a minimal landing page. Customer identity, CRM/sales pipeline, sales/order, service/subscription, billing/invoice, support/ticketing, vendor/purchasing, supplier/provisioning, commercial, and catalogue documents are business architecture only. They do not implement customer management, CRM automation, authentication or authorization, billing or payment processing, support/ticketing, vendor/purchasing, product, order, service, subscription, or financial databases, integrations, domains, hosting, payments, provisioning, a customer portal, an admin dashboard, complex UI, or a database schema.

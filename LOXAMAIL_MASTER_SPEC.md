# LoxaMail Master Specification

**Status:** Initial approved foundation. Details marked TBD require a later decision.
**Brand:** LoxaMail
**Owner:** ONLYZER

This is the authoritative project specification. Read it before every LoxaMail development task. Future approved architectural decisions must be recorded here.

## 1. Business identity and purpose

LoxaMail is a product and brand of ONLYZER. It is not a separate legal entity. LoxaMail is intended to become a business technology services platform for domains, business email, Microsoft 365, web hosting, professional IT services, managed services, cloud/server products, and other business technology services. The catalogue will expand only through controlled specification changes.

The platform may combine relevant concepts from WHMCS and Odoo. It is not a clone of either system. Implement only the capabilities relevant to LoxaMail.

## 2. Customer architecture (locked)

Use one unified Customer Account architecture. Each account has type `COMPANY` or `INDIVIDUAL`; these are not separate customer systems. An account may own contacts, users, products/services, orders, subscriptions, domains, quotes, invoices, payments, tickets, documents, activities, and customer history.

**Contact/Person is not the same as User.** A contact is a person associated with a customer. A user has authentication access and permissions. Only people who need platform access receive user accounts. An individual customer may be represented as both a contact and a user.

## 3. Product-independent commercial architecture

The intended lifecycle is:

`Product → Order → Service → Subscription → Billing → Payment → Renewal → Provisioning`

The core must support different product/provider implementations and must not be built specifically around Microsoft 365.

- A **Product** is a catalogue definition.
- A **Service** is the actual purchased/delivered instance belonging to a Customer Account. Supplier assignment and provisioning operations target this Service, not the catalogue Product.
- Product types eventually include recurring products, one-time services, recurring managed services, and configurable products.

The intended high-level order and service lifecycle is:

`Order → Order Approval → Service Creation → Provisioning → Active → Renewal / Change → Suspension / Cancellation`

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

The platform will eventually support one-time, monthly, quarterly where appropriate, and annual billing; recurring billing; renewal; suspension; cancellation; reactivation; credits; refunds; and taxes. Exact billing and tax rules are TBD and must not be invented.

## 6. Selected WHMCS and Odoo concepts

WHMCS-inspired capabilities: products/services, orders, subscriptions, recurring billing, invoices, payments, renewals, provisioning, domains, customer portal, and support.

Odoo-inspired capabilities: customer management, companies, contacts, CRM, leads, opportunities, quotations, sales orders, activities, vendors, purchasing, documents, and reporting.

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

## 9. Development and environments

Development is local on the user's Mac: Next.js at `localhost:3000` and a new local MariaDB database when database work begins. Do not reuse the previous LoxaMail database.

Staging and production must use separate databases. The desired flow is feature branch → `develop` → automatic staging deployment (`staging.loxamail.com`) → testing/approval → `main` → production (`loxamail.com`). Do not configure production or invent hosting infrastructure during initialization.

## 10. Product and operational decisions still TBD

Supplier; final TLD list and registrar; business email features/supplier/pricing; all pricing; billing and tax rules; payment gateway; hosting supplier; UI design; production server; provisioning workflow; and hosting/deployment infrastructure.

## 11. Initialization boundary

Initialization creates the clean Next.js foundation, documentation, baseline tooling, and a minimal landing page. Supplier/provisioning categories and flows are business architecture documentation only. They do not implement customer management, CRM, billing, product or order databases, subscriptions, integrations, domains, hosting, payments, provisioning, a customer portal, an admin dashboard, complex UI, or a database schema.

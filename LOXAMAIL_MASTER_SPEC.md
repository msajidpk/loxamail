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
- A **Service** is a customer's purchased instance of a product.
- Product types eventually include recurring products, one-time services, recurring managed services, and configurable products.

## 4. Product direction (candidates, not a finalized catalogue)

### Launch candidates

- Domains: registration, transfer, renewal. Potential initial TLDs: `.com`, `.net`, `.org`, `.pk`, `.com.pk`.
- Business email: LoxaMail Business Email Basic, Professional, Enterprise.
- Microsoft 365: Business Basic, Business Standard, Business Premium.
- Hosting: Business Hosting, WordPress Hosting.
- Professional services: Microsoft 365 deployment, email migration, DNS/email configuration, Microsoft 365 security configuration, website/hosting migration.
- Managed services: managed Microsoft 365, managed email, managed hosting, managed IT support.

### Phase 2 candidates

Google Workspace, Zoho Workplace, VPS, cloud servers, managed VPS, backup, Microsoft 365 backup, cloud storage, reseller hosting, SSL, dedicated servers.

### Future candidates

AWS, Azure, Google Cloud, enterprise infrastructure, software development, mobile applications, ERP/CRM, AI automation, SEO, and digital marketing.

These are potential product areas only. Do not invent features or implement the entire catalogue.

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

Future provider abstractions may include Microsoft 365, domain registrars, hosting providers, payment providers, and other providers. Provider-specific behavior must not be scattered through the core. Microsoft Graph, registrar/hosting APIs, payment gateways, transactional email, S3-compatible storage, and Redis/BullMQ are not part of initialization.

## 9. Development and environments

Development is local on the user's Mac: Next.js at `localhost:3000` and a new local MariaDB database when database work begins. Do not reuse the previous LoxaMail database.

Staging and production must use separate databases. The desired flow is feature branch → `develop` → automatic staging deployment (`staging.loxamail.com`) → testing/approval → `main` → production (`loxamail.com`). Do not configure production or invent hosting infrastructure during initialization.

## 10. Product and operational decisions still TBD

Supplier; final TLD list and registrar; business email features/supplier/pricing; all pricing; billing and tax rules; payment gateway; hosting supplier; UI design; production server; provisioning workflow; and hosting/deployment infrastructure.

## 11. Initialization boundary

Initialization creates the clean Next.js foundation, documentation, baseline tooling, and a minimal landing page. It does not implement customer management, CRM, billing, product or order databases, subscriptions, integrations, domains, hosting, payments, provisioning, a customer portal, an admin dashboard, complex UI, or a database schema.

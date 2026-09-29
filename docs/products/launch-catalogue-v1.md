# LoxaMail Launch Product Catalogue V1

**Status:** Proposed LoxaMail V1 launch catalogue. Product names/families are agreed for catalogue planning; commercial and technical definitions remain pending as described below.

The catalogue defines proposed Products, not purchased Customer Services. A **Product** is a catalogue definition. A **Customer Service** is a customer's purchased instance of a Product. Listing a Product does not create an order, subscription, service instance, or provisioning instruction. The generic provisioning-category assignments and flow profiles are documented in [Supplier & Provisioning Architecture V1](supplier-provisioning-v1.md).

The commercial core remains product-independent:

`Product → Order → Service → Subscription → Billing → Payment → Renewal → Provisioning`

The platform must not hardcode Microsoft 365 into this lifecycle. Microsoft 365 is one of the proposed product/provider families. The unified Customer Account model remains unchanged: a Customer Account has type `COMPANY` or `INDIVIDUAL`; these are not separate systems. Contacts/people remain distinct from authenticated Users.

## 1. Domains

**Purpose:** Offer domain registration, transfer, and renewal services.

**Products included:** Domain Registration; Domain Transfer; Domain Renewal.

**Product category:** Domain products/services. How the separate registration, transfer, and renewal offerings map to the general product types in the Master Spec—including charges and timing—is TBD. This does not set a billing cycle.

**Currently known:** The three domain operations are in the proposed V1 catalogue. Potential initial TLDs previously identified are `.com`, `.net`, `.org`, `.pk`, and `.com.pk`; they are not a finalized list.

**Undecided:** Registrar/supplier, final supported TLDs, product rules for each operation, technical requirements, prices, billing/renewal rules, quantity model, provisioning, and all other fields in [Commercial Definition Pending](#commercial-definition-pending).

## 2. Business Email

**Purpose:** Offer LoxaMail-branded business email packages.

**Products included:** LoxaMail Business Email Basic; LoxaMail Business Email Professional; LoxaMail Business Email Enterprise.

**Product category:** Business email products. Their mapping to the general product types in the Master Spec, billing interval, and product-specific commercial rules are TBD.

**Currently known:** The three package names and their membership in the proposed V1 family.

**Undecided:** Features, capacity, service levels, supplier, technical specification, pricing, billing cycle, quantity model, provisioning, support scope, and all other fields in [Commercial Definition Pending](#commercial-definition-pending).

## 3. Microsoft 365

**Purpose:** Offer the named Microsoft 365 business packages as one product/provider family in the broader platform.

**Products included:** Microsoft 365 Business Basic; Microsoft 365 Business Standard; Microsoft 365 Business Premium.

**Product category:** Microsoft 365 business products. Their mapping to the general product types in the Master Spec and any billing frequency are TBD. This family does not make Microsoft 365 the core platform model.

**Currently known:** The three package names and their membership in the proposed V1 family.

**Undecided:** Inclusions, licensing terms, supplier/channel, technical specification, prices, billing cycle, quantity model, provisioning, support scope, and all other fields in [Commercial Definition Pending](#commercial-definition-pending).

## 4. Hosting

**Purpose:** Offer the named business hosting packages.

**Products included:** Business Hosting; WordPress Hosting.

**Product category:** Hosting products. Their mapping to the general product types in the Master Spec, billing frequency, and product specifications are TBD.

**Currently known:** The two product names and their membership in the proposed V1 family.

**Undecided:** Hosting supplier, technical specifications, features, limits, prices, billing cycle, quantity model, provisioning, support scope, and all other fields in [Commercial Definition Pending](#commercial-definition-pending).

## 5. Professional Services

**Purpose:** Offer the named professional implementation, migration, and configuration services.

**Products included:** Microsoft 365 Deployment; Email Migration; DNS / Email Configuration; Microsoft 365 Security Configuration; Website / Hosting Migration.

**Product category:** Professional service offerings. Their mapping to the general product types in the Master Spec is TBD. No charge basis, price, setup fee, or workflow is set.

**Currently known:** The five service names and their membership in the proposed V1 family.

**Undecided:** Scope and deliverables, eligibility, product-type mapping, effort/quantity model, prices, setup fees, tax treatment, workflows, support scope, and all other fields in [Commercial Definition Pending](#commercial-definition-pending).

## 6. Managed Services

**Purpose:** Offer the named managed-service families. The service scopes are not yet defined.

**Products included:** Managed Microsoft 365; Managed Email; Managed Hosting; Managed IT Support.

**Product category:** Managed service offerings. Their mapping to the general product types in the Master Spec and the commercial treatment of each offer are TBD. No billing interval is set.

**Currently known:** The four offering names and their membership in the proposed V1 family.

**Undecided:** Included services, boundaries, service levels, exclusions, supplier dependencies, measurement/quantity model, prices, billing cycle, renewal/cancellation/refund rules, workflows, support scope, and all other fields in [Commercial Definition Pending](#commercial-definition-pending).

## Commercial Definition Pending

All commercial values below remain **TBD for each individual product**, except that the Provisioning method column records the high-level category defined in [Supplier & Provisioning Architecture V1](supplier-provisioning-v1.md). Specific supplier, API, and operational method remain TBD. This register is a documentation checklist only; it does not introduce product behavior or implementation requirements.

| Product                              | Supplier | Supplier cost | Currency | Selling price | Billing cycle | Quantity model | Setup fee | Tax treatment | Provisioning method | Renewal rule | Cancellation rule | Refund rule | Customer workflow | Admin workflow | Support model |
| ------------------------------------ | -------- | ------------- | -------- | ------------- | ------------- | -------------- | --------- | ------------- | ------------------- | ------------ | ----------------- | ----------- | ----------------- | -------------- | ------------- |
| Domain Registration                  | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | FUTURE_INTEGRATION  | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| Domain Transfer                      | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | FUTURE_INTEGRATION  | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| Domain Renewal                       | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | FUTURE_INTEGRATION  | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| LoxaMail Business Email Basic        | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | FUTURE_INTEGRATION  | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| LoxaMail Business Email Professional | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | FUTURE_INTEGRATION  | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| LoxaMail Business Email Enterprise   | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | FUTURE_INTEGRATION  | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| Microsoft 365 Business Basic         | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | FUTURE_INTEGRATION  | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| Microsoft 365 Business Standard      | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | FUTURE_INTEGRATION  | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| Microsoft 365 Business Premium       | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | FUTURE_INTEGRATION  | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| Business Hosting                     | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | FUTURE_INTEGRATION  | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| WordPress Hosting                    | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | FUTURE_INTEGRATION  | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| Microsoft 365 Deployment             | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | INTERNAL_MANUAL     | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| Email Migration                      | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | INTERNAL_MANUAL     | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| DNS / Email Configuration            | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | INTERNAL_MANUAL     | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| Microsoft 365 Security Configuration | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | INTERNAL_MANUAL     | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| Website / Hosting Migration          | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | INTERNAL_MANUAL     | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| Managed Microsoft 365                | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | HYBRID              | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| Managed Email                        | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | HYBRID              | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| Managed Hosting                      | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | HYBRID              | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |
| Managed IT Support                   | TBD      | TBD           | TBD      | TBD           | TBD           | TBD            | TBD       | TBD           | INTERNAL_MANUAL     | TBD          | TBD               | TBD         | TBD               | TBD            | TBD           |

No supplier, price, currency, billing interval, technical specification, tax rule, workflow, or service commitment should be inferred from a product name or category. Update this register and the Master Spec only when commercial definitions are approved.

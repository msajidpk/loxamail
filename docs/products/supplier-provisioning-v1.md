# LoxaMail Supplier & Provisioning Architecture V1

**Status:** V1 business-architecture direction. Product assignments below establish generic fulfillment categories only; no specific supplier or provider is approved.

This document describes intended fulfillment and lifecycle handling for the 20 proposed Launch Product Catalogue V1 products. It is documentation only. It does not approve a supplier, API, integration, pricing, workflow implementation, data model, or service-level commitment.

## 1. Product, Service, and customer ownership

- **Product** is the catalogue definition.
- **Service** is the actual purchased and delivered instance belonging to a Customer Account.
- Supplier assignment and provisioning operate on the purchased Service, never directly on the catalogue Product.

Example:

```text
Product:
Microsoft 365 Business Standard

Customer Account:
ABC Traders (type: COMPANY)

Purchased Service:
ABC Traders — Microsoft 365 Business Standard — 25 licenses
```

The example illustrates the Product/Service distinction only; it does not define V1 quantity, pricing, licensing, or billing rules. The Customer Account architecture remains unified: each account is `COMPANY` or `INDIVIDUAL`. Do not create separate company and individual customer systems. Contacts/persons and authenticated Users remain distinct.

## 2. Supplier-independent architecture

The external fulfillment route is:

```text
LoxaMail Product
    → Supplier/Provider Assignment
    → Provisioning Adapter
    → External Provider
```

The assignment is resolved for a purchased Service. An operation is requested against that Service and routed through its generic assignment and adapter. Provider-specific behavior is contained in the adapter boundary. Replacing a supplier changes the assignment and corresponding adapter implementation; it must not require redesigning Product, Order, Service, Subscription, Billing, or Customer architecture.

For internal manual delivery, the Service is routed to a LoxaMail staff work process instead of an external provider. A hybrid Service combines the external route with staff delivery. The architecture must not require a supplier to exist for every Product.

These are logical boundaries only. Assignment precedence, whether assignments default from Product or are chosen per Service, adapter interfaces, credentials, queues, retries, status persistence, error handling, and other implementation details remain undecided. Do not add provider-specific fields or logic to core concepts as part of this documentation.

## 3. Provisioning categories

- **EXTERNAL_PROVIDER** — The product/service is fulfilled through an external supplier/provider API or reseller platform.
- **INTERNAL_MANUAL** — LoxaMail staff manually delivers or configures the service.
- **HYBRID** — Part of the service is externally provisioned and part is handled by LoxaMail staff.
- **FUTURE_INTEGRATION** — The generic external-provider approach is intended, but its integration will be implemented later.

No V1 product is assigned `EXTERNAL_PROVIDER` at this time: no active external API or reseller fulfillment route has been approved. Products expected to use a generic external provider later are categorized `FUTURE_INTEGRATION`. This does not select or approve a provider. Generic provider categories below (such as “domain registrar”) describe the kind of assignment only.

## 4. High-level order and service lifecycle

```text
Order
  → Order Approval
  → Service Creation
  → Provisioning
  → Active
  → Renewal / Change
  → Suspension / Cancellation
```

The Service is created for its owning Customer Account after order approval. Provisioning actions, renewals, changes, suspension, and cancellation target the Service. Approval authority, state names beyond this high-level sequence, triggers, eligibility, timing, customer notices, billing effects, failure handling, and status-transition rules are TBD. This lifecycle is not implemented in code.

## 5. Flow profiles inherited by the product register

Each product in the assignment register references one flow profile. That profile supplies its expected provisioning, renewal, and cancellation flows, customer-visible completion state, human involvement, LoxaMail tracking expectations, and architecture-level undecided items. Product-specific undecided details are listed in the final register.

### Profile F1 — FUTURE_INTEGRATION

**Expected provisioning flow:** After order approval, create the purchased Service under its Customer Account. Route a provisioning request for that Service through the generic assignment and a future adapter to the generic provider category. Record the returned outcome on the Service and show the agreed completion state. Until the integration exists, any interim/manual fulfillment route is TBD and requires a separately approved process.

**Expected renewal flow:** If the Service is determined to be renewable under a future approved product rule, attach the renewal operation to the Service and route it through the assigned adapter. Record the outcome. Whether the product is renewable, eligibility, trigger, notice, approval, timing, and automatic behavior are TBD; no billing cycle is implied.

**Expected cancellation flow:** Attach an authorized cancellation request to the Service, evaluate it under future approved rules, route a provider cancellation operation through the assigned adapter where required, record its outcome, and update the Service's customer-visible state. Eligibility, timing, external deprovisioning, and billing/refund effects are TBD.

**Human/admin involvement:** TBD. A future integration does not establish whether a person must review requests, handle exceptions, or use an interim process.

**Customer-visible completion state:** Show that fulfillment is pending/in progress until an external result is recorded, then show the approved active or completed outcome. Exact labels and per-product completion criteria are TBD.

**What LoxaMail must track:** Conceptually associate the Customer Account, purchased Service, Product, generic provider assignment, requested operation, lifecycle state, timestamps, external correlation/reference, and provider outcome or exception. Exact fields, retention, and audit detail are TBD.

**What remains undecided:** Provider and supplier assignment; API/integration; interim fulfillment; approval and customer-notice flow; external reference format; status vocabulary; retries, timeouts, exceptions, and reconciliation; renewal/cancellation eligibility and rules; and product-specific inputs and completion criteria.

### Profile F2 — INTERNAL_MANUAL

**Expected provisioning flow:** After order approval, create the purchased Service and a staff-delivery work item linked to it. LoxaMail staff manually deliver/configure the service and record the outcome against the Service. Scope, assignment, review, and evidence rules are TBD.

**Expected renewal flow:** No renewal behavior is assumed. If an approved rule makes the Service renewable or extendable, staff review and complete the approved work, record the result, and update the Service. Applicability, trigger, timing, and policy are TBD.

**Expected cancellation flow:** Link a customer/admin cancellation request to the Service. Staff review and stop or close the work according to a future approved policy, then record the outcome against the Service. Eligibility, effective time, remaining work, and any financial effects are TBD.

**Human/admin involvement:** Yes, by category: LoxaMail staff perform the delivery/configuration work.

**Customer-visible completion state:** Show work as pending/in progress until staff record the approved completion outcome; exact labels, milestone visibility, and completion criteria are TBD.

**What LoxaMail must track:** Conceptually associate the Customer Account and Service with the requested work/scope once defined, responsible staff, work state and actions, timestamps, and recorded outcome. Exact fields and audit requirements are TBD.

**What remains undecided:** Staff roles/ownership, work scope and acceptance criteria, customer communications, handoff and evidence requirements, renewability, cancellation policy, support model, and the detailed manual workflow.

### Profile F3 — HYBRID

**Expected provisioning flow:** After order approval, create the purchased Service. Coordinate the external-provider portion through its generic assignment and future adapter with the LoxaMail staff-delivery portion. Record both outcomes against the same Service. Exact sequence, dependency, and acceptance criteria are TBD.

**Expected renewal flow:** If the Service is renewable under an approved product rule, coordinate any required provider-side renewal with continuation of the LoxaMail-managed portion, then record both outcomes on the Service. Eligibility, cycle, trigger, order, and customer approval are TBD.

**Expected cancellation flow:** Link the cancellation request to the Service. Coordinate any required provider-side cancellation with stopping the internal managed work; record both outcomes and update the Service. Eligibility, effective date, order, external deprovisioning, and financial effects are TBD.

**Human/admin involvement:** Yes, by category: LoxaMail staff handle the internal portion. Whether a person also reviews the external operation is TBD.

**Customer-visible completion state:** Show fulfillment as pending/in progress until all required external and internal parts have recorded outcomes, then show the approved active or completed state. Exact labels, required parts, and completion criteria are TBD.

**What LoxaMail must track:** Conceptually associate the Customer Account and Service with its generic provider assignment, external operation reference/outcome, internal owner/actions/outcome, combined state, and timestamps. Exact fields, sequence, and audit detail are TBD.

**What remains undecided:** Provider/supplier, integration, division of work, sequencing and dependencies, service scope, acceptance criteria, provider failures and manual exceptions, renewability, cancellation coordination, and customer communications.

## 6. Product assignment register — Launch V1

`Supplier/provider` and `API/integration` are **TBD for every product**. Provider categories are generic descriptions, not supplier selections. The referenced flow profile applies to each product in that row.

| Product                              | Product family        | Fulfillment type                                       | Provisioning category | Generic provider category                                      | Supplier/provider | API/integration | Human/admin involvement | Flow profile |
| ------------------------------------ | --------------------- | ------------------------------------------------------ | --------------------- | -------------------------------------------------------------- | ----------------- | --------------- | ----------------------- | ------------ |
| Domain Registration                  | Domains               | External provider category intended; integration later | FUTURE_INTEGRATION    | Domain registrar                                               | TBD               | TBD             | TBD                     | F1           |
| Domain Transfer                      | Domains               | External provider category intended; integration later | FUTURE_INTEGRATION    | Domain registrar                                               | TBD               | TBD             | TBD                     | F1           |
| Domain Renewal                       | Domains               | External provider category intended; integration later | FUTURE_INTEGRATION    | Domain registrar                                               | TBD               | TBD             | TBD                     | F1           |
| LoxaMail Business Email Basic        | Business Email        | External provider category intended; integration later | FUTURE_INTEGRATION    | Email provider                                                 | TBD               | TBD             | TBD                     | F1           |
| LoxaMail Business Email Professional | Business Email        | External provider category intended; integration later | FUTURE_INTEGRATION    | Email provider                                                 | TBD               | TBD             | TBD                     | F1           |
| LoxaMail Business Email Enterprise   | Business Email        | External provider category intended; integration later | FUTURE_INTEGRATION    | Email provider                                                 | TBD               | TBD             | TBD                     | F1           |
| Microsoft 365 Business Basic         | Microsoft 365         | External provider category intended; integration later | FUTURE_INTEGRATION    | Microsoft 365 provider/reseller                                | TBD               | TBD             | TBD                     | F1           |
| Microsoft 365 Business Standard      | Microsoft 365         | External provider category intended; integration later | FUTURE_INTEGRATION    | Microsoft 365 provider/reseller                                | TBD               | TBD             | TBD                     | F1           |
| Microsoft 365 Business Premium       | Microsoft 365         | External provider category intended; integration later | FUTURE_INTEGRATION    | Microsoft 365 provider/reseller                                | TBD               | TBD             | TBD                     | F1           |
| Business Hosting                     | Hosting               | External provider category intended; integration later | FUTURE_INTEGRATION    | Hosting provider                                               | TBD               | TBD             | TBD                     | F1           |
| WordPress Hosting                    | Hosting               | External provider category intended; integration later | FUTURE_INTEGRATION    | Hosting provider                                               | TBD               | TBD             | TBD                     | F1           |
| Microsoft 365 Deployment             | Professional Services | LoxaMail staff-delivered service                       | INTERNAL_MANUAL       | Internal LoxaMail service delivery                             | TBD               | TBD             | Yes                     | F2           |
| Email Migration                      | Professional Services | LoxaMail staff-delivered service                       | INTERNAL_MANUAL       | Internal LoxaMail service delivery                             | TBD               | TBD             | Yes                     | F2           |
| DNS / Email Configuration            | Professional Services | LoxaMail staff-delivered service                       | INTERNAL_MANUAL       | Internal LoxaMail service delivery                             | TBD               | TBD             | Yes                     | F2           |
| Microsoft 365 Security Configuration | Professional Services | LoxaMail staff-delivered service                       | INTERNAL_MANUAL       | Internal LoxaMail service delivery                             | TBD               | TBD             | Yes                     | F2           |
| Website / Hosting Migration          | Professional Services | LoxaMail staff-delivered service                       | INTERNAL_MANUAL       | Internal LoxaMail service delivery                             | TBD               | TBD             | Yes                     | F2           |
| Managed Microsoft 365                | Managed Services      | External provider plus LoxaMail-managed service        | HYBRID                | Microsoft 365 provider/reseller plus internal service delivery | TBD               | TBD             | Yes                     | F3           |
| Managed Email                        | Managed Services      | External provider plus LoxaMail-managed service        | HYBRID                | Email provider plus internal service delivery                  | TBD               | TBD             | Yes                     | F3           |
| Managed Hosting                      | Managed Services      | External provider plus LoxaMail-managed service        | HYBRID                | Hosting provider plus internal service delivery                | TBD               | TBD             | Yes                     | F3           |
| Managed IT Support                   | Managed Services      | LoxaMail staff-delivered service                       | INTERNAL_MANUAL       | Internal LoxaMail service delivery                             | TBD               | TBD             | Yes                     | F2           |

The generic external provider categories in this table are intended architecture directions for planning only. No domain registrar, email supplier, Microsoft 365 reseller, hosting provider, or external managed-service provider is selected or approved.

## 7. Product-specific undecided items

The flow profiles above list shared architecture decisions still open. The undecided items listed for a family apply to each V1 product in that family; any differences between its products are also TBD. The following list does not imply a specification.

| Product family        | What remains undecided                                                                                                                                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Domains               | Final TLD catalogue; operation-specific requirements and inputs; supplier/registrar assignment; provider capabilities; renewal eligibility and rules; and completion criteria for registration, transfer, and renewal. |
| Business Email        | Package features, service limits, technical requirements, product inputs, provider assignment, and completion criteria for each tier.                                                                                  |
| Microsoft 365         | Package inclusions, licensing requirements, supplier/channel, product inputs, and completion criteria for each package.                                                                                                |
| Hosting               | Plan features, technical specifications and limits, supplier assignment, required inputs, and completion criteria for both hosting products.                                                                           |
| Professional Services | Scope, deliverables, prerequisites, eligibility, estimates/quantity basis, acceptance criteria, and closure/handoff requirements for each service.                                                                     |
| Managed Services      | Included scope, boundaries, service levels, exclusions, staffing/ownership, customer interaction, underlying-provider dependencies, and completion/ongoing-state criteria for each service.                            |

## 8. Decisions intentionally not made

- No specific supplier, reseller, registrar, hosting provider, or managed-service provider is approved.
- No API, integration, credentials, or external account is selected.
- No product price, supplier cost, currency, billing cycle, renewal/cancellation/refund rule, tax treatment, or setup fee is set.
- No database schema, Prisma model, API, UI, authentication flow, billing logic, adapter code, queue, or provisioning implementation is part of this document.
- Product-level flow details and customer-visible state names remain subject to later approved product and architecture decisions.

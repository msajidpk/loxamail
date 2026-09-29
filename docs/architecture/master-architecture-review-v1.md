# LoxaMail Master Architecture Review V1

**Review scope:** Consistency and conceptual readiness of the current Master Spec and all documents under `docs/business/` and `docs/products/`, plus the top-level project structure. This is an architecture review only; it does not design tables or authorize implementation.

## A. Executive Result

**Result: READY to begin Database Architecture V1 at the conceptual relationship/model level.** The documented business objects have workable, distinct responsibilities; the customer ownership model is unified; and the main commercial, fulfillment, billing, support, CRM, vendor, document, and notification boundaries are coherent. Readiness does not mean every relationship cardinality, status transition, or commercial policy is already decided. Those are the work of the next architecture stage. It does not authorize Prisma schema, migrations, APIs, or application implementation.

Two Master Spec wording ambiguities were corrected using boundaries already approved elsewhere: its lifecycle could be read as requiring an existing Customer Account before a Lead, while CRM allows a Lead before account identification; and its Customer Account summary could be read as customer ownership of catalogue Products. The updated text permits both the direct Customer Account purchase path and the optional CRM/Quote path, and states that customer-owned Services reference catalogue Products. Other material observations and recommendations are recorded below; they are not silently changed.

## B. Confirmed Architecture

- **Customer & Identity:** One Customer Account with type `COMPANY` or `INDIVIDUAL`; no separate company/individual customer systems. Contact and User are distinct. Internal identities are distinct from customer identities. A User may hold memberships in multiple Customer Accounts, with per-context permissions still TBD.
- **CRM:** Lead, Opportunity, and Activity are internal CRM concepts. Leads may precede account identification; an Opportunity may reference a known Customer Account. CRM may hand off to Quote/Order but does not own Customer Accounts, Products, Orders, Billing, or Support.
- **Products, Sales, Orders, and Services:** Product is the catalogue definition; Order Item captures the purchase and commercial snapshot; Service is the purchased/delivered customer instance. A Quote is optional. Direct orders do not require CRM. One Order Item can result in one or more Services. A recurring Service may have a separate Subscription; a one-time Service need not.
- **Billing and Payments:** Invoice and Invoice Line preserve issued financial snapshots. Payment is settlement and may be partial or allocated across invoices. Credit balance, Credit Note, and Refund have different meanings. Overpayment, credits, partial refunds, proration, and recurring/renewal billing are acknowledged, with behavior pending.
- **Vendors and Provisioning:** Vendor is distinct from Customer Account. Supplier Offering is internal and distinct from LoxaMail Product. Customer and Vendor invoices/payments are separate flows. Supplier assignment is replaceable, and provisioning operates on the purchased Service through an adapter or internal delivery route.
- **Support:** Ticket is Customer Account-owned and remains distinct from Service, Order, Invoice, Payment, and CRM Opportunity. It can reference relevant records; Support does not own their business rules.
- **Documents and Notifications:** Document is a cross-platform business object separated from physical file storage. Notification is a business communication separated from Email or another channel. Ownership, visibility, and access use Customer Account membership/permissions; internal/vendor information stays internal by default. Transactional and marketing communication are distinct concepts.
- **Architecture style:** The project specifies a modular monolith. No microservice architecture or provider-specific core is proposed.

### Conceptual module map and record ownership

These are logical ownership boundaries, not a requirement for one code package per row. Sales/Quotes and Orders can stay together; Subscription and Payment remain distinct business records without requiring standalone modules.

| Area                 | Recommendation                                                                                                                | Owns / remains authoritative for                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Customer & Identity  | Keep                                                                                                                          | Customer Account (`COMPANY` / `INDIVIDUAL`), Contact, User identity context, membership, roles/access concepts.                      |
| CRM                  | Keep                                                                                                                          | Lead, Opportunity, Activity, pipeline.                                                                                               |
| Products             | Keep                                                                                                                          | LoxaMail Product catalogue and product definitions.                                                                                  |
| Vendors & Purchasing | Keep together                                                                                                                 | Vendor/Supplier, Supplier Offering, sourcing/purchase records, Vendor Invoice and Vendor Payment. Customer records remain elsewhere. |
| Sales/Quotes         | Combine with Orders as Sales & Order Management                                                                               | Quote, Order, Order Item, approval and purchase snapshots. This matches the existing combined sales/order document.                  |
| Orders               | Combine with Sales/Quotes                                                                                                     | No separate Order system is needed; Order and Order Item remain distinct records within the shared ownership boundary.               |
| Services             | Keep                                                                                                                          | Purchased/delivered Service and its lifecycle.                                                                                       |
| Subscriptions        | Keep as a distinct record/capability associated with Services and Billing; do not make a standalone module a V1 prerequisite. | Recurring commercial commitment and renewal terms where applicable.                                                                  |
| Billing              | Keep together with Payments                                                                                                   | Customer Invoice, Invoice Line, Credit, Credit Note, Refund, and financial obligations.                                              |
| Payments             | Keep as a distinct payment lifecycle within Billing & Payments                                                                | Customer Payment and allocation/settlement history. Vendor Payments stay with Vendor/Purchasing.                                     |
| Provisioning         | Keep as a shared fulfillment capability                                                                                       | Service provisioning operation/request and result; supplier assignment is replaceable, and internal delivery is supported.           |
| Support              | Keep                                                                                                                          | Customer Account-owned Ticket and support conversation/assignment.                                                                   |
| Documents            | Keep cross-platform                                                                                                           | Document metadata, links, visibility and storage reference; physical content belongs to a separately chosen storage infrastructure.  |
| Notifications        | Keep cross-platform                                                                                                           | Notification, event/rule relationship, recipient context and delivery outcomes; channel transport remains separate.                  |

No area needs a separate deployable service. Combining cohesive records in the same module does not merge their business meaning or lifecycle.

### Relationship and ownership check

The reviewed relationships are coherent at the conceptual level: Customer Account owns Orders, Services, Subscriptions, customer Invoices/Payments and Tickets; Product is referenced by Order Items and resulting Services; Orders contain Order Items and may create Services; Services may have Subscriptions and link to Tickets and billing charges; Subscriptions may generate Invoices; Invoices may receive multiple Payments and a Payment may be allocated across multiple Invoices; Vendors own/offer Supplier Offerings and receive Purchase Orders, Vendor Invoices and Vendor Payments. The cross-record details and cardinalities called out in §E remain for conceptual database modeling.

## C. Terminology Issues

### C1. “Customer Service” versus “Service” — MINOR

- **Location:** `LOXAMAIL_MASTER_SPEC.md` §4; `docs/products/launch-catalogue-v1.md`; examples in business documents.
- **Problem:** “Customer Service” is sometimes used as a synonym for the purchased Service. In ordinary business usage, “customer service” can also mean support/helpdesk activity.
- **Recommended resolution:** Use **Service** for the purchased/delivered instance and reserve “customer service” in prose for a support function only where needed. Do not add or merge entities because of this wording.

### C2. “Vendor” and “Supplier” — MINOR

- **Location:** `docs/business/vendor-purchasing-v1.md` §1 and supplier/provisioning references.
- **Problem:** Vendor and Supplier are explicitly aliases in the purchasing document, while other documents use Supplier/Provider for fulfillment assignments. The different use of “Provider” may blur the external counterparty versus the provisioning mechanism.
- **Recommended resolution:** Retain Vendor/Supplier as aliases for the external organization; use Provider only as a generic fulfillment endpoint, and define the distinction once in conceptual database terminology.

### C3. Distinct concepts that should remain separate — no conflict found

- **Location:** Master Spec and the customer identity, CRM, sales/order, service/subscription, billing, support, vendor/purchasing, and documents/notifications documents.
- **Finding:** Customer Account / Contact / User; Lead / Opportunity / Activity; Product / Supplier Offering; Quote / Order / Order Item / Service / Subscription; Invoice / Invoice Line / Payment / Credit / Credit Note / Refund; Customer Ticket / CRM Opportunity; Document / storage reference; Notification / delivery; and supplier assignment / provisioning operation have separate stated responsibilities. No duplicate core concept needs merging. Invoice Line and Notification delivery are subordinate concepts, not competing ownership records.

### C4. Customer association with catalogue Products — MINOR, clarified

- **Location:** Previous wording in `LOXAMAIL_MASTER_SPEC.md` §2; Product definition in §3 and §4.
- **Problem:** The phrase “own or be associated with ... products/services” could suggest a Customer Account owns a catalogue Product, even though Products are LoxaMail catalogue definitions and Services are the purchased customer instances.
- **Resolution:** Master Spec §2 now says Customer Accounts are associated with purchased Services, which reference catalogue Products. This is a wording clarification of the existing Product/Service boundary, not a new ownership relationship.

## D. Contradictions

### D1. Arrow diagrams imply a single linear commercial lifecycle — IMPORTANT

- **Location:** `docs/products/launch-catalogue-v1.md` opening lifecycle; `docs/business/commercial-model-v1.md` §1; compare `LOXAMAIL_MASTER_SPEC.md` §3, Sales & Order Lifecycle §§5–8, and Billing & Invoice Architecture §§3, 7, 17.
- **Problem:** The catalogue presents `Product → Order → Service → Subscription → Billing → Payment → Renewal → Provisioning`, and the commercial model presents `Product → Order → Service → Subscription → Invoice → Payment`. Read literally, these place provisioning after renewal and imply every Service has a Subscription and every purchase follows one billing/settlement order. Elsewhere, Products are selected on Order Items, Services can be one-time and have no Subscription, billing timing can vary, and provisioning begins after Service creation. The concepts themselves are consistent; the linear diagrams overstate sequence and mandatory relationships.
- **Recommended resolution:** In a later documentation pass, replace these shorthand chains with separate purchase/fulfillment and recurring billing paths, explicitly marking Quote, CRM, Subscription, Invoice, and Payment as conditional where applicable. Keep renewal/change and provisioning as Service lifecycle operations, not a single mandatory tail of the sales chain.

### D2. Lead-before-customer CRM path versus Master Spec ordering — IMPORTANT, corrected

- **Location:** Previous wording in `LOXAMAIL_MASTER_SPEC.md` §3; `docs/business/crm-sales-pipeline-v1.md` §§2 and 4.
- **Problem:** The Master Spec sequence began with Customer Account then Lead, while CRM explicitly allows a Lead to exist before a Customer Account is identified. This could imply that CRM requires a preexisting customer.
- **Resolution:** Master Spec §3 now says the direct path may begin at Customer Account → Order, while an optional CRM/Quote path may begin with a Lead and associate a Customer Account when identified. The Master Spec now agrees with the CRM document.

### D3. Invoice statuses mix settlement state with credit/refund outcomes — IMPORTANT

- **Location:** `docs/business/billing-invoice-v1.md` §5 compared with §§10–14 and §16.
- **Problem:** `REFUNDED` and `CREDITED` appear in the candidate Invoice status list alongside lifecycle/settlement states such as `ISSUED`, `PARTIALLY_PAID`, and `PAID`. Refund and Credit Note are separate records, and the document itself says exact use for partial/full and mixed cases is TBD. This risks conflating the Invoice's amount-due state with adjustments or outcomes on related payments.
- **Recommended resolution:** Before finalizing a status model, decide whether refund/credit is represented by related adjustment records only, by a derived summary, or also by an Invoice status. Preserve separate Refund, Credit Note, and Invoice concepts and define partial/mixed outcomes.

### D4. Status vocabularies — MINOR overall; D3 is IMPORTANT

- **Location:** Customer Identity §10; Sales & Order Lifecycle §§2 and 4; Service & Subscription Lifecycle §§2 and 6; Billing & Invoice Architecture §§5 and 11; Support & Ticketing §4; Vendor & Purchasing §§2 and 6; Supplier & Provisioning Architecture §§4–5.
- **Finding:** Status sets are scoped to different records, and same labels such as `ACTIVE`, `PENDING`, `FAILED`, and `CANCELLED` do not by themselves imply shared state. Order, Service, Subscription, Invoice, Payment, Ticket, Customer Account, Vendor, Purchase Order, and Notification delivery each have separate conceptual states. The documents mostly warn against conflating them. Provisioning outcomes are discussed separately from Service status, but no standalone provisioning-operation status vocabulary is defined.
- **Problem:** The candidate state lists are broad, transitions remain TBD, and `TERMINATED` versus `CANCELLED` for Service is unresolved. Invoice `REFUNDED`/`CREDITED` has the specific boundary issue described in D3.
- **Recommended resolution:** In the conceptual model, keep statuses owned by their record/capability, define only required transitions, decide whether one-time work and provisioning use separate state records, and resolve Service termination and Invoice adjustment summaries before finalizing the state model.

## E. Missing Relationships

These are not evidence of conflicting ownership; they are relationship decisions the conceptual database stage must make explicit.

### E1. Supplier Assignment scope — IMPORTANT

- **Location:** `docs/products/supplier-provisioning-v1.md` §§2–3; `docs/business/vendor-purchasing-v1.md` §§3 and 11; Master Spec §8.
- **Problem:** Assignment is resolved for a purchased Service, while a Product may have potential supplier assignments and the vendor document leaves assignment scope/precedence TBD. No preferred default, override, or historical snapshot relationship is defined.
- **Recommended resolution:** Model a replaceable assignment/strategy boundary that can be resolved for a Service. During database architecture, decide how Product-level defaults and Service-level selection/history relate, without binding core Order/Service records to a named supplier.

### E2. Cross-record Document links and ownership — IMPORTANT

- **Location:** `docs/business/documents-notifications-v1.md` §§2, 5–6 and 15.
- **Problem:** Documents may attach to many unrelated business entity types, but relationship/cardinality and how customer ownership is derived when linked to multiple records are intentionally undefined. This has real consequences for authorization and internal/customer boundary enforcement.
- **Recommended resolution:** The data architecture must choose an explicit relationship strategy and define the owning access context, including a rule for documents linked to records with different visibility/ownership. Keep file content behind a storage reference and keep shared document handling centralized.

### E3. Service/Subscription/Billing relationships — IMPORTANT

- **Location:** `docs/business/service-subscription-lifecycle-v1.md` §§5–8; `docs/business/billing-invoice-v1.md` §§2–4 and 20; `docs/business/commercial-model-v1.md` §1.
- **Problem:** Documents establish that a Service may have no Subscription, and that a Subscription is associated with a recurring Service; invoices may be generated from one-time charges or recurring billing. Exact cardinalities and the route from a Service/Subscription through charges to invoice lines are not specified.
- **Recommended resolution:** Make optionality and cardinalities explicit in Database Architecture V1; preserve the option for one-time charges without Subscription and recurring invoices without making Invoice a Service state.

### E4. Provisioning operation and status ownership — IMPORTANT

- **Location:** Master Spec §8; `docs/products/supplier-provisioning-v1.md` §§2, 4–5; Service & Subscription Lifecycle §3.
- **Problem:** The architecture says Service status and Provisioning status are distinct and lists conceptual tracking of requests/results, but no named owner/lifecycle boundary for a provisioning operation is settled. The Service carries outcome context while the provisioning capability performs attempts.
- **Recommended resolution:** Define a provisioning operation/request as owned by the Provisioning capability and associated with a Service, with outcomes distinct from Service status. Decide whether a distinct persisted record is needed during database architecture; do not duplicate the Service lifecycle.

### E5. Notification recipient and related-record context — MINOR

- **Location:** `docs/business/documents-notifications-v1.md` §§8, 10–12, 14–16.
- **Problem:** Notifications may be delivered to users in customer or internal contexts and may link to a business record/document, but recipient identity, account context, and behavior when the recipient belongs to multiple Customer Accounts are not yet stated as a relationship model.
- **Recommended resolution:** Bind each customer notification to an explicit Customer Account context and recipient authorization; preserve internal recipient context separately. Resolve record links and preference behavior in the conceptual model.

## F. Missing Business Rules

The documents generally identify these as TBD instead of making unsupported claims. They are decision dependencies for later operational/product work, not blockers to start conceptual data architecture:

- Which Products are one-time, recurring, configurable, or renewable; their pricing, quantity, billing interval, tax treatment, and supplier costs.
- Quote acceptance, Order approval/payment gating, and whether payment precedes fulfillment.
- Subscription renewal, cancellation, expiry, grace-period, suspension, and Service relationship rules.
- Payment allocation/reallocation, overpayment handling, refund and credit policy, proration, and invoice correction/void treatment.
- Supplier assignment precedence, purchasing approvals, Vendor Invoice/payment workflow, and customer disclosure.
- Support status/priority/assignment details and whether any SLA is later approved.
- Document access rules, file limits/types, retention/deletion, scanning/encryption, and storage provider.
- Notification event rules, recipients/preferences, transactional/marketing policies, localization, providers, delivery tracking, and retry behavior.

No specific supplier, price, tax rate, payment gateway, SLA, consent obligation, legal rule, retention period, or operational policy was introduced in this review.

## G. Over-Engineering Risks

| Severity  | Location                                                                                                                                            | Risk                                                                                                                                                                                                                    | Practical recommendation                                                                                                                                                                                  |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IMPORTANT | Sales/order, service/subscription, commercial, and provisioning documents                                                                           | Commercial Profile, Fulfillment Profile, Billing Profile, Provisioning Strategy, Supplier Assignment, Supplier Offering, and Adapter could become many overlapping configuration records before launch needs are known. | Keep the business distinctions; implement only abstractions needed by approved V1 products. Reuse profile/configuration concepts where semantics overlap and avoid one bespoke record per product family. |
| IMPORTANT | Service & Subscription Lifecycle §§2, 6; Sales & Order Lifecycle §4; Billing & Invoice Architecture §§5, 11; Support §4; Vendor & Purchasing §§2, 6 | Multiple candidate status vocabularies can create redundant state machines. Some records include many candidate terminal/exception states while transitions and meanings are still TBD.                                 | Define a state machine per owned entity, not a shared global status. Include only states needed for approved workflows; do not persist derived summaries as independent states without a use case.        |
| MINOR     | CRM §§13–15; Vendor & Purchasing §§9–10; Documents & Notifications §§7, 13–14                                                                       | Forecasting, supplier performance, contract management, document versioning/scanning, templates/localization, notification centers, and advanced audit are future capabilities.                                         | Keep these as documented options; implement only when a concrete V1 workflow requires them.                                                                                                               |
| MINOR     | `docs/business/README.md` and module placeholders                                                                                                   | The architecture has many conceptual concerns, but repository `modules/`, `lib/`, and `components/` contain README placeholders and the application is still a clean foundation.                                        | Group cohesive concerns into a modular monolith. Do not equate each business concept or document with a separate deployable service or code module.                                                       |

No microservices, provider integrations, marketing automation, forecasting system, or extra business module is warranted by the current documentation.

## H. Database Readiness

**READY** for Database Architecture V1 as a conceptual model. The approved object boundaries and ownership contexts are sufficiently coherent to begin mapping entities and relationships. The next phase must explicitly resolve or mark the relationships in section E and keep deferred commercial/operational policies as configuration or TBD requirements rather than inventing defaults. This is not approval to create schemas, migrations, or application code.

## I. Required Corrections

1. **Completed in this review:** Clarified Master Spec §2 so purchased Services reference catalogue Products, and §3 so the optional Lead/Opportunity/Quote path can begin before a Customer Account is identified while direct Customer Account purchases remain supported.
2. **Recommended for the next documentation/database-architecture pass:** Replace strict linear commercial arrows in the Catalogue and Commercial Model with conditional, separate fulfillment and billing paths (D1).
3. **Required before final status design:** Resolve whether Invoice `REFUNDED`/`CREDITED` are statuses, derived summaries, or solely represented by related Refund/Credit Note records (D3).
4. **Required within conceptual relationship modeling:** Decide the Supplier Assignment, Document ownership/link, Service/Subscription/Invoice, provisioning operation, and notification recipient relationships (E1–E5).

Items 2–4 are recommendations for the next architecture step and were not changed automatically. The Master Spec was changed only for the explicit Lead/customer contradiction; no business rule or feature was added.

## J. Deferred Decisions

Deferred decisions remain as recorded in the Master Spec and the business/product documents, including exact fields and cardinalities; product terms/prices/taxes; supplier selection/costs; payment and renewal policies; state transitions; permission matrices; storage/provider and retention rules; notification providers/policies; and integration/operational workflows. These should be resolved only by the relevant approved specification; no values are inferred by this review.

## Review Files

The full review covered `LOXAMAIL_MASTER_SPEC.md`, `AGENTS.md`, `README.md`, every current Markdown document under `docs/business/` and `docs/products/`, `docs/architecture/README.md`, and the current project structure. No application or database code was changed.

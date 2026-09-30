# LoxaMail Database Architecture V1 Review

**Review scope:** Conceptual review of `database-architecture-v1.md` against the approved Master Spec and business/product architecture documents. This is a documentation review only; no schema, migration, code, or provider implementation is authorized.

## A. Overall result

**APPROVED WITH REQUIRED CORRECTIONS**

The proposed model preserves the approved unified Customer Account, product-independent platform, and separation between catalogue Product, Order, purchased Service, Subscription, Invoice, and Payment. The main entity groups are appropriate and the architecture avoids direct coupling to a supplier. Before Prisma design, resolve the findings in sections B, C, and L. The review does not recommend redesigning the architecture.

## B. Critical findings

None identified at the conceptual-documentation stage.

## C. Important findings

### I1. Refund cardinality differs between the relationship description and ERD

**Location:** `database-architecture-v1.md`, refund relationship description and conceptual ERD.

The relationship description allows a Refund to reference one Payment and an optional Invoice. The ERD places Refund beneath Invoice in a way that reads as a required Invoice relationship. This is a contradiction and could produce a required foreign key that excludes payment-only refunds already allowed by the billing architecture.

**Required correction:** Make the ERD show the Invoice relationship as optional, or show Refund connected to Payment with a separately optional Invoice relationship. Keep the same cardinality in prose, matrix, and diagram.

### I2. Cross-account ownership rules need an enforceable implementation decision

**Location:** `database-architecture-v1.md`, relationship integrity rules and typed context/document associations.

The document requires related records such as Contacts, Activities, Tickets, Documents, and Notifications to belong to the same Customer Account. Independent foreign keys and a one-of-target check do not by themselves guarantee that both records belong to the same account. The architecture notes possible transactional validation but does not choose an enforcement method.

**Required correction before Prisma:** Identify each account-scoped association and decide how same-account ownership is enforced (for example, suitable database constraints where feasible and transactional validation where needed). Ensure the chosen method also covers updates and reassignment, not only initial inserts.

### I3. Credit Note, Credit, and Refund accounting paths are not defined enough to protect balances

**Location:** `database-architecture-v1.md`, Credit/CreditApplication, CreditNote, Refund, and financial invariants; `billing-invoice-v1.md`, sections 10, 14, and 15.

The approved billing architecture distinguishes a Credit Note (adjustment to an issued Invoice), a Credit (customer balance), and a cash Refund. The database document allows CreditNote to optionally originate a Credit, but does not establish whether the note reduces the Invoice directly, creates a credit balance, or can do both, nor how duplicate recognition is prevented. Refunds reference a Payment and optionally an Invoice, but the effect on allocations and invoice balance is also unspecified.

**Required correction before Prisma:** Define the financial posting/application relationships for these records, including how partial or full adjustments affect outstanding balances and payment allocations. Preserve the distinction between invoice adjustment, reusable customer credit, and returned cash; prevent the same amount being applied or counted twice. Specific policy, tax treatment, and accounting rules may remain TBD.

### I4. Notification recipient identity and account context are ambiguous

**Location:** `database-architecture-v1.md`, NotificationDelivery and notification relationship matrix; `documents-notifications-v1.md`.

NotificationDelivery is described as one delivery per recipient/channel, while the recipient is shown as `User/membership`. That leaves unclear whether delivery ownership is a User, a CustomerMembership, or a polymorphic choice. It also leaves unclear how to validate that an account-scoped notification's recipient membership belongs to that same account. This could create unsafe recipient references or deliver to the wrong account context.

**Required correction before Prisma:** Select an explicit relational recipient reference and define how account-scoped and internal notifications are represented. If both User and membership context are stored, define their consistency rule. Do not implement an unvalidated `type + id` target.

### I5. AuditEvent target integrity is an unresolved weak reference

**Location:** `database-architecture-v1.md`, AuditEvent target strategy and open decisions.

The proposed entity-kind plus record-identity target deliberately has no foreign key, and the document leaves its implementation strategy open. This permits orphaned or mistyped audit targets and makes the identity contract a schema-time decision.

**Required correction before Prisma:** Decide and document the supported target-reference strategy and its integrity/retention behavior. If a weak reference is retained, define how target types and stable identities are validated and what happens when a referenced record is archived or removed. Do not assume a polymorphic target is protected by MariaDB foreign keys.

### I6. Association concepts used by the design are missing from the entity inventory

**Location:** `database-architecture-v1.md`, entity inventory, module ownership table, and relationship/cardinality sections.

`TicketContext`, `NotificationContext`, and `RolePermission` are used in relationship or module sections but do not consistently appear in the entity inventory and ownership list. They may be association concepts rather than standalone entities, but the document does not say so. This leaves implementers unsure whether they are persisted records, embedded relationships, or references to another association.

**Required correction before Prisma:** Add each persisted association to the inventory and assign an owning module, or label it explicitly as a non-entity relationship and remove any implication that it is a separate table. Keep the association cardinalities consistent across sections.

## D. Minor findings

### m1. DocumentRelation target set is not finalized

The architecture describes a wide typed-FK relation with many possible target types and says the initial V1 set should be narrowed, but does not identify that initial set. Implementing every listed target creates a large sparse relation table and expands integrity/testing work without an approved workflow for each target.

**Recommendation:** Before schema generation, list the V1 document relationship targets supported by approved workflows. Keep other targets out until needed. This is a scope clarification, not a request to replace the typed relationship approach.

### m2. Product tax configuration reference has no defined target

`ProductCommercialProfileVersion` refers to a tax configuration reference, while the architecture does not define its target or whether it is an opaque external/business reference. This is not a conflict while tax rules remain TBD, but the reference must not become an invented tax model during implementation.

**Recommendation:** Decide whether the reference is an approved internal entity, an opaque reference, or deferred. Continue snapshotting the applied tax basis and values on issued financial records as required by the billing architecture.

## E. Entity-by-entity review

| Area / entities                                                                                       | Result                           | Review                                                                                                                                                                                               |
| ----------------------------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CustomerAccount, Contact, User, CustomerMembership, Role, InternalRoleAssignment, Permission          | Consistent with correction       | Unified COMPANY/INDIVIDUAL account and separate identity concepts are preserved. Clarify the RolePermission association inventory (I6) and notification recipient ownership (I4).                    |
| Lead, Opportunity, Activity                                                                           | Consistent                       | Internal CRM records remain distinct from Customer Accounts and customer orders. Account/context links must follow I2.                                                                               |
| Product, ProductCommercialProfileVersion, ProductPriceOption, ProductFulfillmentProfile               | Consistent with clarification    | Catalogue and commercial/fulfillment configuration are separate and supplier-independent. Historical versions are supported. Clarify tax reference (m2).                                             |
| Vendor, VendorContact, SupplierOffering, SupplierAssignment, SupplierCostHistory                      | Consistent                       | Vendor is distinct from CustomerAccount; SupplierOffering and assignment preserve provider replaceability; cost history is separate from customer price.                                             |
| Quote, QuoteItem, Order, OrderItem                                                                    | Consistent                       | Sales records preserve transaction snapshots and do not collapse Order into Service.                                                                                                                 |
| Service, Subscription, SubscriptionTermVersion, ProvisioningOperation                                 | Consistent                       | Purchased Service belongs to CustomerAccount and references Product; Subscription is a recurring commercial commitment. Provisioning acts on Service.                                                |
| Invoice, InvoiceLine, Payment, PaymentAllocation                                                      | Consistent with correction       | Invoice and Payment are distinct; allocation association supports partial and many-to-many settlement. Ensure financial posting and currency rules are decided before implementation where required. |
| Credit, CreditApplication, CreditNote, Refund                                                         | Requires correction              | Concepts remain distinct, but application/posting and balance effects need I3; refund cardinality needs I1.                                                                                          |
| PurchaseRequest, PurchaseOrder, PurchaseOrderItem, VendorInvoice, VendorPayment                       | Consistent                       | Purchasing records are internal and vendor-owned; they do not reuse customer Invoice or Payment.                                                                                                     |
| Ticket, TicketMessage, TicketAttachment/DocumentRelation, TicketContext                               | Consistent with correction       | Ticket ownership is account-scoped and attachment reuse is viable. Resolve context inventory (I6), same-account enforcement (I2), and V1 DocumentRelation target set (m1).                           |
| Document, DocumentVersion, StorageReference, DocumentRelation                                         | Consistent with clarification    | Reusable document and version/storage separation is sound. Typed links avoid arbitrary polymorphic FKs; scope target set and enforce account ownership (I2, m1).                                     |
| Notification, NotificationDelivery, NotificationPreference, NotificationTemplate, NotificationContext | Consistent with correction       | Delivery, template, and preference are separate concerns; recipient semantics and context inventory need I4 and I6.                                                                                  |
| AuditEvent                                                                                            | Requires implementation decision | Audit ownership is cross-platform and conceptually appropriate; target integrity remains unresolved (I5).                                                                                            |
| Domain-specific registration records                                                                  | Safe to defer                    | The architecture explicitly defers domain-specific records until product/provider decisions are approved.                                                                                            |

No duplicate core entity was identified. Similar customer-facing and vendor-facing financial records are correctly kept separate.

## F. Relationship/cardinality review

- CustomerAccount to Contact and User/Membership distinctions align with the approved identity architecture. A User can participate in multiple accounts through memberships; do not make the User itself the customer account.
- CustomerAccount owns customer-side Leads where converted, Quotes, Orders, Services, Invoices, Tickets, and account-scoped Documents/Notifications. Same-account checks across linked records need an explicit enforcement plan (I2).
- Product to OrderItem and Service cardinalities preserve one catalogue definition serving many purchases. OrderItem to Service can be zero-to-many, which accommodates fulfillment decomposition without confusing the Order with delivery.
- Service to Subscription allows multiple historical subscriptions over its life. The candidate “at most one active” constraint needs a precise active-state definition before implementing any uniqueness rule.
- Supplier/Product links through offerings and assignments preserve supplier replaceability. Supplier assignment should be resolved for the purchased Service as defined in supplier-provisioning architecture.
- PaymentAllocation correctly models Payment-to-Invoice many-to-many settlement. CreditApplication is the analogous association for customer credit, subject to I3.
- The Refund-to-Invoice ERD edge conflicts with the optional relationship in prose (I1).
- Typed document/context relationships are MariaDB-compatible in principle when implemented with nullable typed foreign keys and a one-target constraint. Their target inventory and cross-account integrity remain to be settled (I2, m1).
- No unavoidable circular dependency was identified in the conceptual ownership model. Document, notification, and audit references are cross-cutting associations; they should not become ownership parents of the records they annotate.

## G. Financial integrity review

The model correctly separates Order, Invoice, InvoiceLine, Payment, PaymentAllocation, Credit, CreditNote, and Refund. Issued invoice/order/quote and supplier-cost snapshots preserve historical amounts rather than depending on current catalogue or supplier settings. Payment allocation permits partial payments and a payment allocated across invoices.

Before Prisma, resolve I1 and I3, and record the relevant invariants for amount/currency compatibility, allocation limits, credit application limits, refund limits, and adjustment reversals. The Master Spec and billing document leave currency, tax law/rates, accounting treatment, and policies undecided; this review does not fill them in. Financial records should remain non-cascading on deletion as the architecture already requires.

## H. Customer/identity review

The architecture conforms to the approved unified `CustomerAccount = COMPANY | INDIVIDUAL` model. Contacts represent people/contact details; Users are authenticated identities; memberships link Users to one or more Customer Accounts. Internal users remain Users with internal role assignments, not a separate customer system. No separate company/person customer tables are implied.

Before implementation, define recipient ownership (I4) and enforce same-account ownership for account-scoped links (I2). The model's one-role-per-membership initial policy is consistent with the identity document and can evolve through the stated association without duplicating account systems.

## I. Product/service/subscription review

Product is a catalogue definition with versioned commercial and fulfillment configuration. Service is the purchased/delivered instance owned by a CustomerAccount and linked to a Product. Subscription is the recurring commercial commitment attached to a Service. Order and OrderItem record the purchase transaction and its snapshot. These distinctions match the Master Spec and the product, sales, service, and provisioning documents.

Supplier/provider assignment and provisioning are abstracted from Product and operate on Service, preserving supplier replaceability. No Microsoft 365-specific core dependency was found. Clarify the tax configuration reference (m2) and avoid treating a Product's current configuration as a historical transaction snapshot.

## J. Supplier/purchasing review

Vendor/VendorContact are distinct from CustomerAccount/Contact. SupplierOffering describes a vendor's offering, while SupplierAssignment selects a fulfillment route and SupplierCostHistory preserves supplier-side history. Customer sale prices remain separate from supplier costs. PurchaseRequest, PurchaseOrder/Item, VendorInvoice, and VendorPayment are distinct from customer Order, Invoice, and Payment.

This is consistent with the vendor/purchasing and supplier-provisioning documents. No supplier is selected or locked. No material supplier/product cardinality issue was found; same-account rules apply only where an association is customer-scoped.

## K. Document/notification review

Document, version, storage reference, and relationship concepts are appropriately separated. Typed target relationships are safer for MariaDB referential integrity than a generic target-type/target-id pair. Resolve the V1 target list (m1) and tenant/account consistency (I2). Ticket attachments can use the shared Document concept without duplicating file storage records.

Notification, delivery, template, and preference are distinct concepts and align with the notifications architecture. Define delivery recipient identity and account context before schema design (I4). Define NotificationContext's persistence/ownership status in the entity inventory (I6). A notification delivery should retain its intended recipient and channel outcome even when a template or preference later changes; the architecture's history/record strategy should preserve that evidence.

## L. Required corrections before Prisma

1. Reconcile the Refund-to-Invoice optionality in the ERD, relationship matrix, and prose (I1).
2. Define an enforceable strategy for same-CustomerAccount relationship integrity across account-scoped links, including updates and reassignment (I2).
3. Specify how CreditNote, Credit, CreditApplication, Refund, PaymentAllocation, and Invoice balances interact, including duplicate-prevention invariants (I3).
4. Make NotificationDelivery recipient identity and optional account-membership context explicit and relationally valid (I4).
5. Decide and document AuditEvent target integrity, identity stability, and deletion/archive behavior (I5).
6. Complete the entity inventory/module ownership for TicketContext, NotificationContext, and RolePermission, or explicitly label them as non-persisted relationship concepts (I6).
7. Specify the initial DocumentRelation target set and clarify the tax configuration reference before schema generation (m1, m2).

## M. Items explicitly safe to defer

The following can remain TBD without blocking the conceptual architecture, provided transaction snapshots and integrity rules above are respected:

- Specific suppliers, provider credentials, APIs, integrations, adapters, and provisioning automation.
- Product prices, supplier costs, supported currencies, billing cycles, setup fees, tax rates/jurisdictions, and commercial policies until approved.
- Renewal, cancellation, refund eligibility, proration formulas, payment terms, support policies, and exact workflow/status transitions.
- Domain-specific data structures and supplier-specific fields until an approved domain/provider workflow requires them.
- Physical column types, indexes, query tuning, retention durations, and MariaDB operational configuration.
- Authentication implementation details and future multi-role policy beyond the approved initial membership model.

## N. Final recommendation

Keep the overall database architecture and its product-independent ownership model. Make the corrections in section L in the documentation before Prisma work begins. Once those decisions are reflected consistently in the inventory, cardinality descriptions, and ERD, the conceptual architecture is a sound basis for physical schema design. This review changed no application code and did not modify `database-architecture-v1.md`.

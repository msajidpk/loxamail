# LoxaMail Database Architecture V1

**Status:** Conceptual relational database architecture for a single modular-monolith application. This document defines business entities, ownership, relationships, cardinalities, constraints, and historical boundaries. Exact schema and unresolved implementation decisions remain deferred.

## 1. Scope and principles

LoxaMail V1 uses one primary application database shared by the modular monolith. Modules own their records and rules logically; they do not receive separate databases. The approved database technology is MariaDB, but this document is not a MariaDB schema design.

The conceptual model should:

- Keep Products and provider integrations independent of the core platform.
- Use one Customer Account model, typed `COMPANY` or `INDIVIDUAL`.
- Make customer ownership explicit and preserve internal/customer boundaries.
- Use relational references for business ownership and supported associations.
- Preserve purchased and issued commercial snapshots so later configuration changes do not rewrite history.
- Preserve supplier replaceability and service-centered provisioning.
- Keep lifecycle status with the record/capability that owns that lifecycle.
- Keep audit history supplementary; operational business records remain authoritative.
- Prefer the smallest model that supports approved V1 behavior. A conceptual entity is not automatically a required physical table.

Each persisted entity should have a stable, immutable internal identity. The identity type/format is TBD. Human-readable account numbers, quote/order/invoice numbers, product codes, and provider references are separate business identifiers, not primary identities. Link entities should enforce uniqueness for the relationship they represent. This document does not specify column types, SQL, indexes, or ORM syntax.

## 2. Modules and record ownership

These are logical ownership boundaries inside one database. Some related concepts intentionally share a module; keeping the records distinct does not require separate services or packages.

| Module / capability | Owns or is authoritative for                                                                                                                   | Notes                                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Customer & Identity | CustomerAccount, Contact, User identity context, CustomerMembership, customer access-role assignments                                          | One account table with type discriminator. Internal identity access is separate from customer membership. |
| CRM                 | Lead, Opportunity, Activity                                                                                                                    | CRM records may reference customer/commercial records but do not own their lifecycles.                    |
| Product Catalogue   | Product and product-level commercial/fulfillment definitions                                                                                   | Product is not customer-owned; it is referenced by purchases and Services.                                |
| Vendor & Purchasing | Vendor, VendorContact, SupplierOffering, SupplierAssignment, SupplierCostHistory, PurchaseRequest, PurchaseOrder, VendorInvoice, VendorPayment | Supplier data and vendor financials remain separate from customer records and billing.                    |
| Sales & Orders      | Quote, QuoteItem, Order, OrderItem                                                                                                             | A combined ownership boundary; Quotes and Orders remain distinct records.                                 |
| Service Management  | Service, Subscription and effective Subscription terms                                                                                         | Subscription remains a separate commercial commitment associated with a Service.                          |
| Provisioning        | ProvisioningOperation/request and outcome                                                                                                      | Operates on a purchased Service through a replaceable assignment/adapter or manual delivery.              |
| Billing & Payments  | Invoice, InvoiceLine, Payment, PaymentAllocation, Credit, CreditNote, CreditApplication, Refund                                                | Payment, Credit, CreditNote, and Refund remain separate financial records.                                |
| Support             | Ticket, TicketMessage, TicketContext                                                                                                           | Ticket attachments use the shared Document relationship.                                                  |
| Documents           | Document, DocumentVersion, DocumentRelation                                                                                                    | File content is external to the business metadata model; storage provider remains undecided.              |
| Notifications       | Notification, NotificationDelivery, NotificationPreference, NotificationTemplate                                                               | A delivery/channel outcome is not the Notification itself.                                                |
| Audit               | AuditEvent                                                                                                                                     | Cross-platform history, not the source of business state.                                                 |

## 3. Conceptual entity inventory

“Required concept” means the architecture needs the concept. It does not always require a separate table at the first implementation. “Optional” means it is needed only when the corresponding approved workflow/capability is used. “Represented by” means reuse another entity/relationship instead of adding a duplicate record. “Deferred” means requirements are insufficient to design the entity safely.

| Entity / concept                    | Disposition                                                                         | Recommended representation and boundary                                                                                                                                                                                       |
| ----------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CustomerAccount**                 | Required concept; primary entity                                                    | One entity with `COMPANY` / `INDIVIDUAL` type; anchors customer-owned records.                                                                                                                                                |
| **Contact**                         | Optional per account                                                                | Person record owned by one CustomerAccount; does not imply login.                                                                                                                                                             |
| **User**                            | Required for authenticated access; implementation details deferred                  | Authenticated principal distinct from Contact. Customer and internal context must be distinguishable without making customer membership single-account.                                                                       |
| **CustomerMembership**              | Required for customer access                                                        | Explicit association between User and CustomerAccount; enables many-to-many membership.                                                                                                                                       |
| **Role**                            | Required access concept; storage choice pending                                     | Assign customer role through membership. Internal role assignment has an internal context. Avoid a global role field on CustomerAccount.                                                                                      |
| **InternalRoleAssignment**          | Optional internal access relationship                                               | Associates an internal User with an internal-scoped Role; do not attach staff roles to CustomerMembership.                                                                                                                    |
| **Permission**                      | Optional/deferred as a database-managed entity                                      | Permission keys may be a small controlled set; a Permission and RolePermission relation are needed only if permission definitions must be managed in the database. Do not create a large matrix now.                          |
| **Lead**                            | Optional CRM capability                                                             | Can exist before CustomerAccount; may reference an account/contact once known.                                                                                                                                                |
| **Opportunity**                     | Optional CRM capability                                                             | May reference a Lead, CustomerAccount, and Contact. Potential sale, not an Order or revenue record.                                                                                                                           |
| **Activity**                        | Optional CRM capability                                                             | One activity may relate to multiple supported records through safe ActivityContext associations.                                                                                                                              |
| **ActivityContext**                 | Optional relationship concept; use if Activities target multiple entity types       | Each association must point to one real target using typed FK concepts; do not store an arbitrary target type/id as if it were referentially enforced.                                                                        |
| **Product**                         | Required catalogue entity                                                           | LoxaMail-owned definition; not assigned to a customer. Product type/category are controlled values initially, not necessarily lookup tables.                                                                                  |
| **ProductCommercialProfileVersion** | Required concept before approved price/terms are published; physical shape deferred | Effective-dated version(s) of approved selling terms, quantity/billing options, setup fee and tax configuration references. Supplier cost is not included.                                                                    |
| **ProductPriceOption**              | Optional if a version offers multiple simultaneous price/currency/cycle options     | May be represented as rows under a commercial profile version; do not split further until approved pricing choices require it.                                                                                                |
| **ProductFulfillmentProfile**       | Optional; can initially be Product attributes plus assignments                      | Separate only if fulfillment settings need independent versioning or reuse. Must stay generic.                                                                                                                                |
| **Vendor**                          | Optional external purchasing entity                                                 | LoxaMail supplier; never a CustomerAccount.                                                                                                                                                                                   |
| **VendorContact**                   | Optional                                                                            | Person associated with one Vendor; not a LoxaMail User.                                                                                                                                                                       |
| **SupplierOffering**                | Optional when sourcing from an external supplier                                    | Vendor offering and its vendor-specific identifiers/configuration; distinct from Product.                                                                                                                                     |
| **SupplierAssignment**              | Optional when a Product may use external fulfillment                                | Associates a Product with a SupplierOffering; may provide defaults/candidates. The selected assignment is recorded for a Service when resolved.                                                                               |
| **SupplierCostHistory**             | Optional where costs are tracked                                                    | Effective-dated cost history for an offering. Purchase-time cost is snapshotted separately on the purchasing item.                                                                                                            |
| **Quote**                           | Optional Sales capability                                                           | CustomerAccount-owned proposal; optional Contact and optional CRM references.                                                                                                                                                 |
| **QuoteItem**                       | Required child concept when Quote has items                                         | References one Product and preserves the quote-time commercial snapshot.                                                                                                                                                      |
| **Order**                           | Required sales record for a purchase                                                | CustomerAccount-owned; may originate from a Quote.                                                                                                                                                                            |
| **OrderItem**                       | Required child concept for Orders                                                   | References one Product and preserves the agreed order-time commercial snapshot.                                                                                                                                               |
| **Service**                         | Required delivered/purchased instance                                               | CustomerAccount-owned; references one Product and may reference its originating OrderItem and selected SupplierAssignment. No product-family-specific columns.                                                                |
| **Subscription**                    | Optional recurring commitment                                                       | Belongs to one Service; not every Service has one. A Service may have multiple non-overlapping Subscription records over its lifetime; at most one active commitment is a candidate rule requiring product/workflow approval. |
| **SubscriptionTermVersion**         | Required concept if recurring terms can change and history must be preserved        | Effective-dated quantity, recurring price, currency, billing cycle, and term snapshot. Current and historical terms must be distinguishable. Exact transition/versioning rule remains open.                                   |
| **ProvisioningOperation**           | Optional per Service operation; recommended for attempts/history                    | One Service may have many requests/attempts, including manual delivery. Stores operation kind, assignment context, outcome and timestamps conceptually; distinct from Service status.                                         |
| **Invoice**                         | Required Billing record when a charge is invoiced                                   | CustomerAccount-owned issued financial snapshot.                                                                                                                                                                              |
| **InvoiceLine**                     | Required child concept for an Invoice                                               | Preserves line description and financial values; optional typed links explain a Product, Service, Subscription, or OrderItem charge.                                                                                          |
| **Payment**                         | Required Billing & Payments record when money is received                           | CustomerAccount-owned settlement record; not tied to one Invoice directly.                                                                                                                                                    |
| **PaymentAllocation**               | Required if one Payment can cover partial/multiple Invoices                         | Join concept between Payment and Invoice with allocated amount/currency; permits partial payments and unallocated overpayment.                                                                                                |
| **Credit**                          | Optional customer credit ledger entry                                               | Account-owned value/adjustment, not the same as a CreditNote or Refund. Prefer traceable entries over an unexplained mutable balance.                                                                                         |
| **CreditApplication**               | Optional when credit is applied to invoices                                         | Associates a Credit with an Invoice and amount; balance can be derived from credit entries/applications.                                                                                                                      |
| **CreditNote**                      | Optional formal invoice adjustment                                                  | References the Invoice being adjusted; may optionally be the source of a Credit when the approved outcome is account credit.                                                                                                  |
| **Refund**                          | Optional return of funds                                                            | References a Payment and, where applicable, an Invoice. Separate record for full/partial refunds.                                                                                                                             |
| **PurchaseRequest**                 | Optional internal purchasing workflow                                               | Does not arise automatically from every Order. May be fulfilled by zero or more PurchaseOrders if approved workflow allows splitting.                                                                                         |
| **PurchaseOrder**                   | Optional procurement record                                                         | Belongs to one Vendor; separate from customer Order. May optionally reference a PurchaseRequest and customer Order/Service context.                                                                                           |
| **PurchaseOrderItem**               | Required child concept when a PurchaseOrder has items                               | References an optional SupplierOffering and snapshots description, quantity, supplier cost and currency at purchase time.                                                                                                     |
| **VendorInvoice**                   | Optional vendor financial record                                                    | Belongs to one Vendor; remains separate from customer Invoice. Match to PurchaseOrder is optional until approved matching rules are known.                                                                                    |
| **VendorPayment**                   | Optional vendor settlement record                                                   | Belongs to one VendorInvoice in the initial conceptual model; partial/multiple payments are possible. Cross-invoice allocation is deferred.                                                                                   |
| **Contract**                        | Deferred business entity                                                            | Supplier/customer contract management is not defined. A contract file can be a Document linked to its Vendor or CustomerAccount; add a Contract record only when contract lifecycle/terms need their own business rules.      |
| **Ticket**                          | Optional Support capability                                                         | Owned by one CustomerAccount; references relevant customer context without owning the referenced records.                                                                                                                     |
| **TicketMessage**                   | Optional child of Ticket                                                            | Each message belongs to one Ticket and has an author/context; system events may instead be AuditEvents.                                                                                                                       |
| **TicketAttachment**                | Represented by DocumentRelation                                                     | No separate file store or attachment entity; ticket attachment relationship points to shared Document.                                                                                                                        |
| **Document**                        | Optional cross-platform business capability                                         | Metadata and visibility/owner context; separate from file content.                                                                                                                                                            |
| **DocumentVersion**                 | Required if preserving document versions                                            | Belongs to one Document; has a storage reference and file metadata for that version.                                                                                                                                          |
| **StorageReference**                | Represented on DocumentVersion initially                                            | Provider-neutral reference to physical content; separate concept, not a selected provider or storage implementation.                                                                                                          |
| **DocumentRelation**                | Required for supported attachments                                                  | Relates Document to supported business records with explicit target FK concepts, not arbitrary polymorphic references.                                                                                                        |
| **Notification**                    | Optional cross-platform capability                                                  | Business communication triggered by an event; no provider send behavior. Event identity/context may be recorded without a general event-bus table.                                                                            |
| **NotificationDelivery**            | Required if notification delivery is supported                                      | One row per recipient and channel outcome; includes recipient context, status, and optional template used.                                                                                                                    |
| **NotificationPreference**          | Optional                                                                            | User preference, optionally scoped to a CustomerMembership; internal and customer contexts remain distinct.                                                                                                                   |
| **NotificationTemplate**            | Optional; can initially be configuration                                            | Database-managed entity only if templates need editing/versioning outside deployment.                                                                                                                                         |
| **AuditEvent**                      | Required cross-platform audit concept; persistence details deferred                 | Actor, action, timestamp, entity/context reference and before/after metadata where appropriate. Never replaces business records.                                                                                              |
| **Domain-specific record**          | Deferred                                                                            | No separate Domain entity until domain-specific fields, ownership/uniqueness rules, and lifecycle are approved. Domain purchases still reference Product and Service.                                                         |

## 4. Primary identities and ownership

Use stable internal primary identities, separate from changeable names and human-facing numbers. Exact identity format is deferred. CustomerAccount is the ownership anchor for customer records; customer-scoped records should carry a required CustomerAccount reference or have one unambiguous required path to it. Do not duplicate customer ownership on every child when it can be derived safely; duplicate ownership references only where they are needed to enforce tenant access or historical context, and keep them consistent.

Ownership/reference rules:

- Contact belongs to one CustomerAccount. A Contact may optionally reference a User. A User may be linked to multiple Contacts (for example, one per customer account); one Contact references at most one User in the simple initial model.
- CustomerMembership is the explicit User–CustomerAccount association. A User may have zero or many memberships; a CustomerAccount may have zero or many memberships. A pair has at most one current membership record; deactivation/reinvitation rules remain TBD.
- Customer roles are assigned through CustomerMembership, not directly to the CustomerAccount. Internal user roles are assigned in internal context. Whether one membership may hold multiple roles is deferred; start with one assigned Role per membership unless an approved need requires role composition.
- Internal staff are distinguishable from customer identities/contexts. Do not infer that a staff identity is a Contact or that internal role grants customer membership.
- Lead may precede CustomerAccount. Opportunity and Activity are CRM-owned even when associated with a CustomerAccount.
- Product is catalogue-owned. A customer owns a Service that references Product, not the Product itself.
- Vendor and purchasing records are internal. SupplierOffering belongs to Vendor and does not replace Product.
- Order, Service, Subscription, Invoice, Payment, Credit, Ticket and customer-visible Document must resolve to one CustomerAccount access context.
- Internal Documents and supplier/purchasing records have no customer ownership context unless an explicitly approved customer-facing association is later defined.

## 5. Relationship and cardinality model

Cardinalities below describe conceptual maxima/optionality. A child in a draft workflow may temporarily be absent; finalization requirements and transition-specific minimums are noted separately. “M:N” is implemented conceptually through an explicit association entity, not a free-form field.

### Customer, identity and CRM

| Relationship                                   | Cardinality                                                         | Conceptual foreign-key direction / rule                                                                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| CustomerAccount → Contact                      | 1 : 0..many                                                         | Contact requires one CustomerAccount.                                                                                                          |
| Contact → User                                 | 0..1 : 0..many                                                      | Contact may link to one User; a User may relate to multiple Contacts. Do not merge the records.                                                |
| User ↔ CustomerAccount                         | many : many                                                         | CustomerMembership has required User and CustomerAccount references; unique current pair.                                                      |
| CustomerMembership → Role                      | 0..1 role per membership initially                                  | Role has many memberships. Role cardinality/composition remains configurable only after approval.                                              |
| User → InternalRoleAssignment → Role           | User 1 : 0..many assignments; each assignment has one internal Role | Internal roles are separate from customer membership roles.                                                                                    |
| Role ↔ Permission                              | many : many, optional                                               | RolePermission association only if permission keys are database-managed; otherwise Permission is a controlled key set outside relational data. |
| Lead → CustomerAccount / Contact               | each 0..1; each target 0..many Leads                                | Lead may predate account identification. If both are set, Contact must belong to the referenced CustomerAccount.                               |
| Opportunity → Lead / CustomerAccount / Contact | each 0..1; each target 0..many Opportunities                        | All references are optional. If both account and contact are set, they must agree.                                                             |
| Activity → context records                     | 1 Activity : 1..many context links when attached                    | ActivityContext rows point to supported targets via typed FK references. Activity may relate to more than one context.                         |

### Product, sourcing, sales and delivery

| Relationship                                         | Cardinality                                                 | Conceptual foreign-key direction / rule                                                                                                                       |
| ---------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product → ProductCommercialProfileVersion            | 1 : 0..many                                                 | Versions have effective dates; published/selected versions are not overwritten historically. Multiple active price options require distinct option rows.      |
| Product → ProductFulfillmentProfile                  | 1 : 0..many                                                 | Optional; may be represented in Product attributes until independent versioning is required.                                                                  |
| Vendor → VendorContact                               | 1 : 0..many                                                 | Each VendorContact belongs to one Vendor.                                                                                                                     |
| Vendor → SupplierOffering                            | 1 : 0..many                                                 | Each SupplierOffering belongs to one Vendor.                                                                                                                  |
| Product → SupplierAssignment                         | 1 : 0..many                                                 | Assignment points to one SupplierOffering. An offering may have zero or more assignment records over time.                                                    |
| SupplierOffering → SupplierCostHistory               | 1 : 0..many                                                 | Effective-dated supplier costs; supplier cost is not the selling price.                                                                                       |
| CustomerAccount → Quote                              | 1 : 0..many                                                 | Each Quote belongs to one CustomerAccount; Contact is optional and must belong to the same account when set.                                                  |
| Quote → QuoteItem                                    | 1 : 0..many while draft; 1..many when issued                | Each QuoteItem belongs to one Quote and references one Product.                                                                                               |
| Quote → Order                                        | 1 : 0..many; Order → Quote 0..1                             | An Order has at most one source Quote. Whether an accepted Quote can produce multiple Orders is a workflow decision; do not add a uniqueness restriction yet. |
| CustomerAccount → Order                              | 1 : 0..many                                                 | Each Order belongs to one CustomerAccount.                                                                                                                    |
| Order → OrderItem                                    | 1 : 0..many while draft; 1..many when confirmed             | Each OrderItem belongs to one Order and references one Product.                                                                                               |
| Product → OrderItem                                  | 1 : 0..many                                                 | Product reference required on each OrderItem; product definition changes do not replace item snapshots.                                                       |
| OrderItem → Service                                  | 1 : 0..many; Service → OrderItem 0..1                       | OrderItem can create multiple Services or none if cancelled/failed; imported/manual Services may lack an originating OrderItem.                               |
| CustomerAccount → Service                            | 1 : 0..many                                                 | Each Service belongs to one CustomerAccount and references one Product.                                                                                       |
| Product → Service                                    | 1 : 0..many                                                 | Required catalogue reference; provider-specific data stays out of Service.                                                                                    |
| Service → SupplierAssignment / ProvisioningOperation | Service has 0..1 selected assignment and 0..many operations | Selected assignment is a snapshot/reference for that Service. A manual-only Service may have no external SupplierAssignment.                                  |
| Service → Subscription                               | 1 : 0..many over its lifetime                               | Each Subscription belongs to one Service. At most one concurrently active Subscription is a candidate rule; overlap/renewal policy is TBD.                    |
| Subscription → SubscriptionTermVersion               | 1 : 1..many                                                 | Each term version snapshots applicable recurring terms; effective intervals must be traceable and not overwrite prior terms.                                  |

### Customer billing and internal purchasing

| Relationship                                               | Cardinality                                                       | Conceptual foreign-key direction / rule                                                                                                                                     |
| ---------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CustomerAccount → Invoice                                  | 1 : 0..many                                                       | Each customer Invoice belongs to one CustomerAccount.                                                                                                                       |
| Invoice → InvoiceLine                                      | 1 : 0..many while draft; 1..many when issued                      | Lines preserve the issued financial snapshot.                                                                                                                               |
| InvoiceLine → Product / Service / Subscription / OrderItem | each optional 0..1 reference                                      | A line may explain a charge by one or more relevant references; manual adjustments may have none. All set references must be consistent with the invoice's CustomerAccount. |
| CustomerAccount → Payment                                  | 1 : 0..many                                                       | Each Payment belongs to one CustomerAccount, whether or not it is fully allocated.                                                                                          |
| Payment → PaymentAllocation → Invoice                      | Payment 1 : 0..many allocations; Invoice 1 : 0..many allocations  | Many-to-many via PaymentAllocation. Allocation records amount/currency and supports partial/multiple payment.                                                               |
| CustomerAccount → Credit                                   | 1 : 0..many                                                       | Credit entries belong to one account; available balance is derived from entries and applications, not an unexplained mutable total.                                         |
| Credit → CreditApplication → Invoice                       | Credit 1 : 0..many applications; Invoice 1 : 0..many applications | Explicit relationship and amount; each application must use the same account/currency context.                                                                              |
| Invoice → CreditNote                                       | Invoice 1 : 0..many; each CreditNote references one Invoice       | A CreditNote adjusts an issued Invoice; its accounting/legal treatment is TBD.                                                                                              |
| Payment → Refund                                           | Payment 1 : 0..many; Refund references one Payment                | Invoice reference on Refund is optional; amount/total refund limits require workflow validation.                                                                            |
| PurchaseRequest → PurchaseOrder                            | Request 1 : 0..many; PurchaseOrder → PurchaseRequest 0..1         | Optional; no customer Order automatically creates a request.                                                                                                                |
| Vendor → PurchaseOrder                                     | Vendor 1 : 0..many                                                | Each PurchaseOrder is issued to one Vendor.                                                                                                                                 |
| PurchaseOrder → PurchaseOrderItem                          | 1 : 0..many while draft; 1..many when issued                      | Each item belongs to one PurchaseOrder; SupplierOffering is optional for ad hoc procurement.                                                                                |
| PurchaseOrderItem → SupplierOffering                       | 0..1 : 0..many                                                    | If present, offering must belong to the same Vendor as its PurchaseOrder. Item preserves actual supplier cost/currency.                                                     |
| Vendor → VendorInvoice                                     | Vendor 1 : 0..many                                                | Each VendorInvoice belongs to one Vendor; PO matching is optional pending purchasing rules.                                                                                 |
| VendorInvoice → VendorPayment                              | 1 : 0..many                                                       | VendorPayment belongs to one VendorInvoice in the initial model; one invoice may receive multiple payments.                                                                 |

### Support, documents, notifications and audit

| Relationship                                       | Cardinality                                                      | Conceptual foreign-key direction / rule                                                                                                                                                         |
| -------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CustomerAccount → Ticket                           | 1 : 0..many                                                      | Ticket requires one CustomerAccount. Optional Contact/User references must be authorized in that account context.                                                                               |
| Ticket → TicketMessage                             | 1 : 0..many                                                      | Message belongs to one Ticket; author is a User/context reference.                                                                                                                              |
| Ticket → Service / Order / Invoice / Subscription  | each 0..many context links                                       | Use TicketContext with explicit typed FK concepts; do not make the Ticket own or alter the referenced record.                                                                                   |
| Document → DocumentVersion                         | 1 : 1..many                                                      | A logical Document can have one or more versions. Each version has one provider-neutral storage reference.                                                                                      |
| Document ↔ supported business records              | many : many through DocumentRelation                             | Each DocumentRelation links one Document to exactly one supported target through a real typed FK. CUSTOMER-visible Documents require one CustomerAccount owner; internal records stay internal. |
| Business event → Notification                      | 1 event may create 0..many notifications                         | No separate BusinessEvent table is required by default; a notification records event type and source context.                                                                                   |
| Notification → NotificationDelivery                | 1 : 0..many                                                      | One row per recipient/channel outcome; supports multiple recipients and channels.                                                                                                               |
| User / CustomerMembership → NotificationPreference | each 1 : 0..many                                                 | Preferences may be global per User or account-context-specific via membership; do not mix scopes.                                                                                               |
| NotificationDelivery → NotificationTemplate        | 0..1 template per delivery; a template may serve many deliveries | Channel-specific template reference/version. Templates may remain deployment configuration initially.                                                                                           |
| User → AuditEvent                                  | Actor 0..1 : 0..many                                             | Actor may be a User or system process; actor/context recorded, not necessarily a customer Contact.                                                                                              |
| Business record → AuditEvent                       | 1 : 0..many events; each event has one primary target            | Audit target is an explicit typed entity/context reference; the chosen technical referential strategy remains an implementation decision.                                                       |

## 6. Relational association strategy

Do not use a `targetType` + arbitrary `targetId` pair as if it were a foreign key for Activity, Document, Ticket context, or Notification context.

Initial DocumentRelation target concepts may include CustomerAccount, Contact, User, Lead, Opportunity, Activity, Product, Quote/QuoteItem, Order/OrderItem, Service, Subscription, Invoice/InvoiceLine, Payment, Credit, CreditNote, Refund, Ticket, Vendor/VendorContact, SupplierOffering, PurchaseRequest, PurchaseOrder/PurchaseOrderItem, VendorInvoice/VendorPayment, and ProvisioningOperation. A future Contract target is added only after that entity is approved. The initial set should be narrowed to actual V1 document workflows; a future target is added explicitly with its own FK relationship, and “other future business record” is not a free-form target type.

For the V1 conceptual model, use a **DocumentRelation** association with explicit nullable FK concepts for the approved target types and an exactly-one-target-per-relation integrity rule. Apply the same typed-target principle to ActivityContext, TicketContext, and NotificationContext; a context may instead use a dedicated typed junction if its cardinality or metadata differs materially. This keeps one shared Document/file model and avoids unrelated `TicketAttachment`, `InvoiceFile`, or `VendorFile` storage systems. Adding a new target requires an explicit relationship addition; it is not silently accepted through a free-form string.

**NotificationContext** is an optional relational association between a Notification and one supported business target, used when the source event alone is insufficient context. It uses the same explicit target references as DocumentRelation and may remain embedded in Notification if there is only one fixed target reference.

Document is a logical business record. DocumentVersion carries file metadata and a provider-neutral StorageReference. Physical content is not stored in customer tables. A CUSTOMER-visible Document has an explicit CustomerAccount access owner; relations to records in other accounts or internal-only records must be rejected. Visibility and the user's membership/role both gate access.

AuditEvent is a deliberate cross-platform history exception: its target is descriptive context and audit is never used to load/update authoritative business state. Prefer a typed target association when the implementation can keep it maintainable. If an implementation uses a constrained entity-kind + stable record identity reference for audit lookup, document that it is not an FK and never cascade-delete business records through it. Audit retention/reference survival remains policy-dependent.

## 7. Product commercial and fulfillment configuration

Keep Product stable and product-independent. A Product belongs to the catalogue, has a controlled product type/category, and does not contain named supplier fields or customer data.

Use an effective-dated ProductCommercialProfileVersion concept rather than embedding mutable prices directly in Product. It holds approved commercial options (selling price, currency, permitted billing cycle/quantity model, setup fee, tax configuration reference, and effective dates) when those decisions exist. If a profile offers multiple concurrent currency/cycle/quantity price choices, represent each as a child ProductPriceOption. The V1 products currently have no approved commercial values; do not populate guessed values. Supplier cost is sourced from SupplierOffering/SupplierCostHistory, never copied into Product selling price.

Fulfillment configuration stays separate from commercial terms. Initially, generic Product fulfillment category plus SupplierAssignment may be sufficient; introduce a separately versioned ProductFulfillmentProfile only if approved product configuration requires it. Supplier assignments connect Product to SupplierOffering and may evolve over time. When a supplier is resolved for a purchased Service, retain the selected assignment/offering context on that Service or its ProvisioningOperation so later reassignment does not rewrite history. Do not store supplier-specific API fields in Product, Order, or Service.

## 8. Historical snapshot requirements

Operational/configuration references and commercial snapshots serve different purposes. A reference answers “which current definition or source was selected?”; a snapshot answers “what exact terms were agreed/charged then?”

| Record                        | Snapshot or stable historical values                                                                                                                                                            | References retained                                                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| QuoteItem                     | Product display/code, description, quantity, unit price, currency, setup/recurring amounts, billing/term choice, discounts, tax basis/rate/amount and totals, where applicable                  | Product; Quote.                                                                                                              |
| OrderItem                     | Agreed Product identity/description, selected quantity/options, unit/total amounts, currency, setup/recurring terms, billing interval, discount and tax values, where applicable                | Product; Order; originating QuoteItem where traceable.                                                                       |
| Service                       | Purchased Product identity/description, configuration/quantity needed to identify the delivered instance, originating OrderItem, and selected supplier/fulfillment assignment context when used | CustomerAccount; Product; optional OrderItem and SupplierAssignment.                                                         |
| SubscriptionTermVersion       | Effective period, quantity, recurring price, currency, billing cycle/term and renewal terms applicable during that version                                                                      | Subscription; source ProductCommercialProfileVersion/OrderItem where applicable.                                             |
| Invoice / InvoiceLine         | Issued descriptions, quantities, prices, currency, discounts, tax basis/rates/amounts, totals, applicable period, and customer/billing presentation values                                      | CustomerAccount; optional Product, Service, Subscription, OrderItem, PaymentAllocation, CreditNote/adjustment relationships. |
| Payment / PaymentAllocation   | Received amount/currency/date/reference as known; each allocation amount/currency and allocation event                                                                                          | CustomerAccount; Invoice through PaymentAllocation; provider reference only if later approved.                               |
| Credit / CreditApplication    | Credit amount/currency/source/reason and applied amount/date                                                                                                                                    | CustomerAccount; Invoice; optional originating CreditNote/approved adjustment.                                               |
| Refund                        | Refund amount/currency/reason/date/status and relationship at time of refund                                                                                                                    | Payment; optional Invoice.                                                                                                   |
| PurchaseOrderItem             | Ordered description, quantity, supplier cost, currency, tax if applicable, and supplier terms at purchase time                                                                                  | Vendor/PurchaseOrder; optional SupplierOffering; associated customer Order/Service where relevant.                           |
| VendorInvoice / VendorPayment | Vendor invoice amounts and payment amount/currency/reference as received/paid; do not infer supplier terms                                                                                      | Vendor; optional PurchaseOrder match; VendorPayment to VendorInvoice.                                                        |
| DocumentVersion               | File name/type/size, version identity, upload actor/time and storage reference for that version                                                                                                 | Document; explicit DocumentRelation targets.                                                                                 |
| NotificationDelivery          | Recipient/context, channel, template/version, outcome, sent time and failure information where available                                                                                        | Notification; recipient User/membership; optional business context.                                                          |

Snapshots should be immutable after the relevant business commitment/issuance point. Exact correction, supersession, and retention rules remain TBD. Current Product price, supplier cost, tax configuration, or template content must never be used to silently recalculate a historical Quote/Order/Invoice/Payment. InvoiceLine pricing is a snapshot; payment allocation is a separate settlement record.

## 9. Status ownership

Each lifecycle status belongs to its own entity. Use controlled values owned by that module; do not introduce a global Status table or reuse another entity's status as a substitute.

| Owner                                                  | Status boundary                                                                                                                    |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| CustomerAccount                                        | Customer account lifecycle (`ACTIVE`, `SUSPENDED`, `INACTIVE` candidates).                                                         |
| Product                                                | Catalogue availability/status, distinct from Service status.                                                                       |
| Lead / Opportunity / Activity                          | Separate CRM lifecycle/stage/status.                                                                                               |
| Quote                                                  | Quote proposal status.                                                                                                             |
| Order                                                  | Purchase/approval/fulfillment summary status; not a Service or Payment status.                                                     |
| Service                                                | Delivered resource/work status; distinct from provisioning operation and Subscription.                                             |
| Subscription                                           | Recurring commitment and renewal status.                                                                                           |
| ProvisioningOperation                                  | Operation/attempt outcome, separate from Service status. Final state vocabulary remains TBD.                                       |
| Invoice                                                | Financial obligation/settlement summary; do not conflate related Refund/CreditNote state.                                          |
| Payment / Refund                                       | Each has its own settlement/refund status.                                                                                         |
| Vendor / PurchaseOrder / VendorInvoice / VendorPayment | Separate internal supplier/purchasing lifecycle states, never customer billing states.                                             |
| Ticket                                                 | Support request lifecycle.                                                                                                         |
| Document / DocumentVersion                             | Document availability/version lifecycle and visibility are separate concepts.                                                      |
| NotificationDelivery                                   | Per-recipient/channel delivery state (`PENDING`, `QUEUED`, `SENT`, `DELIVERED` where supported, `FAILED`, `CANCELLED` candidates). |

Candidate labels documented in business architecture are not final enumerations. In particular, resolve Invoice `REFUNDED`/`CREDITED` semantics before implementation; related Refund/CreditNote records may be sufficient without treating these outcomes as invoice lifecycle states. A parent Order or customer account status must not overwrite child record status.

## 10. Integrity constraints

These are conceptual invariants, not physical index or SQL definitions:

- CustomerAccount type is exactly one of the approved account types; Company and Individual are not separate tables.
- Contact's CustomerAccount is required; its optional User association does not grant access. When a Lead/Opportunity/Ticket references both Contact and CustomerAccount, both references must resolve to the same account.
- CustomerMembership is unique for a User/CustomerAccount pair in the active relationship. Membership changes remain traceable; no duplicate active membership.
- User authentication identity is unique according to the eventual Auth.js identity mapping (for example, issuer/provider plus subject); email uniqueness is not assumed until login/account-recovery behavior is approved.
- Product code/identifier is unique within the LoxaMail catalogue. A Product is never tenant-owned.
- Quote/Order/Invoice numbers are unique within their eventual issuing series/scope; exact numbering and scope remain TBD. Human numbers are not primary identities.
- PurchaseOrder and VendorInvoice numbers are unique within the relevant issuer/vendor numbering scope; the scope and supplier-reference uniqueness rules remain TBD.
- Vendor identifiers, VendorContact links, and vendor-side SKUs/references are unique only within an approved scope (such as one Vendor), not assumed globally unique.
- Payment references are unique only within a payment source/provider scope if that source is approved; do not assume a globally unique external reference.
- DocumentVersion identity/sequence is unique within its Document; NotificationPreference is unique for its user, context, event/category, and channel scope once those keys are decided.
- Each QuoteItem and OrderItem belongs to exactly one parent and references exactly one Product. Each issued Quote/confirmed Order must satisfy its approved minimum-item rule.
- Product/SupplierAssignment/SupplierOffering/Vendor references must agree; a PurchaseOrderItem's offering, if set, must belong to that PurchaseOrder's Vendor.
- Customer-owned records and cross-record links must have matching CustomerAccount ownership. Vendor/internal records cannot become customer-visible solely through a Document or Notification link.
- Each typed ActivityContext, TicketContext, Notification context, or DocumentRelation targets exactly one supported record. Enforce same-account context where relevant.
- Each InvoiceLine belongs to one Invoice. Once issued, line snapshots and invoice totals are not silently edited. Any correction uses a traceable approved adjustment/replacement flow.
- PaymentAllocation must not exceed the Payment's available amount; allocations must match customer and currency context. Unallocated remainder can exist as overpayment until an approved credit/refund/manual action.
- CreditApplications cannot exceed available credit. Credit and Invoice must belong to the same CustomerAccount and compatible currency context.
- Refund amounts must be related to an eligible Payment and respect its refundable amount under the future policy. Partial/multiple refunds remain traceable.
- Subscription effective term versions must not ambiguously overlap for the same commitment. Whether multiple concurrent subscriptions on one Service are allowed remains a business rule.
- Customer invoice and vendor invoice/payment references must never cross financial ownership domains.
- Financial history is not physically cascade-deleted when a customer, product, supplier, or parent transaction is deactivated or archived.
- A domain name uniqueness constraint is not designed here. It requires an approved Domain entity/normalization and ownership/transfer policy before domain operations are implemented.

Uniqueness, amount equality, effective-date overlap, and same-account/currency checks may require database constraints and/or transactional business validation; exact implementation is deferred.

## 11. Delete, archive, and retention principles

- Do not cascade-delete issued financial history, allocations, credits, refunds, purchase records, or audit events.
- Prefer status-based deactivation for Products, Vendors, and Customer Accounts referenced by historical transactions.
- Restrict deletion of referenced business records unless a later approved retention/deletion policy provides a controlled process.
- Preserve an issued Quote/Order/Invoice and their snapshots as historical records even if their Product is retired.
- Document archival, version removal, and physical file deletion are separate concerns. Removing a Document relationship does not automatically erase stored content or its audit history.
- No retention period, legal obligation, or right-to-delete rule is defined here. Access controls and approved policy determine any controlled anonymization or permanent deletion.

## 12. Audit architecture

AuditEvent is a cross-platform append-oriented history concept with actor (User or system), action, timestamp, target entity/context, and relevant metadata. Before/after values may be captured for appropriate changes, with sensitive values excluded or redacted according to a future approved security policy.

Business records remain authoritative for current state. An AuditEvent saying a Payment completed does not make the Payment complete; the Payment record does. Audit access, event scope, target reference strategy, metadata format, retention and tamper protection remain to be finalized before implementation. Do not create separate audit source-of-truth state machines or depend on audit replay to derive current records.

## 13. Textual ERD

```text
CustomerAccount (type: COMPANY | INDIVIDUAL)
 ├─< Contact ─ optional >─ User
 ├─< CustomerMembership >─ User ─ internal role context (separate)
 ├─< Quote ─< QuoteItem >─ Product ─< ProductCommercialProfileVersion
 │     └─ optional source for >─ Order ─< OrderItem >─ Product
 │                                  └─< Service >─ Product
 ├─< Service ─< Subscription ─< SubscriptionTermVersion
 │      ├─ optional SupplierAssignment >─ SupplierOffering >─ Vendor
 │      └─< ProvisioningOperation
 ├─< Invoice ─< InvoiceLine ─ optional Product / Service / Subscription / OrderItem refs
 │      ├─< PaymentAllocation >─ Payment
 │      ├─< CreditApplication >─ Credit
 │      ├─< CreditNote
 │      └─< Refund >─ Payment
 ├─< Ticket ─< TicketMessage
 │      ├─< TicketContext >─ Service / Order / Invoice / Subscription
 │      └─< DocumentRelation >─ Document ─< DocumentVersion ─ StorageReference
 └─< customer-owned Document / Notification context (explicit typed links)

Vendor ─< VendorContact
  ├─< SupplierOffering ─< SupplierCostHistory
  │      └─< SupplierAssignment >─ Product
  ├─< PurchaseOrder ─< PurchaseOrderItem ─ optional SupplierOffering
  └─< VendorInvoice ─< VendorPayment

Lead ─ optional CustomerAccount / Contact
 └─< Opportunity ─ optional CustomerAccount / Contact
Activity ─< ActivityContext >─ supported CRM/business records

Business event/context ─< Notification ─< NotificationDelivery >─ User/membership
                                         └─ optional NotificationTemplate
User/system actor ─< AuditEvent ─ typed or constrained target context
```

The diagram omits lookup/configuration rows and repeats shared entity references for readability. Arrows indicate association/cardinality, not an enforced chronological workflow. A Product can be sold without a SupplierOffering; a Service can be one-time without a Subscription; an Invoice/payment timing is governed by future commercial rules.

## 14. Complexity and normalization review

- Keep one normalized relational model and one database; module ownership is logical, not a reason to create duplicate customer/product/payment tables.
- Do not create separate Company/Individual, invoice-file/ticket-file/vendor-file, or customer/vendor financial tables that reuse the wrong ownership model. Customer and vendor invoices/payments are separate concepts and owners even if they share implementation patterns later.
- Keep SupplierOffering distinct from Product because one is external and replaceable. Do not add supplier columns to Product.
- Preserve QuoteItem, OrderItem, InvoiceLine, PaymentAllocation, SubscriptionTermVersion, and PurchaseOrderItem only for their distinct snapshot/relationship purposes; avoid duplicating a second mutable copy of current catalogue or supplier configuration.
- Do not create universal Status, Party, BusinessEvent, ProductType, or DocumentCategory tables without an approved need. Controlled values can begin as module-owned configuration.
- Avoid free-form polymorphic foreign keys for Activity, Document, Ticket, and Notification relationships. Typed association targets have deliberate maintenance cost but preserve relational integrity.
- A universal `BusinessRecord` supertype or per-document file tables would add complexity without current business need.
- Domain details, extensive RBAC, configurable permission engines, vendor analytics, notification marketing automation, and provider-specific databases are not included without approved requirements.

## 15. Open decisions before Prisma implementation

These are genuine implementation blockers for the affected parts of the schema; they do not block this conceptual model:

- Auth.js/User identity mapping and uniqueness basis; whether one principal can act in both customer and internal contexts.
- Whether roles/permissions are database-managed and whether a membership can hold one or multiple roles.
- Product category/type vocabulary and the final version/option shape for multiple currencies, cycles, quantity models, and tax references.
- Domain-specific fields and unique domain/ownership rules before implementing domain workflows; a Domain table is deliberately deferred here.
- Final supported target list and chosen typed-FK/junction-table implementation for DocumentRelation, ActivityContext, TicketContext, Notification context, and AuditEvent target references.
- Notification recipient scoping, read/unread state ownership, preference precedence, and whether in-app delivery is persisted as NotificationDelivery.
- Provisioning operation fields/status lifecycle and whether manual work attempts require separate persisted operation records.
- Quote, Order, Invoice, CreditNote, and VendorInvoice numbering scope/series.
- Currency representation, tax snapshot detail and rounding basis before generating financial records.
- Subscription term-version transition semantics and whether concurrent subscriptions per Service are permitted.
- VendorInvoice matching to PurchaseOrders and whether VendorPayments may allocate across invoices.
- Document storage-reference contract, supported file/version lifecycle and access-control enforcement before file handling is implemented.
- AuditEvent target integrity, before/after metadata representation, and retention/access controls.

Supplier names, prices, tax rates, billing cycles, legal retention periods, and notification/security policies are not schema blockers at this conceptual stage and remain TBD; do not invent them to resolve the items above.

## 16. Physical implementation boundary

This document defines conceptual Database Architecture V1 only. It does not define Prisma syntax, column types, migration SQL, indexes, MariaDB-specific optimization, ORM configuration, application code, APIs, authentication implementation, or business logic. Do not run Prisma, connect to MariaDB, or create/modify a database as part of this architecture task.

# LoxaMail Vendor & Purchasing Architecture V1

**Status:** Product-independent internal purchasing business architecture. Suppliers, costs, terms, fields, policies, and implementation remain TBD unless explicitly approved elsewhere.

This document describes how LoxaMail may acquire external products and services while keeping supplier relationships separate from the public Product Catalogue and customer architecture. It is documentation only; it does not authorize application code, database schemas, Prisma models, APIs, UI, supplier integrations, accounting integration, or purchasing automation. The existing supplier-independent Provisioning Architecture remains authoritative for how purchased services are delivered/configured.

## 1. Vendor / Supplier

A **Vendor** (also called a **Supplier**) is an external organization from which LoxaMail obtains products, services, licenses, domains, hosting, infrastructure, professional services, or other business inputs.

A Vendor is not a Customer Account. For V1, Vendor and Customer Account are separate business concepts; do not reuse the customer model for Vendors. A future shared-party abstraction, if useful, requires a separate architecture/database decision and is not assumed here.

Commercial direction may be:

```text
Vendor supplies to LoxaMail → LoxaMail sells/manages a Service → Customer buys from LoxaMail
```

This intermediary relationship applies where appropriate and does not assert that every Service requires an external Vendor.

## 2. Vendor profile and contacts

Conceptual Vendor information may include vendor name, vendor type/category, primary contact, email, phone, website, country, address, status, notes, internal owner, and account/reference information. Exact fields, validation, and relationship rules remain TBD.

A Vendor may have multiple Vendor Contacts, such as Sales, Technical Support, Billing, or an Account Manager. A Vendor Contact is not a LoxaMail User and does not receive platform authentication by virtue of being a contact. Exact Vendor Contact fields and communication rules are TBD.

Conceptual Vendor statuses are:

- `ACTIVE`
- `INACTIVE`
- `SUSPENDED`

These are simple planning states only. Their meanings and transitions are TBD; no vendor lifecycle is implemented.

## 3. Product, Supplier Assignment, and Supplier Offering

The LoxaMail Product Catalogue remains the public catalogue of what LoxaMail offers. Supplier Offerings are internal records of what an external Vendor offers; they are not public LoxaMail Products and do not replace or redefine the Product Catalogue.

The replaceable sourcing relationship is:

```text
LoxaMail Product
  → Supplier Assignment
  → Supplier Product / Offering
  → Supplier Cost
  → Provisioning Strategy
```

A LoxaMail Product may have one or more potential suppliers. The catalogue must not permanently hardcode a single Vendor. Supplier assignments and offerings can change without redesigning the LoxaMail Product, Customer, Order, Service, Subscription, or Billing architecture. Assignment precedence and whether an assignment is selected by Product, fulfillment, or Service remain TBD.

A **Supplier Offering** is the Vendor's product/service that corresponds to a LoxaMail Product. Conceptual information may include Vendor, vendor product/service name, vendor reference/SKU, related LoxaMail Product, cost, currency, supplier billing cycle, quantity rules, availability/status, effective date, and end date where applicable. These are candidate concepts, not finalized fields. Actual Vendor values, costs, currency, cycles, and quantity rules remain TBD.

## 4. Supplier cost and cost history

Supplier cost is separate from LoxaMail selling price:

```text
Supplier Cost → LoxaMail Commercial Model → Selling Price
```

Supplier cost is internal and is not exposed to customers by default. Customer-facing information is controlled by approved Product/Service and commercial configuration.

Future cost records may distinguish one-time, recurring, quantity-based, or other supplier cost bases where approved. Historical cost records should preserve the cost and currency effective for their period. A supplier price change should record the new cost with its effective date while preserving the old cost and effective date. A change to an offering's current cost must not silently rewrite historical purchases, Orders, Services, or financial transactions.

Exact cost model, effective-date rules, currency handling, conversion, and transaction snapshots are TBD. Supplier costs are not LoxaMail selling prices, and no actual cost or margin is specified.

## 5. Purchase Request

A **Purchase Request** is an internal request to acquire something from a Vendor. Examples include additional licenses, domain registration, hosting resources, a third-party service, or equipment/service needed for customer delivery.

A Purchase Request may be created manually or, in the future, be raised from a customer Order or Service requirement. A customer Order does not automatically imply a Purchase Request. Request fields, approval, routing, and any relationship to Orders/Services remain TBD. No automation is implemented.

## 6. Purchase Order

A **Purchase Order (PO)** is LoxaMail's formal request to a Vendor to supply goods/services. It is an internal procurement record and is not a customer Order or a payment.

Conceptual PO information may include PO number, Vendor, date, items, quantity, supplier price, currency, taxes where applicable, total, requested delivery/fulfillment, status, notes, and approval information. This is not a final field list or commitment. Numbering, approval, calculations, terms, and vendor acceptance process remain TBD.

Conceptual Purchase Order statuses are:

- `DRAFT`
- `PENDING_APPROVAL`
- `SENT`
- `ACKNOWLEDGED`
- `PARTIALLY_FULFILLED`
- `FULFILLED`
- `CANCELLED`
- `REJECTED`

These are candidate labels only. Definitions and transitions remain TBD and should not be over-engineered before implementation design.

## 7. Purchase fulfillment and customer Order relationships

A Purchase Order may be fulfilled through an approved provider integration, manually, partially, or through recurring supplier billing. Fulfillment may eventually link to the relevant Customer Service, customer Order, LoxaMail Product, and Supplier Offering. A PO can also serve internal or inventory needs without a direct customer Order/Service link. Exact relationships and lifecycle handling are TBD. No provisioning is implemented here.

A customer Order does not always require a Purchase Order. The architecture supports:

**A. Existing inventory or pre-provisioned resource:**

```text
Customer Order → Service → Fulfillment
```

**B. External supplier required:**

```text
Customer Order → Supplier Purchase / Provisioning → Service
```

**C. Internal professional service:**

```text
Customer Order → Internal Delivery → Service
```

These are alternative conceptual fulfillment paths; they do not assert an inventory model, supplier selection, or integration. One customer Order can be delivered without a Purchase Order, and supplier purchasing is not the same record or process as customer selling.

## 8. Vendor Invoice and Vendor Payment

A **Vendor Invoice** is a financial document received from a Vendor and addressed to LoxaMail. It is separate from LoxaMail's Customer Invoice:

```text
Customer Invoice: LoxaMail → Customer
Vendor Invoice:   Supplier → LoxaMail
```

A **Vendor Payment** is money LoxaMail pays to a Vendor and is conceptually associated with a Vendor Invoice:

```text
Vendor Invoice → Vendor Payment
```

Vendor Invoices and Vendor Payments must remain distinct from Customer Invoices, Customer Payments, and customer credit/refund records. Vendor document numbering, received/paid status, approval, reconciliation, payment methods, timing, tax/accounting treatment, and relationships to purchase records remain TBD. No bank, payment method, or supplier payment term is selected.

Customer Billing is LoxaMail charging a customer; Vendor Purchasing is LoxaMail incurring supplier cost. These are separate financial flows and must not be merged.

## 9. Cost tracking and supplier price changes

Purchasing should conceptually support future tracking of supplier cost, product/service cost, purchase cost, recurring supplier cost, one-time supplier cost, cost changes, and effective dates. This may support future gross margin, profitability, product economics, and supplier comparison reporting; no reporting, target margin, or performance claim is defined here.

Cost history should preserve at least the old Supplier Cost and its effective date, and the new Supplier Cost and its effective date when an approved change occurs. Historical purchases must retain their applicable transaction terms and must not be recalculated from a current supplier price.

## 10. Supplier contracts and performance

The architecture may support future supplier agreements, contract dates, renewal dates, contract documents, and commercial terms. Contract management is not implemented, and no contract, term, renewal rule, or legal obligation is invented.

Future reporting may track fulfillment success, provisioning failures, response times, cost changes, or supplier availability. Metric definitions and data sources are TBD. No performance targets or supplier rankings are defined.

## 11. Supplier assignment and provisioning boundary

Supplier/Purchasing and Provisioning are related but separate:

- **Supplier/Purchasing:** who LoxaMail buys from, what offering is purchased, and the applicable supplier cost/transaction.
- **Provisioning:** how a purchased Service is delivered or configured.

The conceptual connected route is:

```text
Product
  → Supplier Assignment
  → Supplier Offering
  → Purchase / Provisioning Strategy
  → Provisioning Adapter or Internal Delivery
  → Customer Service
```

This extends the previously approved architecture: provider assignment is resolved for the purchased Service; external behavior passes through a replaceable Provisioning Adapter, while internal/manual delivery remains valid. Purchasing records may provide fulfillment context but do not replace the Provisioning Strategy, Service lifecycle, or Supplier & Provisioning Architecture. No adapters or integrations are implemented.

## 12. Multiple suppliers and supplier selection

The architecture must allow multiple suppliers for the same LoxaMail Product. For example, a future Business Hosting Product could have more than one potential Supplier Offering. No supplier is named or approved by this example.

Future selection may consider cost, availability, product capability, customer requirement, or operational policy. Selection rules, preferred supplier behavior, fallback, assignment scope, and approval are TBD. No automatic supplier selection is implemented or assumed.

## 13. Vendor vs Customer and customer visibility

- A **Customer** buys from LoxaMail and is represented by the unified Customer Account architecture.
- A **Vendor** supplies to LoxaMail and remains a separate internal business concept.

Supplier information is internal by default. Customers should not automatically see Vendor identity, Supplier Cost, supplier contracts, internal Purchase Orders, or Vendor Invoices. Any customer-facing information is determined by the approved Product/Service and commercial configuration. Visibility rules are TBD; no customer or vendor record is merged.

## 14. Future Admin capabilities

Future Admin capabilities may include a Vendor list and profile; Vendor Contacts; Supplier Offerings and costs; Purchase Requests and Purchase Orders; Vendor Invoices and Vendor Payments; supplier documents and history; and related Products and Services. Roles, permissions, approval, search, reporting, and workflows are TBD. No UI is built here.

## 15. Audit and history

Important Vendor and purchasing events should eventually be auditable, including Vendor created/updated; Supplier Assignment changed; Supplier Cost changed; Purchase Request created; Purchase Order created, approved, sent, or fulfilled; Vendor Invoice recorded; Vendor Payment recorded; and supplier relationship changed.

Event definitions, actors, before/after details, retention, and audit implementation remain TBD. No audit infrastructure is designed here.

## 16. Open decisions

The following remain **TBD** unless established by a future approved specification:

- Exact Vendor fields, Vendor categories, and Vendor Contact fields.
- Vendor matching/identity and any future shared-party abstraction.
- Supplier Assignment rules, assignment scope, and preferred supplier concept.
- Supplier Offering fields, availability, and Product correspondence.
- Supplier Cost model, cost history/effective dates, currency, and cost snapshots.
- Purchase Request fields, workflow, and approval rules.
- Purchase Order numbering, approval, terms, and fulfillment states.
- Vendor Invoice numbering, approval, matching, and status.
- Vendor Payment workflow, terms, methods, and reconciliation.
- Supplier contract management and document handling.
- Supplier performance reporting and definitions.
- Automatic purchasing and automatic supplier selection.
- Inventory/pre-provisioned resource model.
- Supplier integration and Provisioning Adapter implementation.
- Customer visibility and disclosure of supplier information.

No supplier, supplier cost, payment term, tax rate, contract term, database/schema, Prisma model or migration, API, UI, supplier integration, automatic supplier selection, accounting integration, or purchasing automation is defined or authorized by this document.

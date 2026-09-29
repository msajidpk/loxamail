# LoxaMail Sales & Order Lifecycle V1

**Status:** Product-independent sales and order business architecture. Exact fields, status transitions, approvals, and product-specific rules remain TBD where stated.

This document defines conceptual business flows only. It does not authorize application code, database schemas, Prisma models, APIs, UI, billing, payment integration, or provisioning implementation. It preserves the unified Customer Account architecture (`COMPANY` or `INDIVIDUAL`) and the approved Product, Service, supplier/provisioning, and commercial boundaries in the Master Spec.

## 1. Sales architecture

The conceptual sales-to-fulfillment flow is:

```text
Customer Account
  → Lead / Sales Opportunity (future CRM layer, where applicable)
  → Quote (optional)
  → Customer Approval (where required)
  → Order
  → Order Items
  → Service Creation
  → Provisioning / Delivery
  → Active Service or Completed Work
```

Not every sale requires a Quote. Both paths are supported:

**Path A — Direct purchase**

```text
Customer Account → Order → Order Item(s) → Service(s)
```

**Path B — Quotation**

```text
Customer Account → Quote → Customer approval → Order → Order Item(s) → Service(s)
```

Lead and Sales Opportunity belong to a future CRM layer and are not prerequisites for direct purchases. Approval steps, if any, are governed by future approved workflow and product/service rules.

## 2. Quote

A **Quote** is a commercial proposal presented to a Customer Account before an Order exists. It may be prepared with an associated Contact. A Quote is not itself an Order, Service, Invoice, or Payment. Acceptance may result in an Order according to a future approved workflow; not every Order must originate from a Quote.

Conceptual Quote information may include Customer Account, Contact, quote number, issue date, expiry date, currency, line items, quantities, unit prices, discounts, tax, subtotal, total, notes, terms, and status. These are candidate concepts, not a finalized field list or commercial commitment. The exact fields and calculation/approval rules remain TBD; monetary values, taxes, and terms follow the [Commercial Model V1](commercial-model-v1.md) and are not specified here.

Conceptual Quote statuses may include:

- `DRAFT`
- `SENT`
- `VIEWED`
- `ACCEPTED`
- `REJECTED`
- `EXPIRED`
- `CANCELLED`

Exact status names, transitions, customer acceptance evidence, signature requirements, and quote numbering are TBD.

## 3. Order and Order Items

An **Order** is a customer's confirmed commercial request for one or more catalogue Products, subject to applicable approval and payment conditions. It belongs to one Customer Account and may optionally reference an originating Quote. It is separate from the Services later created to fulfill it.

Conceptual Order information may include Customer Account, optional originating Quote, order number, order date, currency, Order Items, discounts, tax, total, notes, status, creator, approval information, and audit/history. This is not a finalized field list. Exact fields, numbering, calculations, approval evidence, and edit rules are TBD.

An **Order Item** represents a specific catalogue Product selected for purchase:

```text
Order → Order Item → Product
```

An Order Item should conceptually capture the commercial snapshot needed to create the purchased Service(s), such as the Product, quantity, unit price, setup fee, discount, tax, billing model where relevant, term where relevant, total, and selected configuration/options where applicable. Exact fields are TBD and do not approve any price, quantity rule, billing cycle, tax rule, or product option.

### Historical commercial terms

An Order and its items preserve the commercial terms agreed at purchase time. They must not dynamically change when a catalogue price or Product definition changes later. The historical order snapshot, the resulting Service terms, and any later invoice snapshot remain distinct records/concepts. This is consistent with the [Commercial Model V1](commercial-model-v1.md); no storage design is defined here.

## 4. Order status

The conceptual Order lifecycle should support these statuses:

- `DRAFT`
- `PENDING_APPROVAL`
- `PENDING_PAYMENT`
- `CONFIRMED`
- `PROCESSING`
- `PARTIALLY_FULFILLED`
- `FULFILLED`
- `FAILED`
- `CANCELLED`

This is a candidate lifecycle vocabulary, not a finalized enum or strict one-way sequence. An Order may wait for approval or payment, and fulfillment progress depends on its items. Exact definitions, allowed transitions, terminal states, and implementation can be refined during future workflow and database design.

Order status is distinct from Service status, Subscription status, Invoice status, Payment status, and Provisioning status. Each represents a different lifecycle subject. An Order may be confirmed while its Services are being provisioned; an Order can be partially fulfilled while different item Services have different states.

## 5. Order approval and payment relationship

Approval may conceptually be automatic, customer-approved, internally approved, or dependent on a payment condition. Which approvals apply may vary by the approved commercial and fulfillment rules for a Product/Service. High-value or manually delivered work may require internal review, but no threshold or mandatory review rule is set here.

The financial relationship is:

```text
Order → Financial obligation → Invoice / Payment
```

An Order is **not** a Payment. A confirmed Order may create or correspond to a financial obligation; Invoice and Payment remain distinct financial records. Whether payment is required before Service creation or fulfillment depends on future product/service commercial rules. No gateway, payment method, timing, or billing implementation is defined here. Refer to the [Commercial Model V1](commercial-model-v1.md) for unresolved payment and billing decisions.

## 6. Service creation

After an Order is confirmed under the applicable approval/payment rules, an Order Item may result in one or more Customer Services. Keep the concepts separate:

- **Product** = catalogue definition.
- **Order Item** = what was purchased and its agreed commercial snapshot.
- **Service** = actual customer-owned/delivered instance associated with the Customer Account.

Example:

```text
Product:
Microsoft 365 Business Standard

Order:
ABC Traders — 25 licenses

Order Item:
25 × Microsoft 365 Business Standard

Customer Service:
ABC Traders — Microsoft 365 Business Standard — 25 licenses
```

The example illustrates the concept only; it does not establish a product specification, quantity model, price, supplier, or billing rule. Service creation rules and required information vary by the approved Product commercial and fulfillment profiles and remain TBD.

One Order may contain multiple Order Items. One Order Item may create one Service, multiple Services, a Service plus a Subscription, or a one-time work/service record, depending on the Product's approved fulfillment model. Do not assume a universal one-to-one relationship.

## 7. One-time and recurring Services

Some Orders create a one-time professional Service or work item, such as Microsoft 365 Deployment, Email Migration, or Website / Hosting Migration. Such work may move conceptually through:

```text
Ordered → Assigned → In Progress → Completed
```

These examples are proposed catalogue entries, not a commitment to exact workflow or scope. A one-time Service must not be forced into a recurring Subscription model. Assignment rules, work states, acceptance criteria, and closure are TBD.

A recurring product may create both a Customer Service and a Subscription:

```text
Recurring Product → Customer Service + Subscription
```

The Service represents the delivered instance; the Subscription represents the recurring commercial commitment where applicable. For example, Microsoft 365 Business Standard may result in a Customer Service with a Subscription if its future commercial rules define it as recurring. No interval or billing behavior is implied. Subscription billing is outside this task.

## 8. Provisioning and fulfillment

After Service creation, fulfillment conceptually follows the previously approved supplier-independent architecture:

```text
Service
  → Provisioning request
  → Provisioning adapter or internal delivery
  → External provider / LoxaMail staff
  → Provisioning result
  → Service status update
```

Fulfillment may be automatic, manual, or hybrid, using the category and flow assigned by the [Supplier & Provisioning Architecture V1](../products/supplier-provisioning-v1.md). Operations act on the purchased Service, not directly on the catalogue Product. Provider selection and adapter implementation remain outside scope.

## 9. Partial fulfillment

An Order may have multiple Order Items with different fulfillment requirements and completion timing. Some items may complete while others remain pending, processing, or fail. Order-level status must support `PARTIALLY_FULFILLED` and must not impose a single shared provisioning state on every item or Service.

Each item's resulting Service/work record and fulfillment outcome is tracked conceptually at its own level; the Order status summarizes the aggregate progress. Aggregation rules, customer presentation, and treatment of mixed outcomes are TBD.

## 10. Failed fulfillment

If Service creation or fulfillment fails, the conceptual process is:

```text
Order / Order Item
  → Service creation or provisioning attempt
  → Failure recorded with a reason
  → Retry or manual intervention, if approved
  → Continue fulfillment or cancel under applicable rules
```

Failure context should be associated with the affected Order Item and/or Service so other successfully fulfilled items can continue. Retry eligibility, counts, timing, escalation, customer communication, and cancellation/financial outcomes are TBD. No automatic retry policy is invented.

## 11. Cancellation boundaries

Cancellation depends on the stage and applicable future rules:

- Before Order confirmation, an Order may be cancelled under a future approved rule.
- After confirmation but before fulfillment, cancellation may require review depending on the Product/Service and work already started.
- After a Service is active, the Service's cancellation rules apply.

**Order cancellation is not Service cancellation.** Cancelling an Order concerns the request and its remaining fulfillment; cancelling a Service concerns an already created/delivered instance. An Order with several items may need item-level outcomes. The exact effect of Order cancellation on existing or partially created Services is TBD. Refund and credit treatment is not defined here; refer to the [Commercial Model V1](commercial-model-v1.md).

## 12. Order history and audit

Important Order and fulfillment events should eventually be auditable. Conceptual examples include:

- Order created or updated.
- Order approved or rejected.
- Payment requirement created.
- Order confirmed.
- Service created.
- Provisioning started, completed, or failed.
- Order became partially fulfilled or fulfilled.
- Order cancelled.

Event definitions, actor/context, before/after detail, retention, and audit implementation remain TBD. This does not design an audit database.

## 13. Future customer and admin experience

### Customer experience

A future Customer Portal may guide a customer through:

1. Browse a Product.
2. Select a Product.
3. Configure permitted quantity/options.
4. Add it to an Order.
5. Review and submit the Order.
6. Approve a Quote if applicable.
7. Complete payment if required.
8. Track Order progress.
9. Receive activation or completion information.
10. Access the Service from the Customer Portal.

The sequence and availability are conceptual; direct purchase may omit Quote approval, and payment/approval order may vary by approved rules. No UI is built here.

### Admin experience

Future Admin capabilities may include viewing and searching Orders; reviewing, approving, or rejecting Orders; modifying them where permitted; requesting payment; confirming an Order; creating Services; monitoring fulfillment; handling provisioning failures; cancelling Orders; and viewing complete Order history. Roles, approval rules, edit boundaries, workflows, and UI remain TBD. No Admin UI is built here.

## 14. Product-independent processing

The core Order system must not contain named-product special cases such as `if Microsoft 365`, `if Domain`, or `if Hosting`. Conceptually, processing uses:

```text
Product
  → Commercial Profile
  → Fulfillment Profile
  → Provisioning Strategy
```

The Commercial Profile supplies approved purchase terms; the Fulfillment Profile describes the service/work to deliver; the Provisioning Strategy routes fulfillment according to the supplier-independent provisioning architecture. The boundaries are conceptual and do not add new product details or authorize implementation. Product definitions and profiles remain replaceable without coupling the core Order lifecycle to a specific product family or supplier.

## 15. Open decisions

The following remain **TBD** unless established by a future approved specification:

- Exact Quote fields and commercial calculation details.
- Exact Order and Order Item fields.
- Quote numbering and Order numbering.
- Quote approval, acceptance evidence, and customer signature/e-signature mechanism.
- Payment-before-confirmation or payment-before-fulfillment rules by Product/Service.
- Internal approval rules and any review thresholds.
- Order modification rules before and after confirmation.
- Order and Service cancellation rules and item-level effects.
- Failed fulfillment retry, escalation, and manual-intervention rules.
- Partial fulfillment aggregation and customer-facing progress rules.
- Service creation rules and quantity-to-Service mapping by Product.
- Exact Quote, Order, item, Service, and provisioning status implementations and transitions.
- Order-to-invoice/payment timing and commercial consequences.
- Customer/Admin workflow details, notifications, and audit implementation.

No database schema, Prisma model or migration, API, UI, billing implementation, payment integration, or provisioning adapter is defined or authorized by this document.

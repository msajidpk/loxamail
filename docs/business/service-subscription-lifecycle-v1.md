# LoxaMail Service & Subscription Lifecycle V1

**Status:** Product-independent service and subscription business architecture. Exact fields, states, transitions, billing rules, and product-specific behavior remain TBD unless already approved elsewhere.

This document is documentation only. It does not define a database schema, Prisma models, APIs, UI, billing implementation, or provisioning implementation. It preserves the unified Customer Account model and the previously approved sales/order, commercial, product, and supplier/provisioning architecture.

## 1. Product, Order Item, Service

A **Product** is a catalogue definition. An **Order Item** is the Product and commercial selection purchased on an Order. A **Service** is the actual purchased/delivered instance belonging to a Customer Account.

```text
Product → Order Item → Service
```

Example:

```text
Product:
Microsoft 365 Business Standard

Order Item:
25 licenses

Service:
ABC Traders — Microsoft 365 Business Standard — 25 licenses
```

The example is conceptual and sets no licensing, quantity, price, supplier, or billing rule. A Service must retain the commercial and provisioning context needed to operate the purchased service, while exact fields and relationships remain subject to future database design. The Service belongs to its unified Customer Account (`COMPANY` or `INDIVIDUAL`).

## 2. Service lifecycle and status

The conceptual Service lifecycle supports these states:

| Status                 | Conceptual meaning                                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `PENDING`              | Service has been created or requested but is not yet in provisioning/delivery or active use.                             |
| `PROVISIONING`         | Automatic, manual, or hybrid fulfillment is underway.                                                                    |
| `ACTIVE`               | The Service has met its approved activation/completion requirements and is available as defined for that Product.        |
| `SUSPENDED`            | Service use or delivery is suspended under an approved reason or process; suspension does not itself cancel the Service. |
| `EXPIRED`              | A time-bound Service has reached its approved expiry condition without remaining active under applicable rules.          |
| `CANCELLATION_PENDING` | A cancellation request has been recorded and is awaiting its effective action or review.                                 |
| `CANCELLED`            | The Service has been cancelled under the applicable process.                                                             |
| `TERMINATED`           | The Service has reached an end state under an approved termination action. Exact distinction from cancellation is TBD.   |
| `FAILED`               | Creation or delivery failed and requires an approved recovery, intervention, or closure decision.                        |

These are conceptual states, not a final enum or a complete transition diagram. Exact meanings, entry/exit criteria, transitions, and implementation remain subject to future design.

Service status is separate from Order status, Subscription status, Invoice status, Payment status, and Provisioning status. Those states describe different business subjects and must not be merged.

## 3. Service activation and provisioning

The conceptual activation flow is:

```text
Order Confirmed
  → Service Created (PENDING)
  → Provisioning / Delivery
  → Activation requirements met
  → ACTIVE
```

Fulfillment may be automatic, manual, or hybrid according to the Product's approved fulfillment model. A Service must not become `ACTIVE` merely because an Order exists. Activation criteria and which party records or confirms activation are TBD by Product and operational rules.

Use the approved supplier-independent provisioning architecture:

```text
Service
  → Provisioning Strategy
  → Provisioning Adapter / Internal Delivery
  → External Provider or LoxaMail staff
  → Result
```

Provisioning can succeed or fail. A failed attempt should be recorded against the appropriate Service and recoverable through an approved retry or manual intervention process. Failure data, retry counts/timing, escalation, and recovery policy are TBD. Provisioning operates on the purchased Service, not directly on the catalogue Product. No adapter or workflow is implemented here.

## 4. One-time Services

Some Products create one-time Services or delivery work, such as Microsoft 365 Deployment, Email Migration, DNS / Email Configuration, or Website / Hosting Migration. Their conceptual delivery path may be:

```text
PENDING → IN_PROGRESS / DELIVERY → COMPLETED
```

`IN_PROGRESS` and `COMPLETED` here describe a possible work/delivery lifecycle, not additional approved Service status enum values. If implementation needs a separate work/delivery status, it can be designed later. A one-time Service does not require a recurring Subscription and must not be forced into one.

## 5. Recurring Services and Subscriptions

A recurring Product may create a Customer Service and a Subscription:

```text
Recurring Product → Service + Subscription
```

The **Service** represents what the customer owns or receives. The **Subscription** represents the recurring commercial commitment associated with that Service. Example:

```text
Service:
ABC Traders — Microsoft 365 Business Standard — 25 licenses

Subscription:
Recurring commercial commitment for that Service
```

The example does not choose a billing cycle, price, currency, renewal default, supplier, or product-specific rule. A Service may exist without a Subscription. A Subscription should normally reference a recurring Service. Keep these concepts separate.

## 6. Subscription concept and status

A **Subscription** is the recurring commercial agreement associated with a recurring Service. Conceptual information it may track includes the Customer Account, Service, Product, start date, current term, current period start/end, billing cycle, renewal date, quantity, recurring price, currency, status, and renewal behavior. This list is not a final field definition; exact fields and relationships are TBD.

Conceptual Subscription statuses are:

| Status       | Conceptual meaning                                                                         |
| ------------ | ------------------------------------------------------------------------------------------ |
| `PENDING`    | Subscription is recorded but its recurring commitment has not yet become active.           |
| `ACTIVE`     | Subscription is in an active recurring term under its approved commercial rules.           |
| `PAST_DUE`   | A required renewal or recurring financial obligation is unresolved under applicable rules. |
| `SUSPENDED`  | The recurring commitment is suspended under an approved process.                           |
| `CANCELLING` | A cancellation request or scheduled cancellation is being processed.                       |
| `CANCELLED`  | The Subscription has been cancelled.                                                       |
| `EXPIRED`    | The current term or commitment has ended under applicable expiry rules.                    |

Subscription status is distinct from Service status. For example, a Subscription may become `PAST_DUE` while the Service remains `ACTIVE` during an allowed grace period; whether this is allowed, and for how long, is TBD. A Subscription state does not mechanically dictate a Service state until approved business rules define the relationship.

## 7. Terms and billing intervals

Where applicable, Subscription terms may represent a start date, current period start and end, renewal date, billing cycle, and term. The platform must not force one universal term or cycle on every Product. Potential billing intervals documented in the [Commercial Model V1](commercial-model-v1.md) include monthly, quarterly, semi-annual, annual, and approved custom intervals. Which Products support which interval, cycle alignment, dates, and term behavior remain TBD.

## 8. Renewal and renewal failure

The conceptual renewal flow is:

```text
Subscription approaches renewal date
  → Renewal calculation under approved terms
  → Renewal invoice / financial obligation
  → Payment / approval as required
  → Renewal recorded
  → New subscription period
```

Renewal may be automatic or manual; actual default behavior is TBD. Renewal calculation, the relationship to an invoice/financial obligation, and any required payment or approval follow future approved commercial rules. No reminder interval or payment processor is selected.

Conceptual renewal-failure handling is:

```text
Renewal due
  → Payment or approval fails / remains unresolved
  → Subscription may become PAST_DUE
  → Grace period if applicable
  → Suspension if required
  → Expiry or cancellation if unresolved under approved rules
```

Reminder schedule, grace-period duration, suspension timing, and expiry/termination timing remain TBD. No grace period or automatic suspension is assumed.

## 9. Quantity changes and Service changes

Recurring Services should support future quantity changes, such as a change from 25 licenses to 30, or from 25 to 20. A quantity change may affect the Service, Subscription, recurring price, invoice, and proration. The effective date, permissions/approval, commercial impact, invoice treatment, and quantity rules remain TBD. Any proration follows the unresolved concept in the Commercial Model; no calculation is defined here.

Future Service changes may include an upgrade or downgrade, such as moving between catalogue tiers. These are generic Product/service changes; Microsoft 365 examples do not create Microsoft-specific core logic.

Conceptually:

```text
Current Service
  → Change request
  → Commercial calculation under approved terms
  → Provisioning change
  → Updated Service / Subscription
```

Eligibility, timing, approval, price/term effects, provisioning sequence, and rollback/failure handling are TBD. The Service and Subscription engines must not include product-family branches such as `if Microsoft 365`, `if Domain`, or `if Hosting`.

## 10. Suspension, cancellation, expiry, termination

### Suspension

A Service may be suspended for a non-payment condition, customer request, provider action, administrative action, or operational/security reason, subject to future approved rules. Suspension must be auditable. A suspended Service is not automatically cancelled. Authority, customer notice, effects, reinstatement, and the relationship to Subscription and payment states are TBD.

### Cancellation

Service cancellation is distinct from Order cancellation. A possible Service flow is:

```text
ACTIVE → CANCELLATION_PENDING → CANCELLED or TERMINATED
```

Cancellation may take effect immediately or at end of term depending on future Product/business rules. No default is selected. Cancellation eligibility, request/approval flow, effective date, service shutdown, and financial/refund effects are TBD. Refer to the [Commercial Model V1](commercial-model-v1.md) for open cancellation and refund policy.

### Expiry and termination

Expiry describes reaching an applicable time boundary, such as a time-bound Service reaching its expiry date. Conceptually:

```text
ACTIVE → EXPIRING / RENEWAL DUE → EXPIRED
```

`EXPIRING / RENEWAL DUE` is a conceptual milestone, not an additional approved Service status. A domain reaching expiry is only an example; no domain-specific registrar rule is set. Such rules belong to the applicable future provider policy. The exact meaning of `TERMINATED`, how it differs from `CANCELLED` or `EXPIRED`, and what records persist are TBD.

## 11. Boundaries with other records

- **Service vs Subscription:** Service is the delivered customer resource; Subscription is the recurring commercial commitment. A Service can exist without a Subscription.
- **Service vs Order:** Order is the historical purchase transaction/request. Service is the ongoing purchased/delivered customer resource. An Order may create one or more Services, and a Service continues after its originating Order is completed.
- **Service vs Invoice:** Invoice is a financial charge/document; Service is a delivered resource. One Service may generate multiple invoices over its lifetime. Service status is not directly determined by one invoice.
- **Service vs Payment:** Payment records settlement, not delivery or Service state. An unpaid or paid Payment does not itself define Service status; any gating/suspension behavior requires explicit commercial rules.
- **Service vs Provisioning:** Provisioning records a fulfillment operation/result. The Service has its own lifecycle status and remains distinct from provisioning status.

These boundaries preserve the Customer Account ownership model and product-independent commercial architecture.

## 12. Service history and audit

Important Service and Subscription events should eventually be auditable, including:

- Service created.
- Provisioning started, succeeded, or failed.
- Service activated.
- Quantity changed; Service upgraded or downgraded.
- Service suspended or resumed.
- Renewal initiated or completed.
- Service cancellation requested or completed.
- Service terminated.

Event definitions, actor/context, before/after detail, retention, and audit implementation are TBD. No audit database is designed here.

## 13. Future customer and admin experience

### Customer Portal

A future Customer Portal may show active Services, Service details, Subscription details, renewal date, quantity, billing cycle, Service status, renewal actions, upgrade/downgrade options where available, cancellation requests, and Service history. Exact content, permissions, and workflows are TBD. This does not authorize UI work.

### Admin

Future Admin capabilities may include viewing/searching/filtering Services; activating, suspending, resuming, or cancelling a Service; viewing its Subscription; changing quantity; initiating renewal; viewing provisioning status; retrying failed provisioning; viewing Service history; and viewing linked Orders, Invoices, and Payments. Roles, rules, and workflows remain TBD. This does not authorize an Admin UI.

## 14. Product-independent architecture

The Service and Subscription engines remain generic. Conceptually:

```text
Product
  → Service Definition
  → Fulfillment / Provisioning Profile
  → Service
  → Subscription (where recurring)
  → Billing
```

Product-specific behavior belongs in approved Product/commercial/fulfillment configuration or supplier-independent adapters, not special cases in the core lifecycle. The Product is the catalogue definition; the Service is the customer-owned delivered instance; Subscription applies only where recurring terms exist. No provider, billing behavior, schema, or implementation is selected here.

## 15. Open decisions

The following remain **TBD** unless established by a future approved specification:

- Exact Service fields and relationships.
- Exact Subscription fields and relationships.
- Final Service and Subscription status names, meanings, and transitions.
- Service activation requirements and confirmation responsibility.
- Automatic versus manual renewal defaults and product-specific applicability.
- Renewal calculation and reminder schedule.
- Grace-period duration and renewal-failure handling.
- Suspension authority, effects, reinstatement, and timing.
- Service and Subscription cancellation rules; immediate versus end-of-term behavior.
- Proration formulas and quantity-change rules.
- Upgrade/downgrade rules and change timing.
- Service termination rules and distinction from cancellation/expiry.
- Time-bound Service expiry and any domain-specific provider rules.
- Failed provisioning retry, recovery, and manual-intervention policy.
- Work/delivery status model for one-time Services.
- Portal/Admin actions, permissions, notifications, and audit history implementation.

No supplier, price, tax rate, payment gateway, grace period, database schema, Prisma model or migration, API, UI, billing implementation, or provisioning implementation is defined or authorized by this document.

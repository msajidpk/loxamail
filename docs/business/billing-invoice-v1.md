# LoxaMail Billing & Invoice Architecture V1

**Status:** Product-independent financial business architecture. Values, policies, exact fields, numbering, and implementation remain TBD unless explicitly approved elsewhere.

This document defines conceptual billing and financial boundaries only. It does not define a database schema, Prisma models, APIs, UI, automated billing jobs, payment gateway, accounting integration, tax/legal policy, or billing/payment implementation. The [Commercial Model V1](commercial-model-v1.md) remains the source for unresolved commercial values and policies.

## 1. Product-independent billing principle

LoxaMail billing must remain independent of any named Product or provider. The billing concepts should accommodate one-time and recurring charges, setup fees, quantity-based charges, discounts, taxes, credits, payments, refunds, and renewal charges as approved per Product. The billing engine must not contain product-family branches such as `if Microsoft 365`, `if Domain`, or `if Hosting`.

Conceptually, billing consumes generic commercial information associated with the purchase and delivered service:

```text
Product
  → Order Item
  → Service / Subscription (where applicable)
  → Billing Profile
  → Invoice
```

Product-specific prices, billing cycles, tax treatment, and terms remain TBD. One-time, monthly, quarterly, semi-annual, annual, and approved future custom cycles are possible only where a Product Commercial Profile permits them.

## 2. Financial objects

Keep these concepts separate:

- **Order:** Customer's purchase transaction/request. It is not money received.
- **Service:** Actual purchased/delivered customer resource.
- **Subscription:** Recurring commercial commitment associated with a recurring Service where applicable.
- **Invoice:** Financial document requesting payment for one or more charges. It has a financial snapshot and lifecycle of its own.
- **Invoice Line:** Individual charge, adjustment, discount, tax, credit application, or other financial component represented on an Invoice.
- **Payment:** Money received against financial obligations. It may be allocated to one or more Invoices.
- **Credit:** Positive customer balance or financial adjustment available for future charges, subject to approved rules.
- **Refund:** Money returned to a customer, linked to the relevant Payment and/or Invoice.
- **Credit Note:** Formal financial adjustment reducing a previous issued Invoice/charge. It references the relevant Invoice and is distinct from a customer credit balance or a cash refund.

These are conceptual records and relationships; exact fields and accounting treatment remain TBD.

## 3. Invoice creation

Invoices may conceptually be generated through these paths:

**One-time Order:**

```text
Order → Charge → Invoice
```

**Recurring Subscription:**

```text
Subscription → Billing Event → Invoice
```

**Manual Charge:**

```text
Admin → Charge → Invoice
```

**Renewal:**

```text
Subscription → Renewal Billing Event → Invoice
```

Invoice generation timing, required approval, and whether a charge is invoiced before or after Service fulfillment are TBD by future commercial/workflow decisions. These examples do not authorize automated invoice jobs.

## 4. Invoice and Invoice Lines

An Invoice is a financial document requesting payment from a Customer Account. Conceptual invoice information may include invoice number, Customer Account, billing Contact, issue date, due date, currency, Invoice Lines, quantity, unit price, discount, tax, subtotal, total, amount paid, amount credited, amount refunded where applicable, balance due, status, notes, and payment instructions. This list does not finalize fields, calculations, or document/legal requirements.

An Invoice contains one or more Invoice Lines. A line may represent a Product charge, Service charge, Subscription charge, setup fee, renewal charge, quantity charge, one-time professional service, manual adjustment, discount, tax, or credit application. The exact line taxonomy and grouping are TBD.

Each Invoice Line and Invoice must preserve the financial snapshot used when the Invoice is issued, including the applicable descriptions, quantities, prices, discounts, tax values, and totals. The Invoice must not rely on current Product price, discount configuration, tax configuration, supplier cost, or Subscription configuration to reconstruct historical amounts. Changing these source values later must not silently change an issued Invoice.

## 5. Invoice status

Conceptual Invoice statuses include:

| Status           | Conceptual purpose                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| `DRAFT`          | Invoice is being prepared and has not been issued as a payment request.                               |
| `ISSUED`         | Invoice has been issued and is an open payment request under the applicable terms.                    |
| `PARTIALLY_PAID` | Some amount has been paid or credited, with a balance remaining.                                      |
| `PAID`           | The amount due has been settled under the applicable allocation/credit rules.                         |
| `PAST_DUE`       | The due date passed and an amount remains outstanding under applicable terms.                         |
| `VOID`           | Invoice is invalidated before or without being treated as an active financial obligation.             |
| `CANCELLED`      | Invoice was cancelled through an approved business workflow.                                          |
| `REFUNDED`       | A related payment/charge has been refunded; exact status use for full/partial and mixed cases is TBD. |
| `CREDITED`       | An issued credit has offset the Invoice/charge; exact status use for partial/full credit is TBD.      |

These are conceptual labels, not a finalized enum or transition matrix. Exact status definitions, combinations, and transitions are TBD. Invoice status is distinct from Payment and Subscription status.

## 6. Issue date, due date, and payment terms

An Invoice should conceptually support an issue date, due date, and applicable payment terms. Possible terms include due immediately, a fixed number of days, or custom/future terms. Actual defaults, available terms, calculation, and exceptions remain TBD. No standard payment term is established here.

## 7. Recurring and renewal billing

Recurring billing may conceptually follow:

```text
Subscription
  → Billing period becomes due
  → Billing Event
  → Invoice generated
  → Payment requested / received
  → Subscription period renewed
```

Potential cycles are monthly, quarterly, semi-annual, annual, or future custom cycles, where permitted by the Product Commercial Profile. Product-specific cycles, invoice timing, price, renewal behavior, and calculation remain TBD.

Renewal billing may follow:

```text
Subscription → Renewal Date → Renewal Billing Calculation → Renewal Invoice
  → Payment / approval as required → New Subscription Period
```

If payment is incomplete or fails, an Invoice may become `PAST_DUE`, and the Subscription may become `PAST_DUE` or `SUSPENDED` according to future policy. Grace period, reminders, collections, and any effect on Service availability are TBD; no duration or automatic behavior is assumed.

## 8. Tax representation

The billing model should conceptually support taxable and non-taxable lines, an applied tax rate and amount, and tax-inclusive or tax-exclusive pricing. Multiple tax components may be needed in the future if approved. No actual tax rate, jurisdiction, Pakistani tax treatment, legal interpretation, calculation rule, or invoice requirement is asserted. Tax configuration and treatment remain TBD.

## 9. Discounts

The billing model should represent percentage or fixed discounts, which may conceptually be associated with a Product, Order, Customer Account, or promotion. Coupon functionality is not approved by this document. Discount eligibility, precedence, stacking, calculation, tax interaction, and duration remain TBD.

The Invoice snapshot must preserve the actual discount amount and basis applied at issue time. A later discount configuration change must not alter an issued Invoice.

## 10. Customer credit and credit notes

### Credit balance

A customer credit is a positive balance/financial adjustment that may later be applied against charges or Invoices according to approved rules. Possible origins include a manual Admin adjustment, a refund converted to credit, a Credit Note, an overpayment, or another approved financial adjustment. Application, expiry, withdrawal/refundability, and accounting treatment are TBD. Credit movements must have an audit trail and source/reason; silent balance changes are not acceptable.

### Credit Note

A Credit Note is a financial adjustment against a previously issued Invoice or charge and should reference the relevant Invoice. Possible conceptual reasons include a partial Service cancellation, billing correction, approved commercial adjustment, or refund-related adjustment. Eligibility, amount, numbering, approval, relationship to customer credit, tax treatment, and accounting integration are TBD. A Credit Note is distinct from both a cash Refund and a positive customer credit balance.

## 11. Payment

A Payment represents money received against one or more financial obligations. Conceptual payment information may include Customer Account, associated Invoice(s), amount, currency, payment method, payment reference, payment date, status, processing fee where applicable, and notes. Exact fields, provider integration, settlement evidence, allocation behavior, and fee rules are TBD. No payment gateway is selected.

A Payment may be full, partial, applied across multiple Invoices where supported, or greater than the outstanding amount (an overpayment). A Payment is not an Invoice, Service, or Subscription.

Conceptual Payment statuses include:

- `PENDING`
- `PROCESSING`
- `COMPLETED`
- `FAILED`
- `CANCELLED`
- `REFUNDED`
- `PARTIALLY_REFUNDED`

These states describe the Payment lifecycle and must remain distinct from Invoice status. Exact meanings and transitions are TBD.

## 12. Partial payments and allocation

Multiple Payments may satisfy one Invoice over time. For example, using the illustrative amounts supplied in this task:

```text
Invoice: PKR 100,000
Payment: PKR 40,000
Invoice status: PARTIALLY_PAID
Remaining balance: PKR 60,000
```

A Payment may also be allocated among multiple Invoices where supported. For example:

```text
Payment: PKR 100,000
Applied to Invoice A: PKR 60,000
Applied to Invoice B: PKR 40,000
```

Allocation order, reallocation, currency compatibility, and rounding are TBD. The examples illustrate arithmetic only and do not establish LoxaMail's base currency, prices, or currency policy.

## 13. Overpayment

If a Payment exceeds the amount due, the excess may conceptually be handled as customer credit, a Refund, or manual handling. For example, the task's illustrative values show an Invoice of PKR 100,000 and a Payment of PKR 110,000, leaving PKR 10,000 excess before any approved treatment. The default policy, allocation, approval, refund, or credit behavior is TBD.

## 14. Refund

A Refund represents money returned to a customer. Future supported outcomes may include full or partial refund to the original payment method, conversion to customer credit, or a manual refund. A Refund should reference the related Payment and/or Invoice so the financial history remains connected. Eligibility, approvals, processing method, timing, fees, tax/accounting treatment, and gateway behavior are TBD. No gateway behavior or refund policy is invented here.

## 15. Financial adjustments and proration

Controlled financial adjustments may include a manual charge, discount, credit, Credit Note, Refund, or correction. Adjustments must be attributable and auditable. Issued historical financial records must not be silently overwritten; use an appropriate future adjustment mechanism.

The billing architecture should support future proration for mid-cycle Service activation, quantity increase/decrease, upgrade/downgrade, billing-cycle change, and mid-cycle cancellation. Whether proration applies and its exact formula, policy, timing, rounding, tax/discount treatment, and approval are TBD under the [Commercial Model V1](commercial-model-v1.md). No calculation is defined here.

## 16. Invoice immutability; void and cancellation

Once an Invoice is issued, its financial snapshot must not be silently rewritten. Corrections should use an appropriate approved mechanism, such as a Credit Note, adjustment, Refund, or replacement/corrected Invoice if supported by future rules. A draft may be edited before issuance according to future workflow; changes to issued financial history remain traceable.

Conceptually:

- **VOID:** Invoice exists but is invalidated before or without being treated as an active financial obligation.
- **CANCELLED:** Invoice is cancelled according to an approved business workflow.

The distinction and effects are subject to future workflow and accounting decisions. No legal or accounting treatment is specified.

## 17. Billing lifecycles

**One-time charge:**

```text
Order → Service → Charge → Invoice → Payment → Paid (when settled)
```

**Recurring charge:**

```text
Service → Subscription → Billing Event → Invoice → Payment → Renewed Period
```

**Failed payment:**

```text
Invoice → Payment Failure → PAST_DUE → Collection / Reminder
  → Future suspension or cancellation according to approved policy
```

These are conceptual flows, not automated processes. Payment failure does not by itself define Service status or cancellation. Collection behavior, reminders, grace periods, and suspension/cancellation policy remain TBD.

## 18. Financial history and audit

Important financial events should eventually be auditable, including:

- Invoice created, issued, or modified before issuance.
- Payment initiated, completed, failed, allocated, or reallocated.
- Invoice partially paid, paid, or became overdue.
- Credit issued or applied.
- Refund issued.
- Invoice voided or cancelled.
- Credit Note or other adjustment issued/applied.

Event definitions, actor/context, before/after detail, references, retention, and audit implementation are TBD. No audit infrastructure is designed here.

## 19. Future customer and Admin capabilities

### Customer Portal

A future portal may allow customers to view/download Invoices, see Invoice status and balances, view Payments/payment history and credits, make a payment, request a Refund where allowed, and view Subscriptions/renewals. Exact access, document formats, workflows, and payment capabilities are TBD. No UI is built here.

### Admin billing

Future Admin capabilities may include creating/viewing/issuing Invoices; voiding or cancelling Invoices; recording and allocating Payments; recording adjustments; issuing/applying credits; processing Refunds; viewing Customer Account balances and payment/financial history; and reviewing overdue Invoices. Roles, controls, approvals, and workflow are TBD. No Admin UI is built here.

## 20. Service, Subscription, and billing boundaries

```text
Service:      Microsoft 365 Business Standard — 25 licenses
Subscription: Recurring commercial commitment for that Service
Invoice:      Charge for an applicable billing period
Payment:      Customer money received against that Invoice
```

The example is illustrative and does not set terms or a billing cycle. A Service is what is delivered; a Subscription is the recurring commercial commitment; an Invoice is the charge/payment request; a Payment is money received. Keep Product, Order, Service, Subscription, Invoice, Invoice Line, Payment, Credit, Credit Note, and Refund as distinct concepts.

## 21. Open decisions

The following remain **TBD** unless established by a future approved specification:

- Base currency and supported currencies.
- Default payment terms and due-date rules.
- Invoice, Credit Note, and Payment numbering.
- Tax configuration and rates.
- Payment gateway and methods.
- Payment processing fees.
- Refund and customer credit policy.
- Overpayment default policy.
- Proration formulas and rules.
- Automatic invoice generation timing and manual charge controls.
- Renewal invoice timing.
- Late-payment and collection policy.
- Grace periods and Service/Subscription suspension relationships.
- Invoice PDF/document format.
- Financial/accounting integration.
- Accounting standards and reporting requirements.
- Exact financial fields, calculations, statuses, transitions, audit, and retention.

No supplier, price, tax rate, gateway, legal policy, database/schema, Prisma model or migration, API, UI, accounting integration, payment integration, or automated billing job is defined or authorized by this document.

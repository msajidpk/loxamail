# LoxaMail Commercial Model V1

**Status:** Product-independent commercial architecture for the proposed LoxaMail Launch Catalogue V1. Commercial values, policies, and implementation details marked TBD require explicit decisions.

This document defines concepts the future platform should be able to represent. It does not approve prices, supplier costs, currencies, tax treatment, payment providers, or product-specific commercial terms, and it does not authorize application or database implementation. The products covered are listed in [Launch Product Catalogue V1](../products/launch-catalogue-v1.md).

## 1. Commercial object boundaries

Keep these concepts distinct:

- **Product:** catalogue definition and available commercial options.
- **Order:** customer request for one or more products and their selected options.
- **Service:** actual purchased/delivered instance owned by a unified Customer Account (`COMPANY` or `INDIVIDUAL`).
- **Subscription:** recurring commercial relationship for a Service when recurring terms apply. A one-time Service need not have one.
- **Invoice:** issued financial document representing charges, credits, and tax as determined at issue time. It must preserve a financial snapshot; later Product price changes must not rewrite an issued invoice.
- **Payment:** record of money received or applied against an invoice or account balance. It is separate from both the invoice and service fulfillment.

The high-level relationship is:

```text
Product → Order → Service → Subscription (when recurring) → Invoice → Payment
```

Commercial rules operate on the purchased Service and its applicable terms. They must remain product-independent and must not make Microsoft 365 a core platform assumption.

## 2. Currency and price concepts

- The business base currency is **TBD**.
- Product prices may be expressed in a selected currency. Supported currencies and whether a Product may have more than one price currency are **TBD**.
- Customer/account and invoice currency behavior, including whether customers can choose a currency, is **TBD**.
- Currency conversion, rate source, conversion time, rounding, and accounting treatment are **TBD**. No conversion behavior is assumed.
- Commercial records may distinguish supplier cost, selling price, setup fee, one-time charge, recurring charge, discount, tax, payment fee, credit, and refund. The actual amounts and applicable currency for every Launch V1 product are **TBD**.
- Prices and costs must not be inferred from product names, providers, market rates, or examples.

## 3. Pricing models and quantity

The commercial model should allow a Product to define its approved pricing basis, such as a one-time amount, recurring amount, per-unit amount, fixed amount, or a combination. Which basis applies to each product, and all amounts, are **TBD**.

Potential quantity concepts include a fixed quantity, customer-selected quantity, user/license count, or another approved unit/configuration. Product-specific quantity rules, minimums, maximums, increments, and quantity changes are **TBD**. Examples such as domains, licenses, hosting units, or managed-service units are illustrative only and establish no rule.

Setup fees, if approved, are separate from recurring charges. A Product may eventually specify no setup fee, a fixed fee, a quantity-based fee, or a manually quoted fee; the chosen type and amount per Product are **TBD**.

## 4. Billing intervals and lifecycle charges

Potential intervals are one-time, monthly, quarterly, semi-annual, annual, or a custom interval approved for a Product. A Product must define its permitted interval options; the platform must not assume every interval applies to every Product. Product-specific intervals, charge timing, invoice timing, due dates, and proration rules are **TBD**.

Proration may be relevant when a Service starts, changes quantity or plan, or ends partway through a period. Whether to prorate, the calculation basis, rounding, and applicable events are **TBD**. No formula or customer entitlement is established here.

## 5. Discounts and customer-specific pricing

Potential discount concepts include a fixed amount or percentage, applied to an approved charge or period. Eligibility, stacking, precedence, duration, expiry, approval, and how discounts interact with setup fees, quantity, tax, and renewal are **TBD**. Coupon codes are a possible future mechanism and are not approved as a V1 requirement.

The model may later distinguish standard catalogue pricing, customer-specific pricing, promotional pricing, and negotiated pricing. Availability, precedence, approval, and effective dates for each are **TBD**. Contract pricing and contract management are not established by this document.

## 6. Tax treatment

The commercial model should be capable of recording whether a charge is taxable, the applicable tax amount/rate, and whether a displayed or stored amount is tax-inclusive or tax-exclusive, once the applicable rules are determined. Tax jurisdiction, registration status, tax categories, rates, calculation, rounding, invoice presentation, and legal/accounting treatment are **TBD**. No jurisdiction or rate—including a Pakistan rate—is assumed.

## 7. Renewal, cancellation, and refund

For recurring or renewable Services, future rules may address the service period, renewal date, renewal price, invoice timing, automatic or manual renewal, reminders, payment failure, grace period, suspension, and cancellation. Which products renew, the workflow, notice timing, retry behavior, grace duration, and suspension/cancellation effects are **TBD**. No billing cycle or automatic renewal is implied.

Refund concepts may include full or partial refund, account credit, or an adjustment associated with an invoice/payment. Eligibility, calculation, approval, timing, method, and customer policy are **TBD**. No refund entitlement or policy is approved.

## 8. Payment fees and account credit

Payment records should be conceptually separate from invoices and Services. Payment methods, settlement states, allocation, failed/returned payments, reconciliation, and payment gateway are **TBD**. A future model may represent a payment-processing fee separately from a product charge; whether a fee applies, its amount, who bears it, and its tax treatment are **TBD**. No gateway or processor is selected.

A Customer Account may eventually have a credit balance that can be applied to an invoice, added by an approved adjustment, or used to record an approved refund conversion. Credit sources, application order, expiry, withdrawal, approval, and audit rules are **TBD**. Any change to a balance must be traceable to its source and reason; no specific credit policy is established.

## 9. Price history and existing customer terms

Product price changes must not silently change an existing Subscription or the financial snapshot of an issued Invoice. Future commercial records should make it possible to distinguish a Product's current price from the price/terms applicable to an existing Service or Subscription, with effective dates where needed.

Whether an existing customer retains a price, adopts a new price immediately, or adopts it at renewal requires an explicit approved rule. Change notice, consent, grandfathering, and effective-date policy are **TBD**. Product price history and change handling are conceptual requirements only; no schema or implementation is defined.

## 10. Cost and margin concepts

Supplier cost and selling price are separate values. A future reporting model may calculate:

```text
Gross margin amount = selling amount − supplier cost amount
Gross margin percentage = gross margin amount ÷ selling amount × 100
```

The calculation basis, treatment of tax, discounts, setup charges, payment fees, currency conversion, and zero selling amounts are **TBD**. No margin target or profitability claim is set. Supplier costs and supplier assignments remain independently undecided.

## 11. Launch V1 commercial definition register

All fields below are **TBD for every product**. This register records decision status, not product behavior or implementation. Product names and family membership follow the proposed Launch Product Catalogue V1.

| Product                              | Product family        | Price model | Allowed billing intervals | Quantity model | Supplier cost | Selling price | Currency | Setup fee | Tax treatment | Discount/customer pricing | Renewal rule | Cancellation rule | Refund rule |
| ------------------------------------ | --------------------- | ----------- | ------------------------- | -------------- | ------------- | ------------- | -------- | --------- | ------------- | ------------------------- | ------------ | ----------------- | ----------- |
| Domain Registration                  | Domains               | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| Domain Transfer                      | Domains               | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| Domain Renewal                       | Domains               | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| LoxaMail Business Email Basic        | Business Email        | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| LoxaMail Business Email Professional | Business Email        | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| LoxaMail Business Email Enterprise   | Business Email        | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| Microsoft 365 Business Basic         | Microsoft 365         | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| Microsoft 365 Business Standard      | Microsoft 365         | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| Microsoft 365 Business Premium       | Microsoft 365         | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| Business Hosting                     | Hosting               | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| WordPress Hosting                    | Hosting               | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| Microsoft 365 Deployment             | Professional Services | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| Email Migration                      | Professional Services | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| DNS / Email Configuration            | Professional Services | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| Microsoft 365 Security Configuration | Professional Services | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| Website / Hosting Migration          | Professional Services | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| Managed Microsoft 365                | Managed Services      | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| Managed Email                        | Managed Services      | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| Managed Hosting                      | Managed Services      | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |
| Managed IT Support                   | Managed Services      | TBD         | TBD                       | TBD            | TBD           | TBD           | TBD      | TBD       | TBD           | TBD                       | TBD          | TBD               | TBD         |

The product-specific order, service, provisioning, support, and administrative workflows also remain TBD in [the catalogue's Commercial Definition Pending register](../products/launch-catalogue-v1.md#commercial-definition-pending) and [Supplier & Provisioning Architecture V1](../products/supplier-provisioning-v1.md).

## 12. Commercial decisions still pending

- Business base currency; supported Product, Customer Account, and Invoice currencies; any conversion and rounding approach.
- Supplier cost and selling price for every product; price model and any margin target.
- Allowed billing intervals, quantity rules, setup fees, and charge/invoice timing per product.
- Tax jurisdiction, tax registration and categories, rates, inclusive/exclusive treatment, calculation, and presentation.
- Discount eligibility, stacking and precedence, promotional rules, customer-specific pricing, and any contract pricing.
- Proration events and formulas.
- Renewal eligibility, renewal pricing, automatic/manual behavior, notices, payment-failure process, grace period, suspension, and cancellation rules.
- Refund eligibility, full/partial/credit method, approval, timing, and customer policy.
- Credit-balance sources, application, expiry, withdrawal, and adjustment controls.
- Payment gateway/provider, payment methods, settlement/reconciliation rules, and processing fees.

No application code, database schema, API, UI, authentication, billing implementation, payment integration, or supplier integration is defined or authorized by this document.

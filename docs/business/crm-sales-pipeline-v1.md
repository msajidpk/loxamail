# LoxaMail CRM & Sales Pipeline Architecture V1

**Status:** Focused internal CRM business architecture. Exact fields, stage rules, ownership, conversion behavior, and integrations remain TBD unless explicitly approved elsewhere.

This document adopts useful Odoo-style CRM concepts without defining a full Odoo clone. It is documentation only; it does not authorize application code, a database schema, Prisma models, APIs, UI, CRM automation, email marketing, or reporting implementation. It preserves the previously approved Customer Account, Sales/Order, Product, Billing, and Support architectures.

## 1. CRM purpose and boundaries

CRM manages potential and developing business relationships. Its primary concepts are Leads, Opportunities, Activities, a sales pipeline, sales ownership, and customer conversion.

CRM is not Support Ticketing, Billing, Provisioning, Accounting, or the Product Catalogue. Those remain separate modules and sources of truth. CRM may reference Quotes, Orders, Products, and Customer Accounts without owning their lifecycle or rules.

CRM is primarily an internal capability. Internal pipeline information is not exposed in the Customer Portal by default.

## 2. Lead

A **Lead** is an unqualified or partially qualified potential business opportunity. It may exist before a Customer Account has been identified or created.

Potential Lead sources include a website, contact form, referral, phone, email, manual entry, marketing activity, an existing customer referral, or another future source. These are examples, not a fixed taxonomy.

Conceptual Lead information may include a name, company/customer information if known, contact information, source, interest, notes, assigned salesperson, status, and created date. This is not a final field list; exact fields, source values, validation, and workflow are TBD.

## 3. Lead status

Conceptual Lead states are:

- `NEW`
- `CONTACTED`
- `QUALIFIED`
- `DISQUALIFIED`
- `CONVERTED`

These are a simple candidate vocabulary, not a finalized enum or strict workflow. Exact transitions, qualification criteria, and disqualification reasons remain TBD. Lead status is separate from Opportunity and Activity status.

## 4. Lead conversion and Customer Account relationship

A qualified Lead may convert into or become associated with a Customer Account, a Contact, and an Opportunity, as appropriate to the case. A Lead may exist before any Customer Account exists; once qualified/converted, it may be associated with an existing or newly created Customer Account.

The CRM must use the unified Customer Account architecture. The account `type` remains `COMPANY` or `INDIVIDUAL`; do not create separate CRM customer systems. A Lead must not automatically create a duplicate Customer Account when the customer already exists. Future conversion should identify a likely existing account and associate the Lead where appropriate. Matching, deduplication, merge, and creation rules are TBD; no matching algorithm is defined.

The distinction remains:

- **Customer Account:** the actual customer relationship and ownership context.
- **Lead:** a potential relationship before qualification.
- **Opportunity:** a qualified potential sale.

## 5. Opportunity

An **Opportunity** is a qualified potential sale. It may be associated with a Customer Account and primary Contact and may conceptually include an Opportunity name, sales owner, pipeline stage, estimated value, currency, expected close date, source, Products/Services of interest, notes, Activities, and related Quote and Order where applicable.

These are candidate concepts only. Exact fields, requiredness, relationships, and behavior remain TBD. Existing Customer Accounts may have new Opportunities for additional business; this does not create another customer record.

## 6. Opportunity stages

An initial simple pipeline may use these conceptual stages:

- `QUALIFIED`
- `DISCOVERY`
- `PROPOSAL`
- `NEGOTIATION`
- `WON`
- `LOST`

Stages should be configurable in the future. Exact stage definitions, ordering, transition permissions, required information, and conversion/closure rules are TBD. Core behavior must not be hardcoded around these stage names.

## 7. Opportunity value

An Opportunity may hold an estimated value and currency, and may distinguish expected recurring value from expected one-time value where relevant. These are estimates, not Invoices, Orders, confirmed financial values, or revenue records. Values, estimation method, currency, and reporting definitions remain TBD.

Do not implement forecasting algorithms or present probability-weighted forecasts as actual financial values. No sales targets, commissions, quotas, or forecast assumptions are established.

## 8. Sales ownership

An Opportunity should support an assigned internal Sales Owner:

```text
Opportunity → Sales Owner
```

Future team, department, or territory concepts may be considered later. No complex sales hierarchy is introduced. Lead ownership, reassignment, team/territory behavior, and access rules remain TBD.

## 9. Activities

An **Activity** is a planned or completed business action. Examples include a call, meeting, email, follow-up, task, demo, or proposal follow-up. An Activity may relate to a Lead, Opportunity, Customer Account, Contact, Quote, Order, or Ticket.

Conceptual Activity information may include subject, type, due date, assigned User, status, notes, and completion date. Activity statuses are:

- `PLANNED`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`

These are conceptual states and remain separate from Lead and Opportunity status. Exact fields, types, reminders, recurrence, relationships, and lifecycle rules are TBD. Calendar/email integrations are not implemented.

## 10. Quote and Order relationship

An Opportunity may produce a Quote:

```text
Lead → Opportunity → Quote → Customer Approval → Order
```

A Quote may also be created directly without a CRM Opportunity. CRM must not require every sale to pass through CRM. An Opportunity may have zero, one, or multiple Quotes or revisions; Quote versioning is not designed here.

An Opportunity marked `WON` may result in an Order. The Order remains owned by the Sales/Order module. CRM may reference the Order and its outcome but must not duplicate order, approval, payment, or fulfillment logic. The relationship is optional and governed by future workflow.

An Opportunity is a potential business opportunity; a Quote is a commercial proposal. They are separate concepts, with independent statuses and ownership boundaries.

## 11. Support relationship

CRM and Support are separate. A Customer Account may have both an Opportunity and Support Tickets. A Ticket handles an existing customer support/service issue; an Opportunity represents potential business.

If a genuine sales opportunity emerges during support, a future process may create or reference an Opportunity from the Ticket. For example:

```text
Customer asks Support about a new requirement
  → Support Ticket
  → Potential expansion opportunity identified
  → CRM Opportunity
```

This is a conceptual future handoff, not an implemented workflow. Neither module absorbs or duplicates the other's records.

## 12. Customer expansion and Product references

CRM should conceptually support future sales Opportunities for existing customers, including possible additional licenses, hosting changes, a new domain, managed services, migration work, or another business service. These are illustrative examples, not product commitments or approved upsell rules.

CRM may reference Products or Services of interest, but it does not own the Product Catalogue, set product behavior, or implement product-specific upsell logic. Product definitions remain the responsibility of the Product module, and product-specific fulfillment remains outside CRM.

## 13. Won, lost, and history

When an Opportunity becomes `WON`, it may lead to an Order owned by the Sales/Order module. A won Opportunity is not itself an Order or proof of payment/fulfillment.

When an Opportunity becomes `LOST`, a loss reason may be recorded where appropriate. Loss reasons should be configurable; no fixed list is defined. Exact requiredness, stage transitions, reopening, and reporting treatment are TBD.

Future CRM history/audit should capture events such as Lead created, assigned, contacted, qualified, disqualified, or converted; Opportunity created, stage changed, or owner changed; Activity created/completed; Quote created; and Opportunity won or lost. Event detail, actor/context, retention, and audit implementation are TBD.

## 14. Customer Portal and Admin CRM

### Customer Portal

CRM is primarily internal. The Customer Portal should not expose internal Leads, Opportunity stages, sales ownership, estimated values, or pipeline information by default. Customer-facing functionality remains in the approved customer-facing contexts, such as Quotes, Orders, Services, Billing, and Support. Any later CRM visibility would require an explicit decision. No UI is built here.

### Admin / Staff

Future Admin/Staff capabilities may include a Lead inbox and search; Lead qualification and conversion; an Opportunity list and pipeline view; Opportunity details and owner; Activities; related Quotes and Orders; Customer Account context; and basic reporting. Roles, permissions, and exact workflows are TBD. No Admin UI is built here.

## 15. CRM reporting

Future basic reporting may include Lead count and Leads by source; conversion counts; Opportunity count and stage distribution; won and lost Opportunities; estimated sales value; and sales Activity. Metric definitions and time periods are TBD.

Do not implement forecasts or analytics in this task. Opportunity estimates are not actual financial values. No sales target, commission, forecast, or performance commitment is inferred.

## 16. Product-independent architecture

CRM remains generic and must not contain product-family branches such as `if Microsoft 365`, `if Domain`, or `if Hosting`. Its conceptual relationship is:

```text
Lead
  → Opportunity
  → Product references of interest
  → Quote (optional)
  → Order reference when applicable
```

Product-specific fulfillment belongs to approved Product configuration and provisioning architecture, not CRM. Quote and Order remain separate Sales/Order concepts, Support remains a separate module, and Customer Account remains the unified customer record.

## 17. Open decisions

The following remain **TBD** unless established by a future approved specification:

- Exact Lead fields and Lead source taxonomy.
- Lead matching, deduplication, merge, and conversion rules.
- Exact Opportunity fields and Customer Account/Contact matching.
- Configurable pipeline stages and stage-transition rules.
- Loss reasons and when they are recorded.
- Sales ownership, teams, departments, and any future territories.
- Activity types, assignment, due dates, reminders, and integrations.
- Email, calendar, and marketing integrations; email marketing is not defined here.
- Basic CRM reporting and metric definitions.
- Customer-specific CRM visibility.
- Opportunity value/currency conventions and any future probability/forecasting policy.
- CRM history/audit detail, permissions, and retention.

No sales target, commission, price, forecast, CRM automation, marketing, database/schema, Prisma model or migration, API, UI, email/calendar integration, or reporting implementation is defined or authorized by this document.

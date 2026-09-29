# LoxaMail Support & Ticketing Architecture V1

**Status:** Focused, product-independent support business architecture. Exact fields, categories, permissions, workflow rules, and service commitments remain TBD unless explicitly approved elsewhere.

This document describes a practical support and ticketing module for a business technology services company. It is not a full enterprise helpdesk specification and does not authorize application code, database schemas, Prisma models, APIs, UI, notification delivery, email/chat integration, or file storage implementation. The unified Customer Account architecture and all approved product, service, commercial, and provisioning boundaries remain unchanged.

## 1. Ticket and customer ownership

A **Ticket** is a support request associated with a Customer Account. The Customer Account is the primary owner and access context for the Ticket. Do not create a separate customer record for support.

A Ticket may optionally relate to a Contact/User, Service, Subscription, Order, Invoice, Payment, Credit, Refund, Domain, Product, or previous Ticket. Such links provide context; they do not make the Ticket the owner or source of truth for those records. Exact relationships and fields are TBD.

A Contact or authorized Customer User may create or communicate through a Ticket. Internal staff may work on it. Access follows the established Customer Account membership and internal role concepts.

## 2. Ticket types and categories

Conceptual examples of Ticket types/categories include Technical Support, Billing, Sales, Account, Domain, Microsoft 365, Hosting, Migration, and General. These are examples, not a fixed or hardcoded enum. The support module should allow categories to be configured; the category list, hierarchy, applicability, and maintenance rules remain TBD.

Categories classify and route requests. They do not create product-specific Ticket behavior in the core support lifecycle.

## 3. Priority

Conceptual Ticket priorities are:

- `LOW`
- `NORMAL`
- `HIGH`
- `URGENT`

These labels indicate relative handling priority only. Priority definitions, who may set/change priority, and any relationship to support targets are TBD. No response or resolution time is promised.

## 4. Ticket status

Conceptual Ticket statuses are:

| Status                 | Purpose                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| `OPEN`                 | A new request is recorded and awaiting active investigation or work.                                    |
| `IN_PROGRESS`          | Support staff are investigating or working on the request.                                              |
| `WAITING_FOR_CUSTOMER` | Support needs information, confirmation, or action from the customer.                                   |
| `WAITING_FOR_INTERNAL` | Progress depends on another internal team, staff member, or business module.                            |
| `RESOLVED`             | Support has recorded a resolution; customer confirmation or closure may still follow.                   |
| `CLOSED`               | The Ticket is considered closed under the applicable workflow. Support staff may reopen it if required. |
| `CANCELLED`            | The request was withdrawn or cancelled under an approved process.                                       |

These are conceptual states, not a finalized enum or transition matrix. A Ticket's status is separate from Service, Order, Invoice, and Payment statuses. Changing a Ticket does not change those other records' lifecycles.

## 5. Ticket lifecycle

The conceptual lifecycle is:

```text
Customer or Internal User creates Ticket
  → Ticket assigned or placed in an unassigned queue
  → Investigation / work
  → Waiting for customer or internal input when needed
  → Resolution recorded
  → Customer confirmation or closure
  → Closed
```

Support staff may reopen a closed Ticket if required. Reopening conditions, permissions, status transitions, and any effect on reporting are TBD; no automatic reopening rule is assumed. Assignment may occur at creation or later, and an unassigned queue is supported conceptually.

## 6. Assignment and internal ownership

Tickets should conceptually support:

- An assigned internal staff member.
- An assigned team or department.
- An unassigned queue.
- Reassignment between staff members or teams.
- Clear internal ownership while the Ticket is being handled.

Assignment rules, team model, queue behavior, ownership handoff, permissions, notifications, and reassignment history are TBD. Staff permissions are not implemented or defined in a permission matrix here.

## 7. Customer communication and internal notes

Ticket communication may include customer messages, staff responses, internal notes, and system events. Keep visibility explicit:

- **PUBLIC MESSAGE:** Visible to the customer and authorized Customer Account users, subject to future access rules.
- **INTERNAL NOTE:** Visible only to authorized internal staff. It is not customer-facing communication.
- **SYSTEM EVENT:** Records a Ticket lifecycle/assignment action. Whether a particular event is displayed to customers is TBD.

Customer messages and staff responses are the public conversation. Internal notes must not be presented as customer messages. Message editing/deletion, authorship, attachments per message, and retention rules are TBD. No email, chat, or other communication integration is implemented here.

## 8. Attachments

Tickets should support future attachments such as screenshots, logs, documents, and error messages. Attachment storage should use the future document/file storage architecture and follow its access and retention controls. Storage provider, size/type restrictions, scanning, retention, and implementation are TBD. No file storage is implemented here.

## 9. Service and technical context

A Ticket may link to a specific Service so support staff can understand the customer's service context. For example:

```text
Customer Account: ABC Traders
Service: Microsoft 365 Business Standard — 25 licenses
Ticket: “Users unable to access Outlook”
```

This is an illustrative context link only. A Ticket can also reference a Domain, Hosting Service, Email Service, Microsoft 365 Service, or another customer Service where appropriate. The architecture remains generic; there is no Microsoft 365-specific ticket behavior.

## 10. Billing and other business context

A Ticket may optionally reference an Invoice, Payment, Credit, Refund, or Subscription to help staff understand a customer question, such as an Invoice amount query. The Ticket does not implement accounting or alter financial records. Support may request an appropriate action through the relevant Billing module; Billing remains authoritative for charges, payments, credits, and refunds.

A Ticket may likewise reference an Order, Product, or previous Ticket for context. Links do not merge the lifecycle or ownership of those records with the Ticket.

## 11. Customer Portal and Admin support

### Customer Portal

A future Customer Portal may allow an authorized customer to create and view Tickets, reply, add attachments, see status and priority, see assigned team/person where appropriate, and close or confirm resolution where allowed. Which assignment information customers can see, closure behavior, and permissions are TBD. No UI is built here.

### Admin / Staff

Future Admin/Staff capabilities may include a Ticket inbox; search and filtering; assignment and reassignment; priority, category, and status management; customer, Service, and billing context; internal notes and public replies; attachments; and Ticket history. Roles, permissions, routing, and exact workflow remain TBD. No Admin UI is built here.

## 12. Ticket history and audit

Important Ticket events should eventually be auditable, including:

- Ticket created, assigned, or reassigned.
- Priority or category changed.
- Status changed.
- Customer replied or staff replied.
- Internal note added.
- Attachment added.
- Ticket resolved, reopened, closed, or cancelled.

Event detail, actor/context, visibility, before/after data, retention, and audit implementation are TBD. No audit database is designed here.

## 13. SLA as a future capability

The support model may later support configurable SLA concepts such as a support plan, priority, response target, resolution target, business hours, and escalation. SLA configuration is a future capability and remains TBD. No response or resolution time, support hours, escalation commitment, contractual term, or SLA promise is established here.

## 14. Notifications

Future Ticket events may generate notifications for a new Ticket, customer reply, staff reply, assignment, status change, resolution, or closure. Notification rules and channels should be defined in the future Notifications Architecture. Delivery methods, templates, recipients, timing, preferences, and integrations remain TBD. No notification delivery or email integration is implemented here.

## 15. Support module boundaries

Support must not directly modify:

- Invoice financial records.
- Payment records.
- Product definitions.
- Customer ownership.
- Provisioning records.

Support may initiate or request actions through the responsible business module. For example, a billing issue can lead to a Billing action/request, and a fulfillment issue can lead to a Provisioning action/request. The responsible module remains authoritative and applies its own approved workflow. These boundaries prevent support conversation state from silently changing commercial or service state.

## 16. Support vs CRM, Order, and Service

- **Ticket vs CRM Opportunity:** A Ticket handles an existing customer support/service issue. A CRM Opportunity represents potential sales/business opportunity. A future CRM process may create or reference an Opportunity from a Ticket when appropriate, but the concepts remain distinct; CRM is outside scope.
- **Ticket vs Order:** An Order handles the commercial purchase. A Ticket handles support and communication. A Ticket may reference an Order for context but does not replace or modify it.
- **Ticket vs Service:** A Service is the customer's purchased/delivered resource. A Ticket represents an issue or request about that resource and may link to it without becoming the Service.
- **Ticket vs Invoice/Payment:** Invoice and Payment are financial records managed by Billing. A Ticket may link to them for context but does not become or alter them.

## 17. Product-independent support architecture

Support uses a generic Ticket lifecycle, configurable categories, priority, assignment, communication, and optional links to customer-owned business records. It must not contain product-family branches such as `if Microsoft 365`, `if Domain`, or `if Hosting`. Product or Service context may help categorize or route work through configuration, while the Ticket remains owned by the Customer Account.

## 18. Open decisions

The following remain **TBD** unless defined in a future approved specification:

- Exact Ticket fields and numbering.
- Category list, hierarchy, and configuration controls.
- Priority definitions and change rules.
- Assignment/team/department model and unassigned queue handling.
- SLA policy, support plans, support hours, targets, and escalation rules.
- Customer and staff permissions, visibility, and internal role matrix.
- Notification channels, recipients, and event rules.
- Email-to-ticket or other communication integrations.
- Attachment/file storage architecture, restrictions, and retention.
- Customer closure/confirmation behavior and reopen rules.
- Ticket status meanings and transitions.
- Reassignment and ownership rules.
- Ticket reporting and operational metrics.
- Audit event detail, access, and retention.

No SLA times, support hours, pricing, contractual commitment, database/schema, Prisma model or migration, API, UI, notification delivery, email/ticket integration, file storage implementation, or CRM implementation is defined or authorized by this document.

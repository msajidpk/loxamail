# LoxaMail Documents & Notifications Architecture V1

**Status:** Cross-platform business architecture. Exact fields, policies, permissions, providers, and implementation remain TBD unless explicitly approved elsewhere.

This document defines reusable Documents and Notifications as business capabilities across LoxaMail. It does not authorize application code, database schemas, Prisma models, APIs, UI, file storage, email delivery, notification workers/queues, or provider integrations. It preserves the unified Customer Account model (`COMPANY` or `INDIVIDUAL`) and existing customer, commercial, support, CRM, vendor, and purchasing boundaries.

## 1. Shared architecture

Documents and Notifications are platform capabilities used by business modules. They must not be implemented as separate file or notification systems inside Customer, CRM, Sales, Services, Billing, Support, Vendors, or Purchasing. A module may create or reference a Document or emit a business event; the shared capability applies its own applicable ownership, visibility, recipient, and delivery rules.

The architecture remains product-independent. Documents and Notifications operate on generic business records and events; they do not branch on product families such as Microsoft 365, domains, or hosting.

## 2. Document concept and relationships

A **Document** is a reusable business file/record with descriptive metadata, ownership/context, visibility, and a reference to stored file content. The Document business object is distinct from the physical file and storage mechanism. Documents may be associated with one or more relevant business records without duplicating file handling in each module.

Conceptual relationships may include:

- Customer Account, Contact, or User.
- Lead or Opportunity.
- Quote or Order.
- Service or Subscription.
- Invoice, Payment, or Credit Note.
- Ticket.
- Vendor, Purchase Order, or Vendor Invoice.
- Contract or another future business record.

These examples do not prescribe cardinalities, database relationships, or a finalized list. The related module remains authoritative for its business record. Customer-facing records retain their Customer Account ownership context; internal CRM and supplier/purchasing records remain internal by default. A Document attachment does not merge the Document with the linked record or change that record's lifecycle.

## 3. Document categories

Document categories should be configurable and extendable. Illustrative categories include customer, identity/verification, quote, invoice, contract, service, support attachment, vendor, purchase, technical, and general documents. These are examples only; they do not define a final taxonomy, required category per record, or legal classification.

## 4. Document metadata

Candidate descriptive metadata may include name, file type, file size, storage reference, uploaded-by identity, created and updated dates, owner/context, category/type, visibility, version, and status. This is a conceptual list, not a finalized field set, validation rule, or database schema. Which values are required, derived, editable, or retained is TBD.

## 5. Business Document and physical storage boundary

Keep business meaning separate from physical file storage:

```text
Document
  → Storage Reference
  → File/Object Storage
```

The Document represents the business record and its relationships, metadata, and access context. The Storage Reference connects it to file content held by a future storage mechanism. Storage provider and storage architecture are not selected. The storage reference must not make the business Document dependent on a particular provider. No local-storage strategy or cloud storage provider is approved here.

## 6. Visibility, ownership, and access boundary

Conceptual Document visibility levels are:

- `CUSTOMER` — may be available to appropriately authorized users of its owning Customer Account.
- `INTERNAL` — available only within the approved internal LoxaMail context.
- `RESTRICTED` — limited to an explicitly authorized subset of users; the detailed mechanism and policy are TBD.

Visibility alone does not grant access. Future access decisions must consider the authenticated User's context, Customer Account membership, role/permissions, Document visibility, Customer Account ownership, and access to the related business record. A customer user must not access a Document belonging to another Customer Account. Internal Documents—including supplier contracts, vendor documents, internal notes, and operational documents—must not be exposed through the Customer Portal. Vendor/supplier information remains internal unless explicitly approved for customer disclosure.

Customer-visible examples may include Invoices, Quotes, customer-provided documents, or Service documents where configured. These examples do not make every document of that type customer-visible. Detailed authorization, download permissions, and exceptions remain TBD; this is not an authorization design or implementation.

## 7. Document versioning, audit, and deletion

The architecture should support future version history where required, such as Contract v1, v2, and v3. Replacing or versioning a file should preserve the relevant history where the approved rules require it. Version identity, comparison, current-version behavior, and storage implementation remain TBD.

Future audit history should be able to record events such as upload, view, download, replace/version, delete/archive, visibility change, and access denied. Event detail, actor/context, access, and retention are TBD; no audit infrastructure is designed here.

Do not assume immediate permanent deletion. Future lifecycle concepts may include archive, soft deletion, retention, and controlled permanent deletion. Retention periods, deletion authority, legal requirements, and permanent-deletion rules are all TBD. No legal or retention policy is inferred.

## 8. Notification concept and event flow

A **Notification** is a business communication object created in response to a business event under an applicable rule. Email is one possible delivery channel, not the Notification system itself.

```text
Business Event
  → Notification Rule
  → Notification
  → Delivery Channel(s)
```

This is a conceptual architecture, not an implemented event bus, rules engine, queue, or delivery workflow. Notification logic belongs to the shared capability, rather than being embedded in each business module. Modules remain authoritative for their business events and records.

## 9. Notification categories and channels

Potential notification types include informational, action required, warning, success, billing, renewal, service, order, support, account, security, and system/admin. This is an illustrative taxonomy, not a final list or status model.

The architecture should accommodate Email and in-app notifications. SMS and WhatsApp are future channel possibilities. No email, SMS, or WhatsApp provider is selected. Channel availability, customer preferences, fallback behavior, and channel-specific delivery rules remain TBD.

## 10. Events that may trigger notifications

Future notification rules may respond to business events including:

- **Customer/account:** Customer Account created; User invited; password or security event.
- **Sales/order:** Order created or approved; Quote issued or expiring.
- **Service/subscription:** Service activated; provisioning failed; renewal due or failed; Service suspended.
- **Billing:** Invoice issued or overdue; payment received or failed; credit issued.
- **Support:** Ticket created, assigned, replied to, resolved, or closed.
- **CRM:** Lead assigned; Opportunity updated; Activity due.
- **Vendor/purchasing:** Purchase Order created; Vendor fulfillment update.

These are candidate event examples only. Exact event definitions, eligibility, recipients, rule configuration, timing, and whether an event results in any notification remain TBD. Events are generic business concepts; no product-specific branching is introduced.

## 11. Recipients, preferences, and communication purpose

Potential recipient groups include customer users, internal staff, assigned owners, billing contacts, support assignees, and administrators. The correct recipient depends on the event, record ownership, context, and future approved rules. A notification must respect Customer Account membership and role/permissions; internal-only records or events must not leak to customer users. Recipient selection, default preferences, read/unread behavior beyond the future portal concept, and preference overrides remain TBD.

Keep **transactional** and **marketing** communication conceptually separate:

- **Transactional:** communications needed to operate a Customer Account or service, with invoice, payment, renewal, service activation, and password/security events as examples.
- **Marketing:** promotions, campaigns, and offers as examples.

These categories do not establish legal classifications, delivery obligations, consent requirements, or opt-out policy. Transactional notification policy, marketing consent model, and any future marketing capability remain TBD. This architecture does not create a marketing automation system.

## 12. Notification delivery lifecycle and history

Future delivery tracking should support these conceptual statuses:

| Status      | Conceptual meaning                                                     |
| ----------- | ---------------------------------------------------------------------- |
| `PENDING`   | Notification delivery has not yet been queued or completed.            |
| `QUEUED`    | Delivery has been accepted for later processing.                       |
| `SENT`      | A channel/provider reports that it sent the message.                   |
| `DELIVERED` | Delivery is confirmed where the channel/provider supports that signal. |
| `FAILED`    | Delivery failed or could not be completed.                             |
| `CANCELLED` | Delivery was cancelled under an applicable rule or action.             |

These are candidate delivery states, not a finalized transition matrix. Channel/provider reporting may differ; `DELIVERED` is only meaningful where supported. The Notification business object and each channel delivery outcome are conceptually distinct. Future delivery should support retry, but retry counts, timing, eligibility, and escalation are TBD. No delivery worker or queue is implemented.

Future notification history may record the triggering event, recipient, channel, template, status, sent time, and failure information where available. Exact fields, retention, delivery tracking, and customer/internal history visibility are TBD.

## 13. Templates

Future notifications should use templates. A template may conceptually include subject, body, language, event type, channel, variables/placeholders, and active/inactive status. Template ownership, editing, approval, rendering, localization, versioning, and fallback behavior remain TBD. No template engine is defined.

## 14. Customer Portal and internal administration

A future Customer Portal may provide a notification center with read/unread state, relevant business link, date/time, notification type, and an action where applicable. It may show only notifications appropriate to the active Customer Account membership and permissions. Which events and details are customer-visible remains TBD; no UI is authorized.

Future internal notifications may cover a new Order, failed provisioning, failed payment, Support Ticket, renewal issue, Vendor issue, or system alert. Internal notification rules may be configurable in the future. Admin recipient groups, rules, permissions, and UI remain TBD; internal notifications must remain separate from customer-visible notifications.

## 15. Documents and Notifications together

A Notification may reference a Document or related business record without embedding or duplicating its file content. Examples include an Invoice-issued Notification pointing to an available Invoice Document, a Support-reply Notification linking to Ticket context, or a Quote-sent Notification linking to a Quote Document. Whether a document is accessible still depends on its own ownership, visibility, and access rules. A Notification reference does not grant access to the Document.

## 16. Product independence and architecture boundaries

Documents and Notifications operate on generic business records, ownership contexts, and events. They must not contain branches such as `if Microsoft 365`, `if Domain`, or `if Hosting`. Product- and provider-specific details remain with the relevant Product, Service, supplier/provisioning, or business module configuration; the shared capabilities handle generic records and event references.

The architectural access boundary remains:

```text
Customer Account
  → User Membership
  → Role / Permissions
  → Authorized business records, Documents, and Notifications
```

Internal records remain internal by default. Customer and internal contexts remain distinct, and a User's access to one Customer Account does not grant access to another. The unified Customer Account model remains unchanged: one account concept with type `COMPANY` or `INDIVIDUAL`.

## 17. Open decisions

The following remain **TBD** unless established by a future approved specification.

**Documents:**

- Storage provider and storage architecture.
- Maximum file size and allowed file types.
- Retention rules and deletion policy.
- Versioning implementation and history behavior.
- Virus/malware scanning and document encryption.
- Download permissions and detailed authorization rules.
- Category taxonomy, metadata fields, status, and relationship/cardinality rules.
- Archive, soft deletion, and controlled permanent deletion behavior.

**Notifications:**

- Email, SMS, and WhatsApp providers.
- Queue/worker architecture and delivery implementation.
- Notification templates, localization, and template governance.
- Retry policy, delivery tracking, and channel fallback.
- Notification preference rules and recipient selection.
- Transactional notification policy and marketing consent model.
- In-app notification history and retention.
- Event catalog, rule configuration, and customer/internal visibility.

No storage or notification provider, legal requirement, retention period, security policy, delivery obligation, or marketing consent rule is selected or asserted here.

## 18. Implementation boundary

This document defines business architecture only. It does not authorize application code, database schemas, Prisma models or migrations, APIs, UI, authorization implementation, file storage, document scanning/encryption implementation, email/SMS/WhatsApp delivery, templates engine, notification workers/queues, marketing automation, or provider integration.

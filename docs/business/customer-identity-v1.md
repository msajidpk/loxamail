# LoxaMail Customer & Identity Architecture V1

**Status:** Approved conceptual architecture for customer and identity boundaries. Exact fields, workflows, permission details, and implementation remain TBD as listed below.

This is documentation and business architecture only. It does not define database tables or relationships, Prisma models, authentication or authorization implementation, APIs, or UI. The Master Spec remains authoritative for the unified Customer Account architecture.

## 1. Unified Customer Account

LoxaMail has one Customer Account architecture. A Customer Account has a `type` of `COMPANY` or `INDIVIDUAL`; these are types of the same account concept, not separate customer systems.

A Customer Account is the customer ownership and data-access context for associated contacts and memberships, and for that customer's commercial and operational records, including orders, services, subscriptions, domains, quotes, invoices, payments, tickets, documents, activities, and customer history. The exact database relationships will be designed later.

The platform must not create a separate company customer system or individual customer system. The architecture is product-independent and must not hardcode Microsoft 365 into Customer, Contact, User, or membership concepts.

## 2. Company and individual examples

### Company

```text
Customer Account: ABC Traders
Type: COMPANY

Contacts:
- Ali — Director
- Ahmed — Accounts
- Sara — IT Manager
```

These are people associated with ABC Traders. Some or all may have login access. A Contact does not automatically receive a User account or permission to sign in.

### Individual

```text
Customer Account: Muhammad Ali
Type: INDIVIDUAL
```

An individual account may have a Contact record and a User/login, and may own orders, services, subscriptions, invoices, payments, support records, documents, activities, and other customer history. This uses the same Customer Account architecture as a company account.

## 3. Customer Account profile

Conceptually, a Customer Account profile should support:

- Display name, account type, and account status.
- Primary email and phone.
- Address, city, and country.
- Billing information and tax information where required.
- Associated Contacts and account Users through membership.
- Notes and customer history.

These are profile capabilities, not a finalized field list. Exact fields, validation, requiredness, formats, and legal or tax requirements are TBD. No legal or tax requirement is inferred here.

## 4. Contact / Person

A **Contact** represents a real person associated with a Customer Account. A Contact may exist without login access. A company may have multiple Contacts with different responsibilities; only those who need access should be associated with a User identity and an authorized membership.

Conceptual Contact information includes name, email, phone, job title, department, contact type or role, Customer Account relationship, status, notes, and communication preferences. The exact Contact fields and their rules are TBD.

## 5. User and identity context

A **User** represents an authenticated identity that can sign in to LoxaMail. `Contact != User`: a Contact is a person record; a User is an identity with authenticated access. A Contact may have no User, and a User may be related to a Contact when appropriate. Their relationship is not assumed to be one-to-one.

Conceptually, access follows:

```text
User
  → Authentication identity
  → Identity context and Customer Account membership
  → Role
  → Permission
```

Do not implement Auth.js, login, sessions, password reset, or authorization as part of this architecture document.

## 6. Customer Account membership

Membership is the concept that connects a customer User to a Customer Account and supplies the context for that user's role and access. A Customer Account may have multiple Users. Users must not be hardcoded directly onto the Customer Account as a single-user arrangement.

**SUPPORTED ARCHITECTURAL CAPABILITY:** One User may belong to multiple Customer Accounts. This permits future cases such as an accountant, consultant, or group administrator working with more than one customer account without redesigning identity. The exact account-switching UI, invitation and acceptance behavior, simultaneous context behavior, and per-account permission rules are TBD.

Membership, roles, and permissions are conceptual boundaries only; the exact database design is deferred.

## 7. Customer roles and permissions

Use a role-based permission concept: a role groups the business responsibilities/access intended for a User within a Customer Account context. Initial conceptual customer roles may include:

- Account Owner
- Account Administrator
- Billing / Finance
- Technical
- Support
- Read Only

These labels describe business roles, not implemented application permissions. Their exact definitions, permission matrix, assignment rules, role precedence, and ability to create or delegate roles are TBD. Do not over-specify or implement a permission matrix here.

## 8. Internal LoxaMail users

Keep two broad identity contexts distinct:

- **INTERNAL:** LoxaMail staff and administrators acting in an internal capacity.
- **CUSTOMER:** Users acting through membership in a Customer Account.

Internal Users are not modeled as customer Contacts merely because they can access LoxaMail. Internal users may have broader access according to an internal role. Exact internal roles, their permissions, separation of duties, and any ability to act in a customer context are TBD.

## 9. Access boundaries

Access is determined by the authenticated User, the active identity/context, the applicable Customer Account membership where relevant, the role, and its permissions.

Customer Users may access only records belonging to Customer Account(s) for which they have authorized membership and permissions. Commercial and support data remain in the appropriate Customer Account context. Internal Users receive access according to their internal role and approved operating context. Detailed enforcement, exceptions, auditing, and permission rules are TBD; this is not an authorization implementation design.

## 10. Status boundaries

The conceptual Customer Account statuses are:

- `ACTIVE`
- `SUSPENDED`
- `INACTIVE`

Their precise meaning, transition rules, and operational consequences are TBD. Customer Account status is distinct from Service status, Subscription status, Invoice status, and Payment status. These represent separate lifecycle subjects and must not be merged into a single status.

## 11. Customer data ownership

The conceptual ownership and association hierarchy is:

```text
Customer Account
  → Contacts / customer memberships and Users
  → Orders, quotes, and other commercial records
  → Services and associated subscriptions / domains
  → Billing records (invoices and payments)
  → Support records (tickets)
  → Documents
  → Activities and customer history
```

This expresses the customer context that governs ownership and access. It does not prescribe exact foreign keys, cardinalities, cascade behavior, or a database schema. Each record type's precise relationships will be designed later.

## 12. Future customer portal

The future Customer Portal may provide capabilities for:

- Dashboard and account profile.
- Contacts and account Users/memberships.
- Products and Services, orders, subscriptions, and domains.
- Invoices and payments.
- Support tickets and documents.
- Notifications and account activity/history.

Availability by role, content, workflows, and presentation are TBD. This section does not authorize portal UI or API work.

## 13. Future Admin customer management

Future internal Admin capabilities may include:

- Search, create, view, and edit Customer Accounts.
- Suspend or reactivate a Customer Account.
- Manage Contacts and customer Users/memberships.
- View orders, Services, subscriptions, invoices, payments, tickets, documents, and activity/history.

Internal roles, approvals, field-level access, workflow, and UI are TBD. This section does not authorize an Admin interface or customer-management implementation.

## 14. Audit and history

Important customer/account actions should eventually have an audit trail. Conceptual examples include customer creation or update, user addition/removal, role change, service creation/suspension, invoice generation, payment recording, and account status change.

The event catalog, actor/context attribution, before/after detail, retention, access, and audit implementation are TBD. No audit schema is defined.

## 15. Architectural rules

1. There is one Customer Account architecture.
2. `Customer Account.type` determines `COMPANY` or `INDIVIDUAL`.
3. Contact and User are different concepts.
4. A User can have authenticated access; a Contact does not necessarily have access.
5. Customer ownership belongs to the Customer Account.
6. Orders, Services, Subscriptions, Invoices, Payments, and Tickets belong to the appropriate Customer Account context.
7. Internal LoxaMail Users are separate from customer Users.
8. The architecture supports future multi-account membership for one User.
9. Microsoft 365 is not hardcoded into customer architecture.
10. Database implementation is not designed here.

## 16. Open decisions

The following remain **TBD** unless decided in a future approved specification:

- Exact Customer Account fields and validation.
- Exact Contact fields, types/roles, and communication-preference behavior.
- Exact User fields and identity lifecycle.
- Authentication implementation and session behavior.
- Customer and internal role definitions and permission matrices.
- Multi-account UI and active-account/context behavior.
- Invitation, acceptance, removal, and membership-change workflow.
- Password creation, reset, recovery, and policy.
- Multi-factor authentication (MFA) policy.
- Account and identity verification.
- Customer approval/onboarding workflow.
- Account, Contact, User, and membership status transition rules.
- Audit log events, implementation, access, and retention.
- Customer-data retention and deletion rules.
- Exact data ownership relationships and database design.

No application code, database schema, Prisma model or migration, API, UI, authentication, or authorization implementation is part of this document.

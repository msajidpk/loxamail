import type { GlobalConfig } from "payload";

const textField = (name: string, label: string, defaultValue?: string) => ({
name,
label,
type: "text" as const,
...(defaultValue ? { defaultValue } : {}),
});

const textareaField = (name: string, label: string, defaultValue?: string) => ({
name,
label,
type: "textarea" as const,
...(defaultValue ? { defaultValue } : {}),
});

export const Homepage: GlobalConfig = {
slug: "homepage",
label: "Homepage",
admin: {
description:
"Manage the content displayed on your public homepage. Select a section below to edit it.",
},
fields: [
{
type: "tabs",
tabs: [
{
label: "Hero",
fields: [
{
name: "hero",
type: "group",
label: "Hero content",
fields: [
textField("eyebrow", "Small label", "Business email, managed properly"),
textField("title", "Heading", "Your email."),
textField("highlight", "Highlighted heading", "Handled."),
textareaField(
"body",
"Description",
"LoxaMail helps businesses deploy, migrate, secure and manage Microsoft 365 — without making your team responsible for the technical work behind it.",
),
textField("primaryButtonLabel", "Primary button label", "Get Started"),
textField("primaryButtonURL", "Primary button URL", "/contact"),
textField("secondaryButtonLabel", "Secondary button label", "Explore services"),
textField("secondaryButtonURL", "Secondary button URL", "#services"),
{
type: "collapsible",
label: "Preview card",
admin: {
initCollapsed: true,
description: "Content shown in the decorative card beside the main heading.",
},
fields: [
textField("panelTitle", "Card title", "LoxaMail"),
textField("panelSubtitle", "Card subtitle", "Microsoft 365 management"),
textField("status", "Status badge", "Protected"),
textField("emailHeading", "Email preview label", "Business email"),
textField("emailAddress", "Email preview address", "[hello@yourcompany.com](mailto:hello@yourcompany.com)"),
textField("platform", "Platform label", "Microsoft 365"),
textField("completion", "Completion label", "Configured"),
{
name: "checklist",
label: "Preview checklist",
type: "array",
fields: [textField("label", "Item")],
},
textField("floatingLabel", "Floating note label", "Migration"),
textField("floatingText", "Floating note text", "Ready to move"),
],
},
],
},
],
},
{
label: "Services",
fields: [
{
name: "serviceSection",
type: "group",
label: "Service cards section",
fields: [
textField("eyebrow", "Small label", "Built around your business"),
textField("title", "Heading", "More than a mailbox."),
textareaField(
"body",
"Description",
"Microsoft provides the platform. LoxaMail handles the practical work around it — from your domain and migration to security, users and ongoing support.",
),
{
name: "cards",
label: "Service cards",
type: "relationship",
relationTo: "services",
hasMany: true,
admin: {
description:
"Select the services to display and arrange them in the order you want.",
},
},
],
},
],
},
{
label: "Capabilities",
fields: [
{
name: "capabilities",
type: "group",
label: "Capabilities section",
fields: [
textField("eyebrow", "Small label", "Microsoft 365"),
textField("title", "Heading", "The cloud platform."),
textField("highlight", "Highlighted heading", "The help around it."),
textareaField(
"body",
"Description",
"Whether you are starting fresh or moving from an existing email host, we take care of the setup and technical details that businesses often get stuck with.",
),
{
name: "items",
label: "Capabilities",
type: "array",
admin: {
description: "Add or edit the capabilities shown on the homepage.",
},
fields: [textField("label", "Capability")],
},
],
},
],
},
{
label: "Migration",
fields: [
{
name: "migration",
type: "group",
label: "Migration section",
fields: [
textField("eyebrow", "Small label", "Move without the mess"),
textField("title", "Heading", "From old email to Microsoft 365."),
textareaField(
"body",
"Description",
"We turn migration into a clear sequence instead of a risky weekend of changing DNS records and hoping everything works.",
),
textField("buttonLabel", "Button label", "Explore migration"),
textField("buttonURL", "Button URL", "/migration"),
{
name: "steps",
label: "Migration steps",
type: "array",
admin: {
description: "Add the steps in the order customers should follow.",
},
fields: [
textField("number", "Step number"),
textField("title", "Step title"),
textareaField("description", "Step description"),
],
},
],
},
],
},
{
label: "Security",
fields: [
{
name: "security",
type: "group",
label: "Security section",
fields: [
textField("eyebrow", "Small label", "Security by default"),
textField(
"title",
"Heading",
"Small configuration details make a big difference.",
),
{
name: "items",
label: "Security items",
type: "array",
admin: {
description: "Add or edit the security features displayed on the homepage.",
},
fields: [textField("label", "Security item")],
},
],
},
],
},
{
label: "Support",
fields: [
{
name: "managedCta",
type: "group",
label: "Managed support section",
fields: [
textField("eyebrow", "Small label", "One team to call"),
textField("title", "First heading line", "You run the business."),
textField("highlight", "Second heading line", "We’ll handle the email."),
textareaField(
"body",
"Description",
"Ongoing support for the people and configuration behind your Microsoft 365 environment.",
),
textField("buttonLabel", "Button label", "Talk to an Expert"),
textField("buttonURL", "Button URL", "/contact"),
],
},
],
},
{
label: "Final CTA",
fields: [
{
name: "finalCta",
type: "group",
label: "Final call to action",
fields: [
textField("eyebrow", "Small label", "Get started with LoxaMail"),
textField("title", "Heading", "Ready to make business email simpler?"),
textareaField(
"body",
"Description",
"Tell us what you use today and where you want to go. We’ll help you plan the next step.",
),
textField("buttonLabel", "Button label", "Get Started"),
textField("buttonURL", "Button URL", "/contact"),
],
},
],
},
],
},
],
};

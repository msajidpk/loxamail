export type Service = {
  slug: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  intro: string;
  features: {
    number: string;
    title: string;
    text: string;
  }[];
  process: {
    number: string;
    title: string;
    text: string;
  }[];
  audience: string[];
  ctaTitle: string;
  ctaText: string;
};

export const services: Service[] = [
  {
    slug: "microsoft-365",
    navLabel: "Microsoft 365",
    eyebrow: "Microsoft 365",
    title: "Microsoft 365,",
    highlight: "set up properly.",
    description:
      "LoxaMail helps businesses deploy Microsoft 365 with the configuration, security and technical support needed to use it confidently.",
    intro:
      "Microsoft 365 is powerful, but getting the environment, domains, users, email and security configuration right still takes technical work. That is where LoxaMail fits.",
    features: [
      {
        number: "01",
        title: "Microsoft 365 setup",
        text: "Get your Microsoft 365 environment configured around your business, domains and users.",
      },
      {
        number: "02",
        title: "Domains & DNS",
        text: "Configure the domain records your Microsoft 365 email environment needs.",
      },
      {
        number: "03",
        title: "Users & mailboxes",
        text: "Set up users, business mailboxes and the administration structure your team needs.",
      },
      {
        number: "04",
        title: "Security configuration",
        text: "Apply essential account and email security settings, including MFA and email authentication.",
      },
    ],
    process: [
      ["01", "Understand", "Review your current setup, domains, users and requirements."],
      ["02", "Configure", "Set up Microsoft 365, domains, users and email configuration."],
      ["03", "Secure", "Configure essential security and email authentication controls."],
      ["04", "Launch", "Move your team onto the new environment."],
      ["05", "Support", "Continue with administration, changes and technical support."],
    ].map(([number, title, text]) => ({ number, title, text })),
    audience: [
      "Companies with 5–100 employees",
      "Businesses starting with Microsoft 365",
      "Businesses moving from hosting email",
      "Companies needing ongoing administration",
    ],
    ctaTitle: "Ready to get Microsoft 365 properly set up?",
    ctaText:
      "Tell us about your current email setup, your team and what you need from Microsoft 365.",
  },
  {
    slug: "business-email",
    navLabel: "Business Email",
    eyebrow: "Business Email",
    title: "Professional email,",
    highlight: "built for business.",
    description:
      "Professional business email on your own domain, configured and supported as part of a managed Microsoft 365 environment.",
    intro:
      "Your business email is part of how customers, suppliers and your team experience the company. LoxaMail handles the technical setup around it so your team can focus on the business.",
    features: [
      {
        number: "01",
        title: "Business mailboxes",
        text: "Set up professional email addresses on your business domain.",
      },
      {
        number: "02",
        title: "Domain configuration",
        text: "Configure the DNS records required for reliable business email delivery.",
      },
      {
        number: "03",
        title: "Email authentication",
        text: "Configure SPF, DKIM and DMARC as part of your email environment.",
      },
      {
        number: "04",
        title: "Ongoing administration",
        text: "Get technical help when users, mailboxes or configuration need attention.",
      },
    ],
    process: [
      ["01", "Review", "Understand your domain, current email and business requirements."],
      ["02", "Configure", "Set up the business email environment and domain records."],
      ["03", "Verify", "Check the configuration and email authentication."],
      ["04", "Go live", "Put your team on the new business email environment."],
      ["05", "Support", "Keep the environment maintained as your business changes."],
    ].map(([number, title, text]) => ({ number, title, text })),
    audience: [
      "SMEs needing professional email",
      "Businesses replacing basic hosting email",
      "New businesses setting up business domains",
      "Teams needing ongoing email administration",
    ],
    ctaTitle: "Ready for professional business email?",
    ctaText:
      "Tell us what you use today and what you want your business email environment to look like.",
  },
  {
    slug: "migration",
    navLabel: "Migration",
    eyebrow: "Email Migration",
    title: "Move your email,",
    highlight: "without the mess.",
    description:
      "A structured path from existing hosting or legacy email systems to Microsoft 365.",
    intro:
      "Email migration affects people, mailboxes, domains and business communication. LoxaMail helps turn the move into a planned technical process instead of a last-minute DNS change.",
    features: [
      {
        number: "01",
        title: "Current setup review",
        text: "Understand your existing mailboxes, domain and email environment before the move.",
      },
      {
        number: "02",
        title: "Migration planning",
        text: "Plan the transition around your users, mailboxes and business requirements.",
      },
      {
        number: "03",
        title: "Microsoft 365 setup",
        text: "Prepare the destination environment before moving business email.",
      },
      {
        number: "04",
        title: "Go-live support",
        text: "Help with the transition and the configuration required after the move.",
      },
    ],
    process: [
      ["01", "Assess", "Review the current email system and migration requirements."],
      ["02", "Plan", "Define the migration and transition approach."],
      ["03", "Prepare", "Configure the Microsoft 365 destination environment."],
      ["04", "Migrate", "Move the required business email data."],
      ["05", "Switch", "Complete the domain transition and support the go-live."],
    ].map(([number, title, text]) => ({ number, title, text })),
    audience: [
      "Businesses moving from cPanel or hosting email",
      "Companies changing email platforms",
      "Teams moving to Microsoft 365",
      "Businesses wanting help with a planned migration",
    ],
    ctaTitle: "Thinking about moving your business email?",
    ctaText:
      "Tell us about your current email system and we can help you understand the migration path.",
  },
  {
    slug: "security",
    navLabel: "Security",
    eyebrow: "Email & Microsoft 365 Security",
    title: "Protect the environment,",
    highlight: "not just the inbox.",
    description:
      "Configure the core account, domain and email security controls around Microsoft 365.",
    intro:
      "Business email security is more than a password. LoxaMail helps configure the controls around identities, domains and email authentication.",
    features: [
      {
        number: "01",
        title: "Multi-factor authentication",
        text: "Configure MFA as an important layer of protection for Microsoft 365 accounts.",
      },
      {
        number: "02",
        title: "SPF",
        text: "Configure the domain's SPF record for email authentication.",
      },
      {
        number: "03",
        title: "DKIM",
        text: "Configure DKIM for supported business email domains.",
      },
      {
        number: "04",
        title: "DMARC",
        text: "Configure DMARC as part of the domain's email authentication strategy.",
      },
    ],
    process: [
      ["01", "Review", "Understand the existing domain and Microsoft 365 configuration."],
      ["02", "Configure", "Apply the required identity and email security settings."],
      ["03", "Verify", "Check DNS and email authentication configuration."],
      ["04", "Test", "Validate the environment and user access."],
      ["05", "Support", "Help maintain the configuration as the environment changes."],
    ].map(([number, title, text]) => ({ number, title, text })),
    audience: [
      "Businesses using Microsoft 365",
      "Companies improving email security",
      "Businesses configuring a new domain",
      "Teams needing technical security administration",
    ],
    ctaTitle: "Want to strengthen your business email setup?",
    ctaText:
      "Tell us about your current Microsoft 365 and domain configuration.",
  },
  {
    slug: "support",
    navLabel: "Support",
    eyebrow: "Managed Support",
    title: "Your team runs the business.",
    highlight: "We handle the email.",
    description:
      "Ongoing technical support for Microsoft 365, users, mailboxes, domains and email configuration.",
    intro:
      "People join and leave, domains change, mailboxes need attention and configurations evolve. LoxaMail provides a technical support layer around your business email environment.",
    features: [
      {
        number: "01",
        title: "User administration",
        text: "Help with user, mailbox and account administration.",
      },
      {
        number: "02",
        title: "Configuration changes",
        text: "Support changes to domains, DNS and email configuration.",
      },
      {
        number: "03",
        title: "Troubleshooting",
        text: "Get technical help when business email needs attention.",
      },
      {
        number: "04",
        title: "Ongoing management",
        text: "Keep your Microsoft 365 environment maintained as your business grows.",
      },
    ],
    process: [
      ["01", "Understand", "Review the issue, request or configuration change."],
      ["02", "Plan", "Identify the appropriate technical action."],
      ["03", "Implement", "Apply the required configuration or administration."],
      ["04", "Verify", "Check the result and confirm the environment is working."],
      ["05", "Continue", "Remain available for future administration and support."],
    ].map(([number, title, text]) => ({ number, title, text })),
    audience: [
      "SMEs without dedicated Microsoft 365 staff",
      "Growing businesses",
      "Teams needing ongoing email administration",
      "Businesses wanting a technical point of contact",
    ],
    ctaTitle: "Need someone to handle the technical side?",
    ctaText:
      "Tell us what you need help managing and we can discuss the right support approach.",
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}


import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { connection } from "next/server";
import type { Homepage } from "@/payload-types";

const fallbackServices = [
  {
    title: "Microsoft 365",
    text: "A properly configured Microsoft 365 environment for your people, domains and day-to-day work.",
    className: "bg-[#eaf2ff]",
    icon: "01",
  },
  {
    title: "Business Email",
    text: "Professional email on your own domain, set up for a reliable business experience.",
    className: "bg-[#f5f1ff]",
    icon: "02",
  },
  {
    title: "Email Migration",
    text: "Move away from legacy hosting with a structured path to Microsoft 365.",
    className: "bg-[#eef9f3]",
    icon: "03",
  },
  {
    title: "Security",
    text: "MFA, SPF, DKIM, DMARC and Microsoft 365 security configuration.",
    className: "bg-[#fff4e8]",
    icon: "04",
  },
];

const fallbackCapabilities = [
  "Microsoft 365 deployment",
  "Domain & DNS configuration",
  "Mailbox setup and administration",
  "Email migration",
  "SPF, DKIM & DMARC",
  "Ongoing managed support",
];

const fallbackChecklist = ["MFA", "SPF / DKIM", "DNS", "Support"];

const fallbackMigrationSteps = [
  {
    number: "01",
    title: "Existing email",
    description: "Understand what you have today",
  },
  { number: "02", title: "Migration", description: "Move users and mailboxes" },
  {
    number: "03",
    title: "Microsoft 365",
    description: "Configure the new environment",
  },
  {
    number: "04",
    title: "Go live",
    description: "Switch over with confidence",
  },
];

const fallbackSecurityItems = [
  "Multi-factor authentication",
  "SPF",
  "DKIM",
  "DMARC",
  "DNS configuration",
  "Account security",
];

const serviceCardStyles = [
  "bg-[#eaf2ff]",
  "bg-[#f5f1ff]",
  "bg-[#eef9f3]",
  "bg-[#fff4e8]",
];


type WordPressHero = {
  eyebrow: string;
  title: string;
  highlight: string;
  body: string;
  primary_button_label: string;
  primary_button_url: string;
  secondary_button_label: string;
  secondary_button_url: string;
  panel_title: string;
  panel_subtitle: string;
  status: string;
  email_heading: string;
  email_address: string;
  platform: string;
  completion: string;
  floating_label: string;
  floating_text: string;
};

type WordPressPage = {
  acf?: {
    hero?: WordPressHero;
    services_eyebrow?: string;
    services_title?: string;
    services_description?: string;
  };
};

async function getHomepageContent(): Promise<Homepage | null> {
  try {
    const response = await fetch(
      "https://cms.loxamail.com/wp-json/wp/v2/pages?slug=home",
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const pages = (await response.json()) as WordPressPage[];
    const wpPage = pages[0];
    const wpHero = wpPage?.acf?.hero;

    if (!wpHero) return null;

    return {
      hero: {
        eyebrow: wpHero.eyebrow,
        title: wpHero.title,
        highlight: wpHero.highlight,
        body: wpHero.body,
        primaryButtonLabel: wpHero.primary_button_label,
        primaryButtonURL: wpHero.primary_button_url,
        secondaryButtonLabel: wpHero.secondary_button_label,
        secondaryButtonURL: wpHero.secondary_button_url,
        panelTitle: wpHero.panel_title,
        panelSubtitle: wpHero.panel_subtitle,
        status: wpHero.status,
        emailHeading: wpHero.email_heading,
        emailAddress: wpHero.email_address,
        platform: wpHero.platform,
        completion: wpHero.completion,
        floatingLabel: wpHero.floating_label,
        floatingText: wpHero.floating_text,
      },
      serviceSection: {
        eyebrow: wpPage?.acf?.services_eyebrow || undefined,
        title: wpPage?.acf?.services_title || undefined,
        body: wpPage?.acf?.services_description || undefined,
      },
    } as unknown as Homepage;
  } catch (error) {
    console.error("Unable to load homepage content from WordPress:", error);
    return null;
  }
}

export default async function HomePage() {
  await connection();
  const cms = await getHomepageContent();

  const hero = cms?.hero ?? {};
  const serviceSection = cms?.serviceSection ?? {};
  const capabilitySection = cms?.capabilities ?? {};
  const migration = cms?.migration ?? {};
  const security = cms?.security ?? {};
  const managedCta = cms?.managedCta ?? {};
  const finalCta = cms?.finalCta ?? {};

  const relatedServices = (serviceSection.cards ?? []).flatMap(
    (item, index) => {
      if (typeof item !== "object" || item === null) return [];

      return [
        {
          title: item.title,
          text: item.description || item.intro || "",
          className: serviceCardStyles[index % serviceCardStyles.length],
          icon: String(index + 1).padStart(2, "0"),
        },
      ];
    },
  );
  const services = relatedServices.length ? relatedServices : fallbackServices;
  const capabilities = capabilitySection.items?.length
    ? capabilitySection.items.map((item) => item.label ?? "").filter(Boolean)
    : fallbackCapabilities;
  const checklist = hero.checklist?.length
    ? hero.checklist.map((item) => item.label ?? "").filter(Boolean)
    : fallbackChecklist;
  const migrationSteps = migration.steps?.length
    ? migration.steps.map((step, index) => ({
        number: step.number ?? String(index + 1).padStart(2, "0"),
        title: step.title ?? "",
        description: step.description ?? "",
      }))
    : fallbackMigrationSteps;
  const securityItems = security.items?.length
    ? security.items.map((item) => item.label ?? "").filter(Boolean)
    : fallbackSecurityItems;

  return (
    <>
      <Header />

      <main className="overflow-hidden">
        <section className="bg-[#f7f9fc]">
          <div className="mx-auto max-w-7xl px-6 pb-20 pt-14 sm:px-8 sm:pt-20 lg:px-10 lg:pb-28 lg:pt-24">
            <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
              <div>
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  {hero.eyebrow ?? "Business email, managed properly"}
                </div>

                <h1 className="max-w-4xl text-[clamp(3.4rem,7vw,6.8rem)] font-semibold leading-[.92] tracking-[-0.065em] text-slate-950">
                  {hero.title ?? "Your email."}
                  <br />
                  <span className="text-blue-600">
                    {hero.highlight ?? "Handled."}
                  </span>
                </h1>

                <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
                  {hero.body ??
                    "LoxaMail helps businesses deploy, migrate, secure and manage Microsoft 365 — without making your team responsible for the technical work behind it."}
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={hero.primaryButtonURL ?? "/contact"}
                    className="rounded-full bg-slate-950 px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-blue-600"
                  >
                    {hero.primaryButtonLabel ?? "Get Started"}{" "}
                    <span className="ml-2">→</span>
                  </a>
                  <a
                    href={hero.secondaryButtonURL ?? "#services"}
                    className="rounded-full border border-slate-300 bg-white px-7 py-4 text-center text-sm font-semibold text-slate-800 transition hover:border-slate-950"
                  >
                    {hero.secondaryButtonLabel ?? "Explore services"}
                  </a>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-200/60 blur-3xl" />
                <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-violet-200/50 blur-3xl" />

                <div className="relative rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_30px_80px_-30px_rgba(15,23,42,.25)]">
                  <div className="rounded-[1.5rem] bg-slate-950 p-6 sm:p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {hero.panelTitle ?? "LoxaMail"}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {hero.panelSubtitle ?? "Microsoft 365 management"}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                        {hero.status ?? "Protected"}
                      </span>
                    </div>

                    <div className="mt-10 rounded-2xl border border-white/10 bg-white/[.06] p-5">
                      <p className="text-xs font-medium uppercase tracking-[.14em] text-slate-500">
                        {hero.emailHeading ?? "Business email"}
                      </p>
                      <p className="mt-3 text-xl font-medium text-white">
                        {hero.emailAddress ?? "hello@yourcompany.com"}
                      </p>
                      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[82%] rounded-full bg-blue-500" />
                      </div>
                      <div className="mt-3 flex justify-between text-xs text-slate-500">
                        <span>{hero.platform ?? "Microsoft 365"}</span>
                        <span>{hero.completion ?? "Configured"}</span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {checklist.map((label) => (
                        <div
                          key={label}
                          className="rounded-xl bg-white/[.06] p-4"
                        >
                          <span className="text-sm text-blue-300">✓</span>
                          <p className="mt-2 text-sm font-medium text-slate-200">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-5 hidden rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl sm:block">
                  <p className="text-xs font-medium text-slate-400">
                    {hero.floatingLabel ?? "Migration"}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {hero.floatingText ?? "Ready to move"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[.16em] text-blue-600">
                  {serviceSection.eyebrow ?? "Built around your business"}
                </p>
                <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-.04em] text-slate-950 sm:text-5xl">
                  {serviceSection.title ?? "More than a mailbox."}
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                {serviceSection.body ??
                  "Microsoft provides the platform. LoxaMail handles the practical work around it — from your domain and migration to security, users and ongoing support."}
              </p>
            </div>

            <div
              className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              id="services"
            >
              {services.map((service) => (
                <article
                  key={service.title}
                  className={`group min-h-[300px] rounded-[1.75rem] p-7 transition duration-300 hover:-translate-y-1 ${service.className}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-500">
                      {service.icon}
                    </span>
                    <span className="text-xl text-slate-400 transition group-hover:translate-x-1">
                      ↗
                    </span>
                  </div>
                  <div className="mt-28">
                    <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {service.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
            <div className="grid gap-16 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[.16em] text-blue-300">
                  {capabilitySection.eyebrow ?? "Microsoft 365"}
                </p>
                <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-.045em] sm:text-6xl">
                  {capabilitySection.title ?? "The cloud platform."}
                  <br />
                  <span className="text-blue-400">
                    {capabilitySection.highlight ?? "The help around it."}
                  </span>
                </h2>
                <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
                  {capabilitySection.body ??
                    "Whether you are starting fresh or moving from an existing email host, we take care of the setup and technical details that businesses often get stuck with."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {capabilities.map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[.05] p-6"
                  >
                    <span className="text-xs font-semibold text-blue-300">
                      0{index + 1}
                    </span>
                    <p className="mt-8 font-medium text-slate-100">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#eef4ff]">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
            <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[.16em] text-blue-600">
                  {migration.eyebrow ?? "Move without the mess"}
                </p>
                <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-.045em] text-slate-950 sm:text-5xl">
                  {migration.title ?? "From old email to Microsoft 365."}
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                  {migration.body ??
                    "We turn migration into a clear sequence instead of a risky weekend of changing DNS records and hoping everything works."}
                </p>
                <a
                  href={migration.buttonURL ?? "/migration"}
                  className="mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-600"
                >
                  {migration.buttonLabel ?? "Explore migration"}
                </a>
              </div>

              <div className="rounded-[2rem] border border-blue-100 bg-white p-5 shadow-xl shadow-blue-900/5 sm:p-7">
                {migrationSteps.map(({ number, title, description }, index) => (
                  <div
                    key={number}
                    className={`flex gap-5 p-5 ${index !== 0 ? "border-t border-slate-100" : ""}`}
                  >
                    <span className="pt-1 text-xs font-bold text-blue-600">
                      {number}
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-950">{title}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[.16em] text-blue-600">
                  {security.eyebrow ?? "Security by default"}
                </p>
                <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-.045em] text-slate-950 sm:text-5xl">
                  {security.title ??
                    "Small configuration details make a big difference."}
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {securityItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <span className="text-blue-600">✓</span>
                    <p className="mt-4 font-medium text-slate-900">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f7f5]">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[.16em] text-blue-600">
                {managedCta.eyebrow ?? "One team to call"}
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-.045em] text-slate-950 sm:text-6xl">
                {managedCta.title ?? "You run the business."}
                <br />
                {managedCta.highlight ?? "We’ll handle the email."}
              </h2>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
                {managedCta.body ??
                  "Ongoing support for the people and configuration behind your Microsoft 365 environment."}
              </p>
              <a
                href={managedCta.buttonURL ?? "/contact"}
                className="mt-9 inline-flex rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white hover:bg-blue-600"
              >
                {managedCta.buttonLabel ?? "Talk to an Expert"}{" "}
                <span className="ml-2">→</span>
              </a>
            </div>
          </div>
        </section>

        <section className="bg-blue-600">
          <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:px-8 lg:py-28">
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-blue-100">
              {finalCta.eyebrow ?? "Get started with LoxaMail"}
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-.045em] text-white sm:text-6xl">
              {finalCta.title ?? "Ready to make business email simpler?"}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-50">
              {finalCta.body ??
                "Tell us what you use today and where you want to go. We’ll help you plan the next step."}
            </p>
            <a
              href={finalCta.buttonURL ?? "/contact"}
              className="mt-9 inline-flex rounded-full bg-white px-7 py-4 text-sm font-semibold text-slate-950 hover:bg-slate-100"
            >
              {finalCta.buttonLabel ?? "Get Started"} →
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

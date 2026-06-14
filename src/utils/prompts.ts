import type { GenerationOptions } from "../types";
import { webrionConfig } from "../config/webrion";

export const promptSuggestions = [
  {
    title: "Hospital Website",
    category: "Medical",
    prompt:
      "Create a modern hospital website with doctors section, services, appointment form, emergency call button, WhatsApp button, Google Map, gallery, reviews, and responsive design.",
  },
  {
    title: "Coaching Website",
    category: "Education",
    prompt:
      "Create a premium coaching institute website with courses, admission form, demo class CTA, teacher section, results section, fees section, testimonials, and WhatsApp enquiry button.",
  },
  {
    title: "Hotel Website",
    category: "Hospitality",
    prompt:
      "Create a hotel website with room showcase, booking enquiry form, food section, gallery, nearby places, reviews, Google Map, call button, and WhatsApp button.",
  },
  {
    title: "Restaurant Website",
    category: "Food",
    prompt:
      "Create a restaurant website with menu section, offers, food gallery, WhatsApp order button, opening hours, Google Map, customer reviews, and modern design.",
  },
  {
    title: "Clinic Website",
    category: "Medical",
    prompt:
      "Create a clinic website with doctor profile, treatment services, appointment form, timings, patient reviews, location map, emergency contact, and clean medical design.",
  },
  {
    title: "Portfolio Website",
    category: "Personal",
    prompt:
      "Create a modern portfolio website with about section, skills, projects, testimonials, contact form, resume button, and responsive animations.",
  },
  {
    title: "Business Landing Page",
    category: "Business",
    prompt:
      "Create a high-converting business landing page with hero section, services, why choose us, portfolio, testimonials, pricing, FAQ, and contact form.",
  },
  {
    title: "PHP Contact Form Website",
    category: "PHP",
    prompt:
      "Create a complete website with HTML, CSS, JavaScript, and PHP contact form. Include validation, success message, clean UI, and deployment instructions.",
  },
];

export const defaultGenerationOptions: GenerationOptions = {
  html: true,
  css: true,
  javascript: true,
  php: false,
  readme: true,
  deploymentGuide: true,
};

export function optionsToPromptSuffix(options: GenerationOptions) {
  const requested = [
    options.html && "index.html",
    options.css && "style.css",
    options.javascript && "script.js",
    options.php && "contact.php with validation and safe mail handling notes",
    options.readme && "README.md",
    options.deploymentGuide && "deployment guide",
  ].filter(Boolean);

  return [
    "",
    `Generate these deliverables: ${requested.join(", ")}.`,
    "Return a valid JSON object with project_name, description, website_type, files, deployment_steps, and suggestions.",
    "Use responsive design, clean sections, accessible buttons, SEO metadata, WhatsApp/call CTAs when relevant, and production-quality code.",
    `Webrion context: ${webrionConfig.liveSiteSummary}`,
  ].join("\n");
}

export function inferWebsiteType(prompt: string) {
  const lower = prompt.toLowerCase();
  const candidates = ["hospital", "clinic", "coaching", "hotel", "restaurant", "portfolio", "business", "saas", "gym", "salon", "shop"];

  return candidates.find((candidate) => lower.includes(candidate)) ?? "website";
}

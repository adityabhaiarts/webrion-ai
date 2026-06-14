export type DemoLink = {
  name: string;
  url: string;
  category: string;
  description: string;
  prompt: string;
};

export type WebrionTemplate = {
  name: string;
  demoUrl: string;
  category: string;
  description: string;
  prompt: string;
};

export type PromptSuggestion = {
  title: string;
  category: string;
  prompt: string;
};

export type PricingPlan = {
  name: string;
  price: string;
  cadence: string;
  badge?: string;
  description: string;
  features: string[];
  action: string;
};

export const webrionConfig = {
  productName: "Webrion AI",
  brandName: "Webrion",
  appUrl: "https://ai.webrion.online",
  mainWebsite: "https://webrion.online",
  contactPage: "https://webrion.online/contact",
  pricingPage: "https://webrion.online/pricing",
  portfolioPage: "https://webrion.online/published-works",
  fallbackPortfolioPage: "https://webrion.online/portfolio",
  logoPath: "/logo.png",
  founder: "Aditya Chaurasiya",
  email: "artsaditya332@gmail.com",
  phoneNumber: "+91 8887649654",
  whatsappNumber: "918887649654",
  whatsappMessage: "Hello Webrion, I want a website",
  location: "Tamsa Marg, Akbarpur, Ambedkar Nagar, Uttar Pradesh, India",
  serviceArea: "Akbarpur, Ambedkar Nagar, Uttar Pradesh, and across India",
  workingHours: "Monday to Saturday, 9:00 AM to 7:00 PM",
  description:
    "Webrion creates fast, mobile-friendly websites for clinics, hotels, restaurants, coaching centers, local shops, gyms, salons, portfolios, landing pages, and service businesses across India.",
  liveSiteSummary:
    "Webrion is an India-based website development brand by Aditya Chaurasiya. It builds fast, mobile-friendly websites for hotels, hospitals, coaching centers, restaurants, gyms, salons, shops, portfolios, landing pages, and service businesses with WhatsApp CTAs, local SEO, pricing sections, templates, and clean responsive UI.",
  services: [
    "Business website development",
    "Restaurant website design",
    "Hotel website design",
    "Hospital website design",
    "Coaching institute website",
    "Gym website design",
    "Clinic website design",
    "Salon and beauty website",
    "Shop website development",
    "Portfolio website design",
    "Landing page design",
    "Local SEO setup",
    "WhatsApp lead website",
    "E-commerce website",
    "Website redesign"
  ],
  sitePages: [
    "Home",
    "About",
    "Services",
    "Free Subdomain Hosting",
    "Pricing",
    "Portfolio",
    "Testimonials",
    "FAQ",
    "Blog",
    "Contact",
    "Privacy Policy",
    "Terms and Conditions",
    "Disclaimer",
    "Cookie Policy"
  ],
  blogTopics: [
    "Why every local business in Akbarpur needs a website",
    "How a restaurant website can increase orders and calls",
    "Website vs Instagram page for small businesses",
    "How gyms can get more members using a website",
    "What pages a clinic website should have",
    "How to choose a website developer in India",
    "What SEO is and why local businesses need it",
    "How WhatsApp buttons help websites generate leads",
    "Website redesign checklist for small businesses",
    "Important pages every business website should have"
  ],
  demoLinks: [
    {
      name: "Webrion Official Website",
      url: "https://webrion.online",
      category: "Agency Website",
      description: "Official Webrion website for website development services.",
      prompt:
        "Create an agency website like Webrion with services, portfolio, pricing guidance, testimonials, blog, WhatsApp CTA, contact page, local SEO sections, and a premium responsive layout."
    },
    {
      name: "Krishna Hotel Demo",
      url: "https://krishnahotel.vercel.app/",
      category: "Hotel Website",
      description: "Hotel website demo with rooms, enquiry, gallery, map, reviews, and modern hotel layout.",
      prompt:
        "Create a website similar to Krishna Hotel Demo with rooms, gallery, booking enquiry, customer reviews, Google Map, WhatsApp CTA, food section, nearby places, and premium hotel design."
    },
    {
      name: "Surya Hotel Demo",
      url: "https://suryahotel-nine.vercel.app/",
      category: "Hotel Website",
      description: "Premium hotel website demo with booking-style layout and hotel sections.",
      prompt:
        "Create a premium hotel website like Surya Hotel with room cards, booking enquiry, amenities, restaurant section, gallery, reviews, Google Map, call button, and WhatsApp CTA."
    },
    {
      name: "Postube Demo",
      url: "https://postube.vercel.app/",
      category: "SaaS Website",
      description: "Modern SaaS-style website demo.",
      prompt:
        "Create a modern SaaS website similar to Postube with hero section, feature cards, dashboard preview, pricing, testimonials, FAQ, and conversion-focused CTA."
    }
  ] satisfies DemoLink[],
  get templates(): WebrionTemplate[] {
    return this.demoLinks.map((demo) => ({
      name: demo.name,
      demoUrl: demo.url,
      category: demo.category,
      description: demo.description,
      prompt: demo.prompt,
    }));
  },
  portfolioProjects: [
    "Surya Hotel",
    "PoSTube",
    "Krishna Hotel",
    "Kathi Junctions",
    "Educational Website Demo",
    "Yuva Fitness",
    "Mayur's Restaurant",
    "Portfolio",
    "ExactLib",
    "MorphNews",
    "KrexBlog",
    "Aditya AI"
  ],
  promptSuggestions: [
    {
      title: "Hospital Website",
      category: "Medical",
      prompt:
        "Create a modern hospital website with doctors section, services, appointment form, emergency call button, WhatsApp button, Google Map, gallery, reviews, and responsive design."
    },
    {
      title: "Coaching Website",
      category: "Education",
      prompt:
        "Create a premium coaching institute website with courses, admission form, demo class CTA, teacher section, results section, fees section, testimonials, and WhatsApp enquiry button."
    },
    {
      title: "Hotel Website",
      category: "Hospitality",
      prompt:
        "Create a hotel website with room showcase, booking enquiry form, food section, gallery, nearby places, reviews, Google Map, call button, and WhatsApp button."
    },
    {
      title: "Restaurant Website",
      category: "Food",
      prompt:
        "Create a restaurant website with menu section, offers, food gallery, WhatsApp order button, opening hours, Google Map, customer reviews, and modern design."
    },
    {
      title: "Clinic Website",
      category: "Medical",
      prompt:
        "Create a clinic website with doctor profile, treatment services, appointment form, timings, patient reviews, location map, emergency contact, and clean medical design."
    },
    {
      title: "Portfolio Website",
      category: "Personal",
      prompt:
        "Create a modern portfolio website with about section, skills, projects, testimonials, contact form, resume button, and responsive animations."
    },
    {
      title: "Business Landing Page",
      category: "Business",
      prompt:
        "Create a high-converting business landing page with hero section, services, why choose us, portfolio, testimonials, pricing, FAQ, and contact form."
    },
    {
      title: "PHP Contact Form Website",
      category: "Full Stack",
      prompt:
        "Create a complete website with HTML, CSS, JavaScript, and PHP contact form. Include validation, success message, clean UI, and deployment instructions."
    }
  ] satisfies PromptSuggestion[],
  pricingPlans: [
    {
      name: "Free",
      price: "INR 0",
      cadence: "forever",
      description: "For trying Webrion AI and saving starter ideas.",
      features: [
        "1 website generation every week",
        "Basic AI generation",
        "Basic templates",
        "Chat history",
        "Download ZIP for generated files"
      ],
      action: "Start Free"
    },
    {
      name: "Monthly Pro",
      price: "INR 1,599",
      cadence: "month",
      description: "For businesses and creators building many websites.",
      features: [
        "Unlimited website generation",
        "HTML CSS JS PHP generation",
        "Premium templates",
        "Download ZIP",
        "Chat history",
        "Priority AI generation",
        "Deployment guide"
      ],
      action: "Upgrade Monthly"
    },
    {
      name: "Yearly Pro",
      price: "INR 15,999",
      cadence: "year",
      badge: "Best Value - 2 Months Free",
      description: "For long-term Webrion AI access and future tools.",
      features: [
        "Unlimited website generation for 1 year",
        "All Monthly Pro features",
        "2 months free compared to monthly billing",
        "Early access to Webrion AI tools"
      ],
      action: "Upgrade Yearly"
    }
  ] satisfies PricingPlan[]
};

export const whatsappUrl = `https://wa.me/${webrionConfig.whatsappNumber}?text=${encodeURIComponent(
  webrionConfig.whatsappMessage
)}`;


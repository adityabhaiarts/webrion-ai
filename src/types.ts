export type GeneratedFile = {
  name: string;
  content: string;
};

export type GeneratedProject = {
  projectName: string;
  description: string;
  websiteType?: string;
  files: GeneratedFile[];
  deploymentSteps: string;
  suggestions: string;
};

export type GenerationOptions = {
  html: boolean;
  css: boolean;
  javascript: boolean;
  php: boolean;
  readme: boolean;
  deploymentGuide: boolean;
};

export type UserProfile = {
  uid: string;
  fullName: string;
  email: string;
  photoURL: string;
  plan: "free" | "monthly" | "yearly";
  theme: string;
  font: string;
  businessName: string;
  phoneNumber: string;
  defaultWebsiteType: string;
  createdAt: number;
  updatedAt: number;
};


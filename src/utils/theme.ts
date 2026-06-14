const themeClasses: Record<string, string> = {
  "Light Clean": "theme-light-clean",
  "ChatGPT Light": "theme-chatgpt-light",
  "Dark Green": "theme-emerald-glow",
  "Pure Dark": "theme-pure-dark",
  "Emerald Glow": "theme-emerald-glow",
  "Minimal Black": "theme-minimal-black"
};

const fontFamilies: Record<string, string> = {
  Inter: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  Poppins: "Poppins, Inter, ui-sans-serif, system-ui, sans-serif",
  Roboto: "Roboto, Inter, ui-sans-serif, system-ui, sans-serif",
  "System Default": "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
};

export function applyDashboardPreferences(theme = "Light Clean", font = "Inter") {
  const root = document.documentElement;
  Object.values(themeClasses).forEach((className) => root.classList.remove(className));
  root.classList.add(themeClasses[theme] ?? themeClasses["Light Clean"]);
  root.style.setProperty("--webrion-font", fontFamilies[font] ?? fontFamilies.Inter);
}

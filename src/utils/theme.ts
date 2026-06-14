const themeClasses: Record<string, string> = {
  "Dark Green": "theme-dark-green",
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

export function applyDashboardPreferences(theme = "Dark Green", font = "Inter") {
  const root = document.documentElement;
  Object.values(themeClasses).forEach((className) => root.classList.remove(className));
  root.classList.add(themeClasses[theme] ?? themeClasses["Dark Green"]);
  root.style.setProperty("--webrion-font", fontFamilies[font] ?? fontFamilies.Inter);
}


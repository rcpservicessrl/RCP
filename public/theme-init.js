(() => {
  try {
    const stored = localStorage.getItem("rcp-theme");
    const theme = stored === "light" || stored === "dark"
      ? stored
      : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.documentElement.lang = location.pathname === "/en" || location.pathname.startsWith("/en/") ? "en-US" : "es-DO";
  } catch (_) {}
})();

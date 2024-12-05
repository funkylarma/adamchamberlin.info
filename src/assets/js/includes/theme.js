document.addEventListener("DOMContentLoaded", () => {
  // Use JS to display the theme selector
  //document.querySelector('.themes').removeAttribute('hidden');
  // Get the theme selector element or break
  const themePicker = document.getElementById("theme-picker");
  if (!themePicker) return;
  // Listen for change to sync localStorage and data- attribute
  themePicker.addEventListener("change", (e) => {
    const theme = e.target.value;
    if (theme === "auto") {
      // Remove JS-set theme so the CSS :not([data-theme]) selectors kick in
      delete document.documentElement.dataset["ac_theme"];
      localStorage.removeItem("ac_theme");
    } else {
      document.documentElement.dataset["ac_theme"] = theme;
      localStorage.setItem("ac_theme", theme);
    }
  });
  // Sync picker's selected state to reflect initial theme
  const initialTheme = cachedTheme ?? "auto";
  themePicker.querySelector("input[checked]").removeAttribute("checked");
  themePicker
    .querySelector(`input[value="${initialTheme}"]`)
    .setAttribute("checked", "");
});

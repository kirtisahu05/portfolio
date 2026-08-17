// multiUiEnabled is baked into the returned script text so the pre-hydration
// inline script (which can't import feature-flags.ts at runtime in the
// browser) still respects it — otherwise a theme='b' value left in
// localStorage from before the flag was disabled would flash UI2 on load.
export function getThemeInitScript(multiUiEnabled: boolean) {
  return `
(function () {
  try {
    var multiUiEnabled = ${multiUiEnabled};
    var stored = multiUiEnabled ? window.localStorage.getItem('theme-mode') : null;
    var theme = stored === 'b' ? 'b' : 'a';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'a');
  }
})();
`;
}

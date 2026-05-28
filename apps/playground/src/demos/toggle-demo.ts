import type { SnytToggleChangeEventDetail } from "../../../../packages/snyt/src/index.ts";

export const toggleDemoHtml = `
<section id="component-lab">
  <div>
    <h2>Toggle</h2>
    <p>First primitive boilerplate for state, ARIA, data attributes, and events.</p>
  </div>
  <snyt-toggle class="toggle-preview">
    <button type="button" data-snyt-toggle-trigger class="toggle-button">
      Bold
    </button>
  </snyt-toggle>
  <output id="toggle-state" aria-live="polite">unpressed</output>
</section>
`;

export function setupToggleDemo() {
  const toggle = document.querySelector("snyt-toggle")!;
  const toggleState = document.querySelector<HTMLOutputElement>("#toggle-state")!;

  toggle.addEventListener("snyt-toggle-change", (event) => {
    const detail = (event as CustomEvent<SnytToggleChangeEventDetail>).detail;

    toggleState.value = detail.pressed ? "pressed" : "unpressed";
  });
}

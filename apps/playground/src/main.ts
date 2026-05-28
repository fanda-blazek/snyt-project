import "./style.css";
import "../../../packages/snyt/src/index.ts";
import type { SnytToggleChangeEventDetail } from "../../../packages/snyt/src/index.ts";
import typescriptLogo from "./assets/typescript.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import { setupCounter } from "./counter.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<section id="center">
  <div class="hero">
    <img src="${heroImg}" class="base" width="170" height="179">
    <img src="${typescriptLogo}" class="framework" alt="TypeScript logo"/>
    <img src="${viteLogo}" class="vite" alt="Vite logo" />
  </div>
  <div>
    <h1>Snyt Playground</h1>
    <p>Use this app to exercise primitives in a real browser while the API takes shape.</p>
  </div>
  <button id="counter" type="button" class="counter"></button>
</section>

<div class="ticks"></div>

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

<div class="ticks"></div>

<section id="next-steps">
  <div id="docs">
    <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#documentation-icon"></use></svg>
    <h2>Workspace</h2>
    <p>Runtime primitives live in <code>packages/snyt</code></p>
    <ul>
      <li>
        <a href="https://viteplus.dev/guide/pack/" target="_blank">
          <img class="logo" src="${viteLogo}" alt="" />
          Vite+ pack
        </a>
      </li>
      <li>
        <a href="https://www.typescriptlang.org" target="_blank">
          <img class="button-icon" src="${typescriptLogo}" alt="">
          TypeScript
        </a>
      </li>
    </ul>
  </div>
  <div id="social">
    <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#social-icon"></use></svg>
    <h2>Next Up</h2>
    <p>Prototype the first primitive here before documenting it</p>
    <ul>
      <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#documentation-icon"></use></svg>Custom Elements</a></li>
      <li><a href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#documentation-icon"></use></svg>ARIA</a></li>
      <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#documentation-icon"></use></svg>HTML</a></li>
    </ul>
  </div>
</section>

<div class="ticks"></div>
<section id="spacer"></section>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

const toggle = document.querySelector("snyt-toggle")!;
const toggleState = document.querySelector<HTMLOutputElement>("#toggle-state")!;

toggle.addEventListener("snyt-toggle-change", (event) => {
  const detail = (event as CustomEvent<SnytToggleChangeEventDetail>).detail;

  toggleState.value = detail.pressed ? "pressed" : "unpressed";
});

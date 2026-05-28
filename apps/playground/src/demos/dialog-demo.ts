import type { SnytDialogChangeEventDetail } from "../../../../packages/snyt/src/index.ts";

export const dialogDemoHtml = `
<section id="dialog-lab">
  <div>
    <h2>Dialog</h2>
    <p>Native dialog primitive with scroll lock, light dismiss, and data attributes.</p>
  </div>
  <snyt-dialog class="dialog-preview">
    <button type="button" data-snyt-dialog-trigger class="dialog-trigger">
      Open dialog
    </button>
    <dialog data-snyt-dialog-popup class="dialog-popup">
      <div data-snyt-dialog-panel class="dialog-panel">
        <div>
          <h3 data-snyt-dialog-title>Delete draft?</h3>
          <p data-snyt-dialog-description>
            This checks modal state, focus return, ARIA wiring, and backdrop dismissal.
          </p>
        </div>
        <div class="dialog-actions">
          <button type="button" data-snyt-dialog-close class="dialog-button secondary">
            Cancel
          </button>
          <button type="button" data-snyt-dialog-close class="dialog-button danger">
            Delete
          </button>
        </div>
      </div>
    </dialog>
  </snyt-dialog>
  <output id="dialog-state" aria-live="polite">closed</output>
</section>
`;

export function setupDialogDemo() {
  const dialog = document.querySelector("snyt-dialog")!;
  const dialogState = document.querySelector<HTMLOutputElement>("#dialog-state")!;

  dialog.addEventListener("snyt-dialog-change", (event) => {
    const detail = (event as CustomEvent<SnytDialogChangeEventDetail>).detail;

    dialogState.value = detail.open ? "open" : "closed";
  });
}

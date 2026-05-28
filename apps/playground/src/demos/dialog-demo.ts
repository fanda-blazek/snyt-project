export const dialogDemoHtml = `
<section id="dialog-lab">
  <div>
    <h2>Dialog</h2>
    <p>Native-first dialog root with command buttons, scroll lock, and light dismiss.</p>
  </div>
  <snyt-dialog-root class="dialog-preview">
    <button type="button" commandfor="demo-dialog" command="show-modal" class="dialog-trigger">
      Open dialog
    </button>
    <dialog
      id="demo-dialog"
      aria-labelledby="demo-dialog-title"
      aria-describedby="demo-dialog-description"
      class="dialog-popup"
    >
      <snyt-dialog-backdrop class="dialog-backdrop"></snyt-dialog-backdrop>
      <snyt-dialog-panel class="dialog-panel">
        <div>
          <h3 id="demo-dialog-title">Delete draft?</h3>
          <p id="demo-dialog-description">
            This checks modal state, focus return, ARIA wiring, and backdrop dismissal.
          </p>
        </div>
        <div class="dialog-actions">
          <button type="button" commandfor="demo-dialog" command="request-close" class="dialog-button secondary">
            Cancel
          </button>
          <button type="button" commandfor="demo-dialog" command="close" class="dialog-button danger">
            Delete
          </button>
        </div>
      </snyt-dialog-panel>
    </dialog>
  </snyt-dialog-root>
  <output id="dialog-state" aria-live="polite">closed</output>
</section>
`;

export const dialogPageHtml = `
<section id="dialog-page" class="component-page">
  <div class="page-head">
    <h1>Dialog</h1>
    <p>Small focused examples for the native-first dialog API.</p>
  </div>

  <div class="dialog-list">
    <article class="dialog-example">
      <div>
        <h2>Command dialog</h2>
        <p>Uses native <code>commandfor</code> and <code>command="show-modal"</code>.</p>
      </div>
      <snyt-dialog-root class="dialog-preview">
        <button type="button" commandfor="command-example-dialog" command="show-modal" class="dialog-trigger">
          Open command dialog
        </button>
        <dialog
          id="command-example-dialog"
          aria-labelledby="command-example-title"
          aria-describedby="command-example-description"
          class="dialog-popup"
        >
          <snyt-dialog-backdrop class="dialog-backdrop"></snyt-dialog-backdrop>
          <snyt-dialog-panel class="dialog-panel">
            <div>
              <h3 id="command-example-title">Delete draft?</h3>
              <p id="command-example-description">
                This example covers the main command button flow.
              </p>
            </div>
            <div class="dialog-actions">
              <button type="button" commandfor="command-example-dialog" command="request-close" class="dialog-button secondary">
                Cancel
              </button>
              <button type="button" commandfor="command-example-dialog" command="close" class="dialog-button danger">
                Delete
              </button>
            </div>
          </snyt-dialog-panel>
        </dialog>
      </snyt-dialog-root>
      <output class="dialog-status" data-dialog-status="command-example-dialog">closed</output>
    </article>

    <article class="dialog-example">
      <div>
        <h2>Preventable dismiss</h2>
        <p>Request-close, Escape, and outside click can be prevented.</p>
      </div>
      <label class="dialog-switch">
        <input type="checkbox" data-prevent-cancel="prevent-example-dialog" checked>
        Prevent cancel
      </label>
      <snyt-dialog-root class="dialog-preview">
        <button type="button" commandfor="prevent-example-dialog" command="show-modal" class="dialog-trigger">
          Open preventable dialog
        </button>
        <dialog
          id="prevent-example-dialog"
          aria-labelledby="prevent-example-title"
          aria-describedby="prevent-example-description"
          class="dialog-popup"
        >
          <snyt-dialog-backdrop class="dialog-backdrop"></snyt-dialog-backdrop>
          <snyt-dialog-panel class="dialog-panel">
            <div>
              <h3 id="prevent-example-title">Unsaved changes</h3>
              <p id="prevent-example-description">
                Toggle prevention off to let request-close, Escape, or outside click close the dialog.
              </p>
            </div>
            <div class="dialog-actions">
              <button type="button" commandfor="prevent-example-dialog" command="request-close" class="dialog-button secondary">
                Request close
              </button>
              <button type="button" commandfor="prevent-example-dialog" command="close" class="dialog-button danger">
                Force close
              </button>
            </div>
          </snyt-dialog-panel>
        </dialog>
      </snyt-dialog-root>
      <output class="dialog-status" data-dialog-status="prevent-example-dialog">closed</output>
    </article>

    <article class="dialog-example">
      <div>
        <h2>Imperative API</h2>
        <p><code>root.show()</code> and <code>dialog.showModal()</code> open modally. <code>dialog.show()</code> opens modelessly.</p>
      </div>
      <div class="dialog-toolbar">
        <button type="button" class="dialog-button secondary" data-dialog-action="root-show" data-dialog-target="native-example-dialog">
          root.show()
        </button>
        <button type="button" class="dialog-button secondary" data-dialog-action="native-show-modal" data-dialog-target="native-example-dialog">
          dialog.showModal()
        </button>
        <button type="button" class="dialog-button secondary" data-dialog-action="native-show" data-dialog-target="native-example-dialog">
          dialog.show()
        </button>
        <button type="button" class="dialog-button secondary" data-dialog-action="root-hide" data-dialog-target="native-example-dialog">
          root.hide()
        </button>
      </div>
      <snyt-dialog-root class="dialog-preview">
        <button type="button" commandfor="native-example-dialog" command="show-modal" class="dialog-trigger">
          Open via command
        </button>
        <dialog
          id="native-example-dialog"
          aria-labelledby="native-example-title"
          aria-describedby="native-example-description"
          class="dialog-popup"
        >
          <snyt-dialog-backdrop class="dialog-backdrop"></snyt-dialog-backdrop>
          <snyt-dialog-panel class="dialog-panel">
            <div>
              <h3 id="native-example-title">Native sync</h3>
              <p id="native-example-description">
                Direct method calls should still update root attributes.
              </p>
            </div>
            <div class="dialog-actions">
              <button type="button" commandfor="native-example-dialog" command="close" class="dialog-button secondary">
                Close
              </button>
            </div>
          </snyt-dialog-panel>
        </dialog>
      </snyt-dialog-root>
      <output class="dialog-status" data-dialog-status="native-example-dialog">closed</output>
    </article>

    <article class="dialog-example">
      <div>
        <h2>Nested dialog</h2>
        <p>Opens a child dialog from inside a parent dialog.</p>
      </div>
      <snyt-dialog-root class="dialog-preview">
        <button type="button" commandfor="parent-example-dialog" command="show-modal" class="dialog-trigger">
          Open parent dialog
        </button>
        <dialog
          id="parent-example-dialog"
          aria-labelledby="parent-example-title"
          aria-describedby="parent-example-description"
          class="dialog-popup"
        >
          <snyt-dialog-backdrop class="dialog-backdrop"></snyt-dialog-backdrop>
          <snyt-dialog-panel class="dialog-panel">
            <div>
              <h3 id="parent-example-title">Parent dialog</h3>
              <p id="parent-example-description">
                Parent state updates while the child is open.
              </p>
            </div>
            <snyt-dialog-root class="nested-dialog-root">
              <button type="button" commandfor="child-example-dialog" command="show-modal" class="dialog-button secondary">
                Open child
              </button>
              <dialog
                id="child-example-dialog"
                aria-labelledby="child-example-title"
                aria-describedby="child-example-description"
                class="dialog-popup nested-popup"
              >
                <snyt-dialog-backdrop class="dialog-backdrop"></snyt-dialog-backdrop>
                <snyt-dialog-panel class="dialog-panel">
                  <div>
                    <h3 id="child-example-title">Child dialog</h3>
                    <p id="child-example-description">Nested modal state should stay isolated.</p>
                  </div>
                  <div class="dialog-actions">
                    <button type="button" commandfor="child-example-dialog" command="close" class="dialog-button secondary">
                      Close child
                    </button>
                  </div>
                </snyt-dialog-panel>
              </dialog>
            </snyt-dialog-root>
            <div class="dialog-actions">
              <button type="button" commandfor="parent-example-dialog" command="close" class="dialog-button secondary">
                Close parent
              </button>
            </div>
          </snyt-dialog-panel>
        </dialog>
      </snyt-dialog-root>
      <output class="dialog-status" data-dialog-status="parent-example-dialog">closed</output>
    </article>
  </div>
</section>
`;

type DialogRootElement = HTMLElement & {
  hide?: () => void;
  show?: () => void;
};

export function setupDialogDemo() {
  const dialog = document.querySelector("snyt-dialog-root")!;
  const dialogState = document.querySelector<HTMLOutputElement>("#dialog-state")!;

  dialog.addEventListener("open", () => {
    dialogState.value = "open";
  });
  dialog.addEventListener("close", () => {
    dialogState.value = "closed";
  });
}

export function setupDialogPage() {
  const roots = Array.from(document.querySelectorAll<HTMLElement>("snyt-dialog-root"));

  for (const root of roots) {
    root.addEventListener("open", () => syncStatus(root));
    root.addEventListener("close", () => syncStatus(root));
    root.addEventListener("cancel", (event) => {
      const dialog = root.querySelector<HTMLDialogElement>("dialog");
      const prevent = dialog
        ? document.querySelector<HTMLInputElement>(`[data-prevent-cancel="${dialog.id}"]`)
        : null;

      if (prevent?.checked) {
        event.preventDefault();
      }
    });

    syncStatus(root);
  }

  document.addEventListener("click", (event) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>(
      "[data-dialog-action][data-dialog-target]",
    );

    if (!button) {
      return;
    }

    const dialog = document.getElementById(
      button.dataset.dialogTarget ?? "",
    ) as HTMLDialogElement | null;
    const root = dialog?.closest("snyt-dialog-root") as DialogRootElement | null;

    if (!dialog || !root) {
      return;
    }

    switch (button.dataset.dialogAction) {
      case "native-show-modal":
        dialog.showModal();
        break;
      case "native-show":
        dialog.show();
        break;
      case "root-hide":
        root.hide?.();
        break;
      case "root-show":
        root.show?.();
        break;
    }
  });

  function syncStatus(root: HTMLElement) {
    const dialog = root.querySelector<HTMLDialogElement>("dialog");

    if (!dialog) {
      return;
    }

    const status = document.querySelector<HTMLOutputElement>(`[data-dialog-status="${dialog.id}"]`);

    if (status) {
      status.value = root.hasAttribute("open")
        ? root.hasAttribute("data-modal")
          ? "open modal"
          : "open modeless"
        : "closed";
    }
  }
}

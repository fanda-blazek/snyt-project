export const dialogDemoHtml = `
<section id="dialog-lab">
  <div>
    <h2>Dialog</h2>
    <p>Native dialog controls with optional Snyt state parts for styling and animation.</p>
  </div>
  <button type="button" commandfor="demo-dialog" command="show-modal" class="dialog-trigger">
    Open dialog
  </button>
  <snyt-dialog-root class="dialog-preview">
    <dialog
      id="demo-dialog"
      closedby="any"
      aria-labelledby="demo-dialog-title"
      aria-describedby="demo-dialog-description"
      class="dialog-popup"
    >
      <snyt-dialog-backdrop class="dialog-backdrop"></snyt-dialog-backdrop>
      <snyt-dialog-panel class="dialog-panel">
        <div>
          <h3 id="demo-dialog-title">Delete draft?</h3>
          <p id="demo-dialog-description">
            Native commands control the dialog. Snyt parts expose styling state.
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
    <p>Small focused examples for native dialog markup and Snyt styling hooks.</p>
  </div>

  <div class="dialog-list">
    <article class="dialog-example">
      <div>
        <h2>Native dialog</h2>
        <p>Plain platform markup with <code>commandfor</code>, <code>command</code>, and <code>closedby</code>.</p>
      </div>
      <button type="button" commandfor="native-command-dialog" command="show-modal" class="dialog-trigger">
        Open native dialog
      </button>
      <dialog
        id="native-command-dialog"
        closedby="any"
        aria-labelledby="native-command-title"
        aria-describedby="native-command-description"
        class="native-dialog"
      >
        <div>
          <h3 id="native-command-title">Native platform path</h3>
          <p id="native-command-description">
            This dialog is not wrapped by Snyt.
          </p>
        </div>
        <div class="dialog-actions">
          <button type="button" commandfor="native-command-dialog" command="request-close" class="dialog-button secondary">
            Cancel
          </button>
          <button type="button" commandfor="native-command-dialog" command="close" class="dialog-button danger">
            Confirm
          </button>
        </div>
      </dialog>
      <output class="dialog-status" data-dialog-status="native-command-dialog">closed</output>
    </article>

    <article class="dialog-example">
      <div>
        <h2>Snyt parts</h2>
        <p>Panel and backdrop receive state attributes for styling and future animations.</p>
      </div>
      <button type="button" commandfor="parts-example-dialog" command="show-modal" class="dialog-trigger">
        Open dialog with parts
      </button>
      <snyt-dialog-root class="dialog-preview">
        <dialog
          id="parts-example-dialog"
          closedby="any"
          aria-labelledby="parts-example-title"
          aria-describedby="parts-example-description"
          class="dialog-popup"
        >
          <snyt-dialog-backdrop class="dialog-backdrop"></snyt-dialog-backdrop>
          <snyt-dialog-panel class="dialog-panel">
            <div>
              <h3 id="parts-example-title">Stateful visual parts</h3>
              <p id="parts-example-description">
                The root, dialog, panel, and backdrop reflect open and modal state.
              </p>
            </div>
            <div class="dialog-actions">
              <button type="button" commandfor="parts-example-dialog" command="request-close" class="dialog-button secondary">
                Cancel
              </button>
              <button type="button" commandfor="parts-example-dialog" command="close" class="dialog-button danger">
                Done
              </button>
            </div>
          </snyt-dialog-panel>
        </dialog>
      </snyt-dialog-root>
      <output class="dialog-status" data-dialog-status="parts-example-dialog">closed</output>
    </article>

    <article class="dialog-example">
      <div>
        <h2>Preventable cancel</h2>
        <p>Native cancel requests can be prevented on the dialog.</p>
      </div>
      <label class="dialog-switch">
        <input type="checkbox" data-prevent-cancel="prevent-example-dialog" checked>
        Prevent cancel
      </label>
      <button type="button" commandfor="prevent-example-dialog" command="show-modal" class="dialog-trigger">
        Open preventable dialog
      </button>
      <snyt-dialog-root class="dialog-preview">
        <dialog
          id="prevent-example-dialog"
          closedby="any"
          aria-labelledby="prevent-example-title"
          aria-describedby="prevent-example-description"
          class="dialog-popup"
        >
          <snyt-dialog-backdrop class="dialog-backdrop"></snyt-dialog-backdrop>
          <snyt-dialog-panel class="dialog-panel">
            <div>
              <h3 id="prevent-example-title">Unsaved changes</h3>
              <p id="prevent-example-description">
                Toggle prevention off to allow request-close, Escape, or light dismiss.
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
        <h2>Native methods</h2>
        <p>Direct <code>dialog.showModal()</code>, <code>dialog.show()</code>, and <code>dialog.close()</code> calls.</p>
      </div>
      <div class="dialog-toolbar">
        <button type="button" class="dialog-button secondary" data-dialog-action="native-show-modal" data-dialog-target="native-method-dialog">
          dialog.showModal()
        </button>
        <button type="button" class="dialog-button secondary" data-dialog-action="native-show" data-dialog-target="native-method-dialog">
          dialog.show()
        </button>
        <button type="button" class="dialog-button secondary" data-dialog-action="native-close" data-dialog-target="native-method-dialog">
          dialog.close()
        </button>
      </div>
      <button type="button" commandfor="native-method-dialog" command="show-modal" class="dialog-trigger">
        Open via command
      </button>
      <snyt-dialog-root class="dialog-preview">
        <dialog
          id="native-method-dialog"
          closedby="any"
          aria-labelledby="native-method-title"
          aria-describedby="native-method-description"
          class="dialog-popup"
        >
          <snyt-dialog-backdrop class="dialog-backdrop"></snyt-dialog-backdrop>
          <snyt-dialog-panel class="dialog-panel">
            <div>
              <h3 id="native-method-title">Method state</h3>
              <p id="native-method-description">
                Use the toolbar to compare modal and modeless state.
              </p>
            </div>
            <div class="dialog-actions">
              <button type="button" commandfor="native-method-dialog" command="close" class="dialog-button secondary">
                Close
              </button>
            </div>
          </snyt-dialog-panel>
        </dialog>
      </snyt-dialog-root>
      <output class="dialog-status" data-dialog-status="native-method-dialog">closed</output>
    </article>

    <article class="dialog-example">
      <div>
        <h2>Nested state</h2>
        <p>Nested Snyt roots keep custom attributes for parent and child styling.</p>
      </div>
      <button type="button" commandfor="parent-example-dialog" command="show-modal" class="dialog-trigger">
        Open parent dialog
      </button>
      <snyt-dialog-root class="dialog-preview">
        <dialog
          id="parent-example-dialog"
          closedby="any"
          aria-labelledby="parent-example-title"
          aria-describedby="parent-example-description"
          class="dialog-popup"
        >
          <snyt-dialog-backdrop class="dialog-backdrop"></snyt-dialog-backdrop>
          <snyt-dialog-panel class="dialog-panel">
            <div>
              <h3 id="parent-example-title">Parent dialog</h3>
              <p id="parent-example-description">
                The parent root is marked while the child dialog is open.
              </p>
            </div>
            <snyt-dialog-root class="nested-dialog-root">
              <button type="button" commandfor="child-example-dialog" command="show-modal" class="dialog-button secondary">
                Open child
              </button>
              <dialog
                id="child-example-dialog"
                closedby="any"
                aria-labelledby="child-example-title"
                aria-describedby="child-example-description"
                class="dialog-popup nested-popup"
              >
                <snyt-dialog-backdrop class="dialog-backdrop"></snyt-dialog-backdrop>
                <snyt-dialog-panel class="dialog-panel">
                  <div>
                    <h3 id="child-example-title">Child dialog</h3>
                    <p id="child-example-description">The child root is marked as nested.</p>
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

export function setupDialogDemo() {
  const dialog = document.querySelector<HTMLDialogElement>("#demo-dialog")!;
  const dialogState = document.querySelector<HTMLOutputElement>("#dialog-state")!;

  wireDialog(dialog, () => {
    dialogState.value = getDialogStatus(dialog);
  });
}

export function setupDialogPage() {
  const dialogs = Array.from(document.querySelectorAll<HTMLDialogElement>("dialog[id]"));
  const syncAllStatuses = () => {
    for (const dialog of dialogs) {
      syncStatus(dialog);
    }
  };

  for (const dialog of dialogs) {
    wireDialog(dialog, syncAllStatuses);
  }
  syncAllStatuses();

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

    if (!dialog) {
      return;
    }

    switch (button.dataset.dialogAction) {
      case "native-show-modal":
        if (!dialog.open) {
          dialog.showModal();
        }
        break;
      case "native-show":
        if (!dialog.open) {
          dialog.show();
        }
        break;
      case "native-close":
        if (dialog.open) {
          dialog.close();
        }
        break;
    }
  });
}

function wireDialog(dialog: HTMLDialogElement, sync: () => void) {
  const root = dialog.closest("snyt-dialog-root");

  dialog.addEventListener("cancel", (event) => {
    const prevent = document.querySelector<HTMLInputElement>(
      `[data-prevent-cancel="${dialog.id}"]`,
    );

    if (prevent?.checked) {
      event.preventDefault();
    }

    queueMicrotask(sync);
  });
  dialog.addEventListener("toggle", () => queueMicrotask(sync));
  dialog.addEventListener("close", () => queueMicrotask(sync));
  root?.addEventListener("open", () => queueMicrotask(sync));
  root?.addEventListener("close", () => queueMicrotask(sync));
}

function syncStatus(dialog: HTMLDialogElement) {
  const status = document.querySelector<HTMLOutputElement>(`[data-dialog-status="${dialog.id}"]`);

  if (status) {
    status.value = getDialogStatus(dialog);
  }
}

function getDialogStatus(dialog: HTMLDialogElement) {
  if (!dialog.open) {
    return "closed";
  }

  const root = dialog.closest("snyt-dialog-root");
  const mode = isModal(dialog) || root?.hasAttribute("data-modal") ? "open modal" : "open modeless";

  return root?.hasAttribute("data-child-dialog-open") ? `${mode} + child` : mode;
}

function isModal(dialog: HTMLDialogElement) {
  try {
    return dialog.matches(":modal");
  } catch {
    return false;
  }
}

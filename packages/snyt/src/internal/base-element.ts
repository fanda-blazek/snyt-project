const HTMLElementBase =
  globalThis.HTMLElement ??
  (class {} as {
    new (): HTMLElement;
  });

export class SnytElement extends HTMLElementBase {
  private abortController: AbortController | null = null;
  private hasMounted = false;
  private isSyncingAttributes = false;

  connectedCallback() {
    this.abortController?.abort();

    const abortController = new AbortController();
    const { signal } = abortController;

    this.abortController = abortController;

    queueMicrotask(() => {
      if (!signal.aborted) {
        this.mount(signal);
        this.hasMounted = true;
      }
    });
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.abortController = null;

    if (this.hasMounted) {
      this.hasMounted = false;
      this.unmount();
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (!this.hasMounted || this.isSyncingAttributes || oldValue === newValue) {
      return;
    }

    this.onAttributeChange(name, oldValue, newValue);
  }

  protected mount(_signal: AbortSignal) {}

  protected unmount() {}

  protected onAttributeChange(_name: string, _oldValue: string | null, _newValue: string | null) {}

  protected setAttributeSilently(name: string, value: string) {
    this.runAttributeSync(() => this.setAttribute(name, value));
  }

  protected removeAttributeSilently(name: string) {
    this.runAttributeSync(() => this.removeAttribute(name));
  }

  protected toggleAttributeSilently(name: string, force: boolean) {
    this.runAttributeSync(() => this.toggleAttribute(name, force));
  }

  protected runAttributeSync(callback: () => void) {
    this.isSyncingAttributes = true;

    try {
      callback();
    } finally {
      this.isSyncingAttributes = false;
    }
  }
}

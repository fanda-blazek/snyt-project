export class SnytOverlayStack<T extends object> {
  private entries: T[] = [];

  add(entry: T) {
    this.remove(entry);
    this.entries.push(entry);
  }

  remove(entry: T) {
    this.entries = this.entries.filter((item) => item !== entry);
  }

  isTopmost(entry: T) {
    return this.entries.at(-1) === entry;
  }

  get size() {
    return this.entries.length;
  }

  clear() {
    this.entries = [];
  }
}

export function defineElement(
  name: string,
  constructor: CustomElementConstructor,
  registry: CustomElementRegistry | undefined = globalThis.customElements,
) {
  if (!registry) {
    return undefined;
  }

  const existing = registry.get(name);

  if (existing) {
    return existing;
  }

  registry.define(name, constructor);
  return constructor;
}

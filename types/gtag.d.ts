interface Window {
  gtag: (
    command: string,
    ...args: (string | Record<string, unknown>)[]
  ) => void;
}

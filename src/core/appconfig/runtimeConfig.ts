declare global {
  interface Window {
    __RUNTIME_CONFIG__: any;
  }
}

export const GetConfig = () => {
  return typeof window !== 'undefined' ? window.__RUNTIME_CONFIG__ : {};
};
  
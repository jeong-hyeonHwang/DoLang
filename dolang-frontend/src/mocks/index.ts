export const initMockAPI = async (): Promise<void> => {
  if (typeof window === 'undefined') {
    const { server } = await import('./node.ts');
    server.listen();
  } else {
    const { worker } = await import('./browser.ts');
    worker.start({ onUnhandledRequest: 'bypass' });
  }
};

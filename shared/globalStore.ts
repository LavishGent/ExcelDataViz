// shared/globalStore.ts
export type appState = {
  [key: string]: any;
};

type Listener = (state: appState) => void;

class GlobalStore {
  private static instance: GlobalStore;
  private state: appState;
  private listeners: Listener[];

  private constructor() {
    this.state = { items: [] };
    this.listeners = [];
  }

  public static getInstance(): GlobalStore {
    if (!GlobalStore.instance) {
      GlobalStore.instance = new GlobalStore();
    }
    return GlobalStore.instance;
  }

  getState(): appState {
    return this.state;
  }

  setState(newState: Partial<appState>): void {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  subscribe(listener: Listener): void {
    this.listeners.push(listener);
  }

  unsubscribe(listener: Listener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }
}

export default GlobalStore;

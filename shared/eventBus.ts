// shared/eventBus.ts
type EventListener = (...args: any[]) => void;

class EventBus {
  private static instance: EventBus;
  private events: { [key: string]: EventListener[] } = {};

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  // Subscribe to an event
  on(event: string, listener: EventListener): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  // Unsubscribe from an event
  off(event: string, listener: EventListener): void {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter((l) => l !== listener);
  }

  // Emit an event, notifying all listeners
  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;

    this.events[event].forEach((listener) => listener(...args));
  }
}

export default EventBus; // Export the class

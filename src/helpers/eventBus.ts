type EventCallback = (payload?: any) => void;

const listeners: Record<string, EventCallback[]> = {};

export function on(event: string, cb: EventCallback) {
  listeners[event] = listeners[event] || [];
  listeners[event].push(cb);
  return () => off(event, cb);
}

export function off(event: string, cb: EventCallback) {
  if (!listeners[event]) return;
  listeners[event] = listeners[event].filter(fn => fn !== cb);
}

export function emit(event: string, payload?: any) {
  (listeners[event] || []).forEach(fn => fn(payload));
}

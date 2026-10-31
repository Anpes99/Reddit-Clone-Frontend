// Used by every test (see setupTests.js) so that importing a component never
// opens a real Socket.IO connection. Tests can trigger server events with
// socket.emitServerEvent(eventName, payload).
const handlers = {};

const socket = {
  auth: {},
  connected: true,
  emit: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
  on: jest.fn((eventName, handler) => {
    handlers[eventName] = [...(handlers[eventName] || []), handler];
  }),
  off: jest.fn((eventName, handler) => {
    handlers[eventName] = (handlers[eventName] || []).filter(
      (registered) => registered !== handler,
    );
  }),
  emitServerEvent: (eventName, payload) => {
    (handlers[eventName] || []).forEach((handler) => handler(payload));
  },
};

export default socket;

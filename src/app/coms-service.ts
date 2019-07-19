import { messagingService, MessageHandler } from "./server-messaging";

type MessagingService = ReturnType<typeof messagingService>;

const coms: MessagingService[] = [];
const handlers: { [key: string]: MessageHandler } = {};

export function add_coms(service: MessagingService) {
  coms.push(service);
  for (const key in handlers) {
    if (!handlers.hasOwnProperty(key)) {
      continue;
    }

    service.handle(key, handlers[key]);
  }
}

export function handle(message: string, handler: MessageHandler) {
  if (handlers.hasOwnProperty(message)) {
    throw new Error("Duplicate handler");
  }

  handlers[message] = handler;

  for (const com of coms) {
    com.handle(message, handler);
  }
}

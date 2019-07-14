import { MessagingService } from "./server-messaging";

let coms: MessagingService;
let awaiters: ((coms: MessagingService) => void)[] = [];

export function set_coms(service: MessagingService) {
  coms = service;
  for (const awaiter of awaiters) {
    awaiter(coms);
  }

  awaiters = [];
}

export function get_coms() {
  return new Promise<MessagingService>(res => {
    if (coms) {
      res(coms);
      return;
    }

    awaiters.push(c => res(c));
  });
}

import { Manager } from "socket.io-client";

export const useSocketManager = () => {
  const manager = ref<Manager | undefined>();
  return ref();
};

import { io } from "socket.io-client";
import type { SuperDmMessage } from "~/types";

interface SuperDmSocketOptions {
  handleSuperDmMessageEvent?: (superDmMessage: SuperDmMessage) => void;
}

export const useSuperDmSocket = (options?: SuperDmSocketOptions) => {
  const { socket, connectionStatus, disconnect, runConnectEvents } =
    useSocketBase();
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const init = (superDmId: string) => {
    if (socket.value) return;

    const url = `${config.public.apiBaseUrl}/super-dms`;
    socket.value = io(url, {
      auth: { token: authStore.state.token },
      query: { superDmId },
    });

    runEvents();
  };

  const runEvents = () => {
    if (!socket.value) return;
    runConnectEvents();

    socket.value.on(
      "super-dm-message",
      (data: { superDmMessage: SuperDmMessage }) => {
        options?.handleSuperDmMessageEvent?.(data.superDmMessage);
      }
    );
  };

  const sendMessage = (params: {
    content: string;
    date: string;
    signature: string;
    superDmId: string;
  }) => {
    return new Promise<{ superDmMessage: SuperDmMessage }>(
      (resolve, reject) => {
        socket.value?.emit("send-message", params, (res: any) => {
          if (res.error) reject(res.error);
          else resolve(res);
          console.log("Send message", res);
        });
      }
    );
  };

  return {
    init,
    disconnect,
    sendMessage,
  };
};

import { io } from "socket.io-client";

interface SuperDmSocketOptions {}

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
  };

  const sendMessage = (params: {
    content: string;
    date: string;
    signature: string;
    superDmId: string;
  }) => {
    return new Promise((resolve, reject) => {
      socket.value?.emit("send-message", params, (res: any) => {
        if (res.error) reject(res.error);
        else resolve(res);
        console.log("Send message", res);
      });
    });
  };

  return {
    init,
    disconnect,
    sendMessage,
  };
};

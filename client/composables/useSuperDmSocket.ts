import { io } from "socket.io-client";
import type { SuperDmMessage } from "~/types";
import type { SuperDmMessageSenderTypeEnum } from "~/types/enums";

interface SuperDmSocketOptions {
  handleSuperDmMessageEvent?: (superDmMessage: SuperDmMessage) => void;
  handleReadMessagesUpdatedEvent?: (messages: SuperDmMessage[]) => void;
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

    socket.value.on(
      "read-messages-updated",
      (data: { messages: SuperDmMessage[] }) => {
        options?.handleReadMessagesUpdatedEvent?.(data.messages);
      }
    );
  };

  const sentMessageBase = (
    params: {
      content: string;
      date: string;
      signature: string;
      superDmId: string;
    },
    event: "send-message" | "streamer-send-message" = "send-message"
  ) => {
    return new Promise<{ superDmMessage: SuperDmMessage }>(
      (resolve, reject) => {
        socket.value?.emit(event, params, (res: any) => {
          if (res.error) reject(res.error);
          else resolve(res);
          console.log("Send message", res);
        });
      }
    );
  };

  const sendMessage = (params: {
    content: string;
    date: string;
    signature: string;
    superDmId: string;
  }) => {
    return sentMessageBase(params, "send-message");
  };

  const streamerSendMessage = (params: {
    content: string;
    date: string;
    signature: string;
    superDmId: string;
  }) => {
    return sentMessageBase(params, "streamer-send-message");
  };

  const readMessages = (params: {
    superDmId: string;
    senderType: SuperDmMessageSenderTypeEnum;
    signature: string;
    date: string;
  }) => {
    return new Promise<{ messages: SuperDmMessage[] }>((resolve, reject) => {
      socket.value?.emit("read-messages", params, (res: any) => {
        if (res.error) reject(res.error);
        else resolve(res);
        console.log("Read messages", res);
      });
    });
  };
  return {
    init,
    disconnect,
    sendMessage,
    streamerSendMessage,
    readMessages,
  };
};

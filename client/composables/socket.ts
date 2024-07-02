import { type Socket, io } from "socket.io-client";
import type { PaymentSocketMessage } from "~/types";

interface PaymentSocketOptions {
  onMessage: (...args: [PaymentSocketMessage]) => any;
  onError?: () => any;
  onClose?: () => any;
}

interface TipPaymentInitParams {
  slug: string;
}

export const usePaymentSocket = (options?: PaymentSocketOptions) => {
  const socket = shallowRef<WebSocket | undefined>();
  const config = useRuntimeConfig();

  const init = (params?: TipPaymentInitParams) => {
    // const url = `${config.public.apiBaseUrl}/v1/pages/${params.slug}/ws/tips/${params.tipId}`;
    const url = `wss://api.xmrchat.com/ws/${params?.slug}`;

    console.log("creating socket with url", url);

    socket.value = new WebSocket(url);
    runEvents();
  };

  const runEvents = () => {
    if (!socket.value) return;

    socket.value.onopen = handleOpen;
    socket.value.onclose = handleClose;
    socket.value.onerror = (e) => {
      console.log("on error", e);
      options?.onError?.();
    };
    socket.value.onmessage = (e: MessageEvent<string>) => {
      const data = JSON.parse(e.data) as PaymentSocketMessage;

      if (data.error) {
        options?.onError?.();
        return;
      }

      options?.onMessage(data);
    };
  };

  const handleOpen = () => {
    console.log("Socket Is Active");
  };
  const handleClose = () => {
    console.log("Socket Closed");
    options?.onClose?.();
  };

  const disconnect = () => {
    socket.value?.close();
    // socket.value?.disconnect();
  };

  return {
    init,
    disconnect,
  };
};

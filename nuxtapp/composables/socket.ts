import { type Socket, io } from "socket.io-client";
import type { PaymentSocketMessage } from "~/types";

interface PaymentSocketOptions<T> {
  onTipEvent?: (...args: [T]) => any;
  onPaymentEvent?: (...args: [T]) => any;
  onPageTipEvent?: (...args: [T]) => any;
  onError?: () => any;
  onClose?: () => any;
}

interface TipPaymentInitParams {
  query: any;
  path: string;
}

export const usePaymentSocket = <T>(options?: PaymentSocketOptions<T>) => {
  const socket = shallowRef<Socket | undefined>();
  const config = useRuntimeConfig();

  const init = (params?: TipPaymentInitParams) => {
    // const url = `${config.public.apiBaseUrl}/v1/pages/${params.slug}/ws/tips/${params.tipId}`;
    const url = `${config.public.apiBaseUrl}/${params?.path}`;

    console.log("creating socket-io with url", url);
    console.log(params);

    socket.value = io(url, {
      auth: params?.query,
    });
    runEvents();
  };

  const runEvents = () => {
    if (!socket.value) return;
    socket.value.on("connect", handleConnect);
    socket.value.on("disconnect", handleDisconnect);

    socket.value.on("payment", handlePaymentEvent);

    socket.value.on("tip", handleTipEvent);

    socket.value.on("newTip", handlePageTipEvent);

    // socket.value.onerror = (e) => {
    //   console.log("on error", e);
    //   options?.onError?.();
    // };
    // socket.value.onmessage = (e: MessageEvent<string>) => {
    //   const data = JSON.parse(e.data) as T;

    //   if ((data as any).error) {
    //     options?.onError?.();
    //     return;
    //   }

    //   options?.onMessage(data);
    // };
  };

  const handleConnect = () => {
    console.log("Socket Is Active");
  };
  const handleDisconnect = () => {
    console.log("Socket Closed");
    socket.value = undefined;
    options?.onClose?.();
  };

  const handlePaymentEvent = (v: any) => {
    options?.onPaymentEvent?.(v);
  };

  const handleTipEvent = (v: any) => {
    options?.onTipEvent?.(v);
  };

  const handlePageTipEvent = (v: any) => {
    options?.onPageTipEvent?.(v);
  };

  const disconnect = () => {
    socket.value?.close();
    socket.value = undefined;
    // socket.value?.disconnect();
  };

  return {
    init,
    disconnect,
  };
};

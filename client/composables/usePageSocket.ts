import { io } from "socket.io-client";
import type { ObsTipSocketEvent, Tip } from "~/types";

interface PageSocketOptions {
  handleObsTipEvent?: (data: {
    tip: Tip;
    autoRemove: boolean;
    message: string;
  }) => void;
  handleTipEvent?: (data: {
    tip: Tip;
    autoRemove: boolean;
    message: string;
  }) => void;
  handleObsTipRemovalEvent?: (args0: { tipId: number }) => void;
  handleInitialObsTipsEvent?: (payloads: ObsTipSocketEvent[]) => void;
}

// Usage is for
// OBS page to listen for new tips or tips removal
// Streavmer page to add or remove actie tips ( needs auth )
// Listening for payment of tip for page creation ( not added yet )
export const usePageSocket = (options?: PageSocketOptions) => {
  const { socket, connectionStatus, disconnect, runConnectEvents } =
    useSocketBase();
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const init = (slug: string) => {
    const url = `${config.public.apiBaseUrl}/pages`;
    socket.value = io(url, {
      auth: { token: authStore.state.token },
    });

    runEvents();

    socket.value?.emit("join", { slug }, (payloads: ObsTipSocketEvent[]) => {
      options?.handleInitialObsTipsEvent?.(payloads);
    });
  };

  const runEvents = () => {
    if (!socket.value) return;
    runConnectEvents();
    socket.value.on(
      "obsTip",
      (data: { tip: Tip; autoRemove: boolean; message: string }) =>
        options?.handleObsTipEvent?.(data)
    );
    socket.value.on("obsTipRemove", (args0: { tipId: number }) =>
      options?.handleObsTipRemovalEvent?.(args0)
    );
    socket.value.on(
      "tip",
      (data: { tip: Tip; autoRemove: boolean; message: string }) =>
        options?.handleTipEvent?.(data)
    );
  };

  const sendTipToObs = (slug: string, tipId: number) => {
    return new Promise((resolve, reject) => {
      socket.value?.emit("addTipToObs", { slug, tipId }, (res: any) => {
        if (res.error) reject(res.error);
        else resolve(res);
        console.log("Send tip to obs", res);
      });
    });
  };

  const removeTipFromObs = (slug: string, tipId: number) => {
    return new Promise((resolve, reject) => {
      socket.value?.emit("removeTipFromObs", { slug, tipId }, (res: any) => {
        if (res.error) reject(res.error);
        else resolve(res);
      });
    });
  };

  return {
    init,
    disconnect,
    connectionStatus,
    sendTipToObs,
    removeTipFromObs,
  };
};

import { io } from "socket.io-client";
import type { Tip } from "~/types";

interface PageSocketOptions {
  handleObsTipEvent?: (tip: Tip) => void;
  handleObsTipRemovalEvent?: (tip: Tip) => void;
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

    socket.value?.emit("join", { slug });
  };

  const runEvents = () => {
    if (!socket.value) return;
    runConnectEvents();
    socket.value.on("obs-tip", (tip: Tip) => options?.handleObsTipEvent?.(tip));
    socket.value.on("obs-tip-removal", (tip: Tip) =>
      options?.handleObsTipRemovalEvent?.(tip)
    );
  };

  return {
    init,
    disconnect,
    connectionStatus,
  };
};

export const useSuperDmScroll = (params: {
  bottomOfMessagesRef: Ref<HTMLElement | undefined>;
  messagesContainerRef: Ref<HTMLElement | undefined>;
}) => {
  const getIsAtBottom = () => {
    if (!params.messagesContainerRef.value) return;
    const container = params.messagesContainerRef.value;
    const threshold = 200; // pixels from bottom to consider "at bottom"
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold;
    return isNearBottom;
  };

  const scrollToBottom = async (options?: {
    ignoreBottom?: boolean;
    behavior?: "smooth" | "instant";
  }) => {
    await nextTick();
    const isAtBottom = getIsAtBottom();

    if (!options?.ignoreBottom && !isAtBottom) return;

    if (!params.messagesContainerRef.value) return;
    if (!params.bottomOfMessagesRef.value) return;

    params.bottomOfMessagesRef.value.scrollIntoView({
      behavior: options?.behavior || "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  return {
    scrollToBottom,
  };
};

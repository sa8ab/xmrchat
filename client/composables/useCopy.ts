export const useCopy = () => {
  const toast = useToast();
  const copy = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      toast.add({
        title: "Copied to your clipboard!",
      });
    } catch (e) {}
  };

  return { copy };
};

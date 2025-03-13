import type { ConfirmModalState } from "~/types";

export const useConfirmModal = () => {
  const state = useState<ConfirmModalState>("confirm-modal-state", () => ({
    active: false,
  }));

  const show = (options: ConfirmModalState) => {
    state.value = { ...options, active: true };
  };

  const hide = () => {
    state.value.active = false;
  };

  return {
    show,
    hide,
    state,
  };
};

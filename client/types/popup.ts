import type { Numberic } from "./general";

export type PopupKey = "confirm";

export interface BasePopupContext {
  title?: string;
  onDone?: () => any;
}

export interface ConfirmContext extends BasePopupContext {
  text?: string;
  onAccept?: (params: { loading: Ref<boolean> }) => Promise<void>;
  title?: string;
  color?: string;
}

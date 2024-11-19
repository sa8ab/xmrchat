interface TxInfoId {
  high: number;
  low: number;
}

export interface Txinfo {
  id: TxInfoId;
  block: number;
  index: number;
  amount: number;
  timestamp: number;
  tx_hash: string;
  tx_prefix_hash: string;
  tx_public: string;
  rct_mask: string;
  payment_id: string;
  unlock_time: number;
  mixin_count: number;
  coinbase: boolean;
}

export interface LwsWebhookEvent {
  event: string;
  payment_id: string;
  token: string;
  confirmations: number;
  event_id: string;
  tx_info: Txinfo;
}

export interface PageReportEmailOptions {
  slug: string;
  userId: number | string;
  userName: string;
  pageId: number | string;
  price: string;
}

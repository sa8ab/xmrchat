import { Tip } from 'src/tips/tip.entity';

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

export enum TrocadorStatusEnum {
  NEW = 'new',
  WAITING = 'waiting',
  CONFIRMING = 'confirming',
  SENDING = 'sending',
  PAID_PARTIALLY = 'paid partially',
  FINISHED = 'finished',

  FAILED = 'failed',
  EXPIRED = 'expired',
  HALTED = 'halted',
  REFUNDED = 'refunded',
}

export interface TrocadorTrade {
  trade_id: string;
  date: string;
  ticker_from: string;
  ticker_to: string;
  coin_from: string;
  coin_to: string;
  network_from: string;
  network_to: string;
  amount_from: number;
  amount_to: number;
  provider: string;
  fixed: boolean;
  payment: boolean;
  status: TrocadorStatusEnum;
  address_provider: string;
  // address_provider_memo: '';
  address_user: string;
  // address_user_memo: '';
  // refund_address: '';
  // refund_address_memo: '';
  password: string;
  id_provider: string;
}

export interface InitSwapData {
  coinId: number;
  amountTo: number;
  address: string;
  tip: Tip;
}

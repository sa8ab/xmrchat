import { TrocadorStatusEnum } from '../constants';

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
  time: string;
}

export interface TrocadorQuote {
  provider: string;
  kycrating: string;
  logpolicy: string;
  amount_from: number;
  waste: number;
  eta: number;
  provider_logo: string;
  amount_from_USD: string;
  amount_to_USD: string;
}

export interface TrocadorRate {
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
  quotes: {
    quotes: TrocadorQuote[];
  };
}

export interface TrocadorTrade extends TrocadorRate {
  address_provider: string;
  // address_provider_memo: '';
  address_user: string;
  // address_user_memo: '';
  // refund_address: '';
  // refund_address_memo: '';
  password: string;
  id_provider: string;
  details: {
    original_eta: number;
    expiresAt: string;
  };
}

export interface InitSwapData {
  coinId: number;
  amountTo: number;
  address: string;
}

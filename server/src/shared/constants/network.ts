import { MoneroNetworkType } from "monero-ts";

export enum MoneroNetworkTypeEnum {
  MAINNET = MoneroNetworkType.MAINNET,
  TESTNET = MoneroNetworkType.TESTNET,
  STAGENET = MoneroNetworkType.STAGENET
}

export const NETWORK_CONFIGS: Record<MoneroNetworkTypeEnum, { type: MoneroNetworkType }> = {
  [MoneroNetworkType.MAINNET]: {
    type: MoneroNetworkType.MAINNET
  }
}
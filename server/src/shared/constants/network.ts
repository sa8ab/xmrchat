import { MoneroNetworkType } from "monero-ts";

export enum MoneroNetworkTypeEnum {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  STAGENET = 'stagenet',
  STRESSNET = 'stressnet',
}

export const NETWORK_CONFIGS: Record<MoneroNetworkTypeEnum, { type: MoneroNetworkTypeEnum, validationNetwork: number }> = {
  [MoneroNetworkTypeEnum.MAINNET]: {
    type: MoneroNetworkTypeEnum.MAINNET,
    validationNetwork: MoneroNetworkType.MAINNET,
  },
  [MoneroNetworkTypeEnum.TESTNET]: {
    type: MoneroNetworkTypeEnum.TESTNET,
    validationNetwork: MoneroNetworkType.TESTNET,
  },
  [MoneroNetworkTypeEnum.STAGENET]: {
    type: MoneroNetworkTypeEnum.STAGENET,
    validationNetwork: MoneroNetworkType.STAGENET,
  },
  [MoneroNetworkTypeEnum.STRESSNET]: {
    type: MoneroNetworkTypeEnum.STRESSNET,
    validationNetwork: MoneroNetworkType.TESTNET,
  }
}
import { MoneroNetworkTypeEnum } from "~/types/enums"

export const useMoneroNetwork = () => {
  const config = useRuntimeConfig()

  const { getNetworkConfig } = useConstants()

  const networkType = computed<MoneroNetworkTypeEnum>(() => config.public.moneroNetwork as MoneroNetworkTypeEnum || MoneroNetworkTypeEnum.MAINNET)
  const network = computed(() => getNetworkConfig(networkType.value))
  return {
    networkType,
    network
  }
}

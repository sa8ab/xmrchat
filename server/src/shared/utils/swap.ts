import { SwapStatusEnum, TrocadorStatusEnum } from '../constants';

export const getSwapStatusFromTrocador = (status: TrocadorStatusEnum) => {
  if (status === TrocadorStatusEnum.HALTED)
    return {
      status: SwapStatusEnum.FAILED,
      message: 'Some issue has happened with swap, please contact support.',
    };

  if (status === TrocadorStatusEnum.REFUNDED)
    return {
      status: SwapStatusEnum.FAILED,
      message: 'Swap is refunded to the user.',
    };

  if (Object.values(SwapStatusEnum).includes(status as any))
    return {
      status: status,
    };

  return {
    status: SwapStatusEnum.FAILED,
    message: `Unknown status from trocador - ${status}`,
  };
};

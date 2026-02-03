import {
  englishDataset,
  englishRecommendedTransformers,
  RegExpMatcher,
  TextCensor,
} from 'obscenity';
import { PageTipTier } from 'src/page-tip-tiers/page-tip-tier.entity';

const badWordMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

export const clearMessage = (message: string) => {
  const censor = new TextCensor();
  const matches = badWordMatcher.getAllMatches(message);
  return censor.applyTo(message, matches);
};

export const getTipTier = (amount: string, pageTipTiers?: PageTipTier[]) => {
  if (!amount || !pageTipTiers?.length) return null;

  const amountBig = BigInt(amount);
  const tiers = pageTipTiers.filter((tier) => {
    const minAmountBig = tier.minAmount ? BigInt(tier.minAmount) : BigInt(0);
    return amountBig >= minAmountBig;
  });

  if (!tiers.length) return null;

  const matches = tiers.sort((a: PageTipTier, b: PageTipTier) => {
    const minAmountA = a.minAmount ? BigInt(a.minAmount) : BigInt(0);
    const minAmountB = b.minAmount ? BigInt(b.minAmount) : BigInt(0);
    return Number(minAmountB - minAmountA);
  });

  return matches[0];
};

export const getDefaultMessageLength = (pageTipTiers?: PageTipTier[]) => {
  if (!pageTipTiers?.length) return 255;

  const tiers = pageTipTiers.filter((tier) => Boolean(tier.messageLength)).sort((a: PageTipTier, b: PageTipTier) => {
    const messageLengthA = a.messageLength || 0;
    const messageLengthB = b.messageLength || 0;
    return messageLengthA - messageLengthB;
  });
  return Math.min(tiers?.[0]?.messageLength || 255, 255);
};
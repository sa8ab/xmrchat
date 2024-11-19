import {
  englishDataset,
  englishRecommendedTransformers,
  RegExpMatcher,
  TextCensor,
} from 'obscenity';

const badWordMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

export const clearMessage = (message: string) => {
  const censor = new TextCensor();
  const matches = badWordMatcher.getAllMatches(message);
  return censor.applyTo(message, matches);
};

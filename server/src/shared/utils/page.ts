import { Link } from 'src/links/link.entity';
import { LinkPlatformEnum } from '../constants';

export const contentLinksWithDefaults = (links: Link[]) => {
  const result: Partial<Link>[] = [...links];

  Object.values(LinkPlatformEnum).forEach((p) => {
    if (links.find((link) => link.platform === p)) return;
    result.push({ platform: p, value: null });
  });

  return result;
};

import { Link } from 'src/links/link.entity';
import { Page } from 'src/pages/page.entity';

export interface ILinkVerificationHandlerData {
  page: Page;
  link: Link;
  data: any;
}

export interface ILinkVerificationHandlerResponse {
  valid: boolean;
  name?: string;
}

export interface ILinkVerificationHandler {
  verify(
    data: ILinkVerificationHandlerData,
  ): Promise<ILinkVerificationHandlerResponse>;
}

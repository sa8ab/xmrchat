import { Link } from 'src/links/link.entity';
import { Page } from 'src/pages/page.entity';
import { LinkVerification } from '../link-verification.entity';

export interface ILinkVerificationHandlerData {
  page: Page;
  link: Link;
  data: any;
}

export interface ILinkVerificationHandlerResponse {
  valid: boolean;
  message?: string;
}

export interface ILinkVerificationHandler {
  verify(
    data: ILinkVerificationHandlerData,
  ): Promise<ILinkVerificationHandlerResponse>;

  /**
   * Validate if the page still exists and verification is still valid.
   */
  validate(verification: LinkVerification): Promise<ILinkVerificationHandlerResponse>;
}

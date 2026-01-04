import { Page } from 'src/pages/page.entity';

export interface IPageVerificationHandlerData {
  page: Page;
  data: any;
}

export interface IPageVerificationHandlerResponse {
  valid: boolean;
  name?: string;
  verifiedUrl?: string;
}

export interface IPageVerificationHandler {
  verify(
    data: IPageVerificationHandlerData,
  ): Promise<IPageVerificationHandlerResponse>;
}

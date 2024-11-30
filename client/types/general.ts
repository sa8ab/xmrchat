import type { PageSettingKey } from "./enums";

export type Numberic = string | number;

export interface LoginResponse {
  access_token: string;
}

export interface MeResponse {
  user?: User;
  page?: StreamerPage;
}

export interface User {
  username: string;
  email: string;
  id: string;
}

export interface CreateFormFields {
  logo?: Numberic;
  coverImage?: Numberic;
  primaryAddress?: string;
  secretViewKey?: string;
  path?: string;
  tiers?: TipTierField[];
  twitchChannel?: string;
  minTipAmount?: string;
  isPublic?: boolean;
}

export interface TipFormFields {
  private?: boolean;
  name?: string;
  message?: string;
  amount?: any;
}

export interface SlugReservationResponse {
  paymentAddress: string;
  amount: number;
  reservedUntil: number;
}

export interface TipCreationResponse {
  amount: string;
  id: number;
  paymentAddress: string;
}

export interface StreamerPage {
  userId: string;
  id: string;
  name: string;
  path: string;
  logo: UploadedFile;
  coverImage: UploadedFile;
  adult: boolean;
  primaryAddress?: string;
  secretViewKey?: string;
  tiers?: TipTier[];
  twitchChannel?: string;
  minTipAmount?: string;
  isPublic: boolean;
}

interface TipPayment {
  amount: string;
  id: number;
  paidAmount: string;
}

export interface Tip {
  id: string;
  pageId: string;
  name: string;
  message: string;
  private?: boolean;
  paidAt?: string;
  payment?: TipPayment;
}

export interface TipTier {
  amount: string;
  name?: string;
  description?: string;
  id: string;
}

export interface TipTierField {
  name?: string;
  description?: string;
  amount?: string;
}

export interface PaymentSocketMessage {
  paidAt: Date;
  amount: string;
  paidAmount: string;
}

export interface TipEventData {
  paidAt: Date;
  amount: string;
  paidAmount: string;
}

export interface ObsTip {
  amount: string;
  message: string;
  name: string;
  id?: string;
}

export interface ObsTipSocketMessage {
  amount: string;
  paidAmount: string;
  name: string;
  message: string;
}

export interface UploadedFile {
  filename: string;
  originalName: string;
  type: UploadedFile;
  url: string;
  id: number;
}

export interface PageSetting {
  key: PageSettingKey;
  value?: any;
  category: string;
}

export interface PageSettingField {
  key: PageSettingKey;
  value?: any;
}

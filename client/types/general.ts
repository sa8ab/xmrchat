export type Numberic = string | number;

export interface LoginResponse {
  user_id: string;
}

export interface MeResponse {
  authenticated: boolean;
  user?: User;
  pages?: StreamerPage[];
}

export interface User {
  username: string;
  email: string;
  id: string;
}

export interface CreateFormFields {
  adult?: boolean;
  logo?: string;
  cover_image?: string;
  payment_address?: string;
  view_key?: string;
  slug?: string;
  tiers?: TipTierField[];
  twitch_channel?: string;
}

export interface TipFormFields {
  private?: boolean;
  name?: string;
  message?: string;
  amount?: any;
}

export interface SlugReservationResponse {
  payment_address: string;
  amount: number;
  reservation_timestamp: number;
}

export interface TipCreationResponse {
  amount: string;
  id: string;
  payment_address: string;
}

export interface StreamerPage {
  user_id: string;
  id: string;
  name: string;
  path: string;
  logo: string;
  cover_image: string;
  adult: boolean;
  payment_address?: string;
  view_key?: string;
  tiers?: TipTier[];
  twitch_channel?: string;
}

export interface Tip {
  id: string;
  page_id: string;
  tier_id?: string;
  name: string;
  amount: string;
  message: string;
  private?: boolean;
  paid?: boolean;
  paid_at?: string;
}

export interface TipTier {
  amount: string;
  name?: string;
  id: string;
}

export interface TipTierField {
  name?: string;
  price?: string;
}

export interface PaymentSocketMessage {
  data: {
    type: string;
    tip?: { paid?: boolean };
    page?: { paid?: boolean };
  };
  error?: any;
}

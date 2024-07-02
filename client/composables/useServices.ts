import type { AxiosRequestConfig } from "axios";
import type {
  LoginResponse,
  MeResponse,
  Numberic,
  SlugReservationResponse,
  StreamerPage,
  Tip,
  TipCreationResponse,
} from "~/types";

export const useServices = () => {
  const { axios } = useApp();

  const checkSession = async () => {
    const res = await axios.get<MeResponse>("/v1/users/auth");
    return res.data;
  };

  const login = async (params: any) => {
    const res = await axios.post<LoginResponse>("/v1/users/login", params);
    return res;
  };

  const signup = async (params: any) => {
    const res = await axios.post<LoginResponse>("/v1/users", params);
    return res;
  };

  const checkSlug = async (params: any) => {
    const res = await axios.get<{ available: boolean }>("/v1/pages/checkslug", {
      params,
    });
    return res.data;
  };

  const reserveSlug = async (params: any) => {
    const res = await axios.post<SlugReservationResponse>(
      "/v1/pages/reserveslug",
      params
    );
    return res.data;
  };

  const checkReservation = async (params: any) => {
    const res = await axios.get<{ paid: boolean }>(
      "/v1/pages/checkreservation",
      { params }
    );
    return res.data;
  };

  const checkSendTip = async (slug: string, id: string) => {
    const res = await axios.get<{ paid: boolean }>(
      `v1/pages/${slug}/tips/${id}`
    );
    return res.data;
  };

  const uploadImage = async (params: any, config?: AxiosRequestConfig) => {
    const res = await axios.post<{ id: string }>("/v1/images", params, config);
    return res.data;
  };

  const sendTipToStreamer = async (slug: string, params: any) => {
    const res = await axios.post<TipCreationResponse>(
      `/v1/pages/${slug}/tips`,
      params
    );
    return res.data;
  };

  const getPrice = async () => {
    const res = await axios.get("v1/price");
    return res.data.price;
  };

  const getStreamerPage = async (slug: string) => {
    const res = await axios.get<{ result: StreamerPage }>(`/v1/pages/${slug}`);
    return res.data.result;
  };

  const getTips = async (slug: string) => {
    const res = await axios.get<Tip[]>(`/v1/pages/${slug}/tips`);
    return res.data;
  };

  const getMyPage = async () => {
    const res = await axios.get<StreamerPage[]>("/v1/pages");
    return res.data.toSorted((a, b) => b.path.localeCompare(a.path))[0];
  };

  const updateStreamer = async (slug: string, params: any) => {
    const res = await axios.patch(`/v1/pages/${slug}`, params);
    return res.data[0];
  };

  const logout = async () => {
    const res = await axios.get("/v1/users/logout");
    return res;
  };

  const forgotPassword = async (params: any) => {
    const res = await axios.post("/v1/users/reset_password", params);
    return res;
  };

  const resetPassword = async (params: any, token: string) => {
    const res = await axios.post(
      `/v1/users/auth/reset_password/${token}`,
      params
    );
    return res;
  };

  const confirmEmail = async (token: Numberic) => {
    const res = await axios.post(`/v1/users/auth/email_verification/${token}`);
    return res;
  };

  return {
    checkSession,
    login,
    signup,
    logout,
    checkSlug,
    reserveSlug,
    checkReservation,
    checkSendTip,
    uploadImage,
    sendTipToStreamer,
    getPrice,
    getStreamerPage,
    getTips,
    getMyPage,
    updateStreamer,
    forgotPassword,
    resetPassword,
    confirmEmail,
  };
};

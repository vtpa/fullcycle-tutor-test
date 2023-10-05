import { apiRoutes } from "../routes";
import { api } from "../utils/api";
import { IUser } from "../interfaces/user";
import { useFetch } from "../utils/reactQuery";

interface IAuthResponse {
  token: string;
  refreshToken: string;
}

export const getTokenByPassword = (email: string, password: string) =>
  api.post<IAuthResponse>(apiRoutes.getTokenByPassword, {
    email,
    password,
  });
export const getTokenByRefresh = (refreshToken: string) =>
  api.post<IAuthResponse>(apiRoutes.getTokenByRefresh, {
    access_token: refreshToken,
  });

export const useGetProfile = () => {
  const context = useFetch<{ user: IUser }>(apiRoutes.getProfile, undefined, {
    retry: false,
  });
  return { ...context, data: context.data?.user };
};

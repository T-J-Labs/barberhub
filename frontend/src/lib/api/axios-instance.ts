import Axios, {
  type AxiosError,
  type AxiosRequestConfig,
} from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const AXIOS_INSTANCE = Axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClient = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return AXIOS_INSTANCE({
    ...config,
    ...options,
    headers: {
      ...config.headers,
      ...options?.headers,
    },
  }).then(({ data }) => data);
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;

export function publicTenantRequest(
  tenantSubdomain: string,
): AxiosRequestConfig {
  const normalizedSubdomain = tenantSubdomain.trim().toLowerCase();

  if (!normalizedSubdomain) {
    throw new Error("O subdomínio do tenant é obrigatório.");
  }

  return {
    headers: {
      "X-Tenant-Subdomain": normalizedSubdomain,
    },
  };
}

export function authenticatedRequest(
  accessToken: string,
): AxiosRequestConfig {
  const normalizedToken = accessToken.trim();

  if (!normalizedToken) {
    throw new Error("O token de acesso é obrigatório.");
  }

  return {
    headers: {
      Authorization: `Bearer ${normalizedToken}`,
    },
  };
}

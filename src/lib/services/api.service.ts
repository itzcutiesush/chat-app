import { ApiRequestError } from "./ApiRequestError";

class ApiService {
  protected async request<T>(
    path: string,
    init: RequestInit & { signal?: AbortSignal } = {},
  ): Promise<T> {
    const { baseUrl, token } = getConfig();
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(init.headers ?? {}),
      },
      cache: "no-store",
    });

    const text = await res.text();
    let body: unknown = undefined;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }

    if (!res.ok) {
      const message =
        (body &&
        typeof body === "object" &&
        "message" in body &&
        typeof body.message === "string"
          ? body.message
          : `Upstream API responded with ${res.status}`) ??
        "Upstream API error";
      throw new ApiRequestError(message, res.status, body);
    }

    return body as T;
  }
}

const getConfig = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = process.env.NEXT_PUBLIC_API_TOKEN;
  if (!baseUrl || !token) {
    throw new ApiRequestError(
      "Server is missing API_BASE_URL or API_TOKEN env vars.",
      500,
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), token };
};

export default ApiService;

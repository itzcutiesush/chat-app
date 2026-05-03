import ApiService from "./api.service";
import { API_URL } from "@/lib/constants";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { Message, GetMessagesParams, CreateMessageBody } from "@/lib/types";

class ApiMessageService extends ApiService {
  async getMessages(params: GetMessagesParams = {}): Promise<Message[]> {
    const search = new URLSearchParams();
    if (params.after) search.set("after", params.after);
    if (params.before) search.set("before", params.before);
    if (params.limit !== undefined) search.set("limit", String(params.limit));
    const qs = search.toString();
    return this.request<Message[]>(`${API_URL.messages}${qs ? `?${qs}` : ""}`, {
      method: "GET",
      signal: params.signal,
    });
  }

  async createMessage(
    body: CreateMessageBody,
    signal?: AbortSignal,
  ): Promise<Message> {
    return this.request<Message>(`${API_URL.messages}`, {
      method: "POST",
      body: JSON.stringify(body),
      signal,
    });
  }
}

export const apiMessageService = new ApiMessageService();

export const getMessagesQuery = (params: GetMessagesParams) => {
  return queryOptions({
    queryKey: ["messages"],
    queryFn: () => apiMessageService.getMessages(params),
  });
};

export const createMessageMutation = () => {
  return mutationOptions({
    mutationKey: ["messages", "create"],
    mutationFn: (body: CreateMessageBody) =>
      apiMessageService.createMessage(body),
  });
};

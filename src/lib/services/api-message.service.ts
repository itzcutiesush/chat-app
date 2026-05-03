import ApiService from "./api.service";
import { API_URL } from "@/lib/constants";
import type { QueryClient } from "@tanstack/react-query";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { Message, GetMessagesParams, CreateMessageBody } from "@/lib/types";

const messagesListPrefix = ["messages", "list"] as const;

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

export const getMessagesQuery = (params: GetMessagesParams = {}) => {
  return queryOptions({
    queryKey: [...messagesListPrefix, params] as const,
    queryFn: () => apiMessageService.getMessages(params),
    refetchInterval: 5000,
  });
};

export const createMessageMutation = (queryClient: QueryClient) =>
  mutationOptions({
    mutationKey: ["messages", "create"],
    mutationFn: (body: CreateMessageBody) =>
      apiMessageService.createMessage(body),

    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: messagesListPrefix });
      const snapshots = queryClient.getQueriesData<Message[]>({
        queryKey: messagesListPrefix,
      });
      const tempMessage: Message = {
        _id: `temp-${crypto.randomUUID()}`,
        author: body.author,
        message: body.message,
        createdAt: new Date().toISOString(),
      };

      for (const [key, prev] of snapshots) {
        queryClient.setQueryData<Message[]>(key, [
          ...(prev ?? []),
          tempMessage,
        ]);
      }
      return { snapshots };
    },

    onError: (_err, _body, ctx) => {
      ctx?.snapshots.forEach(([key, prev]) =>
        queryClient.setQueryData(key, prev),
      );
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: messagesListPrefix });
    },
  });

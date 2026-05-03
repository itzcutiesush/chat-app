export type Message = {
  _id: string;
  message: string;
  author: string;
  createdAt: string;
};

export type CreateMessageBody = {
  message: string;
  author: string;
};

export type GetMessagesParams = {
  after?: string;
  before?: string;
  limit?: number;
  signal?: AbortSignal;
};

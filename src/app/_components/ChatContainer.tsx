"use client";

import { MessageList } from "@/app/_components/MessageList";
import { SendMessage } from "@/app/_components/SendMessage";
import { getMessagesQuery } from "@/lib/services/api-message.service";
import { useQuery } from "@tanstack/react-query";

export const ChatContainer = () => {
  const {
    data: messages,
    isPending,
    isError,
  } = useQuery({
    ...getMessagesQuery({}),
    retry: 3,
  });

  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center"
      >
        <p className="mt-2 max-w-sm text-sm text-[var(--color-muted)]">
          Unable to load messages. Please try again later.
        </p>
      </div>
    );
  }

  if (isPending) {
    return (
      <p
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="flex flex-1 items-center justify-center px-6 py-12 text-center text-sm text-[var(--color-muted)]"
      >
        Loading messages…
      </p>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {messages.length === 0 ? (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-1 items-center justify-center px-6 py-12 text-center text-sm text-[var(--color-muted)]"
        >
          No messages yet — be the first to say hello.
        </div>
      ) : (
        <MessageList messages={messages} />
      )}
      <footer
        className="sticky bottom-0 bg-[var(--color-footer)]"
        aria-label="Message composer"
      >
        <div className="mx-auto w-full max-w-[var(--max-content-width)] px-6 py-4">
          <SendMessage />
        </div>
      </footer>
    </div>
  );
};

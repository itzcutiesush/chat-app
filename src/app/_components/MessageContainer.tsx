"use client";

import { useQuery } from "@tanstack/react-query";
import { getMessagesQuery } from "@/lib/services/api-message.service";
import { formatTimestamp } from "@/lib/helper";

export const MessageContainer = () => {
  const { data: messages } = useQuery({
    ...getMessagesQuery({}),
    retry: 3,
  });

  if (messages && messages?.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-12 text-center text-sm text-[var(--color-muted)]">
        No messages yet — be the first to say hello.
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="doodle-bg flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[var(--max-content-width)] flex-1 flex-col">
          <ul className="flex flex-col gap-4 px-6">
            {messages?.map((message) => {
              return (
                <li
                  key={message._id}
                  className={[
                    "max-w-[85%] sm:max-w-[75%] rounded-md px-5 py-4",
                    "shadow-[var(--shadow-card)]",
                    "bg-[var(--color-card)]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <p className="mb-1 text-sm text-[var(--color-muted)]">
                    {message.author}
                  </p>
                  <p className="whitespace-pre-wrap break-words text-base leading-snug text-[var(--color-fg)]">
                    {message.message}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {formatTimestamp(message.createdAt)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

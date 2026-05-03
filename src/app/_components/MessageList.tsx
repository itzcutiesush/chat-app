"use client";

import { useEffect, useRef } from "react";
import { SELF_AUTHOR } from "@/lib/constants";
import { formatTimestamp } from "@/lib/helper";
import type { Message } from "@/lib/types";

export const MessageList = ({ messages }: { messages: Message[] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <section
      className="doodle-bg flex min-h-0 flex-1 flex-col overflow-y-auto [scrollbar-gutter:stable_both-edges]"
      aria-labelledby="chat-messages-heading"
    >
      <h2 id="chat-messages-heading" className="sr-only">
        Chat messages
      </h2>

      <ol className="mx-auto flex w-full max-w-[var(--max-content-width)] list-none flex-col gap-4 px-6 py-6">
        {messages.map((message) => {
          const isSelf = message.author === SELF_AUTHOR;
          const authorId = `msg-${message._id}-author`;

          return (
            <li
              key={message._id}
              className={`flex w-full ${isSelf ? "justify-end" : "justify-start"}`}
            >
              <article
                className={[
                  "max-w-[75%] rounded-2xl px-4 py-3 shadow-[var(--shadow-card)]",
                  isSelf ? "bg-[var(--color-self)]" : "bg-[var(--color-card)]",
                ].join(" ")}
                aria-labelledby={isSelf ? undefined : authorId}
              >
                {!isSelf && (
                  <p
                    id={authorId}
                    className="mb-0.5 text-xs font-medium text-[var(--color-muted)]"
                  >
                    {message.author}
                  </p>
                )}
                <p className="whitespace-pre-wrap break-words text-base leading-snug text-[var(--color-fg)]">
                  {message.message}
                </p>
                <p
                  className={`mt-1 text-xs text-[var(--color-muted)] ${isSelf ? "text-right" : "text-left"}`}
                >
                  <time dateTime={message.createdAt}>
                    {formatTimestamp(message.createdAt)}
                  </time>
                </p>
              </article>
            </li>
          );
        })}
      </ol>

      <div ref={bottomRef} aria-hidden="true" />
    </section>
  );
};

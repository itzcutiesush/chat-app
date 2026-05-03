"use client";

import { type SubmitEvent, useId, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createMessageMutation } from "@/lib/services/api-message.service";
import { SELF_AUTHOR } from "@/lib/constants";

export const SendMessage = ({
  onMessageSent,
}: {
  onMessageSent: () => void;
}) => {
  const messageId = useId();
  const messageFieldRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");

  const mutation = useMutation({
    ...createMessageMutation(),
    onSuccess: () => {
      setMessage("");
      onMessageSent();
      queueMicrotask(() => messageFieldRef.current?.focus());
    },
  });

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || mutation.isPending) return;
    mutation.mutate({ author: SELF_AUTHOR, message: trimmedMessage });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3"
      aria-label="Send a message"
    >
      <label htmlFor={messageId} className="sr-only">
        Message (required)
      </label>
      <textarea
        ref={messageFieldRef}
        id={messageId}
        name="message"
        required
        rows={1}
        maxLength={4000}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
        placeholder="Message"
        disabled={mutation.isPending}
        className={[
          "flex-1 resize-none rounded-lg bg-white px-4 py-3",
          "text-base text-[var(--color-fg)] placeholder:text-[var(--color-muted)]",
          "shadow-[var(--shadow-card)]",
          "focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[var(--color-footer)]",
          "disabled:opacity-70",
        ].join(" ")}
      />
      <button
        type="submit"
        aria-label={mutation.isPending ? "Sending message…" : "Send message"}
        disabled={mutation.isPending}
        className={[
          "rounded-lg px-5 py-3 text-base font-medium text-white",
          "bg-[var(--color-send)] hover:bg-[var(--color-send-hover)]",
          "shadow-[var(--shadow-card)]",
          "focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-[var(--color-footer)]",
          "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[var(--color-send)]",
          "transition-colors",
        ].join(" ")}
      >
        {mutation.isPending ? "…" : "Send"}
      </button>

      {mutation.isError ? (
        <p role="alert" className="sr-only">
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Could not send your message. Please try again."}
        </p>
      ) : null}
    </form>
  );
};

import { getMessagesQuery } from "@/lib/services/api-message.service";
import { getQueryClient } from "@/lib/queryClient";
import { ChatContainer } from "./_components/ChatContainer";

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getMessagesQuery({}));
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-0 flex-1 flex-col outline-none"
    >
      <ChatContainer />
    </main>
  );
}

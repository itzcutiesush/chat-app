import { MessageContainer } from "@/app/_components/MessageContainer";
import { getMessagesQuery } from "@/lib/services/api-message.service";
import { getQueryClient } from "@/lib/queryClient";

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getMessagesQuery({}));
  return <MessageContainer />;
}

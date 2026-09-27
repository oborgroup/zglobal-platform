import { listContactMessages } from "@/lib/adminData";
import MessagesView from "./MessagesView";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await listContactMessages();
  return <MessagesView messages={messages} />;
}

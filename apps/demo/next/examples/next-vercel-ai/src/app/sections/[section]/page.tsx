import { Chat } from "@/components/chat";

export default async function SectionPage({
    params,
  }: {
    params: Promise<{ section: string }>
  }) {
    const { section } = await params
    return <Chat apiUrl={`/api/chat/${section}`} />;
}
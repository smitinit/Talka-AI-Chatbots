import { redirect } from "next/navigation";

export default async function BotRoot({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/bots/${slug}/configure`);
}

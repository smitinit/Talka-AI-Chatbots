import { redirect } from "next/navigation";

export default function BotRoot({ params }: { params: { slug: string } }) {
  redirect(`/bots/${params.slug}/configure`);
}

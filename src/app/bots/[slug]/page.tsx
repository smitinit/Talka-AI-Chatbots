export default async function BotPage({
  params,
}: {
  params: { slug: string };
}) {
  const botId = params.slug;

  return <>{botId}</>;
}

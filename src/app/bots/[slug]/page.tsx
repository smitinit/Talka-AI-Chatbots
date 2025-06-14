export default async function Bot({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: botId } = await params;
  return <>{botId}</>;
}

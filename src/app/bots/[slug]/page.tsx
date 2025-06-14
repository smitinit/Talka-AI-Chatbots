export default async function Bot({ params }: { params: { slug: string } }) {
  const botId = params.slug;
  return <>{botId}</>;
}

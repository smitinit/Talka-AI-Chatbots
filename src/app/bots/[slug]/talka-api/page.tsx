import ApiConfig from "@/ConfigureBot/ApiConfigure";

export default async function API() {
  await new Promise((res) => setTimeout(res, 500));
  return (
    <>
      <ApiConfig />
    </>
  );
}

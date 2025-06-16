import ApiConfig from "@/features/ApiBot/ApiConfigure";

export default async function API() {
  await new Promise((res) => setTimeout(res, 500));
  return (
    <>
      <ApiConfig />
    </>
  );
}

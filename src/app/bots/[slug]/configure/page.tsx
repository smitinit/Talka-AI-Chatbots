import BotConfigsForm from "@/features/ConfigureBot/ConfigureForm";

export default async function Configure() {
  await new Promise((res) => setTimeout(res, 500));

  return (
    <>
      <BotConfigsForm />
    </>
  );
}

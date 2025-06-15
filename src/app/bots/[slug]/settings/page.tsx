import SettingForm from "@/ConfigureBot/SettingsConfigure";

export default async function Settings() {
  await new Promise((res) => setTimeout(res, 500));
  return (
    <>
      <SettingForm />
    </>
  );
}

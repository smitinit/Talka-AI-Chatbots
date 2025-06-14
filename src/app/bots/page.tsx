import { getBots } from "@/ManageBot/bot.actions";
import BotCard from "@/ManageBot/BotCard";
import BotForm from "@/ManageBot/BotForm";

export default async function ManageBots() {
  const bots = await getBots();

  return (
    <main className="p-4">
      <div className="py-6">
        <h1 className="text-2xl">Add bot</h1>
        <BotForm />
      </div>
      <ul className="grid gap-5 pt-6 grid-cols-3 border-t">
        {bots.ok ? (
          bots.data.length > 0 ? (
            bots.data.map((bot) => <BotCard key={bot.id} bot={bot} />)
          ) : (
            <li className="col-span-full text-center text-gray-500">
              No bots in inventory yet — start by creating one.
            </li>
          )
        ) : (
          <li className="col-span-full text-red-500 text-center">
            {bots.message || "Failed to load bots."}
          </li>
        )}
      </ul>
    </main>
  );
}

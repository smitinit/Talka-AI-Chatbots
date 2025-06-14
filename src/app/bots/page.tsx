import { getBots } from "@/ManageBot/bot.actions";
import BotCard from "@/ManageBot/BotCard";
import BotForm from "@/ManageBot/BotForm";

export default async function ManageBots() {
  const bots = await getBots();

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Bot Management</h1>
        <p className="text-muted-foreground">Create and manage your AI bots</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <BotForm />
        {bots.ok ? (
          bots.data.length > 0 ? (
            bots.data.map((bot) => <BotCard bot={bot} key={bot.id} />)
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
      </div>
    </div>
  );
}

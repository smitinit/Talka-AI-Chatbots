import BotForm from "@/ManageBot/BotForm";
import { Modal } from "./modal";

export default async function AddBotForm() {
  return (
    <>
      <Modal>
        <BotForm />
      </Modal>
    </>
  );
}

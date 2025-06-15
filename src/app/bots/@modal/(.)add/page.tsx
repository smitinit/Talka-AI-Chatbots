import BotForm from "@/ManageBot/BotForm";
import { Modal } from "../../../../components/modal";

export default async function AddBotForm() {
  return (
    <>
      <Modal>
        <BotForm />
      </Modal>
    </>
  );
}

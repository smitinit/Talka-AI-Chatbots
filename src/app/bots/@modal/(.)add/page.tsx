import BotForm from "@/features/CreateBot/ManageForm";
import { Modal } from "@/components/modal";

export default async function AddBotForm() {
  return (
    <>
      <Modal>
        <BotForm />
      </Modal>
    </>
  );
}

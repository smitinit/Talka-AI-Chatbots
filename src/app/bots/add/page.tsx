import BotForm from "@/features/create/createForm";
import { Modal } from "@/components/modal";

// This is a static form page - no user-specific data needed on initial load
export const dynamic = "force-static";

export default function AddBotForm() {
  return (
    <Modal classname="sm:max-w-3xl w-[90%]">
      <BotForm />
    </Modal>
  );
}

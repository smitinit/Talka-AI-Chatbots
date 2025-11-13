import { Modal } from "@/components/modal";
import PreviewLayoutForm from "@/features/preview/previewFormLayout";

export default function Preview() {
  return (
    <Modal classname="sm:max-w-none w-[60%]  p-6">
      <PreviewLayoutForm />
    </Modal>
  );
}

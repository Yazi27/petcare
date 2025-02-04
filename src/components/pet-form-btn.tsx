import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function PetFormBtn({ actionType }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="mt-5 py-[22px] rounded-md"
    >
      {actionType === "add" ? "Add pet" : "Save changes"}
    </Button>
  );
}

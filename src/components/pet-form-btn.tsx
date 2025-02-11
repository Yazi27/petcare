import { Button } from "./ui/button";

type PetFormBtnProps = {
  actionType: "add" | "edit";
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  return (
    <Button type="submit" className="mt-5 py-[22px] rounded-md">
      {actionType === "add" ? "Add pet" : "Save changes"}
    </Button>
  );
}

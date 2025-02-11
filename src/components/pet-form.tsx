"use client";

import { usePetContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import PetFormBtn from "./pet-form-btn";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { handleAddPet, selectedPet, handleEditPet } = usePetContext();

  // This is not even used anymore because we are using action instead

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const formData = new FormData(e.currentTarget);

  //   const modifiedPet = {
  //     name: formData.get("name") as string, // As string because required attribute is set
  //     ownerName: formData.get("ownerName") as string,
  //     imageUrl: (formData.get("imageUrl") as string) || "/pet-placeholder.png",
  //     age: +(formData.get("age") as string), // Initially get as string, then convert to number
  //     notes: formData.get("notes") as string,
  //   };

  //   if (actionType === "add") {
  //     handleAddPet(modifiedPet);
  //   } else if (actionType === "edit") {
  //     handleEditPet(selectedPet!.id, modifiedPet);
  //   }
  // };

  return (
    <form
      action={async (formData) => {
        // We make our own object without the id

        const petData = {
          name: formData.get("name") as string,
          ownerName: formData.get("ownerName") as string,
          imageUrl:
            (formData.get("imageUrl") as string) || "/pet-placeholder.png", // Since it can be empty
          age: +(formData.get("age") as string),
          notes: formData.get("notes") as string,
        };

        onFormSubmission();

        if (actionType === "add") {
          await handleAddPet(petData);
        } else if (actionType === "edit") {
          await handleEditPet(selectedPet!.id, petData);
        }
      }}
      className="flex flex-col"
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoFocus
            defaultValue={actionType === "edit" ? selectedPet?.name : ""} // selected pet will never be undefined
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            name="ownerName"
            type="text"
            required
            defaultValue={
              actionType === "edit" ? selectedPet?.ownerName : "" // selected pet will never be undefined
            }
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="text"
            defaultValue={
              actionType === "edit" ? selectedPet?.imageUrl : "" // selected pet will never be undefined
            }
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            required
            defaultValue={
              actionType === "edit" ? selectedPet?.age : "" // selected pet will never be undefined
            }
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={4}
            required
            defaultValue={
              actionType === "edit" ? selectedPet?.notes : "" // selected pet will never be undefined
            }
          />
        </div>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}

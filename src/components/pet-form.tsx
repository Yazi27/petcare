"use client";

import { usePetContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import PetFormBtn from "./pet-form-btn";
import { useForm } from "react-hook-form";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

type TPetForm = {
  name: string;
  ownerName: string;
  imageUrl: string;
  age: string;
  notes: string;
};

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  // ++++++++++++++++++++++++++++++++ CONTEXT HOOK ++++++++++++++++++++++++++++++++ //

  const { handleAddPet, selectedPet, handleEditPet } = usePetContext();

  // ++++++++++++++++++++++++++++++++ FORM VALIDATION HOOK ++++++++++++++++++++++++++++++++ //

  const {
    register,
    formState: { errors },
  } = useForm<TPetForm>();

  // ++++++++++++++++++++++++++++++++ RENDER ++++++++++++++++++++++++++++++++ //
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
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input id="ownerName" {...register("ownerName")} />
          {errors.ownerName && (
            <p className="text-red-500">{errors.ownerName.message}</p>
          )}
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
          {errors.imageUrl && (
            <p className="text-red-500">{errors.imageUrl.message}</p>
          )}
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
          {errors.age && <p className="text-red-500">{errors.age.message}</p>}
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
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}

{
  {
    {
    }
  }
}

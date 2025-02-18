"use client";

import { usePetContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import PetFormBtn from "./pet-form-btn";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PET_IMAGE } from "@/lib/constants";
import { petFormSchema, TPetForm } from "@/lib/validations";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
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
    trigger,
    getValues,
    formState: { errors },
  } = useForm<TPetForm>({
    resolver: zodResolver(petFormSchema),
  });

  // ++++++++++++++++++++++++++++++++ RENDER ++++++++++++++++++++++++++++++++ //
  return (
    <form
      // raw formData, non validated
      action={async (formData) => {
        // We validate the data with the resolver
        const result = await trigger();
        if (!result) return;

        // The data we get here is still raw, we simply validated it, but we did not modify it
        // zod.transforms will not be applied to our raw data
        const petData = getValues();

        // So we have to manually do it ourselves or apply parse to it
        petData.imageUrl = petData.imageUrl || DEFAULT_PET_IMAGE;

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
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters long",
              },
            })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            {...register("ownerName", {
              maxLength: {
                value: 10,
                message: "Owner Name must be at most 10 characters long",
              },
            })}
          />
          {errors.ownerName && (
            <p className="text-red-500 text-sm">{errors.ownerName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input id="imageUrl" {...register("imageUrl")} />
          {errors.imageUrl && (
            <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input id="age" {...register("age")} />
          {errors.age && (
            <p className="text-red-500 text-sm">{errors.age.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...register("notes")} />
          {errors.notes && (
            <p className="text-red-500 text-sm">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}

"use client";

import { usePetContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import PetFormBtn from "./pet-form-btn";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

const petFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100),
  ownerName: z
    .string()
    .trim()
    .min(1, { message: "Owner Name is required" })
    .max(100),
  imageUrl: z.union([
    z.literal(""),
    z.string().trim().url({ message: "Image must be an URL" }),
  ]),
  age: z.coerce.number().int().positive().max(99999),
  notes: z.union([z.literal(""), z.string().trim().max(1000)]),
});

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
    formState: { errors },
  } = useForm<TPetForm>({
    resolver: zodResolver(petFormSchema),
  });

  // ++++++++++++++++++++++++++++++++ RENDER ++++++++++++++++++++++++++++++++ //
  return (
    <form
      action={async (formData) => {
        const result = await trigger();
        if (!result) return;

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

{
  {
    {
    }
  }
}

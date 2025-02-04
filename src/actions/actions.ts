"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addPet(formData) {
  await prisma.pet.create({
    data: {
      name: formData.get("name"),
      ownerName: formData.get("ownerName"),
      age: Number(formData.get("age")),
      imageUrl: formData.get("imageUrl" as string) || "/pet-placeholder.png",
      notes: formData.get("notes") as string,
    },
  });

  revalidatePath("/app", "layout");
}

"use server";

import { prisma } from "@/lib/db";

export async function addPet(formData) {
  await prisma.pet.create({
    data: {
      name: formData.get("name"),
      ownerName: formData.get("ownerName"),
      age: Number(formData.get("age")),
      imageUrl: formData.get("imageUrl"),
      notes: formData.get("notes") as string,
    },
  });
}

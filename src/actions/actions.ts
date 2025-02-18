"use server";

import { prisma } from "@/lib/db";
import { sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { PetEssentials } from "@/lib/types";
import { Pet } from "@prisma/client";
import { petFormSchema } from "@/lib/validations";

export async function addPet(pet: unknown) {
  await sleep(1000);

  console.log(pet);
  // We can use parse instead and wrap it in a try catch block
  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return { message: "Invalid pet data" };
  }

  try {
    await prisma.pet.create({
      data: validatedPet.data,
    });
  } catch (error) {
    return { message: "Could not add pet" };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: Pet["id"], newPet: PetEssentials) {
  await sleep(1000);
  try {
    await prisma.pet.update({
      where: { id: petId },
      data: newPet,
    });
  } catch (error) {
    return { message: "Could not edit pet" };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: Pet["id"]) {
  await sleep(1000);
  try {
    await prisma.pet.delete({ where: { id: petId } });
  } catch (error) {
    return { message: "Could not delete pet" };
  }

  revalidatePath("/app", "layout");
}

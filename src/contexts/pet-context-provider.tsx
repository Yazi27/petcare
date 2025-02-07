"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { TPetData } from "@/lib/types";
import { revalidatePath } from "next/cache";
import React, { createContext, useOptimistic, useState } from "react";
import { toast } from "sonner";

type TPetContext = {
  pets: TPetData[];
  selectedPetId: string | null;
  selectedPet: TPetData | undefined;
  numberOfPets: number;
  handleCheckoutPet: (id: string) => Promise<void>;
  handleAddPet: (newPet: Omit<TPetData, "id">) => Promise<void>;
  handleEditPet: (
    petId: string,
    newPetData: Omit<TPetData, "id">
  ) => Promise<void>;
  handleChangeSelectPetId: (id: string) => void;
};

type PetContextProviderProps = {
  children: React.ReactNode;
  data: TPetData[];
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
  children,
  data,
}: PetContextProviderProps) {
  // State ---------------------------------------------------------------------

  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    // We destructure immediately the action and payload to avoid having to type the object
    (state, { action, payload }) => {
      switch (action) {
        case "add":
          return [...state, { ...payload, id: Math.random().toString() }];
        case "edit":
          return state.map((pet) =>
            pet.id === payload.id ? { ...pet, ...payload } : pet
          );
        case "delete":
          return state.filter((pet) => pet.id !== payload);
        default:
          return state;
      }
    }
  );

  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // Derived state ------------------------------------------------------------

  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  // Event handlers -----------------------------------------------------------

  const handleAddPet = async (newPet: Omit<TPetData, "id">) => {
    setOptimisticPets({
      action: "add",
      payload: newPet,
    });
    const error = await addPet(newPet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  // We don't need the id on the TPetData object, so we omit it
  const handleEditPet = async (
    petId: string,
    newPetData: Omit<TPetData, "id">
  ) => {
    setOptimisticPets({
      action: "edit",
      payload: { id: petId, ...newPetData },
    });
    const error = await editPet(petId, newPetData);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleCheckoutPet = async (petId: string | null) => {
    setOptimisticPets({
      action: "delete",
      payload: petId,
    });
    await deletePet(petId);
    setSelectedPetId(null);
  };

  const handleChangeSelectPetId = (id: string) => {
    setSelectedPetId(id);
  };

  // --------------------------------------------------------------------------

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets, // Rename it since typescript its called pets
        selectedPetId,
        handleChangeSelectPetId,
        selectedPet,
        numberOfPets,
        handleCheckoutPet,
        handleAddPet,
        handleEditPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}

"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { PetEssentials } from "@/lib/types";
import { Pet } from "@prisma/client";
import React, { createContext, useOptimistic, useState } from "react";
import { toast } from "sonner";

type TPetContext = {
  pets: Pet[];
  selectedPetId: Pet["id"] | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleCheckoutPet: (id: Pet["id"]) => Promise<void>;
  handleAddPet: (newPet: PetEssentials) => Promise<void>;
  handleEditPet: (petId: Pet["id"], newPetData: PetEssentials) => Promise<void>;
  handleChangeSelectPetId: (id: Pet["id"]) => void;
};

type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
  children,
  data,
}: PetContextProviderProps) {
  console.log("rendering");
  // State ---------------------------------------------------------------------

  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    // We destructure immediately the action and payload to avoid having to type the object
    (state, { action, payload }) => {
      console.log("Rendering optimisticPets");
      switch (action) {
        case "add":
          const newPet = { ...payload, id: Date.now().toString() };
          console.log(newPet);
          return [...state, newPet];
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
  console.log(selectedPetId);

  // Derived state ------------------------------------------------------------

  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  if (selectedPet) {
    console.log("Pet found:", selectedPet);
  } else {
    console.log("Pet not found");
  }
  const numberOfPets = optimisticPets.length;

  // Event handlers -----------------------------------------------------------

  const handleAddPet = async (newPet: PetEssentials) => {
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

  const handleEditPet = async (petId: Pet["id"], newPetData: PetEssentials) => {
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

  const handleCheckoutPet = async (petId: Pet["id"]) => {
    setOptimisticPets({
      action: "delete",
      payload: petId,
    });
    const error = await deletePet(petId);
    if (error) {
      toast.warning(error.message);
      return;
    }
    setSelectedPetId(null);
  };

  const handleChangeSelectPetId = (id: Pet["id"]) => {
    console.log("Selected pet id:", id);
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

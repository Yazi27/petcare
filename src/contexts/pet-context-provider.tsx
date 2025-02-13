"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { PetEssentials } from "@/lib/types";
import { Pet } from "@prisma/client";
import React, { createContext, useOptimistic, useState } from "react";
import { toast } from "sonner";

type TPetContext = {
  pets: PetState[];
  selectedPetId: Pet["id"] | null;
  selectedPet: Pet | OptimisticPet | undefined;
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

// ++++++++++++++++++++++++++++++++ ACTION TYPE REQUIREMENTS ++++++++++++++++++++++++++++++++ //

type AddAction = {
  action: "add";
  payload: PetEssentials;
  id: string;
};

type EditAction = {
  action: "edit";
  payload: PetEssentials & { id: string };
};

type DeleteAction = {
  action: "delete";
  payload: string;
};

type OptimisticAction = AddAction | EditAction | DeleteAction;

// ++++++++++++++++++++++++++++++++ DEFINE OPTIMISTIC STATE ++++++++++++++++++++++++++++++++ //

type OptimisticPet = PetEssentials & { id: string };

type PetState = Pet | OptimisticPet;

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
  children,
  data,
}: PetContextProviderProps) {
  // ++++++++++++++++++++++++++++++++ OPTIMISTIC STATE ++++++++++++++++++++++++++++++++ //

  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,

    // ++++++++++++++++++++++++++++++++ REDUCER ++++++++++++++++++++++++++++++++ //

    /**
     * @brief Optimistic reducer for pets, id is required so that the reducer is pure and id stays stable upon rerenders
     * @param state Contains server data (Pet[]) and optimistic data (OptimisticPet[])
     * @param action Can be "add", "edit" or "delete", id is only required for "add"
     * @returns New state
     */
    (state: PetState[], action: OptimisticAction) => {
      switch (action.action) {
        case "add": {
          const newPet = { ...action.payload, id: action.id };
          return [...state, newPet];
        }
        case "edit":
          return state.map((pet) =>
            pet.id === action.payload.id ? { ...pet, ...action.payload } : pet
          );
        case "delete":
          return state.filter((pet) => pet.id !== action.payload);
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
      id: Date.now().toString(),
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

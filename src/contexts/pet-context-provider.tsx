"use client";

import { TPetData } from "@/lib/types";
import React, { createContext, useState } from "react";

type TPetContext = {
  pets: TPetData[];
  selectedPetId: string | null;
  handleChangeSelectPetId: (id: string) => void;
  selectedPet: TPetData | undefined;
  numberOfPets: number;
  handleCheckoutPet: (id: string) => void;
  handleAddPet: (newPet: Omit<TPetData, "id">) => void;
  handleEditPet: (petId: string, newPetData: Omit<TPetData, "id">) => void;
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
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  const handleAddPet = (newPet: Omit<TPetData, "id">) => {
    setPets((prev) => [
      ...prev,
      {
        ...newPet,
        id: Date.now().toString(),
      },
    ]);
  };

  // We don't need the id on the TPetData object, so we omit it
  const handleEditPet = (petId: string, newPetData: Omit<TPetData, "id">) => {
    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id === petId) {
          return {
            id: petId,
            ...newPetData,
          };
        }
        return pet;
      })
    );
  };

  const handleChangeSelectPetId = (id: string) => {
    setSelectedPetId(id);
  };

  const handleCheckoutPet = (id: string | null) => {
    setPets((prev) => prev.filter((pet) => pet.id !== id));
    setSelectedPetId(null);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
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

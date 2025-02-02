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

  const handleAddPet = (newPet: TPetData) => {
    setPets((prev) => [...prev, newPet]);
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
      }}
    >
      {children}
    </PetContext.Provider>
  );
}

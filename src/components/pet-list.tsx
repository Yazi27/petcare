"use client";

import { usePetContext } from "@/lib/hooks";
import { TPetData } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export default function PetList() {
  const { pets, handleChangeSelectPetId, selectedPetId } = usePetContext();

  console.log(pets);
  return (
    <ul className="bg-white border-b border-black/[0.08]">
      <li>
        {pets.map((pet) => (
          <button
            onClick={() => handleChangeSelectPetId(pet.id)}
            key={pet.id}
            className={cn(
              "flex h-[70px] w-full items-center px-5 text-base gap-3 cursor-pointer hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition",
              {
                "bg-[#EFF1F2]": selectedPetId === pet.id,
              }
            )}
          >
            <Image
              src={pet.imageUrl}
              alt="Pet image"
              width={45}
              height={45}
              className="w-[45px] h-[45px] rounded-full object-cover"
            />
            <p className="font-semibold">{pet.name}</p>
          </button>
        ))}
      </li>
    </ul>
  );
}

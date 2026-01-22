"use client";

import { useEffect, useState } from "react";
import { POKEMON_GEN_1_DATA, LangKey } from "@/lib/pokemon-constants";
import Image from "next/image";
import { cn } from "@/lib/util";
import { LanguageSelector } from "./LanguageSelector";

const LANGUAGE_OPTIONS: { value: LangKey; label: string }[] = [
  { value: "name_jp", label: "日本語" },
  { value: "name_en", label: "English" },
  { value: "name_fr", label: "Français" },
  { value: "name_es", label: "Español" },
  { value: "name_de", label: "Deutsch" },
  { value: "name_ita", label: "Italiano" },
  { value: "name_kr", label: "한국어" },
  { value: "name_sc", label: "简体中文" },
  { value: "name_tc", label: "繁體中文" },
  { value: "name_hk", label: "粤语" },
];

type PokedexState = Record<string, boolean>;

export default function PokedexTracker() {
  const [currentLanguage, setCurrentLanguage] = useState<LangKey>("name_en");
  const [pokedexState, setPokedexState] = useState<PokedexState>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedPokedexState = localStorage.getItem("pokedex_state");
    const savedPokedexLanguage = localStorage.getItem("pokedex_language");

    if (savedPokedexState) {
      try {
        setPokedexState(JSON.parse(savedPokedexState));
      } catch (e) {
        console.error("Failed to parse pokedex state", e);
        setPokedexState({});
        localStorage.setItem("pokedex_state", JSON.stringify({}));
      }
    }

    if (savedPokedexLanguage) {
      try {
        setCurrentLanguage(savedPokedexLanguage as LangKey);
      } catch (e) {
        console.error("Failed to parse pokedex language", e);
        setCurrentLanguage("name_en" as LangKey);
        localStorage.setItem("pokedex_language", "name_en" as LangKey);
      }
    }

    setIsLoading(false);
  }, []);

  function togglePokedexEntry(key: string) {
    const newState = {
      ...pokedexState,
      [key]: !pokedexState[key],
    };

    setPokedexState(newState);

    localStorage.setItem("pokedex_state", JSON.stringify(newState));
  }

  function setCurrentLanguageAndSave(currentLanguage: LangKey) {
    setCurrentLanguage(currentLanguage);
    localStorage.setItem("pokedex_language", currentLanguage);
  }

  function resetPokedex() {
    setPokedexState({});
    localStorage.setItem("pokedex_state", JSON.stringify({}));
  }

  if (isLoading) {
    return (
      <section>
        <div className="p-10 text-center">Loading...</div>;
      </section>
    );
  }

  return (
    <section>
      {/* Tracker Controls */}
      <div className="flex flex-wrap gap-x-12 mb-6">
        <LanguageSelector
          currentLanguage={currentLanguage}
          LANGUAGE_OPTIONS={LANGUAGE_OPTIONS}
          setCurrentLanguage={setCurrentLanguageAndSave}
        />
        <button
          onClick={resetPokedex}
          className="inline-block bg-primary text-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50"
        >
          Reset
        </button>
      </div>

      {/* Actual Tracker */}
      <div className="grid grid-cols-[repeat(auto-fit,100px)] justify-center gap-1">
        {Object.keys(POKEMON_GEN_1_DATA).map((id) => (
          <div key={id} className="flex justify-center">
            <button
              className={cn(
                "border-gray-400 border-2 rounded-md transition-colors transition-300",
                pokedexState[id] ? "bg-primary" : "bg-card",
              )}
              onClick={() => {
                togglePokedexEntry(id);
              }}
            >
              <Image
                src={
                  "sprites/pokemon/versions/generation-i/red-blue/transparent/" +
                  id +
                  ".png"
                }
                width={100}
                height={100}
                alt={POKEMON_GEN_1_DATA[id]?.[currentLanguage]}
              />
              <p className="mt-[-7] pb-2 font-semibold">
                {POKEMON_GEN_1_DATA[id]?.[currentLanguage]}
              </p>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

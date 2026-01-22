import { LangKey, TranslationItem } from "@/lib/pokemon-constants";
import { Dispatch, SetStateAction } from "react";

interface LanguageSelectorProps {
  currentLanguage: string;
  LANGUAGE_OPTIONS: { value: LangKey; label: string }[];
  setCurrentLanguage:
    | Dispatch<SetStateAction<keyof TranslationItem>>
    | ((currentLanguage: LangKey) => void)
    | (() => void);
}

export function LanguageSelector({
  currentLanguage,
  LANGUAGE_OPTIONS,
  setCurrentLanguage,
}: LanguageSelectorProps) {
  return (
    <div className="grid grid-cols-2 w-fit">
      <label htmlFor="lang-select" className="text-md font-semibold mt-1">
        Language:
      </label>
      <select
        id="lang-select"
        value={currentLanguage}
        onChange={(e) => setCurrentLanguage(e.target.value as LangKey)}
        className="p-2 rounded-md w-fit bg-foreground text-black"
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

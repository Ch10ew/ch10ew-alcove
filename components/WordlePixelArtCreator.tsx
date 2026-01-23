"use client";

import { cn } from "@/lib/util";
import { checkWordExists, TrieNode } from "@/lib/wordle";
import { TRIE } from "@/lib/wordle-constants";
import { useState } from "react";

type Grid = [
  [number, number, number, number, number],
  [number, number, number, number, number],
  [number, number, number, number, number],
  [number, number, number, number, number],
  [number, number, number, number, number],
  [number, number, number, number, number],
];

type GridAnswers = [
  [string, string, string, string, string],
  [string, string, string, string, string],
  [string, string, string, string, string],
  [string, string, string, string, string],
  [string, string, string, string, string],
  [string, string, string, string, string],
];

export default function WordlePixelArtCreator() {
  const [grid, setGrid] = useState<Grid>([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
  const [gridAnswers, setGridAnswers] = useState<GridAnswers>([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);
  const [allGridAnswers, setAllGridAnswers] = useState<string[][]>([]);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function resetGrid() {
    setGrid([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);

    setGridAnswers([
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ]);
  }

  function handleSubmitInput() {
    // Sanitize input
    const input = inputValue.toLowerCase();
    if (input.split("").length !== 5) {
      setErrorMessage("ERROR: Word is not 5 characters long!");
      return;
    }
    if (!input.match(/[a-z]{5}/)) {
      setErrorMessage("ERROR: Not a valid word!");
      return;
    }
    if (!checkWordExists(TRIE, input)) {
      setErrorMessage("ERROR: Word does not exist in Wordle wordlist!");
      return;
    }

    // Sanitize grid
    let lastFilledRowIndex = 5;
    let alreadyFilledRow: boolean = false;
    for (let i = 0; i < grid.length; ++i) {
      const rowTotal = grid[i].reduce((lhs, rhs) => lhs + rhs);
      if (alreadyFilledRow && rowTotal > 0) {
        setErrorMessage("ERROR: Grid is invalid!");
        return;
      } else if (rowTotal === 10) {
        alreadyFilledRow = true;
        lastFilledRowIndex = i;
      }
    }

    // Find words
    const wordSet = new Set<string>(input.split(""));
    const answers: string[][] = [];

    for (let gridIndex = 0; gridIndex < grid.length; ++gridIndex) {
      const rowFeedback = grid[gridIndex];

      const possibleCharset: Set<string>[] = [
        new Set(),
        new Set(),
        new Set(),
        new Set(),
        new Set(),
      ];

      // Build up possibleCharset
      for (let charIndex = 0; charIndex < 5; ++charIndex) {
        const status = rowFeedback[charIndex];
        if (status === 2) {
          // Green: Add only the current char
          possibleCharset[charIndex].add(input[charIndex]);
        } else if (status === 1) {
          // Yellow: Add all chars in the word, except current char
          wordSet.forEach((char) => {
            if (char !== input[charIndex]) possibleCharset[charIndex].add(char);
          });
        } else {
          // Gray: Add all alphabets, except all chars in the word
          const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
          alphabet.forEach((alpha) => {
            if (!wordSet.has(alpha)) possibleCharset[charIndex].add(alpha);
          });
        }
      }

      // DFS to find all valid words in the Trie
      const foundWords: string[] = [];

      const dfs = (node: TrieNode, currentWord: string, index: number) => {
        // Base case: We've reached 5 characters
        if (index === 5) {
          if (node.isEnd) {
            foundWords.push(currentWord);
          }
          return;
        }

        // Optimization: Only iterate over characters allowed at this position
        // that ALSO exist in the current branch of the Trie
        for (const char of possibleCharset[index]) {
          if (node[char] && typeof node[char] === "object") {
            dfs(node[char] as TrieNode, currentWord + char, index + 1);
          }
        }
      };

      // Start DFS from the root of the TRIE
      dfs(TRIE, "", 0);

      answers.push(foundWords);
    }

    // Check if there are any empty answer sets
    const firstEmptyIndex = answers.findIndex((row) => row.length === 0);

    if (firstEmptyIndex !== -1) {
      setErrorMessage(
        `ERROR: No valid words found for row ${firstEmptyIndex + 1}`,
      );
    }

    // Update vars and UI
    setAllGridAnswers(answers);
    const newGridAnswers: GridAnswers = gridAnswers.slice() as GridAnswers;
    for (let i = 0; i < 6; ++i) {
      if (i < lastFilledRowIndex + 1) {
        newGridAnswers[i] = [
          answers[i][0][0],
          answers[i][0][1],
          answers[i][0][2],
          answers[i][0][3],
          answers[i][0][4],
        ];
      } else {
        newGridAnswers[i] = ["", "", "", "", ""];
      }
    }
    setGridAnswers(newGridAnswers);

    // Clear error messages (if we reach here it means it succeeded)
    setErrorMessage("");
  }

  function cycleGridAt(x: number, y: number) {
    const newGrid: Grid = grid.slice() as Grid;
    newGrid[x][y] = ++newGrid[x][y] % 3;
    setGrid(newGrid);
  }

  return (
    <div className="container mx-auto">
      {/* Word Input */}
      <div className="w-auto h-auto">
        <label className="mr-4 font-bold">Today&apos;s Answer:</label>
        <input
          id="word"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border-1 rounded-md border-primary mr-4"
        />
      </div>

      {/* Grid Space */}
      <div className="mt-8 mb-2">
        <button
          onClick={resetGrid}
          className={cn(
            "mb-2 inline-block bg-primary text-foreground",
            "px-4 py-2 rounded hover:bg-primary/90 transition-colors",
            "duration-300 disabled:opacity-50",
          )}
        >
          Reset Grid
        </button>
        {grid.map((row: [number, number, number, number, number], rowIndex) => (
          <div key={rowIndex} className="border-0 m-0 p-0 h-15">
            {row.map((item: number, columnIndex) => (
              <button
                key={columnIndex}
                onClick={() => {
                  cycleGridAt(rowIndex, columnIndex);
                }}
                className={cn(
                  "border-gray-400 font-extrabold text-2xl",
                  "text-shadow-sm text-shadow-neutral-500",
                  "size-15 border-2 rounded-md",
                  "transition-colors transition-300",
                  item === 0
                    ? "bg-card"
                    : item === 1
                      ? "bg-amber-300"
                      : "bg-green-300",
                )}
              >
                {gridAnswers[rowIndex][columnIndex].toUpperCase()}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <p className="mt-0 mb-2 pt-0 pb-0 h-7">{errorMessage}</p>
      <button
        onClick={handleSubmitInput}
        className={cn(
          "inline-block bg-primary text-foreground",
          "px-4 py-2 rounded hover:bg-primary/90 transition-colors",
          "duration-300 disabled:opacity-50",
        )}
      >
        Submit
      </button>
    </div>
  );
}

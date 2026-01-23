export type TrieNode = {
  [key: string]: TrieNode | boolean | undefined;
  isEnd?: boolean;
};

/**
 * Checks if a word exists in the JSON Trie
 * @param trie The root object of the Trie
 * @param word The string to search for
 */
export function checkWordExists(trie: TrieNode, word: string): boolean {
  let currentNode = trie;

  for (const char of word) {
    if (currentNode[char] && typeof currentNode[char] === "object") {
      currentNode = currentNode[char] as TrieNode;
    } else {
      return false;
    }
  }

  return currentNode.isEnd === true;
}

import refs from "./verse-refs.json";

export interface VerseRefs {
  hint: string;
  key: string;
}

/**
 * One hint verse and one key verse per question, in English reference form.
 * The fetch script requests both the CUV and WEB text from getbible.net.
 */
export const VERSE_REFS = refs as Record<string, VerseRefs>;

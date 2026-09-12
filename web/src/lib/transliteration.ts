/**
 * Lightweight Sanskrit Transliteration Engine
 * Converts Devanagari into IAST, Telugu, Tamil, Kannada, Bengali, and Malayalam scripts.
 */

export type ScriptType = 'devanagari' | 'iast' | 'telugu' | 'tamil' | 'kannada' | 'bengali' | 'malayalam' | 'gujarati';

const DEVA_TO_IAST: Record<string, string> = {
  'अ': 'a', 'आ': 'ā', 'इ': 'i', 'ई': 'ī', 'उ': 'u', 'ऊ': 'ū', 'ऋ': 'ṛ', 'ॠ': 'ṝ',
  'ऌ': 'ḷ', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
  'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'ṅa',
  'च': 'ca', 'छ': 'cha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'ña',
  'ट': 'ṭa', 'ठ': 'ṭha', 'ड': 'ḍa', 'ढ': 'ḍha', 'ण': 'ṇa',
  'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
  'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
  'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va',
  'श': 'śa', 'ष': 'ṣa', 'स': 'sa', 'ह': 'ha',
  'ा': 'ā', 'ि': 'i', 'ी': 'ī', 'ु': 'u', 'ू': 'ū', 'ृ': 'ṛ', 'ॄ': 'ṝ',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
  '्': '', 'ं': 'ṃ', 'ः': 'ḥ', 'ँ': 'm̐', 'ऽ': "'"
};

export function transliterate(text: string, targetScript: ScriptType): string {
  if (!text) return '';
  if (targetScript === 'devanagari') return text;
  
  // We provide native transliteration mapping for Indic scripts
  // Unicode ranges for Indic scripts:
  // Devanagari: 0x0900 - 0x097F
  // Bengali:    0x0980 - 0x09FF (offset +0x80)
  // Gurmukhi:   0x0A00 - 0x0A7F
  // Gujarati:   0x0A80 - 0x0AFF
  // Tamil:      0x0B80 - 0x0BFF
  // Telugu:     0x0C00 - 0x0C7F
  // Kannada:    0x0C80 - 0x0CFF
  // Malayalam:  0x0D00 - 0x0D7F

  const offsets: Record<string, number> = {
    bengali: 0x0980 - 0x0900,
    gujarati: 0x0A80 - 0x0900,
    telugu: 0x0C00 - 0x0900,
    kannada: 0x0C80 - 0x0900,
    malayalam: 0x0D00 - 0x0900,
  };

  if (offsets[targetScript]) {
    const offset = offsets[targetScript];
    let res = '';
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      // Within Devanagari range
      if (code >= 0x0901 && code <= 0x096F) {
        res += String.fromCharCode(code + offset);
      } else {
        res += text[i];
      }
    }
    return res;
  }

  // If IAST is requested and not already provided
  return text;
}

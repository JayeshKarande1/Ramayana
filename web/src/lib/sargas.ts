import fs from 'fs';
import path from 'path';

/**
 * Robust resolution of the sargas data directory whether Next.js is run
 * from the repository root (e.g. RamayanaGemini) or the web workspace directory (RamayanaGemini/web).
 */
export function getSargasDirectory(): string {
  const candidates = [
    path.join(process.cwd(), 'src', 'data', 'sargas'),
    path.join(process.cwd(), 'web', 'src', 'data', 'sargas'),
    path.join(__dirname, '..', 'data', 'sargas'),
    path.join(__dirname, '..', '..', 'src', 'data', 'sargas'),
  ];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    } catch {}
  }
  return path.join(process.cwd(), 'src', 'data', 'sargas');
}

/**
 * Efficiently reads totalShlokas from a sarga JSON file without loading the entire JSON tree.
 */
export function getSargaShlokaCount(filePath: string): number {
  try {
    if (!fs.existsSync(filePath)) return 0;
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(/"totalShlokas"\s*:\s*(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
    const data = JSON.parse(content);
    return data.totalShlokas || data.shlokas?.length || 0;
  } catch {
    return 0;
  }
}

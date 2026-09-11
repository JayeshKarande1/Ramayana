import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

let dbInstance: any = null;

function getDb() {
  if (!dbInstance) {
    try {
      const { DatabaseSync } = eval('require')('node:sqlite');
      
      const candidatePaths = [
        path.join(process.cwd(), '..', 'data', 'ramayana.db'),
        path.join(process.cwd(), 'data', 'ramayana.db'),
        path.join(process.cwd(), 'src', 'data', 'ramayana.db'),
      ];

      const dbPath = candidatePaths.find(p => fs.existsSync(p));
      if (!dbPath) {
        console.warn('Could not find ramayana.db in candidate paths:', candidatePaths);
        return null;
      }

      dbInstance = new DatabaseSync(dbPath, { readOnly: true });
    } catch (e) {
      console.warn('node:sqlite initialization error:', e);
      return null;
    }
  }
  return dbInstance;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();
  const kanda = searchParams.get('kanda')?.trim();
  const limit = Math.min(parseInt(searchParams.get('limit') || '30', 10), 100);

  if (!query) {
    return NextResponse.json({ results: [], total: 0 });
  }

  try {
    const db = getDb();
    if (!db) {
      return NextResponse.json({ results: [], total: 0, error: 'Search database unavailable' });
    }
    
    // Clean search string for FTS5 syntax
    const sanitizedQuery = query
      .replace(/['"*^~]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .map(term => `"${term}"*`)
      .join(' ');

    if (!sanitizedQuery) {
      return NextResponse.json({ results: [], total: 0 });
    }

    let sql = `
      SELECT 
        shloka_id,
        verse_code,
        kanda_id,
        sarga_number,
        shloka_number,
        snippet(shlokas_fts, 5, '<mark class="bg-amber-500/30 text-amber-200 px-1 rounded">', '</mark>', '...', 25) as sanskrit_snippet,
        snippet(shlokas_fts, 8, '<mark class="bg-amber-500/30 text-amber-200 px-1 rounded">', '</mark>', '...', 25) as meaning_snippet,
        sanskrit,
        transliteration,
        meaning
      FROM shlokas_fts
      WHERE shlokas_fts MATCH ?
    `;
    const params: any[] = [sanitizedQuery];

    if (kanda) {
      sql += ` AND kanda_id = ?`;
      params.push(kanda);
    }

    sql += ` ORDER BY rank LIMIT ?`;
    params.push(limit);

    const stmt = db.prepare(sql);
    const rows = stmt.all(...params);

    return NextResponse.json({
      results: rows,
      total: rows.length,
      query
    });
  } catch (err: any) {
    console.error('Search error:', err);
    return NextResponse.json({ error: 'Search failed', details: err.message }, { status: 500 });
  }
}

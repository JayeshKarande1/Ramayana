import React from 'react';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import kandasData from '@/data/kandas.json';
import SargaReader, { SargaData } from '@/components/SargaReader';
import { getSargasDirectory } from '@/lib/sargas';

interface Props {
  params: Promise<{ kanda: string; sarga: string }>;
}

export async function generateStaticParams() {
  const params: { kanda: string; sarga: string }[] = [];
  for (const kanda of kandasData) {
    for (let i = 1; i <= kanda.sargasCount; i++) {
      params.push({
        kanda: kanda.id,
        sarga: String(i),
      });
    }
  }
  return params;
}

export default async function SargaPage({ params }: Props) {
  const { kanda: kandaId, sarga: sargaStr } = await params;
  const sargaNum = parseInt(sargaStr, 10);

  const kanda = kandasData.find(k => k.id.toLowerCase() === kandaId.toLowerCase());
  if (!kanda || isNaN(sargaNum) || sargaNum < 1 || sargaNum > kanda.sargasCount) {
    notFound();
  }

  // Load sarga JSON file robustly
  const sargasDir = getSargasDirectory();
  const sargaFilePath = path.join(sargasDir, `${kanda.id}_${sargaNum}.json`);
  
  if (!fs.existsSync(sargaFilePath)) {
    notFound();
  }

  const sargaData: SargaData = JSON.parse(fs.readFileSync(sargaFilePath, 'utf-8'));

  return (
    <SargaReader 
      sargaData={sargaData} 
      totalSargasInKanda={kanda.sargasCount} 
    />
  );
}

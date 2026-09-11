import React from 'react';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import kandasData from '@/data/kandas.json';
import SargaReader, { SargaData } from '@/components/SargaReader';

interface Props {
  params: Promise<{ kanda: string; sarga: string }>;
}

export default async function SargaPage({ params }: Props) {
  const { kanda: kandaId, sarga: sargaStr } = await params;
  const sargaNum = parseInt(sargaStr, 10);

  const kanda = kandasData.find(k => k.id.toLowerCase() === kandaId.toLowerCase());
  if (!kanda || isNaN(sargaNum) || sargaNum < 1 || sargaNum > kanda.sargasCount) {
    notFound();
  }

  // Load sarga JSON file
  const sargaFilePath = path.join(process.cwd(), 'src', 'data', 'sargas', `${kanda.id}_${sargaNum}.json`);
  
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

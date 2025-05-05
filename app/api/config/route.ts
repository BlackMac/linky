import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { initializeConfig } from '@/app/utils/config';

export async function GET() {
  try {
    // Ensure config exists
    await initializeConfig();

    // Read the config file
    const filePath = join(process.cwd(), 'public', 'config', 'apps.json');
    const fileContent = await readFile(filePath, 'utf8');
    const config = JSON.parse(fileContent);

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error loading apps configuration:', error);
    return NextResponse.json({ apps: [] });
  }
}
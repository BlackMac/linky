import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

interface App {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
  url: string;
  iconBg: string;
}

interface AppsConfig {
  apps: App[];
}

export async function POST(request: Request) {
  try {
    const data = await request.json() as AppsConfig;
    
    // Validate the data structure
    if (!data.apps || !Array.isArray(data.apps)) {
      return NextResponse.json(
        { error: 'Invalid data structure' },
        { status: 400 }
      );
    }

    // Validate required fields for each app
    const isValid = data.apps.every((app: App) => 
      app.id && 
      app.title && 
      app.shortDescription && 
      app.longDescription && 
      app.icon && 
      app.url && 
      app.iconBg
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Write to the JSON file
    const filePath = join(process.cwd(), 'public', 'config', 'apps.json');
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving configuration:', error);
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    );
  }
}
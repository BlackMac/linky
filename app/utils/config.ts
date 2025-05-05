import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const defaultConfig = {
  apps: [
    {
      id: "docs",
      title: "Documentation",
      shortDescription: "Learn everything about Next.js",
      longDescription: "Comprehensive Next.js documentation covering all features, APIs, and concepts.",
      icon: "/file.svg",
      url: "https://nextjs.org/docs",
      iconBg: "primary"
    }
  ]
};

export async function initializeConfig() {
  // Ensure required directories exist
  const publicDir = join(process.cwd(), 'public');
  const configDir = join(publicDir, 'config');
  const uploadsDir = join(publicDir, 'uploads');

  const dirs = [configDir, uploadsDir];

  // Create directories if they don't exist
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
  }

  // Create default config file if it doesn't exist
  const configFile = join(configDir, 'apps.json');
  if (!existsSync(configFile)) {
    await writeFile(configFile, JSON.stringify(defaultConfig, null, 2), 'utf8');
  }
}
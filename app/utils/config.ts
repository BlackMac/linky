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
  const configDir = join(process.cwd(), 'public', 'config');
  const configFile = join(configDir, 'apps.json');

  // Create config directory if it doesn't exist
  if (!existsSync(configDir)) {
    await mkdir(configDir, { recursive: true });
  }

  // Create default config file if it doesn't exist
  if (!existsSync(configFile)) {
    await writeFile(configFile, JSON.stringify(defaultConfig, null, 2), 'utf8');
  }
}
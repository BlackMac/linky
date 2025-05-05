import Image from 'next/image';
import { InfoButton } from './components/InfoButton';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { initializeConfig } from './utils/config';

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

async function getApps(): Promise<AppsConfig> {
  try {
    // Ensure config exists
    await initializeConfig();

    // Read the config file
    const filePath = join(process.cwd(), 'public', 'config', 'apps.json');
    const fileContent = await readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error loading apps configuration:', error);
    // Return empty configuration
    return { apps: [] };
  }
}

// Make page dynamic to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const { apps } = await getApps();

  if (apps.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-8">
        <div className="card bg-base-100 p-6 text-center">
          <h2 className="text-lg font-semibold">No Apps Configured</h2>
          <p className="text-base-content/70">Visit the admin panel to add apps.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12">
        {apps.map((app: App) => (
          <div 
            key={app.id} 
            className="card bg-base-100 hover:bg-base-300 transition-all hover:scale-105 p-6"
          >
            <a
              href={app.url}
              className="flex flex-col items-center gap-3"
            >
              <div className={`w-16 h-16 flex items-center justify-center rounded-full bg-${app.iconBg} shadow-lg`}>
                <Image
                  src={app.icon}
                  alt={app.title}
                  width={32}
                  height={32}
                  className={`text-${app.iconBg}-content`}
                />
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-sm font-medium">{app.title}</span>
                  <InfoButton modalId={`${app.id}-modal`} />
                </div>
                <p className="text-xs text-base-content/70 mt-1">
                  {app.shortDescription}
                </p>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Modals */}
      {apps.map((app: App) => (
        <dialog 
          key={`${app.id}-modal`}
          id={`${app.id}-modal`} 
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg">{app.title}</h3>
            <p className="py-4">{app.longDescription}</p>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      ))}
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

const defaultApp: Omit<App, 'id'> = {
  title: '',
  shortDescription: '',
  longDescription: '',
  icon: '',
  url: '',
  iconBg: 'primary'
};

export default function AdminPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [jsonContent, setJsonContent] = useState('');
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const router = useRouter();

  useEffect(() => {
    fetchApps();
  }, []);

  async function fetchApps() {
    try {
      const response = await fetch('/config/apps.json');
      const data = await response.json() as AppsConfig;
      setApps(data.apps);
      setJsonContent(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error loading apps:', error);
    }
  }

  async function handleSave(newData: App[]) {
    try {
      const response = await fetch('/api/admin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apps: newData }),
      });

      if (response.ok) {
        alert('Settings saved successfully!');
        router.refresh();
      } else {
        alert('Error saving settings');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving settings');
    }
  }

  async function handleFileUpload(file: File, appId: string) {
    try {
      setUploading(appId);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        const appIndex = apps.findIndex(app => app.id === appId);
        if (appIndex !== -1) {
          updateApp(appIndex, 'icon', data.path);
        }
      } else {
        alert(data.error || 'Error uploading file');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Error uploading file');
    } finally {
      setUploading(null);
    }
  }

  function handleJsonSave() {
    try {
      const parsed = JSON.parse(jsonContent) as AppsConfig;
      handleSave(parsed.apps);
    } catch {
      alert('Invalid JSON format');
    }
  }

  function handleVisualSave() {
    handleSave(apps);
  }

  function updateApp(index: number, field: keyof App, value: string) {
    const newApps = [...apps];
    newApps[index] = { ...newApps[index], [field]: value };
    setApps(newApps);
  }

  function handleIconClick(appId: string) {
    const fileInput = fileInputRefs.current[appId];
    if (fileInput) {
      fileInput.click();
    }
  }

  function addNewApp() {
    const id = `app-${Date.now()}`;
    setApps([...apps, { ...defaultApp, id }]);
  }

  function removeApp(index: number) {
    const newApps = [...apps];
    newApps.splice(index, 1);
    setApps(newApps);
  }

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="join">
            <button 
              className={`btn join-item ${!isJsonMode ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setIsJsonMode(false)}
            >
              Visual Editor
            </button>
            <button 
              className={`btn join-item ${isJsonMode ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setIsJsonMode(true)}
            >
              JSON Editor
            </button>
          </div>
        </div>

        {isJsonMode ? (
          <div className="card bg-neutral text-neutral-content shadow-2xl">
            <div className="card-body p-0">
              <div className="flex justify-between items-center px-6 py-3 bg-neutral-focus border-b border-neutral-content/10">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-error"></div>
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                  </div>
                  <span className="font-mono text-sm ml-2 opacity-70">apps.json</span>
                </div>
                <button 
                  className="btn btn-sm btn-success" 
                  onClick={handleJsonSave}
                >
                  Save Changes
                </button>
              </div>
              <div className="relative min-h-[600px] bg-[#1e1e1e]">
                <textarea
                  value={jsonContent}
                  onChange={(e) => setJsonContent(e.target.value)}
                  className="w-full h-full min-h-[600px] p-6 text-sm resize-none focus:outline-none bg-transparent"
                  spellCheck={false}
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    tabSize: 2,
                    lineHeight: 1.6,
                    caretColor: '#fff',
                    color: '#d4d4d4',
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-8">
              {apps.map((app, index) => (
                <div key={app.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <fieldset className="fieldset">
                      <div className="flex justify-between items-center">
                        <legend className="fieldset-legend">App #{index + 1}</legend>
                        <button 
                          className="btn btn-sm btn-ghost text-error"
                          onClick={() => removeApp(index)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="label" htmlFor={`title-${app.id}`}>Title</label>
                          <input
                            id={`title-${app.id}`}
                            type="text"
                            className="input input-bordered w-full"
                            value={app.title}
                            onChange={(e) => updateApp(index, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="label">Icon</label>
                          <div className="flex gap-4 items-start">
                            <div 
                              className={`relative w-16 h-16 flex items-center justify-center rounded-lg cursor-pointer transition-all hover:opacity-80 bg-${app.iconBg}`}
                              onClick={() => handleIconClick(app.id)}
                            >
                              {app.icon ? (
                                <Image
                                  src={app.icon}
                                  alt={app.title}
                                  width={32}
                                  height={32}
                                  className={`text-${app.iconBg}-content`}
                                />
                              ) : (
                                <div className="text-3xl text-base-content/20">+</div>
                              )}
                              {uploading === app.id && (
                                <div className="absolute inset-0 bg-base-100/80 flex items-center justify-center">
                                  <span className="loading loading-spinner"></span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <input
                                type="text"
                                className="input input-bordered w-full text-sm mb-2"
                                value={app.icon}
                                onChange={(e) => updateApp(index, 'icon', e.target.value)}
                                placeholder="Icon path or URL"
                              />
                              <input
                                ref={(el) => {
                                  fileInputRefs.current[app.id] = el;
                                }}
                                type="file"
                                accept=".svg,.png"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(file, app.id);
                                }}
                              />
                              <p className="text-xs opacity-50">
                                Click the icon to upload SVG or PNG
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="label" htmlFor={`url-${app.id}`}>URL</label>
                          <input
                            id={`url-${app.id}`}
                            type="url"
                            className="input input-bordered w-full"
                            value={app.url}
                            onChange={(e) => updateApp(index, 'url', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="label" htmlFor={`iconBg-${app.id}`}>Icon Background</label>
                          <select
                            id={`iconBg-${app.id}`}
                            className="select select-bordered w-full"
                            value={app.iconBg}
                            onChange={(e) => updateApp(index, 'iconBg', e.target.value)}
                          >
                            <option value="primary">Primary</option>
                            <option value="secondary">Secondary</option>
                            <option value="accent">Accent</option>
                            <option value="neutral">Neutral</option>
                          </select>
                        </div>
                        <div className="col-span-full">
                          <label className="label" htmlFor={`shortDesc-${app.id}`}>Short Description</label>
                          <input
                            id={`shortDesc-${app.id}`}
                            type="text"
                            className="input input-bordered w-full"
                            value={app.shortDescription}
                            onChange={(e) => updateApp(index, 'shortDescription', e.target.value)}
                          />
                        </div>
                        <div className="col-span-full">
                          <label className="label" htmlFor={`longDesc-${app.id}`}>Long Description</label>
                          <textarea
                            id={`longDesc-${app.id}`}
                            className="textarea textarea-bordered w-full h-32"
                            value={app.longDescription}
                            onChange={(e) => updateApp(index, 'longDescription', e.target.value)}
                          />
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating Action Buttons */}
            <div className="fixed bottom-8 right-8 flex flex-col gap-4">
              <button 
                className="btn btn-circle btn-lg btn-primary shadow-lg" 
                onClick={addNewApp}
              >
                +
              </button>
              <button 
                className="btn btn-circle btn-lg btn-success shadow-lg" 
                onClick={handleVisualSave}
              >
                ✓
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
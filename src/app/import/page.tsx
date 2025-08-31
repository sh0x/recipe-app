'use client';
import { useState } from 'react';

export default function ImportPage(){
  const [file, setFile] = useState<File|null>(null);
  const [overwrite, setOverwrite] = useState(false);
  const [msg, setMsg] = useState('');

  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('overwrite', overwrite ? '1' : '0');
    const res = await fetch('/api/import', { method: 'POST', body: fd });
    const data = await res.json();
    setMsg(data.ok ? `Imported ${data.slug} v${data.version}` : (data.error || 'Error'));
  }

  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold">Import Recipe (.json or .mdx)</h2>
      <form onSubmit={onSubmit} className="card space-y-3">
        <input className="input" type="file" accept=".json,.mdx" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={overwrite} onChange={e=>setOverwrite(e.target.checked)} />
          Overwrite (reuse latest version number)
        </label>
        <button className="btn" type="submit">Import</button>
      </form>
      {msg ? <div className="text-sm text-gray-700">{msg}</div> : null}
    </main>
  );
}

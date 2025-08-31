import { NextRequest, NextResponse } from 'next/server';
import { parseJson, parseMdx, upsertVersioned } from '@/lib/import';

export async function POST(req: NextRequest){
  try {
    const form = await req.formData();
    const file = form.get('file');
    const overwrite = form.get('overwrite') === '1';
    if (!(file instanceof File)) return NextResponse.json({ ok:false, error: 'No file' }, { status: 400 });
    const name = file.name.toLowerCase();
    const text = await file.text();

    const doc = name.endsWith('.json') ? await parseJson(text)
              : name.endsWith('.mdx') ? await parseMdx(text)
              : null;
    if (!doc) return NextResponse.json({ ok:false, error: 'Unsupported file type' }, { status: 400 });

    const created = await upsertVersioned(doc, overwrite);
    return NextResponse.json({ ok:true, slug: created.slug, version: created.version });
  } catch (err: any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Import failed' }, { status: 500 });
  }
}

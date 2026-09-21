import React, { useState } from 'react';
import { ImagePlus, Loader2, Link as LinkIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { featuredImageSrc } from '../../lib/images';

interface ImageUploadFieldProps {
  value?: string;
  binaryData?: string | null;
  binaryMime?: string | null;
  onChange: (url: string) => void;
  onDatabaseImageChange?: (data: string | null, mime: string | null) => void;
  label?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ value = '', binaryData, binaryMime, onChange, onDatabaseImageChange, label = 'Image' }) => {
  const [uploading, setUploading] = useState<'storage' | 'database' | null>(null);
  const [error, setError] = useState('');
  const validate = (file?: File, maximumBytes = 5 * 1024 * 1024) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return false; }
    if (file.size > maximumBytes) { setError(`Images must be ${maximumBytes / 1024 / 1024} MB or smaller.`); return false; }
    return true;
  };
  const uploadToStorage = async (file?: File) => {
    if (!validate(file) || !file) return;
    if (!supabase) return setError('Supabase is not configured.');
    setUploading('storage'); setError('');
    const extension = file.name.split('.').pop() || 'jpg';
    const path = `website/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from('site-media').upload(path, file, { cacheControl: '3600', upsert: false });
    if (uploadError) setError(uploadError.message);
    else {
      onDatabaseImageChange?.(null, null);
      onChange(supabase.storage.from('site-media').getPublicUrl(path).data.publicUrl);
    }
    setUploading(null);
  };
  const uploadToDatabase = async (file?: File) => {
    if (!validate(file, 1 * 1024 * 1024) || !file) return;
    if (!onDatabaseImageChange) return setError('Database-image uploads are not enabled for this form.');
    setUploading('database'); setError('');
    const bytes = new Uint8Array(await file.arrayBuffer());
    let hex = '';
    for (const byte of bytes) hex += byte.toString(16).padStart(2, '0');
    onDatabaseImageChange(`\\x${hex}`, file.type || 'image/jpeg');
    setUploading(null);
  };
  return (
    <div className="min-w-0 space-y-2">
      <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
      <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <div className="relative min-w-0">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            inputMode="url"
            value={value}
            onChange={e => { onDatabaseImageChange?.(null, null); onChange(e.target.value); }}
            placeholder="Paste an image URL"
            className="w-full min-w-0 bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-sm sm:text-xs text-slate-900 focus:outline-none focus:border-red-500"
          />
        </div>
        <label className="inline-flex min-h-11 items-center justify-center gap-2 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-sm sm:text-xs font-bold text-slate-700 cursor-pointer">
          {uploading === 'storage' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4 text-red-600" />}
          {uploading === 'storage' ? 'Uploading…' : 'Upload to Storage'}
          <input type="file" accept="image/*" className="sr-only" disabled={Boolean(uploading)} onChange={e => uploadToStorage(e.target.files?.[0])} />
        </label>
        {onDatabaseImageChange && <label className="inline-flex min-h-11 items-center justify-center gap-2 px-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-sm sm:text-xs font-bold text-red-700 cursor-pointer">
          {uploading === 'database' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          {uploading === 'database' ? 'Encoding…' : 'Store in Database'}
          <input type="file" accept="image/*" className="sr-only" disabled={Boolean(uploading)} onChange={e => uploadToDatabase(e.target.files?.[0])} />
        </label>}
      </div>
      {onDatabaseImageChange && <p className="text-[11px] text-slate-500">Database image: up to 1 MB. Storage image: up to 5 MB.</p>}
      {error && <p className="text-[11px] text-red-600">{error}</p>}
      {featuredImageSrc({ featured_image: value, featured_image_data: binaryData, featured_image_mime: binaryMime }) && <img src={featuredImageSrc({ featured_image: value, featured_image_data: binaryData, featured_image_mime: binaryMime })} alt="Selected preview" className="h-24 sm:h-28 w-full object-cover rounded-xl border border-slate-200" />}
    </div>
  );
};

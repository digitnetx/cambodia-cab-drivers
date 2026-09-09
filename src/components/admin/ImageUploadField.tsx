import React, { useState } from 'react';
import { ImagePlus, Loader2, Link as LinkIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const ImageUploadField: React.FC<{ value?: string; onChange: (url: string) => void; label?: string }> = ({ value = '', onChange, label = 'Image' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const upload = async (file?: File) => {
    if (!file) return;
    if (!supabase) return setError('Supabase is not configured.');
    if (!file.type.startsWith('image/')) return setError('Please choose an image file.');
    if (file.size > 5 * 1024 * 1024) return setError('Images must be 5 MB or smaller.');
    setUploading(true); setError('');
    const extension = file.name.split('.').pop() || 'jpg';
    const path = `website/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from('site-media').upload(path, file, { cacheControl: '3600', upsert: false });
    if (uploadError) setError(uploadError.message);
    else onChange(supabase.storage.from('site-media').getPublicUrl(path).data.publicUrl);
    setUploading(false);
  };
  return <div className="space-y-2"><label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label><div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2"><div className="relative"><LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" /><input type="url" value={value} onChange={e => onChange(e.target.value)} placeholder="Paste an image URL" className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:outline-none focus:border-red-500" /></div><label className="inline-flex min-h-11 items-center justify-center gap-2 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer">{uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4 text-red-600" />} {uploading ? 'Uploading…' : 'Upload image'}<input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={e => upload(e.target.files?.[0])} /></label></div>{error && <p className="text-[11px] text-red-600">{error}</p>}{value && <img src={value} alt="Selected preview" className="h-24 w-full object-cover rounded-xl border border-slate-200" />}</div>;
};

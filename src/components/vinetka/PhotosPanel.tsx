import { useRef, useState } from "react";
import { Check, Crown, ImagePlus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAX_PHOTOS, useVinetka } from "@/lib/vinetka-store";

export function readFiles(files: File[]): Promise<{src: string; name: string}[]> {
 return Promise.all(files.filter(f => f.type.startsWith('image/')).map(file => new Promise<{src: string; name: string}>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve({src: String(reader.result), name: ''}); reader.onerror = reject; reader.readAsDataURL(file); })));
}

export function PhotosPanel() {
 const { pages, activePage, addPhotos, removePhoto, renamePhoto, setMain, select, selectedId } = useVinetka();
 const page = pages[activePage]; const total = pages.reduce((n,p) => n+p.photos.length,0);
 const inputRef = useRef<HTMLInputElement>(null); const [dragging,setDragging] = useState(false); const [loading,setLoading] = useState(false);
 const [pending,setPending] = useState<{src:string; caption:string}[] | null>(null);
 async function handleFiles(files: File[]) { if (!files.length) return; setLoading(true); try { const items = await readFiles(files); if (!items.length) { toast.error('Rasm fayli topilmadi'); return; } setPending(items.map(i => ({ src: i.src, caption: '' }))); } catch { toast.error('Rasmni o‘qib bo‘lmadi'); } finally { setLoading(false); } }
 function confirmPending() { if (!pending?.length) return; const items = pending.map(p => ({ src: p.src, name: p.caption.trim() })); const added = addPhotos(items); if (added) toast.success(`${added} ta rasm qo‘shildi`); else toast.error(`Ko‘pi bilan ${MAX_PHOTOS} ta rasm`); setPending(null); }
 return <aside className="flex min-w-0 flex-col border-b border-border bg-card lg:h-[calc(100vh-65px)] lg:w-48 lg:shrink-0 lg:border-r lg:border-b-0 xl:w-52">
   <div className="flex items-center justify-between border-b border-border px-5 py-5"><div><span className="text-[10px] font-bold uppercase text-primary">01 / Kutubxona</span><h2 className="font-display text-base font-semibold">Rasmlar</h2></div><span className="text-xs font-semibold text-muted-foreground">{total}/{MAX_PHOTOS}</span></div>
   <div className="space-y-4 p-4">
    <div onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);void handleFiles(Array.from(e.dataTransfer.files))}} className={`grid min-h-40 place-items-center border border-dashed p-4 text-center transition-colors ${dragging ? 'border-primary bg-accent' : 'border-border bg-secondary/50'}`}>
      <div><ImagePlus className="mx-auto mb-3 size-8 text-primary"/><p className="text-sm font-semibold">Rasmlarni shu yerga tashlang</p><p className="mt-1 text-xs text-muted-foreground">yoki fayllarni tanlang</p></div>
    </div>
    <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={e=>{void handleFiles(Array.from(e.target.files??[]));e.target.value='';}} />
    <Button onClick={()=>inputRef.current?.click()} disabled={loading || !!pending} className="w-full"><Upload />{loading ? 'Yuklanmoqda...' : 'Rasm yuklash'}</Button>
    {pending ? (
      <div className="space-y-2 border border-primary/40 bg-accent/60 p-3">
        <p className="text-xs font-semibold">Rasm tagidagi yozuvlarni yozing</p>
        {pending.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <img src={item.src} alt="" className="size-9 shrink-0 rounded object-cover" />
            <Input autoFocus={i===0} aria-label={`${i+1}-rasm yozuvi`} placeholder="Yozuv..." value={item.caption} onChange={e=>setPending(prev => prev ? prev.map((p,pi)=>pi===i?{...p,caption:e.target.value}:p):prev)} className="h-8 text-xs" />
          </div>
        ))}
        <div className="flex gap-2 pt-1">
          <Button size="sm" className="h-8 flex-1" onClick={confirmPending}><Check />Qo‘shish</Button>
          <Button size="sm" variant="ghost" className="h-8" onClick={()=>setPending(null)}><X />Bekor</Button>
        </div>
      </div>
    ) : null}
   </div>
   <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-5">
    {page?.photos.map(photo=><div key={photo.id} onClick={()=>select(photo.id)} className={`flex cursor-pointer items-center gap-2 border p-2 ${selectedId===photo.id?'border-primary bg-accent':'border-border bg-background'}`}>
      <img src={photo.src} alt="" className="size-11 shrink-0 object-cover" />
      <div className="min-w-0 flex-1"><Input aria-label="Rasm tagidagi yozuv" placeholder="Yozuv yozing..." value={photo.name} onClick={e=>e.stopPropagation()} onChange={e=>renamePhoto(photo.id,e.target.value)} className="h-7 border-0 px-1 text-xs shadow-none"/><div className="flex items-center"><Button variant="ghost" size="sm" className="h-6 px-1 text-[10px]" onClick={e=>{e.stopPropagation();setMain(photo.id)}}><Crown />{photo.isMain?'Bosh o‘quvchi':'Bosh qilib belgilash'}</Button></div></div>
      <Button variant="ghost" size="icon" className="size-7 shrink-0" title="Rasmni o‘chirish" aria-label="Rasmni o‘chirish" onClick={e=>{e.stopPropagation();removePhoto(photo.id)}}><Trash2 /></Button>
    </div>)}
   </div>
 </aside>;
}

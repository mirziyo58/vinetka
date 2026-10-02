import { useRef } from "react";
import { Grid3X3, Image as ImageIcon, Ruler, Type } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BACKGROUNDS, backgroundCss } from "@/lib/backgrounds";
import { CANVAS_H, CANVAS_W, useVinetka } from "@/lib/vinetka-store";
import { readFiles } from "./PhotosPanel";

export function BackgroundsPanel() {
 const { pages, activePage, setBackground, setCustomBackground, setPageField, setCanvasSize, autoArrange } = useVinetka();
 const page=pages[activePage]; const inputRef=useRef<HTMLInputElement>(null);
 if(!page) return null;
 return <aside className="min-w-0 border-t border-border bg-card lg:h-[calc(100vh-65px)] lg:w-52 lg:shrink-0 lg:overflow-y-auto lg:border-l lg:border-t-0 xl:w-56">
  <div className="border-b border-border px-5 py-5"><span className="text-[10px] font-bold uppercase text-primary">02 / Sozlamalar</span><h2 className="font-display text-base font-semibold">Dizayn</h2></div>
  <div className="space-y-6 p-5">
   <section className="space-y-3"><h3 className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground"><Type className="size-4"/> Matnlar</h3><div className="space-y-2"><Label htmlFor="page-title" className="text-xs">Sarlavha</Label><Input id="page-title" value={page.title} onChange={e=>setPageField('title',e.target.value)}/><Label htmlFor="page-subtitle" className="text-xs">Sinf nomi</Label><Input id="page-subtitle" value={page.subtitle} onChange={e=>setPageField('subtitle',e.target.value)}/></div></section>
   <section className="space-y-3 border-t border-border pt-5"><h3 className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground"><Ruler className="size-4"/> Sahifa o‘lchami</h3><div className="grid grid-cols-2 gap-2"><div><Label htmlFor="canvas-width" className="text-xs">Eni (px)</Label><Input id="canvas-width" type="number" min="600" max="3000" step="10" value={page.canvasWidth??CANVAS_W} onChange={e=>setCanvasSize(Number(e.target.value),page.canvasHeight??CANVAS_H)}/></div><div><Label htmlFor="canvas-height" className="text-xs">Bo‘yi (px)</Label><Input id="canvas-height" type="number" min="420" max="2400" step="10" value={page.canvasHeight??CANVAS_H} onChange={e=>setCanvasSize(page.canvasWidth??CANVAS_W,Number(e.target.value))}/></div></div><p className="text-xs text-muted-foreground">Har bir bet o‘lchamini alohida belgilang.</p></section>
   <section className="space-y-3 border-t border-border pt-5"><h3 className="text-xs font-bold uppercase text-muted-foreground">Fon tanlash</h3><div className="grid grid-cols-4 gap-2">{BACKGROUNDS.map(b=><Button key={b.id} variant="ghost" size="icon" aria-label={b.name} title={b.name} onClick={()=>setBackground(b.id)} className={`aspect-square h-auto w-full rounded-md border-2 p-0 ${page.backgroundId===b.id&&!page.customBackground?'border-primary':'border-border'}`} style={{background:backgroundCss(b)}} />)}</div>
    <input ref={inputRef} type="file" accept="image/*" hidden onChange={async e=>{const files=Array.from(e.target.files??[]);e.target.value='';try{const [item]=await readFiles(files);if(item){setCustomBackground(item.src);toast.success('Fon o‘zgartirildi')}}catch{toast.error('Fon yuklanmadi')}}}/>
    <Button variant="outline" className="w-full" onClick={()=>inputRef.current?.click()}><ImageIcon/> O‘z fonini yuklash</Button>
   </section>
   <section className="border-t border-border pt-5"><Button variant="secondary" className="w-full" onClick={autoArrange}><Grid3X3/> Avtomatik joylash</Button></section>
  </div>
 </aside>;
}

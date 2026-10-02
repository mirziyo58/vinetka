import { Download, FileDown, Plus, Save, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVinetka } from "@/lib/vinetka-store";

export function TopBar({ onSave, onExportPng, onExportPdf }: { onSave: () => void; onExportPng: () => void; onExportPdf: () => void }) {
  const { projectName, setProjectName, pages, activePage, setActivePage, addPage, removePage } = useVinetka();
  return <header className="sticky top-0 z-30 border-b border-border bg-card">
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:flex lg:flex-wrap lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground"><Sparkles className="size-5" /></div>
        <div className="min-w-0"><span className="block font-display text-sm font-bold leading-none">VINETKA <span className="text-primary">STUDIO</span></span><Input aria-label="Loyiha nomi" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="mt-1 h-6 max-w-48 border-0 bg-transparent px-0 text-xs shadow-none focus-visible:ring-0" /></div>
      </div>
      <div className="order-3 col-span-2 flex min-w-0 items-center gap-1 overflow-x-auto lg:order-none lg:col-span-1 lg:ml-5">
        {pages.map((page, i) => <div key={page.id} className="flex shrink-0 items-center"><Button variant={i === activePage ? 'default' : 'ghost'} size="sm" onClick={() => setActivePage(i)}>Bet {i + 1}</Button>{pages.length > 1 && i === activePage && <Button variant="ghost" size="icon" className="size-7" aria-label="Betni o‘chirish" title="Betni o‘chirish" onClick={() => removePage(i)}><X /></Button>}</div>)}
        <Button variant="ghost" size="sm" onClick={addPage}><Plus /> Bet</Button>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 lg:ml-auto">
        <Button variant="outline" size="sm" onClick={onSave} title="Saqlash"><Save /><span className="hidden sm:inline">Saqlash</span></Button>
        <Button variant="outline" size="sm" onClick={onExportPng} title="PNG yuklash"><Download /><span className="hidden sm:inline">PNG</span></Button>
        <Button variant="outline" size="sm" onClick={onExportPdf} title="PDF yuklash"><FileDown /><span className="hidden sm:inline">PDF</span></Button>
      </div>
    </div>
  </header>;
}

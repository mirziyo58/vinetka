import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Maximize, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CANVAS_H, CANVAS_W, useVinetka } from "@/lib/vinetka-store";

const PageStage = lazy(() => import("./PageStage"));

export function CanvasArea() {
  const pages = useVinetka((s) => s.pages);
  const activePage = useVinetka((s) => s.activePage);
  const page = pages[activePage];
  const width = page?.canvasWidth ?? CANVAS_W;
  const height = page?.canvasHeight ?? CANVAS_H;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState(1000);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setAvailableWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fit = Math.min(1, availableWidth / width);
  const scale = fit * zoom / 100;
  return (
    <main className="min-w-0 flex-1 bg-workspace">
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-5 py-3">
        <div className="min-w-0">
          <h1 className="font-display text-base font-semibold text-foreground">Ish maydoni</h1>
          <p className="text-xs text-muted-foreground">{width} × {height} px · {pages.length} bet</p>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-md border border-border bg-background p-1">
          <Button variant="ghost" size="icon" title="Kichraytirish" aria-label="Kichraytirish" onClick={() => setZoom((z) => Math.max(40, z - 10))}><Minus /></Button>
          <span className="w-12 text-center text-xs font-semibold tabular-nums">{zoom}%</span>
          <Button variant="ghost" size="icon" title="Kattalashtirish" aria-label="Kattalashtirish" onClick={() => setZoom((z) => Math.min(200, z + 10))}><Plus /></Button>
          <span className="mx-1 h-5 w-px bg-border" />
          <Button variant="ghost" size="icon" title="Ekranga moslash" aria-label="Ekranga moslash" onClick={() => setZoom(100)}><Maximize /></Button>
        </div>
      </div>
      <div className="overflow-auto p-4 sm:p-6 xl:p-8">
        <div ref={wrapRef} className="mx-auto w-full">
          <div className="mx-auto overflow-hidden shadow-canvas" style={{ width: width * scale, height: height * scale, maxWidth: 'none' }}>
            <Suspense fallback={<div className="h-full w-full animate-pulse bg-secondary" />}>
              {pages.map((item, i) => (
                <div key={item.id} style={{ display: i === activePage ? "block" : "none" }}>
                  <PageStage page={item} interactive={i === activePage} scale={scale} />
                </div>
              ))}
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}

import { stageRegistry } from "@/components/vinetka/stage-registry";
import { CANVAS_H, CANVAS_W, type Page } from "./vinetka-store";

function dataUrlFor(page: Page, pixelRatio: number) {
  const stage = stageRegistry.get(page.id);
  if (!stage) return null;
  const currentScale = stage.scaleX() || 1;
  const w = page.canvasWidth ?? CANVAS_W;
  const h = page.canvasHeight ?? CANVAS_H;
  // Brauzer chegarasidan oshmasdan eng yuqori sifat (max ~10000px tomon)
  const ratio = Math.min(pixelRatio, 10000 / Math.max(w, h));
  return stage.toDataURL({ pixelRatio: ratio / currentScale, mimeType: "image/png" });
}

export function exportPng(page: Page, projectName: string) {
  const url = dataUrlFor(page, 4);
  if (!url) throw new Error("Sahifa topilmadi");
  const a = document.createElement("a");
  a.href = url;
  a.download = `${projectName || "vinetka"}.png`;
  a.click();
}

export async function exportPdf(
  pages: Page[],
  projectName: string,
  onProgress: (percent: number) => void,
) {
  const { jsPDF } = await import("jspdf");
  const first = pages[0];
  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [first?.canvasWidth ?? CANVAS_W, first?.canvasHeight ?? CANVAS_H] });

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]!;
    const url = dataUrlFor(page, 4);
    if (url) {
      if (i > 0) pdf.addPage([page.canvasWidth ?? CANVAS_W, page.canvasHeight ?? CANVAS_H], "landscape");
      pdf.addImage(url, "PNG", 0, 0, page.canvasWidth ?? CANVAS_W, page.canvasHeight ?? CANVAS_H, undefined, "NONE");
    }
    onProgress(Math.round(((i + 1) / pages.length) * 90));
    await new Promise((r) => setTimeout(r, 120));
  }

  onProgress(100);
  pdf.save(`${projectName || "vinetka"}.pdf`);
}

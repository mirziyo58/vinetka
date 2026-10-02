import { useEffect, useState } from "react";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { toast, Toaster } from "sonner";
import { BackgroundsPanel } from "@/components/vinetka/BackgroundsPanel";
import { CanvasArea } from "@/components/vinetka/CanvasArea";
import { PhotosPanel } from "@/components/vinetka/PhotosPanel";
import { TopBar } from "@/components/vinetka/TopBar";
import { exportPdf, exportPng } from "@/lib/export-vinetka";
import { DRAFT_KEY, useVinetka } from "@/lib/vinetka-store";

export const Route = createFileRoute("/")({
 head: () => ({ meta: [
  { title: "Vinetka Studio — sinf vinetkangizni yarating" },
  { name: "description", content: "Rasmlarni joylashtiring, vinetka o‘lchamini moslang va tayyor ishni PNG yoki PDF shaklida yuklab oling." },
  { property: "og:title", content: "Vinetka Studio — sinf vinetkangizni yarating" },
  { property: "og:description", content: "Sinf vinetkasini o‘z didingizga moslab yarating va yuklab oling." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
 ]}), component: () => <ClientOnly fallback={<div className="min-h-screen bg-background"/>}><Editor /></ClientOnly>,
});

function Editor() {
 const { pages, activePage, projectName, loadDraft } = useVinetka();
 const [exporting,setExporting] = useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem(DRAFT_KEY);if(raw){const draft=JSON.parse(raw);if(Array.isArray(draft?.pages)&&draft.pages.length)loadDraft({projectName:draft.projectName??'Mening vinetkam',pages:draft.pages});}}catch{/* invalid draft */}},[loadDraft]);
 function save(silent=false){try{const {projectName:name,pages:all}=useVinetka.getState();localStorage.setItem(DRAFT_KEY,JSON.stringify({projectName:name,pages:all}));if(!silent)toast.success('Loyiha saqlandi');}catch{if(!silent)toast.error('Xotira to‘ldi — kichikroq rasmlarni yuklang')}}
 useEffect(()=>{const id=window.setInterval(()=>save(true),10000);return()=>window.clearInterval(id)},[]);
 async function pdf(){setExporting(true);try{await exportPdf(pages,projectName,()=>{});toast.success('PDF yuklab olindi')}catch{toast.error('PDF yaratilmadi')}finally{setExporting(false)}}
 function png(){const page=pages[activePage];if(!page)return;try{exportPng(page,`${projectName}-bet-${activePage+1}`);toast.success('PNG yuklab olindi')}catch{toast.error('PNG yaratilmadi')}}
 return <div className="min-h-screen bg-background text-foreground"><TopBar onSave={()=>save()} onExportPng={png} onExportPdf={()=>void pdf()} /><div className="lg:flex lg:items-stretch"><PhotosPanel/><CanvasArea/><BackgroundsPanel/></div><div className="border-t border-border bg-card px-4 py-3 text-center text-xs text-muted-foreground sm:hidden">Vinetkangizni PNG yoki PDF shaklida yuklab oling.</div><Toaster position="bottom-right" richColors />{exporting&&<div className="fixed inset-0 z-50 grid place-items-center bg-background/80"><div className="border border-border bg-card p-8 text-center shadow-canvas"><div className="mx-auto mb-4 size-8 animate-spin rounded-full border-2 border-primary border-t-transparent"/><p>PDF tayyorlanmoqda...</p></div></div>}</div>;
}

// Libreta: guarda la app en el equipo para que abra sin internet.
const VERSION='libreta-2026-10-28a';
const BASE=['./','./index.html','./config.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./favicon-32.png'];
const EXTERNOS=['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.js'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(VERSION);await c.addAll(BASE);
  for(const u of EXTERNOS){try{await c.add(new Request(u,{mode:'cors'}))}catch(err){}}await self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==VERSION)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(/supabase\.co$/.test(u.hostname)||u.hostname==='dolarapi.com')return; // datos: siempre a la red
  if(u.origin===self.location.origin){ // la app: primero la red (para recibir cambios), si no hay, lo guardado
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp))}return res})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(x=>x||caches.match('./index.html'))));return}
  if(['cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com'].includes(u.hostname)){ // librerías y fuentes: lo guardado primero
    e.respondWith(caches.match(r).then(x=>x||fetch(r).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp));return res})))}
});

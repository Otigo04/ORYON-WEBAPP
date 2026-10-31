"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "showcase";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB, deckungsgleich mit der Bucket-Policy

/** Dateiname URL-/Storage-sicher machen und mit Zufallspräfix eindeutig halten. */
function safeKey(name: string): string {
  const dot = name.lastIndexOf(".");
  const ext = dot > -1 ? name.slice(dot).toLowerCase() : "";
  const base = (dot > -1 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const rand = crypto.randomUUID().slice(0, 8);
  return `${rand}-${base || "bild"}${ext}`;
}

/**
 * Lädt Referenzbilder direkt aus dem Adminportal in den öffentlichen
 * Storage-Bucket `showcase` (RLS: nur Admins dürfen schreiben) und verwaltet die
 * Galerie-Reihenfolge. Das erste Bild ist das Cover. Die resultierende URL-Liste
 * wird in ein verstecktes `images`-Feld geschrieben, das das umgebende Formular
 * per Server-Action speichert.
 */
export function ShowcaseImageUploader({ initial }: { initial: string[] }) {
  const [urls, setUrls] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setBusy(true);
    const supabase = createClient();
    const added: string[] = [];

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          setError(`„${file.name}“ ist kein Bild.`);
          continue;
        }
        if (file.size > MAX_BYTES) {
          setError(`„${file.name}“ ist größer als 10 MB.`);
          continue;
        }
        const key = safeKey(file.name);
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(key, file, { cacheControl: "3600", upsert: false });
        if (upErr) {
          setError(`Upload fehlgeschlagen: ${upErr.message}`);
          continue;
        }
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(key);
        if (data?.publicUrl) added.push(data.publicUrl);
      }
      if (added.length) setUrls((prev) => [...prev, ...added]);
    } catch {
      setError("Unerwarteter Fehler beim Upload.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(url: string) {
    setUrls((prev) => prev.filter((u) => u !== url));
  }

  function move(index: number, dir: -1 | 1) {
    setUrls((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-white/80">Galerie / Diashow</label>

      {/* Verstecktes Feld: das Formular übernimmt diese URL-Liste als JSON. */}
      <input type="hidden" name="images" value={JSON.stringify(urls)} />

      {urls.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {urls.map((url, i) => (
            <li
              key={url}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
            >
              <div className="relative aspect-video">
                <Image
                  src={url}
                  alt={`Bild ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 240px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              {i === 0 && (
                <span className="absolute left-2 top-2 rounded-md bg-[#09ed2d] px-1.5 py-0.5 text-[10px] font-bold text-black">
                  Cover
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/70 px-2 py-1.5 opacity-0 transition group-hover:opacity-100">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Nach vorne"
                    className="rounded px-1.5 py-0.5 text-xs text-white/80 hover:bg-white/10 disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === urls.length - 1}
                    aria-label="Nach hinten"
                    className="rounded px-1.5 py-0.5 text-xs text-white/80 hover:bg-white/10 disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(url)}
                  aria-label="Entfernen"
                  className="rounded px-1.5 py-0.5 text-xs font-medium text-red-300 hover:bg-red-500/20"
                >
                  Entfernen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="rounded-lg border border-[#09ed2d]/40 bg-[#09ed2d]/10 px-4 py-2 text-sm font-medium text-[#09ed2d] transition hover:bg-[#09ed2d]/20 disabled:opacity-50"
        >
          {busy ? "Lädt hoch …" : "Bilder hochladen"}
        </button>
        <span className="text-xs text-white/40">JPG, PNG, WebP, AVIF · max. 10 MB</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {error && <p className="text-xs text-red-400">{error}</p>}
      <p className="text-xs text-white/40">
        Das erste Bild ist das Cover. Mit ← / → sortieren, mehrere Bilder ergeben auf der
        Startseite eine Diashow.
      </p>
    </div>
  );
}

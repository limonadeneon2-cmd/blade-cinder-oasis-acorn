"use client";

import { useMemo, useState } from "react";
import { useStudio } from "@/lib/store";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  {
    id: "pull",
    title: "Pull nordique",
    price: "89 €",
    blurb: "Laine mérinos, col rond, tricoté à Lille.",
  },
  {
    id: "bonnet",
    title: "Bonnet caban",
    price: "34 €",
    blurb: "Côtes serrées, un seul coloris encre.",
  },
  {
    id: "echarpe",
    title: "Écharpe brume",
    price: "52 €",
    blurb: "Tissage serré, 180 cm, finition brute.",
  },
];

interface ShopSiteProps {
  resetKey: number;
}

export function ShopSite({ resetKey }: ShopSiteProps) {
  const recording = useStudio((s) => s.recording);
  const playing = useStudio((s) => s.playing);
  const pushLiveStep = useStudio((s) => s.pushLiveStep);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [cart, setCart] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const capture = recording && !playing;

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter(
      (p) => p.title.toLowerCase().includes(q) || p.blurb.toLowerCase().includes(q),
    );
  }, [query]);

  function rec(type: "click" | "input", targetId: string, label: string, value?: string) {
    if (!capture) return;
    pushLiveStep({ type, targetId, label, value });
  }

  return (
    <div key={resetKey} className="site-shop min-h-full">
      <header className="flex items-center justify-between border-b border-[#ddd4c6] px-5 py-3">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight">Atelier Nord</p>
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#7a7268]">
            Boutique démo
          </p>
        </div>
        <button
          type="button"
          data-ra-id="shop-cart"
          onClick={() => rec("click", "shop-cart", "Ouvrir le panier")}
          className="rounded-md border border-[#ddd4c6] px-3 py-1.5 text-xs"
        >
          Panier · {cart.length}
        </button>
      </header>

      <div className="px-5 py-4">
        <input
          data-ra-id="shop-search"
          value={query}
          placeholder="Chercher un article…"
          onChange={(e) => {
            setQuery(e.target.value);
            rec("input", "shop-search", `Recherche — ${e.target.value}`, e.target.value);
          }}
          className="h-10 w-full rounded-md border border-[#ddd4c6] bg-white px-3 text-sm text-[#1c1916] outline-none focus:ring-2 focus:ring-[#9a4a2a]/40"
        />
      </div>

      <div className="grid gap-3 px-5 pb-5 sm:grid-cols-3">
        {products.map((p) => (
          <article
            key={p.id}
            className={cn(
              "rounded-lg border border-[#ddd4c6] bg-white p-3",
              openId === p.id && "ring-2 ring-[#9a4a2a]/40",
            )}
          >
            <button
              type="button"
              data-ra-id={`product-${p.id}`}
              onClick={() => {
                setOpenId(p.id);
                rec("click", `product-${p.id}`, `Ouvrir — ${p.title}`);
              }}
              className="w-full text-left"
            >
              <div className="mb-3 h-20 rounded-md bg-[#e8dfd2]" />
              <p className="text-sm font-medium">{p.title}</p>
              <p className="mt-0.5 text-xs text-[#7a7268]">{p.blurb}</p>
              <p className="mt-2 font-mono text-sm">{p.price}</p>
            </button>
            <button
              type="button"
              data-ra-id={`add-${p.id}`}
              onClick={() => {
                setCart((c) => [...c, p.id]);
                rec("click", `add-${p.id}`, `Ajouter au panier — ${p.title}`);
              }}
              className="mt-3 h-9 w-full rounded-md bg-[#1c1916] text-xs font-medium text-[#f4efe6]"
            >
              Ajouter au panier
            </button>
          </article>
        ))}
      </div>

      {cart.length > 0 ? (
        <div className="border-t border-[#ddd4c6] px-5 py-4">
          <p className="text-sm font-medium">Note de commande</p>
          <textarea
            data-ra-id="shop-note"
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              rec("input", "shop-note", "Saisie — note", e.target.value);
            }}
            placeholder="Taille, couleur, message…"
            className="mt-2 min-h-16 w-full rounded-md border border-[#ddd4c6] bg-white px-3 py-2 text-sm"
          />
        </div>
      ) : null}
    </div>
  );
}

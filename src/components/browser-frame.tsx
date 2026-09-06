"use client";

import {
  createContext,
  useCallback,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  type ReactNode,
} from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlayHost } from "@/lib/engine";
import { sleep } from "@/lib/utils";

interface Cursor {
  x: number;
  y: number;
  visible: boolean;
  pulsing: boolean;
}

const HostCtx = createContext<PlayHost | null>(null);

export function usePlayHost() {
  return useContext(HostCtx);
}

export interface BrowserFrameHandle {
  host: () => PlayHost | null;
  root: () => HTMLElement | null;
}

interface BrowserFrameProps {
  url: string;
  recording?: boolean;
  playing?: boolean;
  children: ReactNode;
  className?: string;
}

export const BrowserFrame = forwardRef<BrowserFrameHandle, BrowserFrameProps>(
  function BrowserFrame({ url, recording, playing, children, className }, ref) {
    const shellRef = useRef<HTMLDivElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);
    const [cursor, setCursor] = useState<Cursor>({
      x: 24,
      y: 24,
      visible: false,
      pulsing: false,
    });
    const [hi, setHi] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

    const moveCursor = useCallback(async (el: Element) => {
      const shell = shellRef.current;
      if (!shell) return;
      const s = shell.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      setCursor({
        x: r.left - s.left + r.width / 2,
        y: r.top - s.top + r.height / 2,
        visible: true,
        pulsing: false,
      });
      await sleep(200);
    }, []);

    const pulse = useCallback(() => {
      setCursor((c) => ({ ...c, pulsing: true }));
      window.setTimeout(() => setCursor((c) => ({ ...c, pulsing: false })), 280);
    }, []);

    const highlight = useCallback((el: Element | null) => {
      if (!el || !shellRef.current) {
        setHi(null);
        return;
      }
      const s = shellRef.current.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      setHi({
        x: r.left - s.left,
        y: r.top - s.top,
        w: r.width,
        h: r.height,
      });
      window.setTimeout(() => setHi(null), 700);
    }, []);

    useImperativeHandle(ref, () => ({
      host: () => {
        const root = pageRef.current;
        if (!root) return null;
        return { root, moveCursor, pulse, highlight };
      },
      root: () => pageRef.current,
    }));

    return (
      <div
        ref={shellRef}
        className={cn(
          "relative flex min-h-[420px] flex-col overflow-hidden rounded-xl border border-border bg-ink",
          className,
        )}
      >
        <div className="flex items-center gap-3 border-b border-border bg-card px-3 py-2">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-record/80" />
            <span className="size-2.5 rounded-full bg-primary/80" />
            <span className="size-2.5 rounded-full bg-play/80" />
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground">
            <Lock className="size-3 shrink-0" />
            <span className="truncate font-mono">{url}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            {recording ? (
              <span className="flex items-center gap-1.5 text-record">
                <span className="rec-live size-2 rounded-full bg-record" />
                Rec
              </span>
            ) : null}
            {playing ? <span className="text-play">Lecture</span> : null}
          </div>
        </div>
        <div ref={pageRef} className="relative min-h-0 flex-1 overflow-auto">
          {children}
        </div>
        {hi ? (
          <div
            className="pointer-events-none absolute rounded-sm ring-2 ring-primary/80"
            style={{ left: hi.x, top: hi.y, width: hi.w, height: hi.h }}
          />
        ) : null}
        {cursor.visible ? (
          <div
            className={cn(
              "ghost-cursor pointer-events-none absolute z-20 -ml-1.5 -mt-1.5",
              cursor.pulsing && "pulse",
            )}
            style={{ left: cursor.x, top: cursor.y }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M2 1.5 L2 14.5 L6.2 10.8 L9.2 17 L11.3 16.1 L8.2 10 L14.5 10 Z"
                fill="currentColor"
                className="text-primary"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          </div>
        ) : null}
      </div>
    );
  },
);

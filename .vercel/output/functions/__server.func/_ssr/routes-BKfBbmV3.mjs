import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as Slot } from "../_libs/@radix-ui/react-primitive+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as planSurvey, c as uid, i as planAds, n as formatHolidayDate, r as monthNameFr, s as sleep, t as cn } from "./heuristics-h__ljfX7.mjs";
import { A as Bot, C as Coins, D as CircleAlert, E as Circle, O as Check, S as Download, T as Clapperboard, _ as MousePointer2, a as Type, b as Info, c as Timer, d as Repeat, f as Plus, g as Navigation, h as Pause, i as Upload, j as ArrowDownUp, k as CalendarDays, l as Square, m as Pencil, n as VolumeX, p as Play, r as Volume2, s as Trash2, t as X, u as SkipForward, v as Lock, w as ClipboardList, x as Gift, y as Keyboard } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BKfBbmV3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
(0, import_react.createContext)(null);
var BrowserFrame = (0, import_react.forwardRef)(function BrowserFrame({ url, recording, playing, children, className }, ref) {
	const shellRef = (0, import_react.useRef)(null);
	const pageRef = (0, import_react.useRef)(null);
	const [cursor, setCursor] = (0, import_react.useState)({
		x: 24,
		y: 24,
		visible: false,
		pulsing: false
	});
	const [hi, setHi] = (0, import_react.useState)(null);
	const moveCursor = (0, import_react.useCallback)(async (el) => {
		const shell = shellRef.current;
		if (!shell) return;
		const s = shell.getBoundingClientRect();
		const r = el.getBoundingClientRect();
		setCursor({
			x: r.left - s.left + r.width / 2,
			y: r.top - s.top + r.height / 2,
			visible: true,
			pulsing: false
		});
		await sleep(200);
	}, []);
	const pulse = (0, import_react.useCallback)(() => {
		setCursor((c) => ({
			...c,
			pulsing: true
		}));
		window.setTimeout(() => setCursor((c) => ({
			...c,
			pulsing: false
		})), 280);
	}, []);
	const highlight = (0, import_react.useCallback)((el) => {
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
			h: r.height
		});
		window.setTimeout(() => setHi(null), 700);
	}, []);
	(0, import_react.useImperativeHandle)(ref, () => ({
		host: () => {
			const root = pageRef.current;
			if (!root) return null;
			return {
				root,
				moveCursor,
				pulse,
				highlight
			};
		},
		root: () => pageRef.current
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: shellRef,
		className: cn("relative flex min-h-[420px] flex-col overflow-hidden rounded-xl border border-border bg-ink", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b border-border bg-card px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-record/80" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-primary/80" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-play/80" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-1 items-center gap-2 rounded-md bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate font-mono",
							children: url
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground",
						children: [recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5 text-record",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rec-live size-2 rounded-full bg-record" }), "Rec"]
						}) : null, playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-play",
							children: "Lecture"
						}) : null]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: pageRef,
				className: "relative min-h-0 flex-1 overflow-auto",
				children
			}),
			hi ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute rounded-sm ring-2 ring-primary/80",
				style: {
					left: hi.x,
					top: hi.y,
					width: hi.w,
					height: hi.h
				}
			}) : null,
			cursor.visible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("ghost-cursor pointer-events-none absolute z-20 -ml-1.5 -mt-1.5", cursor.pulsing && "pulse"),
				style: {
					left: cursor.x,
					top: cursor.y
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					width: "18",
					height: "18",
					viewBox: "0 0 18 18",
					fill: "none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M2 1.5 L2 14.5 L6.2 10.8 L9.2 17 L11.3 16.1 L8.2 10 L14.5 10 Z",
						fill: "currentColor",
						className: "text-primary",
						stroke: "currentColor",
						strokeWidth: "1"
					})
				})
			}) : null
		]
	});
});
var ADS = [
	{
		kind: "preroll",
		brand: "Nord Cola",
		line: "L’eau pétillante des fjords, en canette.",
		duration: 8,
		skipAfter: 3,
		reward: 8
	},
	{
		kind: "interstitial",
		brand: "Atelier Lumière",
		line: "Lampes de bureau, édition limitée.",
		duration: 6,
		skipAfter: 4,
		reward: 6
	},
	{
		kind: "rewarded",
		brand: "Flux TV+",
		line: "Regarde pour débloquer le prochain épisode.",
		duration: 10,
		skipAfter: null,
		reward: 14
	}
];
var AdsSite = (0, import_react.forwardRef)(function AdsSite({ muteDefault, skipWhenPossible, speed, onReward, onLog }, ref) {
	const [index, setIndex] = (0, import_react.useState)(0);
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [t, setT] = (0, import_react.useState)(0);
	const [muted, setMuted] = (0, import_react.useState)(muteDefault);
	const [claimed, setClaimed] = (0, import_react.useState)(false);
	const [sessionDone, setSessionDone] = (0, import_react.useState)(false);
	const speedRef = (0, import_react.useRef)(speed);
	speedRef.current = speed;
	const ad = ADS[index];
	(0, import_react.useEffect)(() => {
		if (phase !== "playing" || !ad) return;
		const id = window.setInterval(() => {
			setT((prev) => {
				const next = prev + .25 * (speedRef.current || 1);
				if (next >= ad.duration) {
					window.clearInterval(id);
					setPhase("done");
					return ad.duration;
				}
				return next;
			});
		}, 250);
		return () => window.clearInterval(id);
	}, [
		phase,
		ad,
		index
	]);
	const remaining = ad ? Math.max(0, ad.duration - t) : 0;
	const skipReady = !!(ad?.skipAfter != null && t >= ad.skipAfter);
	const progress = ad ? Math.min(1, t / ad.duration) : 0;
	function snapshot() {
		if (sessionDone) return [];
		const els = [];
		if (phase === "idle") els.push({
			id: "ad-play",
			tag: "button",
			label: "Lecture",
			visible: true,
			kind: "play"
		});
		if (phase === "playing" || phase === "idle") els.push({
			id: "ad-mute",
			tag: "button",
			label: muted ? "Son coupé" : "Couper le son",
			visible: true,
			kind: "mute"
		});
		if (ad?.skipAfter != null) {
			const remain = Math.max(0, ad.skipAfter - t);
			els.push({
				id: "ad-skip",
				tag: "button",
				label: skipReady ? "Passer" : `Passer dans ${Math.ceil(remain)}s`,
				visible: phase === "playing" || phase === "done",
				disabled: !skipReady,
				waitMs: skipReady ? 0 : Math.ceil(remain * 1e3) + 200,
				kind: "skip"
			});
		}
		if (phase === "playing" && ad && (ad.skipAfter == null || !skipWhenPossible)) els.push({
			id: "ad-wait-end",
			tag: "div",
			label: `Publicité en cours · ${remaining.toFixed(1)}s`,
			visible: true,
			waitMs: Math.ceil(remaining * 1e3) + 200
		});
		if (phase === "done" && ad?.kind === "interstitial") els.push({
			id: "ad-close",
			tag: "button",
			label: "Fermer",
			visible: true,
			kind: "close"
		});
		if (phase === "done" && ad?.kind === "rewarded" && !claimed) els.push({
			id: "ad-claim",
			tag: "button",
			label: "Récupérer la récompense",
			visible: true,
			kind: "claim"
		});
		if (phase === "done" && index < ADS.length - 1 && (ad?.kind === "preroll" || ad?.kind === "rewarded" && claimed)) els.push({
			id: "ad-next",
			tag: "button",
			label: "Pub suivante",
			visible: true,
			kind: "next"
		});
		return els;
	}
	(0, import_react.useImperativeHandle)(ref, () => ({
		snapshot,
		tickSpeed: (s) => {
			speedRef.current = s;
		}
	}));
	function start() {
		if (!ad) return;
		setPhase("playing");
		onLog(`Lecture — ${ad.brand}`);
	}
	function skip() {
		if (!skipReady || !ad) return;
		setPhase("done");
		setT(ad.duration);
		onLog(`Pub passée — ${ad.brand}`);
		grantIfNeeded();
	}
	function grantIfNeeded() {
		if (!ad || claimed) return;
		if (ad.kind !== "rewarded") {
			setClaimed(true);
			onReward(ad.reward, ad.brand);
		}
	}
	function close() {
		grantIfNeeded();
		goNext();
	}
	function claim() {
		if (!ad || claimed) return;
		setClaimed(true);
		onReward(ad.reward, ad.brand);
		onLog(`Récompense récupérée · +${ad.reward} jetons`);
	}
	function goNext() {
		if (index >= ADS.length - 1) {
			setSessionDone(true);
			onLog("Session pubs terminée.");
			return;
		}
		setIndex((i) => i + 1);
		setPhase("idle");
		setT(0);
		setClaimed(false);
	}
	if (sessionDone) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "site-ads flex min-h-full flex-col items-center justify-center gap-3 px-6 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "size-8 text-play" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl font-semibold",
				children: "Session terminée"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-sm text-sm text-muted-foreground",
				children: "Les trois formats de pub ont été joués. Relance l’assistant pour une nouvelle passe."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"data-ra-id": "ad-replay",
				onClick: () => {
					setIndex(0);
					setPhase("idle");
					setT(0);
					setClaimed(false);
					setSessionDone(false);
				},
				className: "mt-2 h-10 rounded-md bg-play px-4 text-sm font-medium text-play-foreground",
				children: "Recommencer"
			})
		]
	});
	if (!ad) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "site-ads min-h-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between px-5 py-3 text-xs text-zinc-400",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-sm text-zinc-100",
				children: "Flux TV"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono uppercase tracking-wider",
				children: [
					index + 1,
					" / ",
					ADS.length,
					" · ",
					ad.kind
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-5 pb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ad-static grain relative aspect-video",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] uppercase tracking-[0.22em] text-zinc-400",
									children: "Publicité"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-3xl font-semibold text-zinc-50",
									children: ad.brand
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "max-w-md text-sm text-zinc-300",
									children: ad.line
								})
							]
						}), phase !== "playing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-black/25" }) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								phase === "idle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"data-ra-id": "ad-play",
									onClick: start,
									className: "flex size-10 items-center justify-center rounded-full bg-zinc-50 text-zinc-950",
									"aria-label": "Lecture",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-0.5 size-4" })
								}) : phase === "playing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex size-10 items-center justify-center rounded-full bg-zinc-50/15 text-zinc-50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-play/20 px-2.5 py-1 text-[11px] text-play",
									children: "Terminé"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"data-ra-id": "ad-mute",
									onClick: () => setMuted((m) => !m),
									className: "flex size-9 items-center justify-center rounded-full bg-black/40 text-zinc-100",
									"aria-label": "Son",
									children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-[11px] text-zinc-200",
									children: [remaining.toFixed(1), "s"]
								})
							]
						}), ad.skipAfter != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-ra-id": "ad-skip",
							disabled: !skipReady,
							onClick: skip,
							className: cn("flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium", skipReady ? "bg-zinc-50 text-zinc-950" : "bg-black/40 text-zinc-400"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-3.5" }), skipReady ? "Passer" : `Passer ${Math.ceil((ad.skipAfter ?? 0) - t)}s`]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-zinc-300",
							children: "Lecture obligatoire"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-x-0 top-0 h-0.5 bg-black/40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-primary transition-[width] duration-200",
							style: { width: `${progress * 100}%` }
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-2",
				children: [
					phase === "done" && ad.kind === "interstitial" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-ra-id": "ad-close",
						onClick: close,
						className: "flex h-10 items-center gap-2 rounded-md border border-zinc-700 px-3 text-sm text-zinc-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), "Fermer"]
					}) : null,
					phase === "done" && ad.kind === "rewarded" && !claimed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-ra-id": "ad-claim",
						onClick: claim,
						className: "flex h-10 items-center gap-2 rounded-md bg-play px-3 text-sm font-medium text-play-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "size-4" }),
							"Récupérer +",
							ad.reward,
							" jetons"
						]
					}) : null,
					phase === "done" && (ad.kind === "preroll" || ad.kind === "rewarded" && claimed) && index < ADS.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-ra-id": "ad-next",
						onClick: goNext,
						className: "h-10 rounded-md bg-zinc-50 px-4 text-sm font-medium text-zinc-950",
						children: "Pub suivante"
					}) : null,
					skipWhenPossible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto text-[11px] text-zinc-500",
						children: "Skip autorisé dès que possible"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto text-[11px] text-zinc-500",
						children: "Lecture jusqu’au bout"
					})
				]
			})]
		})]
	});
});
var SAMPLE_PROFILE = {
	firstName: "Léa",
	lastName: "Martin",
	email: "lea.martin@email.fr",
	phone: "06 12 34 56 78",
	birthDate: "1994-03-14",
	city: "Paris",
	country: "France",
	occupation: "Graphiste indépendante",
	gender: "Femme",
	language: "Français",
	bio: "J’habite à Paris, je voyage surtout l’été, et je préfère les réponses honnêtes aux cases marketing.",
	likes: "design, randonnée, café, cinéma indépendant",
	dislikes: "démarchage, pubs trop longues, questions pièges",
	holidays: [
		{
			id: uid("hol"),
			name: "Anniversaire",
			month: 3,
			day: 14,
			notes: "Le mien"
		},
		{
			id: uid("hol"),
			name: "Anniversaire de Thomas",
			month: 11,
			day: 2,
			notes: "Conjoint — dîner en famille"
		},
		{
			id: uid("hol"),
			name: "Noël",
			month: 12,
			day: 25,
			notes: "Toujours chez mes parents à Lyon"
		},
		{
			id: uid("hol"),
			name: "Fête nationale",
			month: 7,
			day: 14,
			notes: "Feu d’artifice à Paris"
		},
		{
			id: uid("hol"),
			name: "Départ en vacances d’été",
			month: 7,
			day: 15,
			year: 2026,
			notes: "Deux semaines en Bretagne"
		}
	]
};
var SAMPLE_MACROS = [{
	id: "macro_sample_cart",
	name: "Ajouter le pull au panier",
	createdAt: Date.now() - 864e5,
	steps: [
		{
			id: "s1",
			type: "input",
			targetId: "shop-search",
			value: "laine",
			delay: 400,
			label: "Recherche — laine"
		},
		{
			id: "s2",
			type: "click",
			targetId: "product-pull",
			delay: 600,
			label: "Ouvrir — Pull nordique"
		},
		{
			id: "s3",
			type: "click",
			targetId: "add-pull",
			delay: 500,
			label: "Ajouter au panier"
		}
	]
}];
var useStudio = create()(persist((set, get) => ({
	mode: "studio",
	macros: SAMPLE_MACROS,
	drafts: [],
	recording: false,
	playing: false,
	recordStartedAt: 0,
	lastStepAt: 0,
	liveSteps: [],
	speed: 1,
	loops: 1,
	infinite: false,
	playingMacroId: null,
	stepIndex: 0,
	profile: SAMPLE_PROFILE,
	logs: [],
	autoDismiss: true,
	adSkipWhenPossible: true,
	adMute: true,
	adTokens: 0,
	setMode: (mode) => set({ mode }),
	setRecording: (v) => set(v ? {
		recording: true,
		liveSteps: [],
		recordStartedAt: Date.now(),
		lastStepAt: Date.now()
	} : { recording: false }),
	pushLiveStep: (step) => {
		const now = Date.now();
		const delay = step.delay ?? Math.max(0, now - get().lastStepAt);
		set({
			liveSteps: [...get().liveSteps, {
				...step,
				id: uid("step"),
				delay: Math.min(delay, 15e3)
			}],
			lastStepAt: now
		});
	},
	stopRecording: () => {
		const steps = get().liveSteps;
		if (steps.length === 0) {
			set({
				recording: false,
				liveSteps: []
			});
			return;
		}
		const draft = {
			id: uid("draft"),
			name: "",
			steps,
			createdAt: Date.now()
		};
		set({
			recording: false,
			liveSteps: [],
			drafts: [...get().drafts, draft]
		});
	},
	saveDraft: (id, name) => {
		const draft = get().drafts.find((d) => d.id === id);
		if (!draft) return;
		set({
			macros: [{
				...draft,
				id: uid("macro"),
				name: name.trim() || "Macro sans nom"
			}, ...get().macros],
			drafts: get().drafts.filter((d) => d.id !== id)
		});
	},
	discardDraft: (id) => set({ drafts: get().drafts.filter((d) => d.id !== id) }),
	updateDraftSteps: (id, steps) => set({ drafts: get().drafts.map((d) => d.id === id ? {
		...d,
		steps
	} : d) }),
	saveMacro: (macro) => set({ macros: get().macros.some((m) => m.id === macro.id) ? get().macros.map((m) => m.id === macro.id ? macro : m) : [macro, ...get().macros] }),
	deleteMacro: (id) => set({ macros: get().macros.filter((m) => m.id !== id) }),
	setPlayback: (partial) => set(partial),
	setSpeed: (n) => set({ speed: n }),
	setLoops: (n) => set({ loops: n }),
	setInfinite: (v) => set({ infinite: v }),
	updateProfile: (partial) => set({ profile: {
		...get().profile,
		...partial
	} }),
	addHoliday: (h) => set({ profile: {
		...get().profile,
		holidays: [...get().profile.holidays, {
			...h,
			id: uid("hol")
		}]
	} }),
	removeHoliday: (id) => set({ profile: {
		...get().profile,
		holidays: get().profile.holidays.filter((h) => h.id !== id)
	} }),
	loadSampleProfile: () => set({ profile: SAMPLE_PROFILE }),
	log: (kind, text) => set({ logs: [{
		id: uid("log"),
		at: Date.now(),
		kind,
		text
	}, ...get().logs].slice(0, 80) }),
	clearLogs: () => set({ logs: [] }),
	setAutoDismiss: (v) => set({ autoDismiss: v }),
	setAdSkipWhenPossible: (v) => set({ adSkipWhenPossible: v }),
	setAdMute: (v) => set({ adMute: v }),
	addTokens: (n) => set({ adTokens: get().adTokens + n })
}), {
	name: "repete-actions-v1",
	partialize: (s) => ({
		macros: s.macros,
		profile: s.profile,
		speed: s.speed,
		loops: s.loops,
		infinite: s.infinite,
		autoDismiss: s.autoDismiss,
		adSkipWhenPossible: s.adSkipWhenPossible,
		adMute: s.adMute,
		adTokens: s.adTokens
	})
}));
var KIND = {
	ai: {
		Icon: Bot,
		className: "text-primary"
	},
	action: {
		Icon: MousePointer2,
		className: "text-play"
	},
	ok: {
		Icon: Check,
		className: "text-play"
	},
	warn: {
		Icon: CircleAlert,
		className: "text-record"
	},
	info: {
		Icon: Info,
		className: "text-muted-foreground"
	}
};
function ActivityLog() {
	const logs = useStudio((s) => s.logs);
	const clearLogs = useStudio((s) => s.clearLogs);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-40 flex-col rounded-xl border border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground",
				children: "Journal"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: clearLogs,
				className: "text-[11px] text-muted-foreground hover:text-foreground",
				children: "Effacer"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex max-h-48 flex-col gap-1.5 overflow-y-auto p-3",
			children: logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Les actions de l’assistant s’afficheront ici."
			}) : logs.map((l) => {
				const { Icon, className } = KIND[l.kind];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 text-xs leading-snug",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("mt-0.5 size-3.5 shrink-0", className) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-pretty text-foreground/90",
						children: l.text
					})]
				}, l.id);
			})
		})]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var decideActions = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("3985e6ad82e720f744bbe6dbb68369fc16d5712e185d1215402890227d15df9b"));
var getAiStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("f55d85520203b0ca68806b32dd775d224e89e7dbf6a1371fbfe6857a9f8e3df4"));
function AiStatus() {
	const [ok, setOk] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getAiStatus().then((r) => setOk(r.available)).catch(() => setOk(false));
	}, []);
	if (ok === null) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-[11px] text-muted-foreground",
		children: ok ? "IA déjà branchée (Grok) — tu n’as pas de clé à fournir." : "IA indisponible pour le moment — le moteur local continue quand même."
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			play: "bg-play text-play-foreground hover:bg-play/90",
			record: "bg-record text-white hover:bg-record/90",
			outline: "border border-border bg-transparent text-foreground hover:bg-secondary",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
		},
		size: {
			default: "h-10 px-4",
			sm: "h-8 rounded-sm px-3 text-xs",
			lg: "h-11 rounded-lg px-5",
			icon: "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
	ref,
	className: cn("text-xs font-medium text-muted-foreground", className),
	...props
}));
Label.displayName = "Label";
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border border-border transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:cursor-not-allowed disabled:opacity-50", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block size-4 rounded-full bg-foreground shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5 data-[state=checked]:bg-primary-foreground") })
}));
Switch.displayName = "Switch";
function findTarget(root, id) {
	return root.querySelector(`[data-ra-id="${CSS.escape(id)}"]`);
}
function nativeSet(el, value) {
	const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
	const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
	if (setter) setter.call(el, value);
	else el.value = value;
	el.dispatchEvent(new Event("input", { bubbles: true }));
	el.dispatchEvent(new Event("change", { bubbles: true }));
}
async function executeAction(host, action, signal) {
	if (signal.aborted) return;
	const type = action.type;
	const targetId = "targetId" in action ? action.targetId : void 0;
	const value = "value" in action ? action.value : void 0;
	const waitMs = "waitMs" in action ? action.waitMs : void 0;
	if (type === "wait" || type === "done") {
		if (waitMs) await sleep(waitMs, signal);
		return;
	}
	if (!targetId) return;
	const el = findTarget(host.root, targetId);
	if (!el) return;
	if (el instanceof HTMLButtonElement && el.disabled) return;
	el.scrollIntoView({
		block: "center",
		behavior: "instant"
	});
	await host.moveCursor(el);
	if (signal.aborted) return;
	host.highlight(el);
	host.pulse();
	if (type === "click") el.click();
	else if (type === "type" || type === "input") {
		if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) nativeSet(el, value ?? "");
		else el.click();
	} else if (type === "select") {
		if (el instanceof HTMLSelectElement && value) {
			el.value = value;
			el.dispatchEvent(new Event("change", { bubbles: true }));
		} else if (value) (host.root.querySelector(`[data-ra-id="${CSS.escape(targetId)}"] [data-option="${CSS.escape(value)}"]`) ?? el).click();
		else el.click();
	} else if (type === "key") el.dispatchEvent(new KeyboardEvent("keydown", {
		key: value || "Enter",
		bubbles: true,
		cancelable: true
	}));
	else if (type === "scroll") el.scrollIntoView({
		block: "center",
		behavior: "smooth"
	});
}
async function runMacroSteps(host, steps, fromIndex, speed, signal, onIndex) {
	for (let i = fromIndex; i < steps.length; i++) {
		if (signal.aborted) return;
		const step = steps[i];
		const delay = Math.min(Math.max((step.delay || 0) / (speed || 1), 0), 15e3);
		await sleep(delay, signal);
		if (signal.aborted) return;
		await executeAction(host, step, signal);
		onIndex(i + 1);
	}
}
async function runAssistant(opts) {
	const speed = Math.max(opts.speed || 1, .25);
	let calls = 0;
	while (!opts.signal.aborted && calls < 12) {
		if (opts.isFinished?.()) {
			opts.onLog("ok", "Terminé.");
			return;
		}
		const elements = opts.snapshot();
		if (elements.length === 0) {
			opts.onLog("ok", "Plus rien à automatiser sur cette page.");
			return;
		}
		let plan;
		try {
			plan = await decideActions({ data: {
				mode: opts.mode,
				elements,
				profile: opts.profile,
				skipWhenPossible: opts.skipWhenPossible,
				extra: opts.extra
			} });
		} catch {
			plan = opts.mode === "survey" ? planSurvey(elements, opts.profile ?? {}) : planAds(elements, { skipWhenPossible: !!opts.skipWhenPossible });
			opts.onLog("warn", "IA injoignable — bascule sur le moteur local.");
		}
		calls += 1;
		if (plan.commentary) opts.onLog(plan.source === "ai" ? "ai" : "info", plan.commentary);
		const host = opts.getHost();
		if (!host) return;
		let did = false;
		for (const action of plan.actions) {
			if (opts.signal.aborted) return;
			if (action.type === "done") {
				if (opts.snapshot().length === 0) {
					opts.onLog("ok", action.reason || "Boucle terminée.");
					return;
				}
				continue;
			}
			const waitMs = action.waitMs ? Math.max(120, action.waitMs / speed) : void 0;
			opts.onLog("action", action.reason);
			await executeAction(host, {
				...action,
				waitMs
			}, opts.signal);
			did = true;
			await sleep(220 / speed, opts.signal);
			if (opts.isFinished?.()) {
				opts.onLog("ok", "Terminé.");
				return;
			}
		}
		if (!did) break;
		await sleep(360 / speed, opts.signal);
	}
}
function AdsPanel() {
	const frameRef = (0, import_react.useRef)(null);
	const adsRef = (0, import_react.useRef)(null);
	const abortRef = (0, import_react.useRef)(null);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [session, setSession] = (0, import_react.useState)(0);
	const finishedRef = (0, import_react.useRef)(false);
	const speed = useStudio((s) => s.speed);
	const mute = useStudio((s) => s.adMute);
	const skip = useStudio((s) => s.adSkipWhenPossible);
	const tokens = useStudio((s) => s.adTokens);
	const { setAdMute, setAdSkipWhenPossible, setSpeed, addTokens, log } = useStudio();
	async function start() {
		if (running) {
			abortRef.current?.abort();
			setRunning(false);
			return;
		}
		finishedRef.current = false;
		const ac = new AbortController();
		abortRef.current = ac;
		setRunning(true);
		log("info", "Assistant pubs lancé.");
		try {
			await runAssistant({
				mode: "ads",
				getHost: () => frameRef.current?.host() ?? null,
				snapshot: () => adsRef.current?.snapshot() ?? [],
				skipWhenPossible: skip,
				extra: mute ? "Couper le son si possible." : "Laisser le son.",
				speed,
				signal: ac.signal,
				onLog: log,
				isFinished: () => finishedRef.current
			});
		} finally {
			setRunning(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg font-semibold",
							children: "Mode pubs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "L’IA repère lecture, skip, fermeture et récompense — puis joue la séquence toute seule. Pré-roll, interstitiel, puis pub récompensée."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiStatus, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: running ? "record" : "play",
							className: "mt-4 w-full",
							onClick: () => void start(),
							children: running ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5 fill-current" }), "Arrêter"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "size-4" }), "Faire jouer les pubs"] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-2 w-full text-center text-[11px] text-muted-foreground hover:text-foreground",
							onClick: () => {
								abortRef.current?.abort();
								setRunning(false);
								finishedRef.current = false;
								setSession((n) => n + 1);
							},
							children: "Réinitialiser la session"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "size-4 text-primary" }), "Jetons"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-lg tabular-nums",
							children: tokens
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between gap-3 text-sm",
								children: ["Passer dès que possible", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: skip,
									onCheckedChange: setAdSkipWhenPossible
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between gap-3 text-sm",
								children: ["Couper le son", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: mute,
									onCheckedChange: setAdMute
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Vitesse", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: String(speed),
								onChange: (e) => setSpeed(parseFloat(e.target.value)),
								className: "mt-1 h-9 w-full rounded-md border border-border bg-secondary px-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "1",
										children: "1×"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "2",
										children: "2×"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "5",
										children: "5×"
									})
								]
							})] })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityLog, {})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrowserFrame, {
			ref: frameRef,
			url: "fluxtv.demo/regarder",
			playing: running,
			className: "min-h-[520px]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdsSite, {
				ref: adsRef,
				muteDefault: mute,
				skipWhenPossible: skip,
				speed,
				onReward: (n, label) => {
					addTokens(n);
					log("ok", `+${n} jetons · ${label}`);
				},
				onLog: (t) => log("info", t)
			}, session)
		})]
	});
}
var PRODUCTS = [
	{
		id: "pull",
		title: "Pull nordique",
		price: "89 €",
		blurb: "Laine mérinos, col rond, tricoté à Lille."
	},
	{
		id: "bonnet",
		title: "Bonnet caban",
		price: "34 €",
		blurb: "Côtes serrées, un seul coloris encre."
	},
	{
		id: "echarpe",
		title: "Écharpe brume",
		price: "52 €",
		blurb: "Tissage serré, 180 cm, finition brute."
	}
];
function ShopSite({ resetKey }) {
	const recording = useStudio((s) => s.recording);
	const playing = useStudio((s) => s.playing);
	const pushLiveStep = useStudio((s) => s.pushLiveStep);
	const [query, setQuery] = (0, import_react.useState)("");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [cart, setCart] = (0, import_react.useState)([]);
	const [note, setNote] = (0, import_react.useState)("");
	const capture = recording && !playing;
	const products = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		if (!q) return PRODUCTS;
		return PRODUCTS.filter((p) => p.title.toLowerCase().includes(q) || p.blurb.toLowerCase().includes(q));
	}, [query]);
	function rec(type, targetId, label, value) {
		if (!capture) return;
		pushLiveStep({
			type,
			targetId,
			label,
			value
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "site-shop min-h-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between border-b border-[#ddd4c6] px-5 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg font-semibold tracking-tight",
					children: "Atelier Nord"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] tracking-[0.18em] uppercase text-[#7a7268]",
					children: "Boutique démo"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-ra-id": "shop-cart",
					onClick: () => rec("click", "shop-cart", "Ouvrir le panier"),
					className: "rounded-md border border-[#ddd4c6] px-3 py-1.5 text-xs",
					children: ["Panier · ", cart.length]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-5 py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"data-ra-id": "shop-search",
					value: query,
					placeholder: "Chercher un article…",
					onChange: (e) => {
						setQuery(e.target.value);
						rec("input", "shop-search", `Recherche — ${e.target.value}`, e.target.value);
					},
					className: "h-10 w-full rounded-md border border-[#ddd4c6] bg-white px-3 text-sm text-[#1c1916] outline-none focus:ring-2 focus:ring-[#9a4a2a]/40"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 px-5 pb-5 sm:grid-cols-3",
				children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: cn("rounded-lg border border-[#ddd4c6] bg-white p-3", openId === p.id && "ring-2 ring-[#9a4a2a]/40"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-ra-id": `product-${p.id}`,
						onClick: () => {
							setOpenId(p.id);
							rec("click", `product-${p.id}`, `Ouvrir — ${p.title}`);
						},
						className: "w-full text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-3 h-20 rounded-md bg-[#e8dfd2]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: p.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-[#7a7268]",
								children: p.blurb
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-mono text-sm",
								children: p.price
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-ra-id": `add-${p.id}`,
						onClick: () => {
							setCart((c) => [...c, p.id]);
							rec("click", `add-${p.id}`, `Ajouter au panier — ${p.title}`);
						},
						className: "mt-3 h-9 w-full rounded-md bg-[#1c1916] text-xs font-medium text-[#f4efe6]",
						children: "Ajouter au panier"
					})]
				}, p.id))
			}),
			cart.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-[#ddd4c6] px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Note de commande"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					"data-ra-id": "shop-note",
					value: note,
					onChange: (e) => {
						setNote(e.target.value);
						rec("input", "shop-note", "Saisie — note", e.target.value);
					},
					placeholder: "Taille, couleur, message…",
					className: "mt-2 min-h-16 w-full rounded-md border border-[#ddd4c6] bg-white px-3 py-2 text-sm"
				})]
			}) : null
		]
	}, resetKey);
}
var ICONS = {
	click: MousePointer2,
	input: Type,
	key: Keyboard,
	select: Type,
	scroll: ArrowDownUp,
	wait: Timer
};
var TINT = {
	click: "border-primary/50",
	input: "border-play/50",
	key: "border-foreground/25",
	select: "border-play/50",
	scroll: "border-border",
	wait: "border-border"
};
function TapeStrip({ steps, editable, activeIndex, onChangeDelay }) {
	if (steps.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-1 py-3 text-xs text-muted-foreground",
		children: "Aucune étape pour l’instant."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-1.5 overflow-x-auto py-2",
		children: steps.map((step, i) => {
			const Icon = ICONS[step.type] ?? Navigation;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("tape-chip flex min-w-[72px] shrink-0 flex-col items-center gap-1 rounded-md border bg-secondary px-2 py-1.5 text-center", TINT[step.type], activeIndex === i && "ring-1 ring-play"),
				style: { animationDelay: `${i * 40}ms` },
				title: step.label,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5 text-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "max-w-[88px] truncate text-[10px] text-muted-foreground",
						children: step.label
					}),
					editable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-0.5 font-mono text-[10px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 0,
							value: step.delay,
							onChange: (e) => onChangeDelay?.(i, Math.max(0, parseInt(e.target.value, 10) || 0)),
							className: "h-6 w-12 rounded-sm border border-border bg-card px-1 text-center text-[10px] text-foreground"
						}), "ms"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[10px] text-muted-foreground",
						children: [step.delay, " ms"]
					})
				]
			}, step.id);
		})
	});
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	className: cn("flex h-10 w-full rounded-md border border-input bg-secondary px-3 text-sm text-foreground shadow-none transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Input.displayName = "Input";
var SPEEDS = [
	{
		v: .25,
		l: "0,25×"
	},
	{
		v: .5,
		l: "0,5×"
	},
	{
		v: 1,
		l: "1×"
	},
	{
		v: 2,
		l: "2×"
	},
	{
		v: 5,
		l: "5×"
	},
	{
		v: 100,
		l: "Instant"
	}
];
function StudioPanel() {
	const frameRef = (0, import_react.useRef)(null);
	const abortRef = (0, import_react.useRef)(null);
	const [resetKey, setResetKey] = (0, import_react.useState)(0);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [draftNames, setDraftNames] = (0, import_react.useState)({});
	const recording = useStudio((s) => s.recording);
	const playing = useStudio((s) => s.playing);
	const liveSteps = useStudio((s) => s.liveSteps);
	const drafts = useStudio((s) => s.drafts);
	const macros = useStudio((s) => s.macros);
	const speed = useStudio((s) => s.speed);
	const loops = useStudio((s) => s.loops);
	const infinite = useStudio((s) => s.infinite);
	const playingMacroId = useStudio((s) => s.playingMacroId);
	const stepIndex = useStudio((s) => s.stepIndex);
	const autoDismiss = useStudio((s) => s.autoDismiss);
	const { setRecording, stopRecording, saveDraft, discardDraft, updateDraftSteps, saveMacro, deleteMacro, setPlayback, setSpeed, setLoops, setInfinite, setAutoDismiss, log } = useStudio();
	function toggleRecord() {
		if (playing) return;
		if (recording) {
			stopRecording();
			log("ok", "Enregistrement arrêté.");
		} else {
			setResetKey((k) => k + 1);
			setRecording(true);
			log("info", "Enregistrement lancé — clique et saisis dans la boutique.");
		}
	}
	async function playMacro(macro) {
		if (recording) return;
		if (playing && playingMacroId === macro.id) {
			abortRef.current?.abort();
			setPlayback({
				playing: false,
				playingMacroId: null
			});
			return;
		}
		const ac = new AbortController();
		abortRef.current = ac;
		setResetKey((k) => k + 1);
		setPlayback({
			playing: true,
			playingMacroId: macro.id,
			stepIndex: 0
		});
		log("info", `Lecture — ${macro.name}`);
		await new Promise((r) => window.setTimeout(r, 50));
		const fresh = frameRef.current?.host();
		if (!fresh) {
			setPlayback({
				playing: false,
				playingMacroId: null
			});
			return;
		}
		try {
			let remaining = infinite ? Number.POSITIVE_INFINITY : Math.max(1, loops);
			while (!ac.signal.aborted && remaining > 0) {
				await runMacroSteps(fresh, macro.steps, 0, speed, ac.signal, (i) => setPlayback({ stepIndex: i }));
				remaining -= 1;
			}
			if (!ac.signal.aborted) log("ok", "Lecture terminée.");
		} finally {
			setPlayback({
				playing: false,
				playingMacroId: null,
				stepIndex: 0
			});
		}
	}
	function exportMacro(macro) {
		const blob = new Blob([JSON.stringify(macro, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${macro.name.replace(/[^a-z0-9-_]+/gi, "_")}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}
	async function onImport(file) {
		try {
			const macro = JSON.parse(await file.text());
			if (!Array.isArray(macro.steps)) throw new Error("format");
			saveMacro({
				...macro,
				id: `macro_${Date.now()}`,
				name: macro.name || "Macro importée",
				createdAt: Date.now()
			});
			toast.success("Macro importée");
		} catch {
			toast.error("Fichier de macro invalide");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: recording ? "outline" : "record",
							className: "w-full",
							disabled: playing,
							onClick: toggleRecord,
							children: recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5 fill-current" }),
								"Arrêter (",
								liveSteps.length,
								" étape",
								liveSteps.length > 1 ? "s" : "",
								")"
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "size-3 fill-current" }), "Démarrer l’enregistrement"] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: recording ? "Navigue dans la boutique : clics et saisies sont enregistrés." : "La macro se joue sur la page démo, comme l’extension sur un vrai onglet."
						}),
						recording && liveSteps.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeStrip, { steps: liveSteps }) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground",
							children: "Assistant anti-pop-up"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: autoDismiss,
							onCheckedChange: setAutoDismiss
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "Ferme les bannières type cookies / « fermer » pendant la lecture. Ne touche pas aux publicités — ça, c’est le mode Pubs."
					})]
				}),
				drafts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-primary/30 bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-medium uppercase tracking-[0.14em] text-primary",
							children: "Nouvelle macro"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-2",
							placeholder: "Nom (ex. Connexion au site)",
							value: draftNames[d.id] ?? "",
							onChange: (e) => setDraftNames((m) => ({
								...m,
								[d.id]: e.target.value
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeStrip, {
							steps: d.steps,
							editable: true,
							onChangeDelay: (i, v) => {
								const steps = d.steps.map((s, idx) => idx === i ? {
									...s,
									delay: v
								} : s);
								updateDraftSteps(d.id, steps);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "flex-1",
								onClick: () => saveDraft(d.id, draftNames[d.id] ?? ""),
								children: "Enregistrer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => discardDraft(d.id),
								children: "Annuler"
							})]
						})
					]
				}, d.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground",
							children: "Mes macros"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 text-xs text-muted-foreground hover:text-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }),
								"Importer",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "application/json",
									className: "hidden",
									onChange: (e) => {
										const f = e.target.files?.[0];
										if (f) onImport(f);
										e.target.value = "";
									}
								})
							]
						})]
					}), macros.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: "Aucune macro — enregistre ta première action ci-dessus."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-col gap-3",
						children: macros.map((macro) => {
							const isThis = playing && playingMacroId === macro.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-border bg-secondary p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium",
											children: macro.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-muted-foreground",
											children: [macro.steps.length, " étapes"]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: isThis ? "record" : "outline",
													className: "size-8",
													disabled: recording,
													onClick: () => void playMacro(macro),
													title: isThis ? "Arrêter" : "Jouer",
													children: isThis ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3 fill-current" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-px size-3 fill-current" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													className: "size-8",
													onClick: () => setEditingId(editingId === macro.id ? null : macro.id),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													className: "size-8",
													onClick: () => exportMacro(macro),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													className: "size-8",
													onClick: () => {
														if (confirm(`Supprimer « ${macro.name} » ?`)) deleteMacro(macro.id);
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
												})
											]
										})]
									}),
									isThis ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-[11px] text-play",
										children: [
											"Étape ",
											stepIndex,
											" / ",
											macro.steps.length,
											infinite ? " · boucle infinie" : ""
										]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 grid grid-cols-2 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Vitesse", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											disabled: isThis,
											value: String(speed),
											onChange: (e) => setSpeed(parseFloat(e.target.value)),
											className: "mt-1 h-8 w-full rounded-md border border-border bg-card px-2 text-xs text-foreground",
											children: SPEEDS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: s.v,
												children: s.l
											}, s.v))
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Répéter", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: 1,
												max: 99,
												disabled: isThis || infinite,
												value: infinite ? "" : loops,
												onChange: (e) => setLoops(parseInt(e.target.value, 10) || 1),
												className: "h-8 w-full rounded-md border border-border bg-card px-2 text-xs"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-1 text-xs text-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													disabled: isThis,
													checked: infinite,
													onChange: (e) => setInfinite(e.target.checked)
												}), "∞"]
											})]
										})] })]
									}),
									editingId === macro.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeStrip, {
										steps: macro.steps,
										editable: true,
										activeIndex: isThis ? stepIndex : void 0,
										onChangeDelay: (i, v) => {
											const steps = macro.steps.map((s, idx) => idx === i ? {
												...s,
												delay: v
											} : s);
											saveMacro({
												...macro,
												steps
											});
										}
									}) : null
								]
							}, macro.id);
						})
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrowserFrame, {
			ref: frameRef,
			url: "atelier-nord.demo/boutique",
			recording,
			playing,
			className: "min-h-[520px]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopSite, { resetKey })
		})]
	});
}
var STEPS = [
	{
		title: "Toi",
		fields: [
			{
				id: "q-firstname",
				label: "Prénom",
				kind: "text"
			},
			{
				id: "q-lastname",
				label: "Nom",
				kind: "text"
			},
			{
				id: "q-email",
				label: "Adresse e-mail",
				kind: "text"
			},
			{
				id: "q-city",
				label: "Ville",
				kind: "text"
			},
			{
				id: "q-age",
				label: "Tranche d’âge",
				kind: "choice",
				options: [
					"18 – 24",
					"25 – 34",
					"35 – 44",
					"45 – 54",
					"55 et plus"
				]
			}
		]
	},
	{
		title: "Dates & fêtes",
		fields: [
			{
				id: "q-birth",
				label: "Date de naissance",
				kind: "text"
			},
			{
				id: "q-holidays",
				label: "Quelles dates de fêtes sont importantes pour toi cette année ?",
				kind: "textarea"
			},
			{
				id: "q-xmas",
				label: "Es-tu disponible le 25 décembre ?",
				kind: "choice",
				options: [
					"Oui, je suis disponible",
					"Non, je suis occupé·e",
					"Je ne sais pas encore"
				]
			},
			{
				id: "q-summer",
				label: "Pars-tu en vacances en juillet ?",
				kind: "choice",
				options: [
					"Oui",
					"Non",
					"Seulement une partie du mois"
				]
			}
		]
	},
	{
		title: "Goûts",
		fields: [
			{
				id: "q-likes",
				label: "Qu’est-ce que tu aimes ?",
				kind: "textarea"
			},
			{
				id: "q-nps",
				label: "Recommanderais-tu ce type de sondage à un ami ?",
				kind: "choice",
				options: [
					"Oui, clairement",
					"Peut-être",
					"Non"
				]
			},
			{
				id: "q-comment",
				label: "Un commentaire libre — dis-nous ce qui compte pour toi.",
				kind: "textarea"
			}
		]
	}
];
var SurveySite = (0, import_react.forwardRef)(function SurveySite({ onComplete }, ref) {
	const [step, setStep] = (0, import_react.useState)(0);
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [done, setDone] = (0, import_react.useState)(false);
	const current = STEPS[step];
	function setField(id, value) {
		setAnswers((a) => ({
			...a,
			[id]: value
		}));
	}
	const snapshot = () => {
		if (done) return [];
		const els = current.fields.map((f) => ({
			id: f.id,
			tag: f.kind === "textarea" ? "textarea" : f.kind === "choice" ? "div" : "input",
			label: f.label,
			value: answers[f.id] ?? "",
			options: "options" in f ? [...f.options] : void 0,
			visible: true,
			kind: f.kind === "choice" ? "choice" : "field"
		}));
		els.push({
			id: step < STEPS.length - 1 ? "q-next" : "q-submit",
			tag: "button",
			label: step < STEPS.length - 1 ? "Suivant" : "Envoyer",
			visible: true
		});
		return els;
	};
	(0, import_react.useImperativeHandle)(ref, () => ({
		snapshot,
		setField,
		step
	}));
	const progress = (0, import_react.useMemo)(() => (step + (done ? 1 : 0)) / STEPS.length * 100, [step, done]);
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "site-survey flex min-h-full flex-col items-center justify-center bg-[#f7f5f1] px-6 py-16 text-center text-[#1a1916]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.2em] text-[#6b645b]",
				children: "Opinion Lab"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-display text-2xl font-semibold",
				children: "Merci, c’est noté."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-sm text-sm text-[#6b645b]",
				children: "Tes réponses, y compris les fêtes, ont été enregistrées dans cette démo."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					setStep(0);
					setAnswers({});
					setDone(false);
				},
				className: "mt-6 h-10 rounded-md border border-[#e4dfd6] px-4 text-sm",
				children: "Recommencer le sondage"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "site-survey min-h-full px-5 py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-[#6b645b]",
					children: [
						"Opinion Lab · ",
						step + 1,
						"/",
						STEPS.length
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold",
					children: current.title
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-xs text-[#6b645b]",
					children: [Math.round(progress), "%"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-5 h-1 overflow-hidden rounded-full bg-[#e4dfd6]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-[#2f5d50] transition-[width] duration-300",
					style: { width: `${progress}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-4",
				children: current.fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs font-medium text-[#5c564e]",
					htmlFor: f.id,
					children: f.label
				}), f.kind === "choice" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-ra-id": f.id,
					className: "mt-2 flex flex-col gap-1.5",
					children: f.options.map((opt) => {
						const selected = answers[f.id] === opt;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-option": opt,
							onClick: () => setField(f.id, opt),
							className: cn("h-10 rounded-md border px-3 text-left text-sm", selected ? "border-[#2f5d50] bg-[#2f5d50] text-white" : "border-[#e4dfd6] bg-white"),
							children: opt
						}, opt);
					})
				}) : f.kind === "textarea" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: f.id,
					"data-ra-id": f.id,
					value: answers[f.id] ?? "",
					onChange: (e) => setField(f.id, e.target.value),
					rows: 3,
					className: "mt-1.5 w-full rounded-md border border-[#e4dfd6] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2f5d50]/30"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: f.id,
					"data-ra-id": f.id,
					value: answers[f.id] ?? "",
					onChange: (e) => setField(f.id, e.target.value),
					className: "mt-1.5 h-10 w-full rounded-md border border-[#e4dfd6] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#2f5d50]/30"
				})] }, f.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"data-ra-id": step < STEPS.length - 1 ? "q-next" : "q-submit",
				onClick: () => {
					if (step < STEPS.length - 1) setStep((s) => s + 1);
					else {
						setDone(true);
						onComplete(answers);
					}
				},
				className: "mt-6 h-11 w-full rounded-md bg-[#1a1916] text-sm font-medium text-[#f7f5f1]",
				children: step < STEPS.length - 1 ? "Suivant" : "Envoyer"
			})
		]
	});
});
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	className: cn("flex min-h-24 w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Textarea.displayName = "Textarea";
var FR_HOLIDAY_PRESETS = [
	{
		name: "Jour de l'An",
		month: 1,
		day: 1
	},
	{
		name: "Fête du travail",
		month: 5,
		day: 1
	},
	{
		name: "Victoire 1945",
		month: 5,
		day: 8
	},
	{
		name: "Fête nationale",
		month: 7,
		day: 14
	},
	{
		name: "Assomption",
		month: 8,
		day: 15
	},
	{
		name: "Toussaint",
		month: 11,
		day: 1
	},
	{
		name: "Armistice",
		month: 11,
		day: 11
	},
	{
		name: "Noël",
		month: 12,
		day: 25
	}
];
function SurveyPanel() {
	const frameRef = (0, import_react.useRef)(null);
	const surveyRef = (0, import_react.useRef)(null);
	const abortRef = (0, import_react.useRef)(null);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [session, setSession] = (0, import_react.useState)(0);
	const finishedRef = (0, import_react.useRef)(false);
	const [holName, setHolName] = (0, import_react.useState)("");
	const [holDay, setHolDay] = (0, import_react.useState)(25);
	const [holMonth, setHolMonth] = (0, import_react.useState)(12);
	const profile = useStudio((s) => s.profile);
	const speed = useStudio((s) => s.speed);
	const { updateProfile, addHoliday, removeHoliday, loadSampleProfile, log } = useStudio();
	async function start() {
		if (running) {
			abortRef.current?.abort();
			setRunning(false);
			return;
		}
		finishedRef.current = false;
		const ac = new AbortController();
		abortRef.current = ac;
		setRunning(true);
		log("info", "Mode sondage — remplissage à partir du profil et des fêtes.");
		try {
			await runAssistant({
				mode: "survey",
				getHost: () => frameRef.current?.host() ?? null,
				snapshot: () => surveyRef.current?.snapshot() ?? [],
				profile,
				speed,
				signal: ac.signal,
				onLog: log,
				isFinished: () => finishedRef.current
			});
		} finally {
			setRunning(false);
		}
	}
	function addFromForm() {
		if (!holName.trim()) return;
		addHoliday({
			name: holName.trim(),
			day: holDay,
			month: holMonth,
			notes: ""
		});
		setHolName("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg font-semibold",
							children: "Mode sondage"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "L’assistant répond avec ton identité et les dates de fêtes que tu as ajoutées — Noël, anniversaires, départs en vacances."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiStatus, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: running ? "record" : "play",
							className: "mt-4 w-full",
							onClick: () => void start(),
							children: running ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5 fill-current" }), "Arrêter"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "size-4" }), "Répondre au sondage"] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-2 w-full text-center text-[11px] text-muted-foreground hover:text-foreground",
							onClick: () => {
								abortRef.current?.abort();
								setRunning(false);
								finishedRef.current = false;
								setSession((n) => n + 1);
							},
							children: "Recommencer le formulaire"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground",
								children: "Profil"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: loadSampleProfile,
								className: "text-[11px] text-primary hover:underline",
								children: "Charger l’exemple Léa"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-2 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Prénom",
									value: profile.firstName,
									onChange: (v) => updateProfile({ firstName: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Nom",
									value: profile.lastName,
									onChange: (v) => updateProfile({ lastName: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "E-mail",
									value: profile.email,
									onChange: (v) => updateProfile({ email: v }),
									className: "col-span-2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Ville",
									value: profile.city,
									onChange: (v) => updateProfile({ city: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Naissance",
									type: "date",
									value: profile.birthDate,
									onChange: (v) => updateProfile({ birthDate: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Métier",
									value: profile.occupation,
									onChange: (v) => updateProfile({ occupation: v }),
									className: "col-span-2"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "mt-3 block",
							children: ["Ce que tu aimes", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								value: profile.likes,
								onChange: (e) => updateProfile({ likes: e.target.value })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "mt-2 block",
							children: ["Bio", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "mt-1",
								rows: 2,
								value: profile.bio,
								onChange: (e) => updateProfile({ bio: e.target.value })
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-3.5" }), "Dates de fêtes"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-1.5",
							children: FR_HOLIDAY_PRESETS.map((p) => {
								const already = profile.holidays.some((h) => h.name === p.name && h.month === p.month && h.day === p.day);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: already,
									onClick: () => addHoliday({
										...p,
										notes: ""
									}),
									className: "h-8 rounded-full border border-border px-2.5 text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-40",
									children: p.name
								}, p.name);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-col gap-2",
							children: profile.holidays.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2 rounded-md border border-border bg-secondary px-2.5 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: h.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-[11px] text-muted-foreground",
										children: formatHolidayDate(h.month, h.day, h.year)
									}),
									h.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: h.notes
									}) : null
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => removeHoliday(h.id),
									className: "text-muted-foreground hover:text-record",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
								})]
							}, h.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-[1fr_4.5rem_7rem_auto] gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Nom de la fête",
									value: holName,
									onChange: (e) => setHolName(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 1,
									max: 31,
									value: holDay,
									onChange: (e) => setHolDay(parseInt(e.target.value, 10) || 1)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: holMonth,
									onChange: (e) => setHolMonth(parseInt(e.target.value, 10)),
									className: "h-10 rounded-md border border-border bg-secondary px-2 text-xs",
									children: Array.from({ length: 12 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: i + 1,
										children: monthNameFr(i + 1)
									}, i + 1))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									onClick: addFromForm,
									"aria-label": "Ajouter une fête",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityLog, {})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrowserFrame, {
			ref: frameRef,
			url: "opinionlab.demo/sondage/lifestyle",
			playing: running,
			className: "min-h-[560px]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SurveySite, {
				ref: surveyRef,
				onComplete: () => {
					finishedRef.current = true;
					log("ok", "Sondage envoyé.");
				}
			}, session)
		})]
	});
}
function Field({ label, value, onChange, type = "text", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
		className,
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "mt-1",
			type,
			value,
			onChange: (e) => onChange(e.target.value)
		})]
	});
}
var MODES = [
	{
		id: "studio",
		label: "Studio",
		Icon: Repeat,
		hint: "Enregistrer & rejouer"
	},
	{
		id: "ads",
		label: "Pubs",
		Icon: Clapperboard,
		hint: "Les faire jouer"
	},
	{
		id: "surveys",
		label: "Sondages",
		Icon: ClipboardList,
		hint: "Réponses auto"
	}
];
function AppShell() {
	const mode = useStudio((s) => s.mode);
	const recording = useStudio((s) => s.recording);
	const setMode = useStudio((s) => s.setMode);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2.5 rounded-full bg-border", recording && "rec-live bg-record") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-xl font-semibold tracking-tight sm:text-2xl",
						children: "Répète-Actions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] text-muted-foreground",
						children: "Enregistre. Joue les pubs. Réponds aux sondages."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex gap-1 rounded-lg bg-secondary p-1",
					children: MODES.map((m) => {
						const active = mode === m.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setMode(m.id),
							className: cn("flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md px-3 text-sm transition-colors sm:flex-none", active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m.Icon, { className: "size-4" }), m.label]
						}, m.id);
					})
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 py-6 sm:px-6",
			children: [
				mode === "studio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Intro, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioPanel, {})] }) : null,
				mode === "ads" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdsPanel, {}) : null,
				mode === "surveys" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SurveyPanel, {}) : null
			]
		})]
	});
}
function Intro() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-6 max-w-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm leading-relaxed text-muted-foreground",
			children: "Même logique que l’extension : tu enregistres une suite de clics, tu la rejoues à la vitesse que tu veux. Ici, le studio le fait sur une boutique démo. L’IA s’occupe des pubs et remplit les sondages en s’appuyant sur tes dates de fêtes."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "size-2 fill-record text-record" }), "Enregistrement par onglet"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1",
					children: "Pubs en lecture auto"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1",
					children: "Sondages + calendrier de fêtes"
				})
			]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {});
}
//#endregion
export { Home as component };

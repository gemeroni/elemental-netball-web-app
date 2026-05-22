# elemental-netball web app — Agent rules

This is the **interactive web app** half of the Elemental Netball project. The other half is a Python + Jinja2 + Playwright PDF pipeline at `C:\Users\gemma\Code\elemental-netball` (different repo, different codebase, shared design system).

## What this is

A mobile-first React SPA that teaches netball positions and matchups through the 7-colour spectrum. Two tabs:
- **Positions** - tap a bib to explore that position: matchup pair, zone diagram, role description, key note, matchup description. Fire/Ice team toggle flips all colours.
- **Court** - interactive court diagram (InteractiveCourt component).

Target audience: beginner players (children), parents, coaches. Keep copy clear and simple.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite 7 + TypeScript |
| Styling | Tailwind CSS v4 |
| UI primitives | Radix UI (shadcn-style, in `src/components/ui/`) |
| Animations | Framer Motion |
| Routing | Wouter (single route for now) |
| Package manager | pnpm (monorepo workspace) |

## Repository layout

```
artifacts/elemental-netball/   this app
  src/
    App.tsx                    root — just TooltipProvider + ElementalNetball + Toaster
    main.tsx                   entry point
    data/positions.ts          POSITIONS array + Team type — single source of truth for all content
    assets/bibSvgs.ts          inline SVG strings for bibs
    assets/zoneSvgs.ts         inline SVG strings for zone diagrams
    components/
      ElementalNetball.tsx     top-level shell: tab state, Fire/Ice toggle, header, routes to sections
      BibSvg.tsx               renders a bib SVG by position code + team
      CourtZone.tsx            zone diagram for active position
      InteractiveCourt.tsx     Court tab content
      sections/                sub-sections (PickYourSide, Positions, TheCourt, TheRules)
      ui/                      shadcn-style Radix primitives — do not modify
    hooks/
      use-mobile.tsx           breakpoint detection
      use-toast.ts             toast state
    lib/utils.ts               cn() helper
    pages/not-found.tsx        404 page
  vite.config.ts               patched for local dev (PORT/BASE_PATH default to 5173 and /)
  .env                         local dev env vars (PORT=5173, BASE_PATH=/)
lib/                           shared workspace libs (api-client-react, api-spec, api-zod, db)
artifacts/api-server/          backend API server
pnpm-workspace.yaml            monorepo config — patched to allow Windows binaries + esbuild build
package.json                   workspace root — preinstall script removed (was Unix-only)
```

## Design tokens (identical to PDF pipeline)

**Never invent new colours.** The 7-position spectrum is the brand:

| Token | Hex | Position role |
|---|---|---|
| Red | `#cc3333` | GS Fire / GK Ice |
| Orange | `#ef6d22` | GA Fire / GD Ice |
| Yellow | `#ffaa00` | WA Fire / WD Ice |
| Green | `#009933` | C (both teams) |
| Teal | `#009999` | WD Fire / WA Ice |
| Blue | `#0052b3` | GD Fire / GA Ice |
| Purple | `#663399` | GK Fire / GS Ice |

- `fireHex` and `iceHex` per position are in `src/data/positions.ts` - use those, don't hardcode.
- Fire Team: filled bibs (solid colour). Ice Team: outlined bibs (white interior, coloured stroke + text).
- C (Centre) is green for both teams - same hue, different bib treatment.

## Key patterns

**State lives in ElementalNetball.tsx**: `activePos` (position code), `activeTeam` (Fire/Ice), `tab` (positions/court). Lift state there if a child needs it; don't duplicate.

**Position data comes from `POSITIONS`**: All position content (name, tagline, role, zones, matchup, colours) is in `src/data/positions.ts`. To change copy, change it there. Don't hardcode position text in components.

**Path aliases**: `@/` resolves to `src/`, `@assets/` resolves to `attached_assets/` (two levels up from app root).

**Bib SVGs**: rendered via `BibSvg` component, which looks up inline SVG strings from `src/assets/bibSvgs.ts` by position code + team.

**Animations**: use Framer Motion (`motion.div`, `AnimatePresence`) consistent with existing patterns. Keep durations short (0.15-0.22s). Don't add animation to static/non-interactive elements.

**No server-side logic in this package**: the app fetches from `artifacts/api-server` if/when needed. Keep component files free of API calls unless using TanStack Query.

## Local dev

```powershell
cd C:\Users\gemma\Code\elemental-netball-app
pnpm install
pnpm --filter @workspace/elemental-netball dev
# App runs at http://localhost:5173/
```

Changes hot-reload. The `.env` file at `artifacts/elemental-netball/.env` provides PORT and BASE_PATH defaults.

## Deployment

Replit pulls from the `main` branch of `gemeroni/elemental-netball` on GitHub. Push to `main` to deploy. Replit runs `pnpm --filter @workspace/elemental-netball dev` with its own PORT env var.

## Figma file

**Elemental Netball — Web App**: https://www.figma.com/design/8IrDxLkc9QGHr3hqlql11p

- Colour variables: `Elemental Netball` collection — all 7 position tokens + team accents + dark UI tokens
- Pages: Positions — Fire, Positions — Ice, Court, 🎨 Tokens
- Positions — Fire has the GS screen built (phone frame + full-scroll variant)
- Ice and Court screens are stubs — build out as needed

## Things that look right but are wrong

- Adding colours outside the 7-position spectrum - the palette is the brand, don't extend it.
- Hardcoding position names, taglines, or descriptions in components - they live in `positions.ts`.
- Modifying `src/components/ui/` files - these are generated shadcn primitives, regenerate them instead.
- Using `BASE_PATH` or `PORT` without defaults - vite.config.ts now defaults them for local dev, don't revert.
- Committing `pnpm-workspace.yaml` changes that re-exclude `@rollup/rollup-win32-x64-msvc` or `esbuild>@esbuild/win32-x64` - these were intentionally unblocked for Windows local dev.

## Style rules

- No em-dashes anywhere (per global rule). Use a hyphen or rephrase.
- Fire Team / Ice Team are proper nouns - always use the full form in copy. Bare "Fire" / "Ice" only as adjectives.
- Position codes: GS, GA, WA, C, WD, GD, GK.

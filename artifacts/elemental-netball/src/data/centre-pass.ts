// Centre pass starting zone data for the mini-game.
//
// Court normalised coordinates: y=0 = top = Fire attacking end.
// Transverse lines at y approx 0.335 (upper) and y approx 0.665 (lower).
//
// Rules source: all positions except C must start in their designated
// thirds before the umpire's whistle. C stands in the centre circle.

import type { Team } from "./positions";

export type GameTeam = Extract<Team, "Fire" | "Ice">;

export interface CentrePassStep {
  code: string;
  name: string;
  // Colour for the highlighted zone overlay
  fireHex: string;
  iceHex: string;
  // Plain-English placement instruction
  firePrompt: string;
  icePrompt: string;
  // Normalised y-range [min, max] the player's tap must land inside
  fireValidY: [number, number];
  iceValidY: [number, number];
  // Normalised y-range to visually highlight on the court
  fireHighlightY: [number, number];
  iceHighlightY: [number, number];
  // Where the bib snaps to once placed (from InteractiveCourt FIRE_INIT / ICE_INIT)
  fireSnap: [number, number];
  iceSnap: [number, number];
}

export const CENTRE_PASS_STEPS: CentrePassStep[] = [
  {
    code: "GS",
    name: "Goal Shooter",
    fireHex: "#F42040",
    iceHex: "#8833EE",
    firePrompt: "GS goes into the attacking goal third, ready to receive and shoot",
    icePrompt: "GS goes into the attacking goal third, ready to receive and shoot",
    fireValidY: [0.00, 0.34],
    iceValidY:  [0.66, 1.00],
    fireHighlightY: [0.00, 0.335],
    iceHighlightY:  [0.665, 1.00],
    fireSnap: [0.38, 0.17],
    iceSnap:  [0.57, 0.83],
  },
  {
    code: "GA",
    name: "Goal Attack",
    fireHex: "#FF6600",
    iceHex: "#2060FF",
    firePrompt: "GA lines up near the transverse on the attacking side, ready to link up with C",
    icePrompt: "GA lines up near the transverse on the attacking side, ready to link up with C",
    fireValidY: [0.00, 0.56],
    iceValidY:  [0.44, 1.00],
    fireHighlightY: [0.00, 0.50],
    iceHighlightY:  [0.50, 1.00],
    fireSnap: [0.20, 0.37],
    iceSnap:  [0.76, 0.64],
  },
  {
    code: "WA",
    name: "Wing Attack",
    fireHex: "#FFD800",
    iceHex: "#00C8DC",
    firePrompt: "WA stands in the centre third, ready to receive the ball from C",
    icePrompt: "WA stands in the centre third, ready to receive the ball from C",
    fireValidY: [0.28, 0.67],
    iceValidY:  [0.33, 0.72],
    fireHighlightY: [0.335, 0.665],
    iceHighlightY:  [0.335, 0.665],
    fireSnap: [0.72, 0.34],
    iceSnap:  [0.18, 0.62],
  },
  {
    code: "C",
    name: "Centre",
    fireHex: "#00C853",
    iceHex: "#00C853",
    firePrompt: "C stands in the centre circle with the ball, ready to take the pass",
    icePrompt: "C stands in the centre third away from the circle, waiting for the whistle",
    fireValidY: [0.38, 0.62],
    iceValidY:  [0.335, 0.665],
    fireHighlightY: [0.38, 0.62],
    iceHighlightY:  [0.335, 0.665],
    fireSnap: [0.42, 0.50],
    iceSnap:  [0.60, 0.52],
  },
  {
    code: "WD",
    name: "Wing Defence",
    fireHex: "#00C8DC",
    iceHex: "#FFD800",
    firePrompt: "WD stands in the centre third, ready to pressure the opposing WA",
    icePrompt: "WD stands in the centre third, ready to pressure the opposing WA",
    fireValidY: [0.33, 0.72],
    iceValidY:  [0.28, 0.67],
    fireHighlightY: [0.335, 0.665],
    iceHighlightY:  [0.335, 0.665],
    fireSnap: [0.28, 0.62],
    iceSnap:  [0.62, 0.34],
  },
  {
    code: "GD",
    name: "Goal Defence",
    fireHex: "#2060FF",
    iceHex: "#FF6600",
    firePrompt: "GD marks up near the transverse on the defensive side, shadowing the opposing GA",
    icePrompt: "GD marks up near the transverse on the defensive side, shadowing the opposing GA",
    fireValidY: [0.46, 1.00],
    iceValidY:  [0.00, 0.54],
    fireHighlightY: [0.50, 1.00],
    iceHighlightY:  [0.00, 0.50],
    fireSnap: [0.62, 0.64],
    iceSnap:  [0.30, 0.37],
  },
  {
    code: "GK",
    name: "Goal Keeper",
    fireHex: "#8833EE",
    iceHex: "#F42040",
    firePrompt: "GK is in the defensive goal third, protecting the goal from the opposing GS",
    icePrompt: "GK is in the defensive goal third, protecting the goal from the opposing GS",
    fireValidY: [0.655, 1.00],
    iceValidY:  [0.00, 0.345],
    fireHighlightY: [0.665, 1.00],
    iceHighlightY:  [0.00, 0.335],
    fireSnap: [0.38, 0.83],
    iceSnap:  [0.53, 0.17],
  },
];

export function getStepHex(step: CentrePassStep, team: GameTeam): string {
  return team === "Fire" ? step.fireHex : step.iceHex;
}

export function getStepPrompt(step: CentrePassStep, team: GameTeam): string {
  return team === "Fire" ? step.firePrompt : step.icePrompt;
}

export function getStepValidY(step: CentrePassStep, team: GameTeam): [number, number] {
  return team === "Fire" ? step.fireValidY : step.iceValidY;
}

export function getStepHighlightY(step: CentrePassStep, team: GameTeam): [number, number] {
  return team === "Fire" ? step.fireHighlightY : step.iceHighlightY;
}

export function getStepSnap(step: CentrePassStep, team: GameTeam): [number, number] {
  return team === "Fire" ? step.fireSnap : step.iceSnap;
}

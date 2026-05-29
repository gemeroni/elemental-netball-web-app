export type Team = "Fire" | "Ice";

export interface Position {
  id: string;
  code: string;
  name: string;
  fireHex: string;
  iceHex: string;
  fireColorName: string;
  iceColorName: string;
  tagline: string;
  role: string;
  zones: string;
  zoneCaption: string;
  note: string;
  matchup: string;
  matchupDescription: string;
}

export const POSITIONS: Position[] = [
  {
    id: "gs",
    code: "GS",
    name: "Goal Shooter",
    fireHex: "#F42040",
    iceHex: "#8833EE",
    fireColorName: "Red",
    iceColorName: "Purple",
    tagline: "the team's scorer",
    role: "Get into the shooting circle, call for the ball, and score. Work with GA to hold space, create leads, and convert every chance. Keep it simple - the simpler you play, the more you score.",
    zones: "Attacking goal third only, including the shooting circle.",
    zoneCaption: "Attacking goal third only. GS can enter the shooting circle.",
    note: "Only GS and GA can shoot for goal, and only from inside the shooting circle. If you are not in the circle, you cannot shoot.",
    matchup: "GK",
    matchupDescription:
      "GS leads for space. GK works to take it away. Get free inside the circle, take your shot, and hold your ground for the rebound.",
  },
  {
    id: "ga",
    code: "GA",
    name: "Goal Attack",
    fireHex: "#FF6600",
    iceHex: "#2060FF",
    fireColorName: "Orange",
    iceColorName: "Blue",
    tagline: "link up and finish",
    role: "GA connects the midcourt to the shooting circle. Run hard to bring the ball forward, then get into the circle and score alongside GS. You are one of only two players on court who can shoot.",
    zones: "Centre third and attacking goal third, including the shooting circle.",
    zoneCaption: "Centre third and attacking goal third. GA can enter the shooting circle.",
    note: "GA covers more ground than any other attacking player - from the centre third all the way into the shooting circle.",
    matchup: "GD",
    matchupDescription:
      "GA needs separation to feed or shoot. GD works to deny every pass. Create space early, move the ball quickly, and trust your angles.",
  },
  {
    id: "wa",
    code: "WA",
    name: "Wing Attack",
    fireHex: "#FFD800",
    iceHex: "#00C8DC",
    fireColorName: "Yellow",
    iceColorName: "Aqua",
    tagline: "set the attack up",
    role: "WA drives the ball into the attacking half and delivers it to GS and GA. When play restarts, get free in the centre third so the Centre can pass to you. You cannot enter the shooting circle - your job is to put your shooters in the best position to score.",
    zones: "Centre third and attacking goal third, NOT the shooting circle.",
    zoneCaption: "Centre third and attacking goal third. WA cannot enter the shooting circle.",
    note: "WA cannot shoot for goal. Get free to receive the centre pass, keep the ball moving forward, and set GA and GS up to score.",
    matchup: "WD",
    matchupDescription:
      "WA needs a clean first touch at the centre pass. WD will try to deny it. Drive hard, change direction early, and get to the ball first.",
  },
  {
    id: "c",
    code: "C",
    name: "Centre",
    fireHex: "#00C853",
    iceHex: "#00C853",
    fireColorName: "Green",
    iceColorName: "Green",
    tagline: "run the whole court",
    role: "Centre takes every centre pass and covers the full court. You link defence to attack, drive the ball forward, and work hard to win it back when you lose it. Expect to do the most running on court.",
    zones: "All three thirds of the court, NOT either shooting circle.",
    zoneCaption: "All three thirds. Centre cannot enter either shooting circle.",
    note: "Centre is the only position that can go anywhere on court - except into either shooting circle.",
    matchup: "C",
    matchupDescription:
      "Both Centres race to control the midcourt. Stay sharp, protect the ball when you have it, and keep the pressure on when you do not.",
  },
  {
    id: "wd",
    code: "WD",
    name: "Wing Defence",
    fireHex: "#00C8DC",
    iceHex: "#FFD800",
    fireColorName: "Aqua",
    iceColorName: "Yellow",
    tagline: "shut the attack down",
    role: "WD marks WA and works to cut the ball off before it reaches the shooting circle. You cannot enter the circle, so your best work happens early - intercept passes, pressure leads, and disrupt the attack in the centre third.",
    zones: "Centre third and defensive goal third, NOT the shooting circle.",
    zoneCaption: "Centre third and defensive goal third. WD cannot enter the shooting circle.",
    note: "WD cannot enter the shooting circle. Apply pressure in the centre third, before the ball gets close to the goal.",
    matchup: "WA",
    matchupDescription:
      "WD follows WA through every lead. Read the play early, cut off the pass, and win the interception before the attack builds.",
  },
  {
    id: "gd",
    code: "GD",
    name: "Goal Defence",
    fireHex: "#2060FF",
    iceHex: "#FF6600",
    fireColorName: "Blue",
    iceColorName: "Orange",
    tagline: "deny and disrupt",
    role: "GD marks GA from the transverse line all the way back to the shooting circle. Contest every pass, challenge every entry, and step into the circle to help GK protect the goal.",
    zones: "Centre third and defensive goal third, including the shooting circle.",
    zoneCaption: "Centre third and defensive goal third. GD can enter the shooting circle.",
    note: "GD covers the most ground of any defender - from midcourt all the way back to the shooting circle. Stay goal-side of GA to cut off their options.",
    matchup: "GA",
    matchupDescription:
      "GD stays goal-side of GA on every lead. Deny the pass, challenge the shot, and force GA into tough decisions.",
  },
  {
    id: "gk",
    code: "GK",
    name: "Goal Keeper",
    fireHex: "#8833EE",
    iceHex: "#F42040",
    fireColorName: "Purple",
    iceColorName: "Red",
    tagline: "protect the goal",
    role: "GK marks GS inside the shooting circle and works with GD to stop GA too. Contest every shot, fight for every rebound. You are the last line of defence - make scoring feel impossible.",
    zones: "Defensive goal third only, including the shooting circle.",
    zoneCaption: "Defensive goal third only. GK can enter the shooting circle to defend.",
    note: "GK primarily marks GS, but GA can also enter the circle. Two shooters, one keeper - stay sharp.",
    matchup: "GS",
    matchupDescription:
      "GS wants space inside the circle. GK takes it away. Get goal-side, contest every shot, and claim the rebound.",
  },
];

export const getPositionByCode = (code: string) =>
  POSITIONS.find((p) => p.code === code);

export const getBibFilename = (code: string, team: Team) => {
  const pos = getPositionByCode(code);
  if (!pos) return "";
  const colorName = team === "Fire" ? pos.fireColorName : pos.iceColorName;
  return `${colorName}_${code}_${team}.svg`;
};

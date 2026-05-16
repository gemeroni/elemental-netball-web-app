import './_group.css';
import { useState } from 'react';

const POSITIONS = [
  { code:'GS', name:'Goal Shooter',  fireHex:'#cc3333', iceHex:'#663399', tagline:'top scorer',         matchup:'GK', role:'GS works inside the shooting circle to score goals. Holds space and converts every shot.', zoneCaption:'Attacking goal third only — including the shooting circle.', matchupDesc:'GS fights for space; GK fights to take it away.' },
  { code:'GA', name:'Goal Attack',   fireHex:'#ef6d22', iceHex:'#0052b3', tagline:'creator & scorer',   matchup:'GD', role:'GA links midcourt to the circle — one of two players who can shoot for goal.', zoneCaption:'Centre third and attacking goal third — including the shooting circle.', matchupDesc:'GA needs separation to feed or shoot; GD works to deny every pass.' },
  { code:'WA', name:'Wing Attack',   fireHex:'#ffaa00', iceHex:'#009999', tagline:'the playmaker',      matchup:'WD', role:'WA delivers the ball into the circle and wins the centre pass — but cannot enter the shooting circle.', zoneCaption:'Centre third and attacking goal third — NOT the shooting circle.', matchupDesc:'WA breaks free at the centre pass; WD denies that first touch.' },
  { code:'C',  name:'Centre',        fireHex:'#009933', iceHex:'#009933', tagline:'engine of the team', matchup:'C',  role:'C covers the whole court, links attack and defence, and takes every centre pass.', zoneCaption:'All three thirds — NOT either shooting circle.', matchupDesc:'Both Centres race to control the midcourt. Most physically demanding matchup.' },
  { code:'WD', name:'Wing Defence',  fireHex:'#009999', iceHex:'#ffaa00', tagline:'pressure player',    matchup:'WA', role:'WD shadows WA and intercepts passes before they reach the circle.', zoneCaption:'Centre third and defensive goal third — NOT the shooting circle.', matchupDesc:'WD denies WA clean ball through positioning and timing.' },
  { code:'GD', name:'Goal Defence',  fireHex:'#0052b3', iceHex:'#ef6d22', tagline:'defensive partner',  matchup:'GA', role:'GD follows GA from midcourt to the circle, contesting every pass and shot.', zoneCaption:'Centre third and defensive goal third — including the shooting circle.', matchupDesc:'GD stays goal-side and forces the turnover on every GA lead.' },
  { code:'GK', name:'Goal Keeper',   fireHex:'#663399', iceHex:'#cc3333', tagline:'last line of defence',matchup:'GS', role:'GK protects the goal, contesting every shot and rebound inside the circle.', zoneCaption:'Defensive goal third only — including the shooting circle.', matchupDesc:'GK makes space disappear for GS and contests every single shot.' },
];

type Team = 'Fire' | 'Ice';

// Simplified court zone: 3 equal horizontal bands, the active zone(s) glow
function CourtHero({ code, hex }: { code: string; hex: string }) {
  // Which thirds the position can play in (0=top/attacking, 1=centre, 2=bottom/defensive)
  const zoneMap: Record<string, number[]> = {
    GS: [0], GA: [0, 1], WA: [0, 1], C: [0, 1, 2], WD: [1, 2], GD: [1, 2], GK: [2],
  };
  const active = new Set(zoneMap[code] ?? []);

  return (
    <div style={{
      width: '100%', aspectRatio: '1 / 2', borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${hex}30`,
      boxShadow: `0 0 32px ${hex}25, 0 0 0 1px ${hex}20`,
      display: 'flex', flexDirection: 'column',
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          flex: 1,
          background: active.has(i) ? hex : '#0e0e18',
          opacity: active.has(i) ? 0.8 : 1,
          borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
          position: 'relative',
        }}>
          {i === 1 && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              width: 40, height: 40, borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.15)',
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

export function HeroZone() {
  const [activeCode, setActiveCode] = useState('C');
  const [team, setTeam] = useState<Team>('Fire');

  const pos = POSITIONS.find(p => p.code === activeCode)!;
  const opponent = POSITIONS.find(p => p.code === pos.matchup)!;
  const hex = team === 'Fire' ? pos.fireHex : pos.iceHex;
  const oppHex = team === 'Fire' ? opponent.iceHex : opponent.fireHex;

  return (
    <div className="netball-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>

      {/* ── Compact header ── */}
      <div style={{ background: '#0f0f15', borderBottom: '1px solid #1e1e2a', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontWeight: 900, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#fff' }}>
          Elemental <span style={{ color: '#22c55e' }}>Netball</span>
        </span>
        <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid #2a2a36' }}>
          {(['Fire', 'Ice'] as Team[]).map(t => (
            <button key={t} onClick={() => setTeam(t)} style={{
              padding: '5px 12px', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1,
              background: team === t ? (t === 'Fire' ? '#E53935' : '#1E88E5') : 'transparent',
              color: team === t ? '#fff' : '#555', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {t === 'Fire' ? '🔥' : '🧊'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Position pill selector ── */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #1a1a22', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0 }}>
        {POSITIONS.map(p => {
          const isActive = p.code === activeCode;
          const pHex = team === 'Fire' ? p.fireHex : p.iceHex;
          return (
            <button key={p.code} onClick={() => setActiveCode(p.code)} style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 999, fontFamily: 'inherit',
              fontWeight: 900, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1,
              background: isActive ? pHex : '#1a1a22',
              color: isActive ? '#fff' : '#555',
              border: isActive ? `1px solid ${pHex}` : '1px solid #2a2a36',
              cursor: 'pointer',
            }}>
              {p.code}
            </button>
          );
        })}
      </div>

      {/* ── Hero section: name + court side-by-side ── */}
      <div style={{
        padding: '16px 14px 12px',
        background: `radial-gradient(ellipse 80% 60% at 30% 50%, ${hex}18, transparent 70%)`,
        borderBottom: '1px solid #1a1a22',
        display: 'flex', gap: 16, alignItems: 'flex-start',
      }}>
        {/* Court hero — tall narrow column */}
        <div style={{ width: 80, flexShrink: 0 }}>
          <CourtHero code={pos.code} hex={hex} />
        </div>

        {/* Right: name + caption + VS */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3, color: hex }}>{pos.code}</div>
          <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', color: '#fff', lineHeight: 1.05, marginTop: 2 }}>{pos.name}</div>
          <div style={{ fontSize: 11, color: '#666', fontStyle: 'italic', marginTop: 3 }}>{pos.tagline}</div>
          <p style={{ fontSize: 11, color: `${hex}bb`, marginTop: 8, lineHeight: 1.5 }}>{pos.zoneCaption}</p>

          {/* vs strip */}
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 40, borderRadius: 6, background: hex, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff', fontFamily: 'inherit',
            }}>{pos.code}</div>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${hex}60, ${oppHex}60)` }} />
            <div style={{
              width: 32, height: 40, borderRadius: 6, background: oppHex, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff', fontFamily: 'inherit', opacity: 0.8,
            }}>{opponent.code}</div>
          </div>
          <div style={{ fontSize: 10, color: '#555', marginTop: 4 }}>vs {opponent.name} · {opponent.tagline}</div>
        </div>
      </div>

      {/* ── Info cards ── */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ background: '#111318', borderRadius: 14, border: '1px solid #1e1e2a', padding: '12px 14px' }}>
          <div style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: '#555', marginBottom: 6 }}>Role</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: '#ccc', margin: 0 }}>{pos.role}</p>
        </div>
        <div style={{
          borderRadius: 14, padding: '12px 14px',
          background: `${hex}12`,
          border: `1px solid ${hex}30`, borderLeft: `4px solid ${hex}`,
        }}>
          <div style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: hex, marginBottom: 6 }}>
            {pos.code === pos.matchup ? 'The Centre Battle' : `${pos.code} vs ${pos.matchup}`}
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: '#ccc', margin: 0 }}>{pos.matchupDesc}</p>
        </div>
      </div>
    </div>
  );
}

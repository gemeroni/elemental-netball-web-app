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

// Horizontal zone strip
function ZoneStrip({ code, hex }: { code: string; hex: string }) {
  const zoneMap: Record<string, number[]> = {
    GS: [0], GA: [0, 1], WA: [0, 1], C: [0, 1, 2], WD: [1, 2], GD: [1, 2], GK: [2],
  };
  const active = new Set(zoneMap[code] ?? []);
  return (
    <div style={{ display: 'flex', gap: 2, width: '100%', height: 28 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          flex: 1, borderRadius: 5,
          background: active.has(i) ? hex : '#1e1e2a',
          opacity: active.has(i) ? 0.85 : 1,
          border: `1px solid ${active.has(i) ? hex + '40' : '#2a2a36'}`,
        }} />
      ))}
    </div>
  );
}

export function CardDeck() {
  const [activeCode, setActiveCode] = useState('C');
  const [team, setTeam] = useState<Team>('Fire');

  const pos = POSITIONS.find(p => p.code === activeCode)!;
  const opponent = POSITIONS.find(p => p.code === pos.matchup)!;
  const hex = team === 'Fire' ? pos.fireHex : pos.iceHex;
  const oppHex = team === 'Fire' ? opponent.iceHex : opponent.fireHex;

  return (
    <div className="netball-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>

      {/* ── Header ── */}
      <div style={{ background: '#111', borderBottom: '1px solid #1e1e2a', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 900, fontSize: 15, textTransform: 'uppercase', letterSpacing: 1 }}>
            Elemental <span style={{ color: '#22c55e' }}>Netball</span>
          </div>
        </div>
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid #2a2a36' }}>
          {(['Fire', 'Ice'] as Team[]).map(t => (
            <button key={t} onClick={() => setTeam(t)} style={{
              padding: '6px 14px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase',
              background: team === t ? (t === 'Fire' ? '#E53935' : '#1E88E5') : 'transparent',
              color: team === t ? '#fff' : '#555', border: 'none', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 1,
            }}>
              {t === 'Fire' ? '🔥 Fire' : 'Ice 🧊'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bib grid — 7 bibs in two rows ── */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid #1a1a22', flexShrink: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: '#444', textAlign: 'center', marginBottom: 8 }}>
          {team} team — tap a position
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {POSITIONS.map(p => {
            const isActive = p.code === activeCode;
            const pHex = team === 'Fire' ? p.fireHex : p.iceHex;
            return (
              <button key={p.code} onClick={() => setActiveCode(p.code)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 2px',
              }}>
                <div style={{
                  width: 36, height: 44, borderRadius: 8,
                  background: isActive ? pHex : '#1a1a22',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 10,
                  color: isActive ? '#fff' : '#444',
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.15s',
                  boxShadow: isActive ? `0 0 12px ${pHex}80` : 'none',
                }}>
                  {p.code}
                </div>
                <span style={{ fontSize: 9, fontWeight: 900, color: isActive ? pHex : 'transparent', letterSpacing: 0.5 }}>{p.code}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Featured position card ── */}
      <div style={{
        margin: '12px 14px', borderRadius: 18,
        background: `linear-gradient(135deg, ${hex}20 0%, #0d0d14 60%)`,
        border: `1px solid ${hex}35`,
        boxShadow: `0 0 48px ${hex}15`,
        overflow: 'hidden', flexShrink: 0,
      }}>
        {/* Card header */}
        <div style={{ padding: '14px 16px 10px', borderBottom: `1px solid ${hex}20` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3, color: hex }}>{pos.code}</div>
              <div style={{ fontSize: 24, fontWeight: 900, textTransform: 'uppercase', color: '#fff', lineHeight: 1.05, marginTop: 2 }}>{pos.name}</div>
              <div style={{ fontSize: 11, color: '#666', fontStyle: 'italic', marginTop: 3 }}>{pos.tagline}</div>
            </div>
            {/* Large bib */}
            <div style={{
              width: 52, height: 64, borderRadius: 12, background: hex, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 16, color: '#fff',
              boxShadow: `0 0 24px ${hex}60`,
            }}>{pos.code}</div>
          </div>
        </div>

        {/* Zone strip */}
        <div style={{ padding: '10px 16px', borderBottom: `1px solid ${hex}20` }}>
          <div style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: '#555', marginBottom: 6 }}>Court zone</div>
          <ZoneStrip code={pos.code} hex={hex} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 9, color: '#444' }}>ATK</span>
            <span style={{ fontSize: 9, color: '#444' }}>CTR</span>
            <span style={{ fontSize: 9, color: '#444' }}>DEF</span>
          </div>
          <p style={{ fontSize: 11, color: `${hex}bb`, marginTop: 6, lineHeight: 1.4, margin: '6px 0 0' }}>{pos.zoneCaption}</p>
        </div>

        {/* VS strip */}
        <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 44, borderRadius: 8, background: hex, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 12, color: '#fff',
          }}>{pos.code}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: '#444', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 2 }}>Matchup</div>
            <div style={{ fontSize: 12, fontWeight: 900, color: '#aaa' }}>vs {opponent.name}</div>
            <div style={{ fontSize: 10, color: '#555', fontStyle: 'italic' }}>{opponent.tagline}</div>
          </div>
          <div style={{
            width: 36, height: 44, borderRadius: 8, background: oppHex, flexShrink: 0, opacity: 0.75,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 12, color: '#fff',
          }}>{opponent.code}</div>
        </div>
      </div>

      {/* ── Detail cards ── */}
      <div style={{ padding: '0 14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ background: '#111318', borderRadius: 14, border: '1px solid #1e1e2a', padding: '12px 14px' }}>
          <div style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: '#555', marginBottom: 6 }}>Role</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: '#ccc', margin: 0 }}>{pos.role}</p>
        </div>
        <div style={{
          borderRadius: 14, padding: '12px 14px',
          background: `${hex}10`,
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

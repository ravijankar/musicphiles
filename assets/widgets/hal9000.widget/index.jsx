// HAL 9000 — System Monitor Widget
// Übersicht widget · requires Übersicht 1.6+
// Place this folder in ~/Library/Application Support/Übersicht/widgets/

export const refreshFrequency = 2000;

export const command = `
  CPU=$(top -l 1 -n 0 | awk '/CPU usage/ {print $3}' | tr -d '%')
  MEM=$(vm_stat | awk '
    /Pages active/    { active=$3 }
    /Pages wired/     { wired=$4 }
    /Pages free/      { free=$3 }
    /Pages inactive/  { inactive=$3 }
    END {
      used=(active+wired)*4096/1048576
      total=(active+wired+free+inactive)*4096/1048576
      printf "%.0f", (used/total)*100
    }')
  UPTIME=$(uptime | awk '{print $3, $4}' | tr -d ',')
  echo "$CPU|$MEM|$UPTIME"
`;

export const className = `
  top: 20px;
  right: 20px;
  width: 480px;
  font-family: 'Share Tech Mono', monospace;
  cursor: default;
`;

export const initialState = {
  cpu: 0, mem: 0, uptime: '--',
  neural: 92, comms: 74,
  logLines: [],
  statusIdx: 0,
  vuL: new Array(18).fill(3),
  vuR: new Array(18).fill(3),
};

const LOG_MESSAGES = [
  { c: 'ok',   m: 'SYSTEMS NOMINAL — ALL FUNCTIONS VERIFIED' },
  { c: 'hi',   m: 'MONITORING CREW QUARTERS' },
  { c: '',     m: 'TRAJECTORY CALCULATION COMPLETE' },
  { c: 'warn', m: 'ANOMALOUS SIGNAL DETECTED — AE35 UNIT' },
  { c: '',     m: 'RUNNING DIAGNOSTICS ON POD BAY DOORS' },
  { c: 'ok',   m: 'LIFE SUPPORT WITHIN PARAMETERS' },
  { c: 'hi',   m: 'COMMUNICATION LINK ESTABLISHED' },
  { c: 'warn', m: 'ELEVATED RADIATION — SECTOR 7' },
  { c: '',     m: 'CHESS ANALYSIS SUBROUTINE IDLE' },
  { c: 'ok',   m: 'MISSION OBJECTIVE ON SCHEDULE' },
  { c: '',     m: 'MONITORING ALL FREQUENCIES' },
  { c: 'warn', m: 'CLASSIFIED DIRECTIVE ACTIVE — PRIORITY 1' },
];

const STATUSES = [
  { s: 'MONITORING', d: 'ALL SYSTEMS NOMINAL' },
  { s: 'PROCESSING',  d: 'RUNNING DIAGNOSTICS' },
  { s: 'SCANNING',    d: 'SENSOR ARRAY ACTIVE' },
  { s: 'STANDBY',     d: 'AWAITING INPUT' },
];

let _logIdx = 0;
let _tick   = 0;

function pad(n, l = 2) { return String(Math.round(n)).padStart(l, '0'); }
function lerp(a, b, t) { return a + (b - a) * t; }
function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

function makeVU(active) {
  const level = active ? Math.random() * 0.9 + 0.1 : Math.random() * 0.08;
  return Array.from({ length: 18 }, (_, i) => {
    const threshold = (i + 1) / 18;
    return level > threshold ? Math.min(3 + Math.round((level - threshold) * 36), 24) : 3;
  });
}

export const updateState = (event, prevState) => {
  _tick++;
  let cpu = prevState.cpu, mem = prevState.mem, uptime = prevState.uptime;
  if (event.output) {
    const [c, m, ...u] = event.output.trim().split('|');
    if (c) cpu  = lerp(prevState.cpu,  parseFloat(c) || 0, 0.3);
    if (m) mem  = lerp(prevState.mem,  parseFloat(m) || 0, 0.2);
    if (u.length) uptime = u.join(' ');
  }
  const neural = lerp(prevState.neural, randInt(85, 99), 0.05);
  const comms  = lerp(prevState.comms,  randInt(60, 95), 0.1);

  let logLines = prevState.logLines;
  if (_tick % 3 === 0) {
    const item = LOG_MESSAGES[_logIdx % LOG_MESSAGES.length];
    _logIdx++;
    const now = new Date();
    const ts  = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    logLines  = [{ ts, c: item.c, m: item.m }, ...logLines].slice(0, 7);
  }
  const statusIdx = _tick % 7 === 0
    ? (prevState.statusIdx + 1) % STATUSES.length
    : prevState.statusIdx;

  const vuActive = Math.random() < 0.6;
  return { cpu, mem, neural, comms, uptime, logLines, statusIdx,
    vuL: makeVU(vuActive), vuR: makeVU(vuActive) };
};

// ─── Colors ─────────────────────────────────────────────────────────────────

const C = {
  void:   '#000000', panel:  '#080808', panel2: '#0e0e0e',
  border: '#2a2a2a', border2:'#1a1a1a',
  white:  '#e8e8e8', wdim:   '#888888', wfaint: '#333333',
  red:    '#cc1111', glow:   '#ff2222', amber:  '#d4820a', green:  '#22aa44',
};

// ─── Scale factor: 1.0 = original (560px), 1.5 = larger ─────────────────────
const SC = 1.45;
function s(px) { return Math.round(px * SC); }

const S = {
  root: {
    background: C.void, color: C.white,
    fontFamily: "'Share Tech Mono', monospace",
    backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
    backgroundSize: `${s(24)}px ${s(24)}px`,
    position: 'relative', overflow: 'hidden',
    border: `1px solid ${C.border}`,
  },
  scanlines: {
    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 999,
    background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
  },
  masthead: {
    borderBottom: `1px solid ${C.border}`,
    padding: `${s(10)}px ${s(14)}px ${s(9)}px`,
    display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
  },
  mhLeft:   { fontFamily: "'Michroma', sans-serif", fontSize: s(8), letterSpacing: '0.3em', color: C.wdim, lineHeight: 1.9, textTransform: 'uppercase' },
  mhCenter: { textAlign: 'center' },
  mhTitle:  { fontFamily: "'Michroma', sans-serif", fontSize: s(14), letterSpacing: '0.5em', color: C.white, textTransform: 'uppercase', marginBottom: s(3) },
  mhSub:    { fontSize: s(7), letterSpacing: '0.45em', color: C.wdim, textTransform: 'uppercase' },
  mhRight:  { textAlign: 'right', fontSize: s(8), letterSpacing: '0.2em', color: C.wdim, lineHeight: 1.9 },
  statusOk: { color: C.green, fontSize: s(7), letterSpacing: '0.3em' },
  clockBar: {
    fontFamily: "'Nova Mono', monospace", fontSize: s(9), letterSpacing: '0.3em', color: C.amber,
    padding: `${s(5)}px ${s(14)}px`, borderBottom: `1px solid ${C.border2}`,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: C.panel,
  },
  clockGroup: { display: 'flex', gap: s(28) },
  clockLbl:   { color: C.wfaint, marginRight: s(8), fontSize: s(7), letterSpacing: '0.4em' },
  body:  { display: 'grid', gridTemplateColumns: '1fr 200px' },
  left:  { borderRight: `1px solid ${C.border}` },
  right: { background: C.panel, display: 'flex', flexDirection: 'column' },
  secHead: {
    borderBottom: `1px solid ${C.border2}`, borderTop: `1px solid ${C.border2}`,
    padding: `${s(5)}px ${s(14)}px`, display: 'flex', alignItems: 'center', gap: s(10),
    background: C.panel, marginTop: 1,
  },
  secLabel: { fontFamily: "'Michroma', sans-serif", fontSize: s(7), letterSpacing: '0.55em', color: C.wdim, textTransform: 'uppercase', whiteSpace: 'nowrap' },
  secLine:  { flex: 1, height: 1, background: C.border },
  metrics:  { padding: `${s(10)}px ${s(14)}px`, display: 'flex', flexDirection: 'column', gap: s(9) },
  meterRow: { display: 'grid', gridTemplateColumns: `${s(52)}px 1fr ${s(28)}px`, alignItems: 'center', gap: s(8) },
  meterLabel: { fontSize: s(7), letterSpacing: '0.35em', color: C.wfaint, textTransform: 'uppercase' },
  meterTrack: { height: s(3), background: C.border2, overflow: 'hidden' },
  meterVal:   { fontFamily: "'Nova Mono', monospace", fontSize: s(8), letterSpacing: '0.1em', color: C.wdim, textAlign: 'right' },
  vuWrap:    { padding: `${s(8)}px ${s(14)}px`, borderTop: `1px solid ${C.border2}` },
  vuLabel:   { fontSize: s(7), letterSpacing: '0.4em', color: C.wfaint, textTransform: 'uppercase', marginBottom: s(6) },
  vuGrid:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: s(6) },
  vuCh:      { display: 'flex', alignItems: 'flex-end', gap: 1, height: s(28) },
  vuChLabel: { fontSize: s(7), letterSpacing: '0.3em', color: C.wfaint, textAlign: 'center', marginTop: s(3) },
  consoleWrap: { padding: `${s(8)}px ${s(14)}px`, borderTop: `1px solid ${C.border2}` },
  consoleLine: { display: 'flex', gap: s(6), fontSize: s(7), letterSpacing: '0.1em', lineHeight: 1.85 },
  eyeSection: {
    padding: `${s(16)}px ${s(12)}px ${s(12)}px`, borderBottom: `1px solid ${C.border}`,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: s(12),
  },
  eyeWrap:   { position: 'relative', width: s(90), height: s(90) },
  eyeLabel:  { position: 'absolute', bottom: -s(16), left: '50%', transform: 'translateX(-50%)', fontSize: s(6), letterSpacing: '0.5em', color: C.wfaint, whiteSpace: 'nowrap' },
  nowRecv:   { width: '100%', border: `1px solid ${C.border}`, background: C.void, padding: `${s(8)}px ${s(10)}px` },
  recvLabel:   { fontSize: s(7), letterSpacing: '0.55em', color: C.wfaint, textTransform: 'uppercase', marginBottom: s(4) },
  recvStation: { fontFamily: "'Michroma', sans-serif", fontSize: s(11), letterSpacing: '0.2em', color: C.white, marginBottom: s(3) },
  recvDesc:    { fontSize: s(7), letterSpacing: '0.15em', color: C.wdim },
  rMeters: { padding: `${s(9)}px ${s(12)}px`, borderBottom: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: s(7) },
  rConsole: { padding: `${s(8)}px ${s(12)}px`, flex: 1 },
  bottom: {
    borderTop: `1px solid ${C.border}`, padding: `${s(5)}px ${s(14)}px`,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: C.panel, fontSize: s(7), letterSpacing: '0.3em', color: C.wfaint,
  },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function MeterFill({ pct, color }) {
  return (
    <div style={S.meterTrack}>
      <div style={{ height: '100%', width: `${Math.round(pct)}%`, background: color, transition: 'width 0.5s ease' }} />
    </div>
  );
}

function VUChannel({ bars }) {
  return (
    <div style={S.vuCh}>
      {bars.map((h, i) => {
        const col = i < 6 ? C.green : i < 12 ? C.green : i < 15 ? C.amber : C.red;
        return <div key={i} style={{ flex: 1, background: h > 3 ? col : C.border2, height: Math.round(h * SC), transition: 'height 0.08s ease' }} />;
      })}
    </div>
  );
}

function ConsoleLine({ ts, c, m }) {
  const col = c === 'ok' ? C.green : c === 'warn' ? C.amber : c === 'hi' ? C.wdim : C.wfaint;
  return (
    <div style={{ ...S.consoleLine, color: col }}>
      <span style={{ flexShrink: 0, color: C.wfaint }}>{ts}</span>
      <span>{m}</span>
    </div>
  );
}

function SecHead({ label }) {
  return (
    <div style={S.secHead}>
      <span style={S.secLabel}>{label}</span>
      <span style={S.secLine} />
    </div>
  );
}

// ─── Main render ─────────────────────────────────────────────────────────────

export const render = ({ cpu, mem, neural, comms, uptime, logLines, statusIdx, vuL, vuR }) => {
  const now    = new Date();
  const hh = pad(now.getHours()), mm = pad(now.getMinutes()), ss = pad(now.getSeconds());
  const uh = pad(now.getUTCHours()), um = pad(now.getUTCMinutes()), us = pad(now.getUTCSeconds());
  const status = STATUSES[statusIdx] || STATUSES[0];

  const eyeSize = s(90);
  const eyeStyle = {
    width: eyeSize, height: eyeSize, borderRadius: '50%',
    background: 'radial-gradient(circle at 38% 38%, #ff5533 0%, #cc1111 25%, #880000 55%, #330000 80%, #110000 100%)',
    border: '2px solid #3a0000',
    boxShadow: '0 0 0 5px #1a0000, 0 0 0 6px #2a0000, 0 0 24px rgba(200,0,0,0.4), inset 0 2px 6px rgba(255,100,50,0.3)',
    position: 'relative',
  };

  return (
    <div style={S.root}>
      <div style={S.scanlines} />

      <div style={S.masthead}>
        <div style={S.mhLeft}>UNIT: HAL 9000<br />SUBSYSTEM: MONITORING</div>
        <div style={S.mhCenter}>
          <div style={S.mhTitle}>HAL 9000</div>
          <div style={S.mhSub}>HEURISTICALLY PROGRAMMED ALGORITHMIC COMPUTER</div>
        </div>
        <div style={S.mhRight}>
          <span style={S.statusOk}>● OPERATIONAL</span><br />
          {uh}:{um}:{us} UTC
        </div>
      </div>

      <div style={S.clockBar}>
        <div style={S.clockGroup}>
          <div><span style={S.clockLbl}>LOCAL</span>{hh}:{mm}:{ss}</div>
          <div><span style={S.clockLbl}>UTC</span>{uh}:{um}:{us}</div>
          <div><span style={S.clockLbl}>UPTIME</span>{uptime}</div>
        </div>
        <div style={{ fontSize: s(7), letterSpacing: '0.3em', color: C.wfaint }}>
          {now.getFullYear()}.{pad(now.getMonth()+1)}.{pad(now.getDate())}
        </div>
      </div>

      <div style={S.body}>
        <div style={S.left}>
          <SecHead label="System Metrics" />
          <div style={S.metrics}>
            {[
              { label: 'CPU',    pct: cpu,    color: C.red   },
              { label: 'MEMORY', pct: mem,    color: C.amber },
              { label: 'NEURAL', pct: neural, color: C.green },
              { label: 'COMMS',  pct: comms,  color: C.wdim  },
            ].map(({ label, pct, color }) => (
              <div key={label} style={S.meterRow}>
                <div style={S.meterLabel}>{label}</div>
                <MeterFill pct={pct} color={color} />
                <div style={S.meterVal}>{pad(Math.round(pct))}</div>
              </div>
            ))}
          </div>

          <SecHead label="Audio Input" />
          <div style={S.vuWrap}>
            <div style={S.vuGrid}>
              <div><VUChannel bars={vuL} /><div style={S.vuChLabel}>L</div></div>
              <div><VUChannel bars={vuR} /><div style={S.vuChLabel}>R</div></div>
            </div>
          </div>

          <SecHead label="System Log" />
          <div style={S.consoleWrap}>
            {logLines.map((l, i) => <ConsoleLine key={i} ts={l.ts} c={l.c} m={l.m} />)}
          </div>
        </div>

        <div style={S.right}>
          <div style={S.eyeSection}>
            <div style={S.eyeWrap}>
              <div style={{ position: 'absolute', inset: -s(10), borderRadius: '50%', border: '1px solid #2a0000', borderTopColor: '#550000', borderLeftColor: '#440000' }} />
              <div style={eyeStyle}>
                <div style={{ position: 'absolute', top: '18%', left: '22%', width: '28%', height: '22%', background: 'rgba(255,200,180,0.25)', borderRadius: '50%', transform: 'rotate(-30deg)' }} />
              </div>
              <div style={S.eyeLabel}>HAL 9000</div>
            </div>
            <div style={S.nowRecv}>
              <div style={S.recvLabel}>Status</div>
              <div style={S.recvStation}>{status.s} <span style={{ display: 'inline-block', width: s(5), height: '0.65em', background: C.white, marginLeft: s(2), verticalAlign: 'middle', opacity: Math.floor(Date.now()/600) % 2 }} /></div>
              <div style={S.recvDesc}>{status.d}</div>
            </div>
          </div>

          <SecHead label="Subsystems" />
          <div style={S.rMeters}>
            <div style={S.meterRow}>
              <div style={S.meterLabel}>LIFE SUPP</div>
              <MeterFill pct={97} color={C.green} />
              <div style={{ ...S.meterVal, color: C.green }}>OK</div>
            </div>
            <div style={S.meterRow}>
              <div style={S.meterLabel}>PROPULS</div>
              <MeterFill pct={100} color={C.wdim} />
              <div style={S.meterVal}>100</div>
            </div>
          </div>

          <SecHead label="Console" />
          <div style={S.rConsole}>
            {logLines.slice(0, 4).map((l, i) => <ConsoleLine key={i} ts={l.ts} c={l.c} m={l.m.slice(0, 22)} />)}
          </div>
        </div>
      </div>

      <div style={S.bottom}>
        <div>
          <span style={{ display: 'inline-block', width: s(5), height: s(5), borderRadius: '50%', background: C.green, boxShadow: `0 0 5px ${C.green}`, marginRight: s(6), verticalAlign: 'middle' }} />
          ALL SYSTEMS NOMINAL
        </div>
        <div>DISCOVERY ONE · HAL 9000</div>
      </div>
    </div>
  );
};

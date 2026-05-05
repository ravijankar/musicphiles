// DISCOVERY ONE — AUDIO RECEPTION SYSTEM
// Übersicht widget — loads raspberrypi.local:8888 as a desktop panel
// Place hal-radio.widget/ in ~/Library/Application Support/Übersicht/widgets/

export const refreshFrequency = false; // no polling needed — iframe handles itself

export const command = 'echo ok';

// Position to the left of the HAL 9000 monitor widget (which sits at right:20px, width:480px)
// Sits at same top position, leaving a 12px gap between the two widgets
export const className = `
  top: 20px;
  right: 512px;
  width: 900px;
  height: calc(100vh - 40px);
  cursor: crosshair;
`;

export const render = () => (
  <div style={{
    width: '100%',
    height: '100%',
    border: '1px solid #2a2a2a',
    overflow: 'hidden',
    background: '#000',
    position: 'relative',
  }}>
    <iframe
      src="http://raspberrypi.local:8888"
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        display: 'block',
        background: '#000',
      }}
      sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
      scrolling="no"
    />
  </div>
);

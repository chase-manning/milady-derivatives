import styled, { keyframes } from "styled-components";

/**
 * remilia.org-style continuous manifesto marquee —
 * corporate-ironic network spirituality, milady green chrome.
 */
const scroll = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const Rail = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  overflow: hidden;
  border-bottom: 1px solid rgba(47, 77, 12, 0.35);
  background: linear-gradient(90deg, #2f4d0c 0%, #3d6614 50%, #2f4d0c 100%);
  color: #f4ffee;
  height: 3.2rem;
  display: flex;
  align-items: center;
  box-shadow: 0 6px 20px rgba(47, 77, 12, 0.18);
`;

const Track = styled.div`
  display: flex;
  width: max-content;
  animation: ${scroll} 48s linear infinite;
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Chunk = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 1.4rem;
  white-space: nowrap;
  padding: 0 1.4rem;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-family: var(--font-display);

  em {
    font-style: normal;
    opacity: 0.7;
    font-weight: 500;
  }
`;

const LINES = [
  "Welcome the Remigumi-guchi digital corporation unofficial derivatives archive",
  "Network spirituality · post-authorship · posting is the new art",
  "We're network kommandos · whitepilled · lawyered up in the court of clout",
  "ゆっくりしていってね · copylefted brand · viral public license spirit",
  "Milady · Remilio · Hypio · Retardio · Dreamilio · Mibera · the expanding family",
  "I'm always online and ready to chat · remilia will save the internet",
];

const text = LINES.join("  ✥  ");

const ManifestoMarquee = () => {
  return (
    <Rail aria-hidden>
      <Track>
        <Chunk>
          {text}
          <em> ✥ </em>
        </Chunk>
        <Chunk>
          {text}
          <em> ✥ </em>
        </Chunk>
      </Track>
    </Rail>
  );
};

export default ManifestoMarquee;

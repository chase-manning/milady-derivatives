import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(61, 102, 20, 0.35); }
  50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(61, 102, 20, 0); }
`;

const Bar = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, #ffffff 75%, var(--secondary-soft) 25%);
  backdrop-filter: blur(10px);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--muted);
  letter-spacing: 0.03em;
`;

const Led = styled.span`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: #3d6614;
  animation: ${pulse} 2.2s ease-in-out infinite;
`;

const StatusBar = () => (
  <Bar title="Remilia-style presence indicator">
    <Led />
    ONLINE · network spirituality active
  </Bar>
);

export default StatusBar;

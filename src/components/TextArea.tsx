import styled from "styled-components";

const StyledTextArea = styled.div`
  width: min(72rem, 100%);
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
  background: color-mix(in srgb, #ffffff 78%, var(--secondary-soft) 22%);
  backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  box-shadow: var(--shadow), inset 0 1px 0 var(--border-soft);
  animation: milady-fade-up var(--dur-page) var(--ease-out) both;
  animation-delay: 80ms;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  color: #fff;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-soft) 100%);
  padding: 1.2rem 1.6rem;
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Body = styled.div`
  padding: 1.6rem 2.2rem;
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--muted);
  line-height: 1.65;

  @media (max-width: 768px) {
    padding: 1.4rem 1.6rem;
    font-size: 1.4rem;
  }
`;

interface Props {
  header: string;
  body: string | JSX.Element;
}

const TextArea = ({ header, body }: Props) => {
  return (
    <StyledTextArea>
      <Header>{header}</Header>
      <Body>{body}</Body>
    </StyledTextArea>
  );
};

export default TextArea;

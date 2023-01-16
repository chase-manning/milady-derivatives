import styled from "styled-components";

const StyledTextArea = styled.div`
  width: 65rem;  
`

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: var(--primary);
  padding: 0.5rem;
  font-size: 1.8rem;
  font-weight: 500;
`

const Body = styled.div`
  padding: 1rem 2rem;
  font-size: 1.6rem;
  font-weight: 400;
  border: solid 1px var(--primary);
  background: white;
`

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

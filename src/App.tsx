import styled from "styled-components";

const StyledApp = styled.div`
  width: 100%;
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`

function App() {
  return (
    <StyledApp>
      meow
    </StyledApp>
  );
}

export default App;

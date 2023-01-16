import styled from "styled-components";
import TextArea from "./components/TextArea";

const StyledApp = styled.div`
  width: 100%;
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
`

function App() {
  return (
    <StyledApp>
      <TextArea header="Milady Derivatives" body="An unofficial collection of Milady Derivatives maintained by the community. To add or update a derivative please view the contribution guide." />
    </StyledApp>
  );
}

export default App;

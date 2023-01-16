import styled from "styled-components";
import Milady from "./components/Milady";
import TextArea from "./components/TextArea";
import useMiladys from "./hooks/use-miladys";

const StyledApp = styled.div`
  width: 100%;
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
`

const Miladys = styled.div`
  width: 100%;
  padding: 6rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
  grid-gap: 2rem;
`

function App() {
  const miladys = useMiladys();

  return (
    <StyledApp>
      <TextArea header="Milady Derivatives" body="An unofficial collection of Milady Derivatives maintained by the community. To add or update a derivative please view the contribution guide." />
      <Miladys>
        {
          miladys && miladys.map(milady => {
            return <Milady milady={milady} />
          })
        }
      </Miladys>
    </StyledApp>
  );
}

export default App;

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


const Text = styled.div`
  font-size: 1.6rem;
  font-weight: 400;
  background: white;
`

const Link = styled.a`
  font-size: 1.6rem;
  font-weight: 400;
  background: white;
  color: #0000FF;
  text-decoration: underline;
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
      <TextArea header="Milady Derivatives" body={
        <Text>
          An unofficial collection of Milady Derivatives maintained by the community. To add or update a derivative please view the <Link href="https://github.com/chase-manning/milady-derivatives/blob/main/.github/CONTRIBUTING.md" target="_blank" >contribution guide.</Link> Feel free to use <Link href="https://miladyderivatives.com/api/data.json" target="_blank" >our open API</Link>.</Text>} />
      <Miladys>
        {
          miladys && miladys.map(milady => {
            return <Milady key={milady.id} milady={milady} />
          })
        }
      </Miladys>
    </StyledApp>
  );
}

export default App;

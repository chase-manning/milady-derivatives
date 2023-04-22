import styled from "styled-components";
import TextArea from "../components/TextArea";
import useMiladys from "../hooks/use-miladys";
import Milady from "../components/Milady";
import NavItems from "../components/NavItems";

const StyledHomePage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Text = styled.div`
  font-size: 1.6rem;
  font-weight: 400;
  background: white;
`;

const Link = styled.a`
  font-size: 1.6rem;
  font-weight: 400;
  background: white;
  color: #0000ff;
  text-decoration: underline;
`;

const Miladys = styled.div`
  width: 100%;
  padding: 6rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
  grid-gap: 2rem;

  @media (max-width: 768px) {
    padding: 2rem 0;
  }
`;

const HomePage = () => {
  const miladys = useMiladys();

  return (
    <StyledHomePage>
      <NavItems />
      <TextArea
        header="Milady Derivatives"
        body={
          <Text>
            An unofficial list of Milady Derivatives maintained by the
            community. To add or update a derivative please view the{" "}
            <Link
              href="https://github.com/chase-manning/milady-derivatives/blob/main/.github/CONTRIBUTING.md"
              target="_blank"
            >
              contribution guide
            </Link>
            . Feel free to use{" "}
            <Link
              href="https://miladyderivatives.com/api/data.json"
              target="_blank"
            >
              our open API
            </Link>
            .
          </Text>
        }
      />
      <Miladys>
        {miladys &&
          miladys.map((milady) => {
            return <Milady key={milady.openseaId} milady={milady} />;
          })}
      </Miladys>
    </StyledHomePage>
  );
};

export default HomePage;

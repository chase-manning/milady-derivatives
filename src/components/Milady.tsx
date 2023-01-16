import styled from "styled-components";
import { MiladyType } from "../hooks/use-miladys";

const StyledMilady = styled.a`
  width: 100%;
  height: 100%;
  border: solid 1px var(--primary);
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  transform: scale(1);
  transition: transform 0.2s ease-in-out;
  :hover {
    transform: scale(1.05);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  flex: 1;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`

const Label = styled.div`
  width: 100%;
  background: var(--secondary);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  font-size: 1.8rem;
  font-weight: 500;
  text-align: center;
`

interface Props {
  milady: MiladyType;
}

const Milady = ({ milady }: Props) => {
  return (
    <StyledMilady href={`https://opensea.io/collection/${milady.openseaId}`} target="_blank">
      <ImageContainer>
        <Image src={milady.image} />
      </ImageContainer>
      <Label>{milady.name}</Label>
    </StyledMilady>
  );
};

export default Milady;

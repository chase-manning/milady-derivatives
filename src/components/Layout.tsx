import { ReactNode } from "react";
import styled from "styled-components";
import NavItems from "./NavItems";

const Shell = styled.div`
  width: min(120rem, 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.4rem;
`;

const Hero = styled.header`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.4rem;
  text-align: center;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--border);
  color: var(--primary);
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  backdrop-filter: blur(8px);
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(3.2rem, 5vw, 5.2rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.05;
  background: linear-gradient(135deg, var(--primary) 0%, #4a7a18 55%, #6a3d8a 140%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Intro = styled.div`
  max-width: 64rem;
  font-size: 1.55rem;
  color: var(--muted);
  line-height: 1.65;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const Link = styled.a`
  color: var(--primary-soft);
  font-weight: 600;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;

  &:hover {
    color: var(--primary);
  }
`;

const Footer = styled.footer`
  margin-top: 1rem;
  text-align: center;
  color: var(--muted);
  font-size: 1.25rem;
  line-height: 1.6;
`;

interface Props {
  children: ReactNode;
  liveUpdatedAt?: string | null;
}

const Layout = ({ children, liveUpdatedAt }: Props) => {
  return (
    <Shell>
      <Hero>
        <Eyebrow>community archive · remiliasphere</Eyebrow>
        <Title>Milady Derivatives</Title>
        <Intro>
          An unofficial list of Milady derivatives maintained by the community.
          To add or update a derivative, view the{" "}
          <Link
            href="https://github.com/chase-manning/milady-derivatives/blob/main/.github/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            contribution guide
          </Link>
          . Open API:{" "}
          <Link
            href="/api/data.json"
            target="_blank"
            rel="noopener noreferrer"
          >
            data.json
          </Link>
          {" · "}
          <Link
            href="/api/live-stats.json"
            target="_blank"
            rel="noopener noreferrer"
          >
            live-stats.json
          </Link>
          .
        </Intro>
        <NavItems />
      </Hero>

      {children}

      <Footer>
        Unofficial · community-maintained
        {liveUpdatedAt
          ? ` · live floors updated ${new Date(liveUpdatedAt).toLocaleString()}`
          : " · sorted by catalog volume"}
        <br />
        Not affiliated with Remilia Corporation
      </Footer>
    </Shell>
  );
};

export default Layout;

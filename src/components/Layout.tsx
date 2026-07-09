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
  animation: milady-fade-up var(--dur-page) var(--ease-out) both;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  color: var(--primary);
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: color-mix(in srgb, #ffffff 72%, var(--secondary-soft) 28%);
  backdrop-filter: blur(14px) saturate(1.2);
  border: 1px solid var(--border);
  box-shadow: var(--shadow), inset 0 1px 0 var(--border-soft);
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(3.2rem, 5vw, 5.2rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.05;
  background: linear-gradient(
    125deg,
    var(--primary) 0%,
    #4a7a18 45%,
    #6a3d8a 120%
  );
  background-size: 180% 180%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: milady-shimmer 8s ease-in-out infinite alternate;
`;

const Intro = styled.div`
  max-width: 64rem;
  font-size: 1.55rem;
  color: var(--muted);
  line-height: 1.65;
  animation: milady-fade-up var(--dur-page) var(--ease-out) both;
  animation-delay: 60ms;

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
  transition: color var(--dur-micro) var(--ease-out);

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
  animation: milady-fade-up var(--dur-page) var(--ease-out) both;
  animation-delay: 120ms;
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
          <Link href="/api/data.json" target="_blank" rel="noopener noreferrer">
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

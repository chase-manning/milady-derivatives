import { useMemo, useState } from "react";
import styled from "styled-components";
import Layout from "../components/Layout";
import Milady from "../components/Milady";
import TextArea from "../components/TextArea";
import useMiladys, { MiladyType } from "../hooks/use-miladys";
import { CHAIN_FILTERS } from "../lib/chains";

const Toolbar = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 1.4rem;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
`;

const SearchRow = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 18rem;
  padding: 1.1rem 1.4rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface-solid);
  color: var(--main);
  font-size: 1.45rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: #8a9a82;
  }

  &:focus {
    border-color: rgba(47, 77, 12, 0.4);
    box-shadow: var(--ring);
  }
`;

const Count = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--muted);
  white-space: nowrap;
  padding: 0.4rem 0.2rem;
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
`;

const Chip = styled.button<{ $active: boolean }>`
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  font-size: 1.25rem;
  font-weight: 600;
  border: 1px solid
    ${({ $active }) => ($active ? "rgba(47, 77, 12, 0.35)" : "var(--border)")};
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, var(--primary) 0%, var(--primary-soft) 100%)"
      : "var(--surface-solid)"};
  color: ${({ $active }) => ($active ? "#fff" : "var(--muted)")};
  transition: transform 0.15s ease, background 0.15s ease, color 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    color: ${({ $active }) => ($active ? "#fff" : "var(--primary)")};
  }
`;

const Miladys = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
  gap: 1.8rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: 1.2rem;
  }
`;

const Empty = styled.div`
  width: 100%;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--muted);
  font-size: 1.5rem;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.5);
`;

const matchesSearch = (milady: MiladyType, query: string) => {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    milady.name.toLowerCase().includes(q) ||
    milady.description.toLowerCase().includes(q) ||
    milady.openseaId.toLowerCase().includes(q) ||
    (milady.parent || "").toLowerCase().includes(q)
  );
};

const HomePage = () => {
  const { miladys, liveUpdatedAt } = useMiladys();
  const [query, setQuery] = useState("");
  const [chain, setChain] = useState<number | "all">("all");

  const filtered = useMemo(() => {
    if (!miladys) return null;
    return miladys.filter((m) => {
      const chainOk = chain === "all" || m.chainId === chain;
      return chainOk && matchesSearch(m, query.trim());
    });
  }, [miladys, query, chain]);

  return (
    <Layout liveUpdatedAt={liveUpdatedAt}>
      <TextArea
        header="network spirituality index"
        body="Browse the expanding Milady / Remilio family tree — from OG Ethereum remasters to chain-native cousins like Hypio, Retardio, Dreamilio, and Mibera. Cards show live floors when available."
      />

      <Toolbar>
        <SearchRow>
          <SearchInput
            type="search"
            placeholder="Search derivatives by name, parent, or vibe…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search derivatives"
          />
          <Count>
            {filtered ? filtered.length : "…"} / {miladys ? miladys.length : "…"}{" "}
            listed
          </Count>
        </SearchRow>
        <Filters>
          {CHAIN_FILTERS.map((f) => (
            <Chip
              key={String(f.id)}
              type="button"
              $active={chain === f.id}
              onClick={() => setChain(f.id)}
            >
              {f.label}
            </Chip>
          ))}
        </Filters>
      </Toolbar>

      <Miladys>
        {filtered &&
          filtered.map((milady) => (
            <Milady key={milady.openseaId} milady={milady} />
          ))}
      </Miladys>

      {filtered && filtered.length === 0 && (
        <Empty>No derivatives match that search. Try another chain or keyword.</Empty>
      )}
    </Layout>
  );
};

export default HomePage;

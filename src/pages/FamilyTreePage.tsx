import { useMemo, useState } from "react";
import styled from "styled-components";
import Layout from "../components/Layout";
import TextArea from "../components/TextArea";
import useMiladys, { MiladyType } from "../hooks/use-miladys";
import { CHAIN_LABELS } from "../lib/chains";
import { getPrimaryLink } from "../lib/marketplaces";

const ROOT_ID = "milady";
const ROOT_NAME = "Milady Maker";

const TreeShell = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const Branch = styled.section`
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const BranchHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.4rem 1.6rem;
  text-align: left;
  background: linear-gradient(135deg, rgba(47, 77, 12, 0.06), transparent);
  border-bottom: 1px solid var(--border);
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, rgba(47, 77, 12, 0.1), transparent);
  }
`;

const BranchTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const BranchName = styled.div`
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary);
`;

const BranchMeta = styled.div`
  font-size: 1.25rem;
  color: var(--muted);
`;

const Chevron = styled.span<{ $open: boolean }>`
  font-size: 1.6rem;
  color: var(--primary);
  transform: rotate(${({ $open }) => ($open ? "90deg" : "0deg")});
  transition: transform 0.15s ease;
`;

const Children = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 1.2rem;
  padding: 1.4rem;
`;

const NodeCard = styled.a`
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.9rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface-solid);
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }
`;

const Thumb = styled.img`
  width: 5.6rem;
  height: 5.6rem;
  object-fit: cover;
  border-radius: 0.8rem;
  background: #eef6ec;
  flex-shrink: 0;
`;

const ThumbPlaceholder = styled.div`
  width: 5.6rem;
  height: 5.6rem;
  border-radius: 0.8rem;
  background: #eef6ec;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-size: 1.8rem;
`;

const NodeMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
`;

const NodeName = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NodeSub = styled.div`
  font-size: 1.15rem;
  color: var(--muted);
`;

const Nested = styled.div`
  grid-column: 1 / -1;
  margin-left: 1.2rem;
  padding-left: 1.2rem;
  border-left: 2px solid var(--secondary);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const NestedLabel = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Legend = styled.div`
  width: 100%;
  padding: 1.2rem 1.4rem;
  border-radius: var(--radius);
  border: 1px dashed var(--border);
  background: rgba(255, 255, 255, 0.55);
  color: var(--muted);
  font-size: 1.35rem;
  line-height: 1.55;
`;

type TreeNode = {
  id: string;
  name: string;
  milady?: MiladyType;
  children: TreeNode[];
};

function buildTree(items: MiladyType[]): TreeNode {
  const byParent = new Map<string, MiladyType[]>();
  for (const item of items) {
    const parent = item.parent || ROOT_ID;
    if (!byParent.has(parent)) byParent.set(parent, []);
    byParent.get(parent)!.push(item);
  }

  const byId = new Map(items.map((i) => [i.openseaId, i]));

  const build = (id: string, name: string, milady?: MiladyType): TreeNode => {
    const kids = (byParent.get(id) || [])
      .slice()
      .sort((a, b) => b.volume - a.volume)
      .map((child) => build(child.openseaId, child.name, child));
    return { id, name, milady, children: kids };
  };

  // Orphans whose parent is another collection not present still hang under root via parent field
  // Also attach nodes whose parent id isn't milady and isn't in catalog under their named parent branch if possible
  const root = build(ROOT_ID, ROOT_NAME);

  // Any item whose parent isn't reachable from root gets attached under root as "uncategorized"
  const reachable = new Set<string>();
  const walk = (n: TreeNode) => {
    reachable.add(n.id);
    n.children.forEach(walk);
  };
  walk(root);

  const orphans = items.filter((i) => !reachable.has(i.openseaId));
  for (const o of orphans) {
    // if parent exists as a catalog item but wasn't under milady chain, attach shallow under root
    if (o.parent && byId.has(o.parent) && !reachable.has(o.openseaId)) {
      root.children.push(build(o.openseaId, o.name, o));
      reachable.add(o.openseaId);
    } else if (!reachable.has(o.openseaId)) {
      root.children.push(build(o.openseaId, o.name, o));
      reachable.add(o.openseaId);
    }
  }

  root.children.sort((a, b) => {
    const av = a.milady?.volume ?? 99999;
    const bv = b.milady?.volume ?? 99999;
    return bv - av;
  });

  return root;
}

const NodeView = ({
  node,
  depth = 0,
}: {
  node: TreeNode;
  depth?: number;
}) => {
  const chain = node.milady
    ? CHAIN_LABELS[node.milady.chainId] || `Chain ${node.milady.chainId}`
    : "Origin";
  const href = node.milady
    ? getPrimaryLink(node.milady)
    : "https://opensea.io/collection/milady";
  const hasKids = node.children.length > 0;

  return (
    <>
      <NodeCard href={href} target="_blank" rel="noopener noreferrer">
        {node.milady?.image ? (
          <Thumb src={node.milady.image} alt="" loading="lazy" />
        ) : (
          <ThumbPlaceholder>♡</ThumbPlaceholder>
        )}
        <NodeMeta>
          <NodeName>{node.name}</NodeName>
          <NodeSub>
            {chain}
            {hasKids ? ` · ${node.children.length} child${node.children.length === 1 ? "" : "ren"}` : ""}
          </NodeSub>
        </NodeMeta>
      </NodeCard>
      {hasKids && depth < 3 && (
        <Nested>
          <NestedLabel>derived from {node.name}</NestedLabel>
          <Children style={{ padding: 0 }}>
            {node.children.map((child) => (
              <NodeView key={child.id} node={child} depth={depth + 1} />
            ))}
          </Children>
        </Nested>
      )}
    </>
  );
};

const FamilyTreePage = () => {
  const { miladys, liveUpdatedAt } = useMiladys();
  const tree = useMemo(() => (miladys ? buildTree(miladys) : null), [miladys]);
  const [open, setOpen] = useState<Record<string, boolean>>({ milady: true });

  const toggle = (id: string) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <Layout liveUpdatedAt={liveUpdatedAt}>
      <TextArea
        header="family tree"
        body="Lineage map of the Remiliasphere. Everything roots in Milady Maker; branches like Remilio, Pixelady, Radbro, and Aura spawn their own subcultures — including multi-chain cousins (Hypio, Retardio, Dreamilio, Mibera)."
      />

      <Legend>
        Click a branch to expand. Cards link to the best marketplace for that
        collection. Parent edges come from community curation (<code>parent</code>{" "}
        in the API).
      </Legend>

      <TreeShell>
        {!tree && <Legend>Loading lineage…</Legend>}
        {tree &&
          tree.children.map((branch) => {
            const isOpen = open[branch.id] ?? false;
            return (
              <Branch key={branch.id}>
                <BranchHeader type="button" onClick={() => toggle(branch.id)}>
                  <BranchTitle>
                    <BranchName>{branch.name}</BranchName>
                    <BranchMeta>
                      {(branch.milady &&
                        (CHAIN_LABELS[branch.milady.chainId] || "Chain")) ||
                        "branch"}{" "}
                      · {branch.children.length} direct derivatives · parent:{" "}
                      {ROOT_NAME}
                    </BranchMeta>
                  </BranchTitle>
                  <Chevron $open={isOpen}>›</Chevron>
                </BranchHeader>
                {isOpen && (
                  <Children>
                    <NodeView node={branch} depth={0} />
                  </Children>
                )}
              </Branch>
            );
          })}
      </TreeShell>
    </Layout>
  );
};

export default FamilyTreePage;

import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledNavItems = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: center;
`;

const NavItem = styled.button<{ $active: boolean }>`
  padding: 0.7rem 1.4rem;
  font-size: 1.35rem;
  font-weight: 600;
  border-radius: 999px;
  cursor: pointer;
  border: 1px solid
    ${({ $active }) => ($active ? "rgba(47, 77, 12, 0.35)" : "var(--border)")};
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, var(--primary) 0%, var(--primary-soft) 100%)"
      : "rgba(255, 255, 255, 0.85)"};
  color: ${({ $active }) => ($active ? "#fff" : "var(--muted)")};
  box-shadow: ${({ $active }) => ($active ? "var(--shadow)" : "none")};
  transition: transform 0.15s ease, background 0.15s ease, color 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    color: ${({ $active }) => ($active ? "#fff" : "var(--primary)")};
  }
`;

const buttons: { name: string; path: string }[] = [
  { name: "All Derivatives", path: "/" },
  { name: "Family Tree", path: "/family-tree" },
];

const NavItems = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <StyledNavItems aria-label="Primary">
      {buttons.map((button) => (
        <NavItem
          key={button.name}
          type="button"
          $active={location.pathname === button.path}
          onClick={() => navigate(button.path)}
        >
          {button.name}
        </NavItem>
      ))}
    </StyledNavItems>
  );
};

export default NavItems;

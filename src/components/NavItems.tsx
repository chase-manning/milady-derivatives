import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import useRipple from "../hooks/use-ripple";

const StyledNavItems = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: center;
  animation: milady-fade-up var(--dur-page) var(--ease-out) both;
  animation-delay: 90ms;
`;

const NavItem = styled.button<{ $active: boolean }>`
  position: relative;
  overflow: hidden;
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
      : "color-mix(in srgb, #ffffff 80%, var(--secondary-soft) 20%)"};
  color: ${({ $active }) => ($active ? "#fff" : "var(--muted)")};
  box-shadow: ${({ $active }) => ($active ? "var(--shadow)" : "none")};
  backdrop-filter: blur(10px);
  transition: transform var(--dur-hover) var(--ease-out),
    background var(--dur-hover) var(--ease-out),
    color var(--dur-hover) var(--ease-out),
    box-shadow var(--dur-hover) var(--ease-out);

  &:hover {
    transform: translateY(-2px);
    color: ${({ $active }) => ($active ? "#fff" : "var(--primary)")};
    box-shadow: var(--shadow);
  }

  &:active {
    transform: scale(0.98);
    transition-duration: var(--dur-press);
  }
`;

const buttons: { name: string; path: string }[] = [
  { name: "All Derivatives", path: "/" },
  { name: "Family Tree", path: "/family-tree" },
];

const NavItems = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ripple = useRipple();

  return (
    <StyledNavItems aria-label="Primary">
      {buttons.map((button) => (
        <NavItem
          key={button.name}
          type="button"
          $active={location.pathname === button.path}
          onClick={(e) => {
            ripple(e);
            navigate(button.path);
          }}
        >
          {button.name}
        </NavItem>
      ))}
    </StyledNavItems>
  );
};

export default NavItems;

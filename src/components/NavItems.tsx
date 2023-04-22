import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";

const StyledNavItems = styled.div`
  display: flex;
  margin-bottom: 4rem;
`;

interface NavItemProps {
  active: boolean;
}

const NavItem = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1.8rem;
  font-weight: 500;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 1rem;

  border: solid 1px var(--primary);
  background: ${(props: NavItemProps) =>
    props.active ? "var(--primary)" : "var(--secondary)"};
  color: ${(props: NavItemProps) =>
    props.active ? "white" : "var(--primary)"};
`;

const buttons: { name: string; path: string }[] = [
  {
    name: "All Derivatives",
    path: "/",
  },
  {
    name: "Family Tree",
    path: "/family-tree",
  },
];

const NavItems = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <StyledNavItems>
      {buttons.map((button) => {
        return (
          <NavItem
            active={location.pathname == button.path}
            key={button.name}
            onClick={() => navigate(button.path)}
          >
            {button.name}
          </NavItem>
        );
      })}
    </StyledNavItems>
  );
};

export default NavItems;

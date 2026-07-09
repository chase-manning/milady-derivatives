import styled from "styled-components";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FamilyTreePage from "./pages/FamilyTreePage";

const StyledApp = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2.4rem 6rem;

  @media (max-width: 768px) {
    padding: 2.4rem 1.4rem 4rem;
  }
`;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <StyledApp>
        <HomePage />
      </StyledApp>
    ),
  },
  {
    path: "/family-tree",
    element: (
      <StyledApp>
        <FamilyTreePage />
      </StyledApp>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

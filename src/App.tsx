import styled from "styled-components";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/HomePage";
import FamilyTreePage from "./pages/FamilyTreePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "family-tree",
    element: <FamilyTreePage />,
  },
]);

const StyledApp = styled.div`
  width: 100%;
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6rem;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

function App() {
  return (
    <StyledApp>
      <RouterProvider router={router} />
    </StyledApp>
  );
}

export default App;

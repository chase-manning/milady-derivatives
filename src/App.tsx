import { useEffect, useState } from "react";
import styled from "styled-components";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import AmbientField from "./components/AmbientField";
import Preloader from "./components/Preloader";
import HomePage from "./pages/HomePage";
import FamilyTreePage from "./pages/FamilyTreePage";

const Shell = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2.4rem 6rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 2.4rem 1.4rem 4rem;
  }
`;

const RootLayout = () => {
  const [booting, setBooting] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Minimum presence so the bloom loader is felt, not a flash
    const min = window.setTimeout(() => setExiting(true), 900);
    return () => window.clearTimeout(min);
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const t = window.setTimeout(() => setBooting(false), 420);
    return () => window.clearTimeout(t);
  }, [exiting]);

  return (
    <>
      <AmbientField />
      {booting && <Preloader exiting={exiting} />}
      <Shell>
        <Outlet />
      </Shell>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "family-tree", element: <FamilyTreePage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

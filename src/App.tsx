import { useEffect, useState } from "react";
import styled from "styled-components";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import AmbientField from "./components/AmbientField";
import FilmGrain from "./components/FilmGrain";
import ManifestoMarquee from "./components/ManifestoMarquee";
import Preloader from "./components/Preloader";
import SoundDock from "./components/SoundDock";
import HomePage from "./pages/HomePage";
import FamilyTreePage from "./pages/FamilyTreePage";
import { soundscape } from "./lib/soundscape";

const Shell = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* room for fixed marquee */
  padding: 5.2rem 2.4rem 6rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 4.4rem 1.4rem 5.5rem;
  }
`;

const RootLayout = () => {
  const [booting, setBooting] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const min = window.setTimeout(() => setExiting(true), 1100);
    return () => window.clearTimeout(min);
  }, []);

  useEffect(() => {
    if (!exiting) return;
    soundscape.blip("open");
    const t = window.setTimeout(() => setBooting(false), 420);
    return () => window.clearTimeout(t);
  }, [exiting]);

  return (
    <>
      <ManifestoMarquee />
      <AmbientField />
      <FilmGrain />
      {booting && (
        <Preloader exiting={exiting} label="loading derivatives · ゆっくり" />
      )}
      <Shell>
        <Outlet />
      </Shell>
      <SoundDock />
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

import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    :root {
        --bg: #eef6ec;
        --bg-accent: #d8f0d6;
        --surface: rgba(255, 255, 255, 0.82);
        --surface-solid: #ffffff;
        --main: #1a2414;
        --muted: #5a6b52;
        --primary: #2f4d0c;
        --primary-soft: #3d6614;
        --secondary: #b8d9b7;
        --secondary-soft: #d4ebd3;
        --border: rgba(47, 77, 12, 0.18);
        --shadow: 0 10px 30px rgba(47, 77, 12, 0.08);
        --shadow-hover: 0 16px 40px rgba(47, 77, 12, 0.14);
        --radius: 1.6rem;
        --radius-sm: 1rem;
        --ring: 0 0 0 3px rgba(47, 77, 12, 0.12);
        --font: "Outfit", "Segoe UI", helvetica, sans-serif;
        --font-display: "Syne", "Outfit", sans-serif;
    }

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    html {
        font-size: 62.5%;
        scroll-behavior: smooth;
    }

    body {
        min-height: 100vh;
        color: var(--main);
        font-family: var(--font);
        font-size: 1.6rem;
        line-height: 1.5;
        background:
            radial-gradient(1200px 600px at 10% -10%, #c8ebc4 0%, transparent 55%),
            radial-gradient(900px 500px at 100% 0%, #f0d9ff 0%, transparent 45%),
            radial-gradient(800px 500px at 50% 100%, #d8f0d6 0%, transparent 50%),
            linear-gradient(180deg, #eef6ec 0%, #f7fbf6 40%, #ffffff 100%);
        background-attachment: fixed;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    button {
        background: none;
        border: none;
        outline: none;
        font-family: inherit;
        cursor: pointer;
    }

    input {
        border: none;
        outline: none;
        font-family: inherit;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    ::selection {
        background: var(--secondary);
        color: var(--primary);
    }

    /* Subtle noise texture overlay via CSS only */
    body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        opacity: 0.035;
        z-index: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    #root {
        position: relative;
        z-index: 1;
    }
`;

const GlobalStyles = (): JSX.Element => {
  return <GlobalStyle />;
};

export default GlobalStyles;

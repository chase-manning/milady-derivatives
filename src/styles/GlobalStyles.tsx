import { createGlobalStyle } from "styled-components";

/**
 * Milady Derivatives visual system.
 * Motion / glass / loader craft inspired by bookmarked Art Utilities
 * (Whimsy Loaders, liquid-glass patterns, water-ripple actuation, clean 3D UI)
 * but recolored to the original Remilia green catalog identity — not Digital Sea.
 */
const GlobalStyle = createGlobalStyle`
    :root {
        /* Original milady catalog palette */
        --bg: #eef6ec;
        --bg-accent: #d8f0d6;
        --surface: rgba(255, 255, 255, 0.78);
        --surface-solid: #ffffff;
        --main: #1a2414;
        --muted: #5a6b52;
        --primary: #2f4d0c;
        --primary-soft: #3d6614;
        --secondary: #b8d9b7;
        --secondary-soft: #d4ebd3;
        --border: rgba(47, 77, 12, 0.18);
        --border-soft: rgba(255, 255, 255, 0.55);
        --shadow: 0 10px 30px rgba(47, 77, 12, 0.08);
        --shadow-hover: 0 18px 44px rgba(47, 77, 12, 0.16);
        --radius: 1.6rem;
        --radius-sm: 1rem;
        --ring: 0 0 0 3px rgba(47, 77, 12, 0.12);
        --font: "Outfit", "Segoe UI", helvetica, sans-serif;
        --font-display: "Syne", "Outfit", sans-serif;

        /* Quiet motion tokens (bookmark motion table, remapped) */
        --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
        --ease-press: ease-in;
        --dur-micro: 180ms;
        --dur-panel: 300ms;
        --dur-page: 380ms;
        --dur-hover: 200ms;
        --dur-press: 100ms;
        --dur-loader: 1.6s;
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
            radial-gradient(900px 500px at 100% 0%, #e8d4f5 0%, transparent 42%),
            radial-gradient(800px 500px at 50% 100%, #d8f0d6 0%, transparent 50%),
            linear-gradient(180deg, #eef6ec 0%, #f7fbf6 40%, #ffffff 100%);
        background-attachment: fixed;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
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

    body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        opacity: 0.028;
        z-index: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    ::selection {
        background: #b8d9b7;
        color: #2f4d0c;
    }

    #root {
        position: relative;
        z-index: 1;
    }

    /* Liquid-glass surface (CSS refraction stand-in; green-tinted) */
    .milady-glass {
        background: color-mix(in srgb, #ffffff 72%, var(--secondary-soft) 28%);
        backdrop-filter: blur(18px) saturate(1.25);
        -webkit-backdrop-filter: blur(18px) saturate(1.25);
        border: 1px solid var(--border);
        box-shadow: var(--shadow), inset 0 1px 0 var(--border-soft);
    }

    @keyframes milady-fade-up {
        from {
            opacity: 0;
            transform: translateY(14px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes milady-bloom {
        0%, 100% {
            transform: scale(0.86);
            opacity: 0.55;
        }
        50% {
            transform: scale(1.08);
            opacity: 1;
        }
    }

    @keyframes milady-orbit {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @keyframes milady-shimmer {
        0% { background-position: 0% 50%; }
        100% { background-position: 100% 50%; }
    }

    @keyframes milady-ripple {
        0% {
            transform: scale(0);
            opacity: 0.45;
        }
        100% {
            transform: scale(2.4);
            opacity: 0;
        }
    }

    .stagger-in {
        animation: milady-fade-up var(--dur-page) var(--ease-out) both;
    }

    @media (prefers-reduced-motion: reduce) {
        html {
            scroll-behavior: auto;
        }

        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;

const GlobalStyles = (): JSX.Element => {
  return <GlobalStyle />;
};

export default GlobalStyles;

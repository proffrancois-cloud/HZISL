import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  House,
  Menu,
  UsersRound,
  X,
} from "lucide-react";
import { GAME_DETAILS, SIDEBAR_GAMES, SPORTS_BY_GAME } from "../data/sports.js";
import { toBrowserPath } from "../lib/appPaths.js";
import { BrandMark } from "./BrandMark.jsx";
import { SportLogo } from "./SportLogo.jsx";

function NavLink({ href, active, onNavigate, children, icon: Icon }) {
  return (
    <a
      className={`nav-link${active ? " is-active" : ""}`}
      href={toBrowserPath(href)}
      aria-current={active ? "page" : undefined}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(href);
      }}
    >
      {Icon ? <Icon size={17} strokeWidth={2} aria-hidden="true" /> : null}
      <span>{children}</span>
      {active ? <ChevronRight className="nav-link__arrow" size={15} aria-hidden="true" /> : null}
    </a>
  );
}

export function AppShell({ children, currentPath, isMenuOpen, onMenuChange, onNavigate }) {
  const closeButtonRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 960px)").matches);
  const activeGame = SIDEBAR_GAMES.find((game) =>
    (SPORTS_BY_GAME[game] ?? []).some((sport) => currentPath === `/sports/${sport.id}`),
  );
  const [openGame, setOpenGame] = useState(activeGame ?? null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 960px)");
    const updateMobileState = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", updateMobileState);
    return () => mediaQuery.removeEventListener("change", updateMobileState);
  }, []);

  useEffect(() => {
    if (isMenuOpen) closeButtonRef.current?.focus();
  }, [isMenuOpen]);

  useEffect(() => {
    if (activeGame) setOpenGame(activeGame);
  }, [activeGame]);

  useEffect(() => {
    if (!isMobile || !isMenuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen, isMobile]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onMenuChange(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onMenuChange]);

  const navigate = (href) => {
    onMenuChange(false);
    onNavigate(href);
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="mobile-header">
        <button
          className="icon-button"
          type="button"
          aria-label="Open navigation"
          aria-expanded={isMenuOpen}
          aria-controls="primary-sidebar"
          onClick={() => onMenuChange(true)}
        >
          <Menu size={21} aria-hidden="true" />
        </button>
        <a
          className="mobile-brand"
          href={toBrowserPath("/")}
          onClick={(event) => {
            event.preventDefault();
            navigate("/");
          }}
        >
          <BrandMark compact />
          <span>HZISL</span>
        </a>
        <span className="season-badge">26/27</span>
      </header>

      {isMenuOpen ? (
        <button
          className="drawer-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => onMenuChange(false)}
        />
      ) : null}

      <aside
        className={`sidebar${isMenuOpen ? " is-open" : ""}`}
        id="primary-sidebar"
        aria-label="Primary navigation"
        aria-hidden={isMobile && !isMenuOpen ? "true" : undefined}
        inert={isMobile && !isMenuOpen ? true : undefined}
      >
        <div className="sidebar__header">
          <a
            className="sidebar__brand"
            href={toBrowserPath("/")}
            onClick={(event) => {
              event.preventDefault();
              navigate("/");
            }}
          >
            <BrandMark />
            <span>
              <strong>HZISL</strong>
              <small>Hsinchu–Zhubei League</small>
            </span>
          </a>
          <button
            ref={closeButtonRef}
            className="icon-button icon-button--sidebar"
            type="button"
            aria-label="Close navigation"
            onClick={() => onMenuChange(false)}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="sidebar__nav">
          <NavLink href="/" active={currentPath === "/"} onNavigate={navigate} icon={House}>
            Home
          </NavLink>

          <div className="nav-section nav-section--games">
            {SIDEBAR_GAMES.map((game) => {
              const details = GAME_DETAILS[game];
              const sports = SPORTS_BY_GAME[game] ?? [];
              const isOpen = openGame === game;

              return (
                <div className={`nav-game${isOpen ? " is-open" : ""}`} key={game}>
                  <button
                    className="nav-game__trigger"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`nav-game-${game}`}
                    onClick={() => setOpenGame((current) => current === game ? null : game)}
                  >
                    <SportLogo game={game} size="menu" decorative />
                    <span>{details.label}</span>
                    <ChevronDown size={15} aria-hidden="true" />
                  </button>
                  {isOpen ? (
                    <div className="nav-game__content" id={`nav-game-${game}`}>
                      {details.hasCompetitions ? sports.map((sport) => (
                        <NavLink
                          key={sport.id}
                          href={`/sports/${sport.id}`}
                          active={currentPath === `/sports/${sport.id}`}
                          onNavigate={navigate}
                        >
                          {sport.shortTitle}
                        </NavLink>
                      )) : (
                        <p className="nav-game__empty">No competitions organized yet</p>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </nav>

        <div className="sidebar__footer">
          <NavLink
            href="/organization"
            active={currentPath === "/organization"}
            onNavigate={navigate}
            icon={UsersRound}
          >
            Organization
          </NavLink>
          <span className="sidebar__season">Season 2026–27</span>
        </div>
      </aside>

      <main className="main-content" id="main-content" tabIndex="-1">
        {children}
      </main>
    </div>
  );
}

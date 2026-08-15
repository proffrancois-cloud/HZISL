import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  CircleDot,
  House,
  Menu,
  Trophy,
  UsersRound,
  X,
} from "lucide-react";
import { SPORTS_BY_GAME } from "../data/sports.js";
import { BrandMark } from "./BrandMark.jsx";

const GAME_LABELS = { football: "Football", basketball: "Basketball" };

function NavLink({ href, active, onNavigate, children, icon: Icon }) {
  return (
    <a
      className={`nav-link${active ? " is-active" : ""}`}
      href={href}
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
          href="/"
          onClick={(event) => {
            event.preventDefault();
            navigate("/");
          }}
        >
          <BrandMark compact />
          <span>ISLT</span>
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
            href="/"
            onClick={(event) => {
              event.preventDefault();
              navigate("/");
            }}
          >
            <BrandMark />
            <span>
              <strong>ISLT</strong>
              <small>Schools League Taiwan</small>
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

          <div className="nav-section">
            <p className="nav-section__label"><Trophy size={14} aria-hidden="true" /> Sports</p>
            {Object.entries(SPORTS_BY_GAME).map(([game, sports]) => (
              <div className="nav-game" key={game}>
                <p className="nav-game__label">
                  {game === "football" ? <CircleDot size={13} aria-hidden="true" /> : <CalendarDays size={13} aria-hidden="true" />}
                  {GAME_LABELS[game]}
                </p>
                {sports.map((sport) => (
                  <NavLink
                    key={sport.id}
                    href={`/sports/${sport.id}`}
                    active={currentPath === `/sports/${sport.id}`}
                    onNavigate={navigate}
                  >
                    {sport.shortTitle}
                  </NavLink>
                ))}
              </div>
            ))}
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

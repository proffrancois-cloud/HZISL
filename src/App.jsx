import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/AppShell.jsx";
import { HomePage } from "./components/HomePage.jsx";
import { OrganizationPage } from "./components/OrganizationPage.jsx";
import { SportPage } from "./components/SportPage.jsx";
import { getSport } from "./data/sports.js";
import { fromBrowserPath, toBrowserPath } from "./lib/appPaths.js";

function getRoute(pathname) {
  if (pathname === "/organization") return { type: "organization" };
  const sportMatch = pathname.match(/^\/sports\/([^/]+)\/?$/);
  if (sportMatch) {
    const sport = getSport(sportMatch[1]);
    if (sport) return { type: "sport", sport };
  }
  return { type: "home" };
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(fromBrowserPath(window.location.pathname));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const route = useMemo(() => getRoute(currentPath), [currentPath]);

  const navigate = useCallback((href) => {
    const browserPath = toBrowserPath(href);
    if (window.location.pathname !== browserPath) window.history.pushState({}, "", browserPath);
    setCurrentPath(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.requestAnimationFrame(() => document.getElementById("main-content")?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    const onPopState = () => setCurrentPath(fromBrowserPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  return (
    <AppShell
      currentPath={currentPath}
      isMenuOpen={isMenuOpen}
      onMenuChange={setIsMenuOpen}
      onNavigate={navigate}
    >
      {route.type === "home" ? <HomePage onNavigate={navigate} /> : null}
      {route.type === "sport" ? (
        <SportPage sport={route.sport} onNavigate={navigate} onNotice={setNotice} />
      ) : null}
      {route.type === "organization" ? <OrganizationPage /> : null}
      {notice ? <div className="toast" role="status">{notice}</div> : null}
    </AppShell>
  );
}

const CONFIGURED_BASE = import.meta.env?.BASE_URL || "/";
const BASE_PATH = CONFIGURED_BASE === "/" ? "" : CONFIGURED_BASE.replace(/\/$/, "");

function normalizeLogicalPath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function toBrowserPath(pathname) {
  const logicalPath = normalizeLogicalPath(pathname);
  if (!BASE_PATH) return logicalPath;
  return logicalPath === "/" ? `${BASE_PATH}/` : `${BASE_PATH}${logicalPath}`;
}

export function fromBrowserPath(pathname) {
  if (!BASE_PATH) return normalizeLogicalPath(pathname);
  if (pathname === BASE_PATH || pathname === `${BASE_PATH}/`) return "/";
  if (pathname.startsWith(`${BASE_PATH}/`)) return normalizeLogicalPath(pathname.slice(BASE_PATH.length));
  return normalizeLogicalPath(pathname);
}

export function publicAsset(pathname) {
  return toBrowserPath(pathname);
}

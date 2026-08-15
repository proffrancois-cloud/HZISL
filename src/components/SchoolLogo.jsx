export function SchoolLogo({ school, size = "default", decorative = false }) {
  if (!school) return null;

  if (school.logoUrl) {
    return (
      <span className={`school-logo school-logo--${size} school-logo--image school-logo--${school.id.toLowerCase()}`}>
        <img src={school.logoUrl} alt={decorative ? "" : `${school.name} logo`} />
      </span>
    );
  }

  return (
    <span
      className={`school-logo school-logo--${size}`}
      aria-label={`${school.id} logo awaiting approval`}
      role="img"
  >
    <span>{school.id}</span>
  </span>
);
}

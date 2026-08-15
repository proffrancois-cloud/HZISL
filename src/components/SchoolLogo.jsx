export function SchoolLogo({ school, size = "default" }) {
  if (school.logoUrl) {
    return (
      <span className={`school-logo school-logo--${size}`}>
        <img src={school.logoUrl} alt={`${school.name} logo`} />
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

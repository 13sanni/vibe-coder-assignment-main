interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <span
      className="inline-flex items-center justify-center ml-1 text-xs"
      title="Verified"
      style={{ color: "var(--accent)" }}
    >
      ✔
    </span>
  );
}

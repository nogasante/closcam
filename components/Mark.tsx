export function Mark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="4" fill="#d89a2b" />
      <path
        d="M8 25V12.5L16 8l8 4.5V25"
        fill="none"
        stroke="#1a1408"
        strokeWidth="2"
      />
      <path d="M13 25v-6h6v6" fill="none" stroke="#1a1408" strokeWidth="2" />
    </svg>
  );
}

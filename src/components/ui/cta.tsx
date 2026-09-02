import Link from "next/link";

type CtaProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
  className?: string;
};

export function Cta({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: CtaProps) {
  const base =
    "inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-sm font-medium transition-all duration-300 active:scale-[0.98]";
  const variants = {
    primary: "bg-zinc-50 text-zinc-950 hover:bg-white",
    secondary:
      "border border-zinc-800 text-zinc-200 hover:border-zinc-600 hover:text-white",
  };
  const cls = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

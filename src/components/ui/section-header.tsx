import { Eyebrow } from "./eyebrow";
import { Reveal } from "./reveal";

export function SectionHeader({
  eyebrow,
  title,
  sub,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "text-center" : ""}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-4 text-balance text-3xl font-medium tracking-tight text-zinc-50 md:text-5xl">
        {title}
      </h2>
      {sub ? (
        <p
          className={`mt-4 max-w-[60ch] text-base leading-relaxed text-zinc-400 ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {sub}
        </p>
      ) : null}
    </Reveal>
  );
}

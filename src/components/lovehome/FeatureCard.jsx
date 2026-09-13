import { head } from "lodash";

export function FeatureCard({ heading, text }) {
  let title = heading
  let body = text
  return (
    <article className="border border-plumb-line bg-plumb-paper p-8 md:p-9">
      <h3 className="font-display text-[28px] font-semibold leading-[1.08] tracking-[-0.025em]">
        {title}
      </h3>
      <p className="mt-5 max-w-xl font-display text-[20px] leading-[1.55] text-plumb-muted">
        {body}
      </p>
    </article>
  );
}

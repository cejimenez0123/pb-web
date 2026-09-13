import { FeatureCard } from "./FeatureCard";

export function FeatureGrid({ features }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {features.map((feature) => (
        <FeatureCard key={feature.title} {...feature} />
      ))}
    </div>
  );
}

import { SectionHeading } from "../ui/SectionHeading";
import { FeatureGrid } from "./FeatureGrid";
import { features } from "../../data/welcomeData";
export function HomePage() {
  return (
    <div className="plumb-scrollbar min-h-screen overflow-y-auto">
      <div className="mx-auto max-w-[1120px] px-7 py-14 md:px-12 md:py-20 xl:px-16">
        <SectionHeading
          eyebrow="New here"
          title="A place where writers become writers."
          description="Plumbumb is small on purpose. It is built for the slow part of writing — the drafting, the reading aloud, the note in the margin."
          titleSize="lg"
        />

        <section className="mt-16 border-t border-plumb-line pt-8 md:mt-20">
          <h2 className="font-display text-3xl font-semibold tracking-[-0.025em] md:text-4xl">
            How it works
          </h2>
          <FeatureGrid features={features} />
        </section>
      </div>
    </div>
  );
}

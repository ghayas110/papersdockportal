import ResourceCard from "@/components/ResourceCard/Resource";
import SectionTitle from "@/components/SectionTitle";
import { resourceData } from "@/constant/page";

const Features = () => {
  return (
    <section id="resource" className="py-16 px-6 md:px-10 md:py-20 lg:py-28 flex items-center justify-center">
      <div className="container mx-auto">
        <SectionTitle title="Resources" center />

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 justify-items-center">
          {resourceData.map((feature) => (
            <ResourceCard
              key={feature.notesId}
              notesId={feature.notesId}
              title={feature.title}
              desc={feature.desc}
              viewNotesUrl={feature.viewNotesUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

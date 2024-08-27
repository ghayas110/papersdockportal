import ResourceCard from "@/components/ResourceCard/Resource";
import SectionTitle from "@/components/SectionTitle";
import SingleFeature from "@/components/SingleFeature";
import { featuresData, resourceData } from "@/constant/page";

const Features = () => {
  return (
    <>
      <section id="features" className="py-16 px-10 md:py-20 lg:py-28 bg-zinc-800">
        <div className="container">
          <SectionTitle
            title="Resources"
            center
          />

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {resourceData.map((feature) => (
          <ResourceCard
            key={feature.notesId}
            notesId={feature.notesId}
            image={feature.image}
            title={feature.title}
            viewNotesUrl={feature.viewNotesUrl}
            downloadNotesUrl={feature.downloadNotesUrl}
          />
        ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;

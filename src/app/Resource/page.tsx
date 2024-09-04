import ResourceCard from "@/components/ResourceCard/Resource";
import SectionTitle from "@/components/SectionTitle";
import SingleFeature from "@/components/SingleFeature";
import { featuresData, resourceData } from "@/constant/page";
// notesId: "paper1",
// desc:"Theory Fundamentals",
// title: "P1",
// viewNotesUrl: "https://example.com/view-notes/abc123",
const Features = () => {
  return (
    <>
      <section id="resource" className="py-16 px-10 md:py-20 lg:py-28 items-center justify-center,flex">
        <div className="container">
          <SectionTitle
            title="Resources"
            center
          />

          <div className="grid grid-cols-1 gap-x-2 gap-y-14 md:grid-cols-2 lg:grid-cols-4">
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
    </>
  );
};

export default Features;

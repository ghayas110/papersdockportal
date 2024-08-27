const SectionTitle: React.FC<{
  title: string;

  width?: string;
  center?: boolean;
  mb?: string;
}> = ({ title, width = "100%", center, mb = "100px" }) => {
  return (
    <div
      className="flex flex-col w-screen text-white"
      style={{
        width,
        display: "flex",
        alignItems: center ? "center" : "flex-start",
        justifyContent: center ? "center" : "flex-start",
        marginBottom: mb,
      }}
    >
      <h2 style={{ fontSize: 40, fontWeight: "bold" }}>{title}</h2>
    
    </div>
  );
};
  
  export default SectionTitle;
  
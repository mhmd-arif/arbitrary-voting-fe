export default function simulationLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="container">{children}</div>
    </main>
  );
}

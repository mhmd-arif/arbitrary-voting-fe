"use client";
export default function dataUserLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="container">
        <div className="title">Data Diri Responden</div>
        {children}
      </div>
    </main>
  );
}

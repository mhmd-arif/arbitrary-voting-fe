import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

export default function TableCell({ data, rootPath }: any) {
  const { kandidat, headline } = data as { kandidat: string; headline: string };

  const router = useRouter();
  const slug = kandidat.toLowerCase();

  const handleToSlug = () => {
    router.push(
      `/${rootPath}/${slug}$?data=${encodeURIComponent(JSON.stringify(data))}`
    );
  };

  return (
    <>
      <button
        onClick={handleToSlug}
        className="group w-full h-full py-5 px-2 relative flex items-center justify-center"
      >
        {headline}
        {/* {nama} */}
      </button>
    </>
  );
}

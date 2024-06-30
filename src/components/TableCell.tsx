import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

export default function TableCell({ data, rootPath }: any) {
  const { nama, headline } = data as { nama: string; headline: string };

  const router = useRouter();
  const slug = nama.toLowerCase();

  const handleToSlug = () => {
    router.push(
      `/${rootPath}/${slug}$?data=${encodeURIComponent(JSON.stringify(data))}`
    );
  };

  return (
    <>
      <button
        onClick={handleToSlug}
        className="group w-full h-[10rem] relative z-0 border border-cus-black flex items-center justify-center"
      >
        {headline} <br />
        {nama}
      </button>
    </>
  );
}

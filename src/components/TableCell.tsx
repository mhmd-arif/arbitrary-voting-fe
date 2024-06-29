import Link from "next/link";
import React from "react";

export default function TableCell({ data, rootPath }: any) {
  const { slug, name } = data as { slug: string; name: string };

  return (
    <>
      <Link
        href={`/${rootPath}/${slug}`}
        className="group w-full relative z-0 border border-cus-black flex items-center justify-center"
      >
        {name}
      </Link>
    </>
  );
}

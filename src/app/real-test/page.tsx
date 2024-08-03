"use client";
import BackButton from "@/components/BackButton";
import NavButton from "@/components/NavButton";
import { useEffect } from "react";

export default function RealTest() {
  useEffect(() => {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (
        key === "type" ||
        key === "access_token" ||
        key === "ally-supports-cache"
      ) {
        return;
      }
      localStorage.setItem(key, "");
    });
  });

  return (
    <section className="wrapper">
      <h1 className="title">Simulasi Pemilihan</h1>
      <p className="description" id="short-desc">
        Anda telah menyelesaikan tahap pengenalan aplikasi, berikutnya adalah
        tahap inti penelitian
      </p>
      <NavButton href={"/real-test/category-prior"} text={"Selanjutnya"} />
    </section>
  );
}

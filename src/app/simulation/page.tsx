"use client";
import BackButton from "@/components/BackButton";
import NavButton from "@/components/NavButton";
import { useEffect } from "react";

export default function Simulation() {
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
      <p className="description">
        Tahap ini merupakan simulasi untuk pengenalan mengenai aplikasi
      </p>
      <div className="w-full flex justify-between">
        <BackButton />
        <NavButton href={"/user-data/initial"} text={"Selanjutnya"} />
      </div>
    </section>
  );
}

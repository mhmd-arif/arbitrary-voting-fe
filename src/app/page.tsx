"use client";
import NavButton from "@/components/NavButton";
import { useEffect } from "react";

export default function Home() {
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
    <main>
      <div className="container h-screen ">
        <h1 className="title">Deskripsi Penelitian</h1>

        <p className="description">
          Penelitian ini dilakukan untuk melihat perilaku memilih dan pola
          pemrosesan informasi dalam simulasi pemilu. Dalam penelitian ini Anda
          akan diminta untuk menjadi pemilih dalam simulasi pemilu yang
          dilaksanakan oleh peneliti. Penelitian akan dimulai dengan pelaksanaan
          uji coba agar peserta terbiasa dengan tampilan dari platform
          pemilihan. Setelah itu peserta akan masuk ke dalam pengambilan data
          simulasi pemilu serta mengisi kuesioner yang dicantumkan. Penelitian
          ini bermanfaat untuk mengetahui faktor apa saja yang mempengaruhi
          kualitas pilihan seseorang terutama dalam konteks pemilu
        </p>

        <NavButton href={"/simulation"} text={"Selanjutnya"} />
      </div>
    </main>
  );
}

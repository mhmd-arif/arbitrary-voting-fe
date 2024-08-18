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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const type = localStorage.getItem("type");
        const url =
          process.env.NEXT_PUBLIC_API_URL +
          `/information/auto-next?type=${type}`;

        const token = localStorage.getItem("access_token");
        // console.log("autonext type realtest", type);

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        });
        const data = await response.json();
        console.log(data.data);
        localStorage.setItem("autoNext", data.data.auto);
        // setLoading(false);
      } catch (error) {
        console.error(error);
        // setLoading(false);
        // Handle error
      }
    };

    fetchData();
  }, []);

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

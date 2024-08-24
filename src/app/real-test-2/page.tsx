"use client";
import BackButton from "@/components/BackButton";
import NavButton from "@/components/NavButton";
import { useEffect } from "react";

export default function RealTestTwo() {
  useEffect(() => {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (
        key === "type" ||
        key === "access_token" ||
        key === "ally-supports-cache" ||
        key === "is_double_test" ||
        key === "second_type"
      ) {
        return;
      }
      localStorage.setItem(key, "");
    });
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const second_type = localStorage.getItem("second_type");
        const url =
          process.env.NEXT_PUBLIC_API_URL +
          `/information/auto-next?type=${second_type}`;

        const token = localStorage.getItem("access_token");

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
        Anda telah menyelesaikan tahap tes pertama, berikutnya adalah tahap tes
        kedua
      </p>
      <NavButton href={"/real-test-2/category-prior"} text={"Selanjutnya"} />
    </section>
  );
}

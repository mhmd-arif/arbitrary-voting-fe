"use client";
import NavButton from "@/components/NavButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import ArrowButton from "@/components/ArrowButton";

export default function SimConfirmation() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [agreement, setAgreement] = useState<string>("");

  const urlNextPage = "/simulation/information-board";

  const handleClick = async () => {
    if (agreement !== "iya") {
      alert("Mohon setuju terlebih dahulu");
      return;
    }
    setLoading(true);

    const body = {
      start_date_simulation: new Date()
        .toISOString()
        .replace("T", " ")
        .split(".")[0],
    };

    console.log("body", body);

    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "/participant/";
      const token = localStorage.getItem("access_token");

      const response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.log("not ok");
        const errorMessage = await response.text();
        console.error("Server error:", errorMessage);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Fetched data:", data);
      const resData = data.data;
      setLoading(false);
      router.push(urlNextPage);

      if (!data || !data.data) {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Error :", error);
    }

    const expiryTime = localStorage.getItem("expiryTime");

    if (expiryTime == null || expiryTime == "0") {
      const expiryDate = new Date();

      expiryDate.setMinutes(expiryDate.getMinutes() + 300);
      expiryDate.setSeconds(expiryDate.getSeconds() + 2);

      localStorage.setItem("expiryTime", expiryDate.toISOString());
      router.push(urlNextPage);
    }

    router.push(urlNextPage);
  };

  return (
    <section className="wrapper">
      <div className="title">Simulasi Pemilihan</div>
      <div className="content">
        <label>
          Apakah Anda Bersedia untuk Mengikuti Penelitian Ini hingga Selesai?
        </label>
        <select
          id="dropdown"
          className="input-style"
          value={agreement}
          onChange={(e) => setAgreement(e.target.value)}
        >
          <option value="">Pilih Jawaban</option>
          <option value="tidak">Tidak</option>
          <option value="iya">Iya</option>
        </select>
      </div>

      <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
    </section>
  );
}

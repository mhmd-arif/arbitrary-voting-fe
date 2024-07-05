"use client";
import NavButton from "@/components/NavButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import ArrowButton from "@/components/ArrowButton";
import BackButton from "@/components/BackButton";

export default function Confirmation() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [agreement, setAgreement] = useState<string>("");
  const [timeLimit, setTimeLimit] = useState<number>(15);

  const urlNextPage = "/real-test/category";
  useEffect(() => {
    const fetchDataTime = async () => {
      try {
        const url =
          process.env.NEXT_PUBLIC_API_URL +
          `/information/time-limit?type=simulation`;
        const token = localStorage.getItem("access_token");

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        });
        const data = await response.json();
        // console.log(data);
        setTimeLimit(data.data.time);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);

        // Handle error
      }
    };

    fetchDataTime();
  });
  const handleClick = async () => {
    if (agreement !== "iya") {
      alert("Mohon setuju terlebih dahulu");
      return;
    }

    const confirmation = window.confirm("Apakah Anda setuju?");
    if (!confirmation) {
      return;
    }

    setLoading(true);

    const body = {
      start_date: new Date().toISOString().replace("T", " ").split(".")[0],
    };

    // console.log("body", body);

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

      // console.log("response", response);

      if (!response.ok) {
        console.log("not ok");
        const errorMessage = await response.text();
        console.error("Server error:", errorMessage);
        setLoading(false);
        return;
      }

      const data = await response.json();
      // console.log("Fetched data:", data);
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

    if (expiryTime == null || expiryTime == "") {
      const expiryDate = new Date();

      expiryDate.setMinutes(expiryDate.getMinutes() + timeLimit);
      expiryDate.setSeconds(expiryDate.getSeconds() + 1);

      localStorage.setItem("expiryTime", expiryDate.toISOString());
      router.push(urlNextPage);
    }

    router.push(urlNextPage);
  };

  return (
    <section className="wrapper">
      <div className="title">Pemilihan Riil</div>
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

      <div className="w-full flex justify-between">
        <BackButton />
        <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
      </div>
    </section>
  );
}

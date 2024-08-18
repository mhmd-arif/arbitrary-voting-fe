"use client";
import NavButton from "@/components/NavButton";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Kandidat } from "../page";
import ArrowButton from "@/components/ArrowButton";

export default function DetailHeading() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const data = searchParams.get("data");
  const [item, setItem] = useState<Kandidat | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [autoNext, setAutoNext] = useState<boolean>(false);

  const urlNextPage = "/simulation/information-check";
  const urlBackPage = "/simulation/information-board";

  useEffect(() => {
    if (timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev !== null) {
            const newTimeLeft = prev - 1000;
            if (newTimeLeft <= 0) {
              clearInterval(timer);
              setTimeLeft(null);
              if (autoNext) {
                router.push("/simulation/information-check");
              }
              // handleToInformationBoard();
            }
            return newTimeLeft;
          }
          return prev;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setItem(parsedData);
      } catch (error) {
        console.error("Error parsing data:", error);
        setItem(null);
      }
    }
  }, [data]);

  useEffect(() => {
    setAutoNext(JSON.parse(localStorage.getItem("autoNext") || "false"));
    const expiryTime = localStorage.getItem("expiryTime");
    if (expiryTime) {
      const currentTime = new Date().getTime();
      const expiryDate = new Date(expiryTime).getTime();
      const timeRemaining = expiryDate - currentTime;
      const enterTime = new Date();
      localStorage.setItem("pageSlugEnterTime", enterTime.toISOString());
      if (timeRemaining <= 0) {
        setTimeLeft(null);
        return;
      }
      setTimeLeft(timeRemaining);
    }
  }, [router]);

  const handleToInformationBoard = async () => {
    const pageSlugEnterTime = localStorage.getItem("pageSlugEnterTime") || "";
    const enterTime = new Date(pageSlugEnterTime).getTime();
    const currentTime = new Date().getTime();
    const timeSpent = Math.round((currentTime - enterTime) / 1000);
    let body;
    if (item) {
      body = {
        kandidat: item.nama,
        kategori: item.kategori,
        durasi: timeSpent,
      };
    }

    // console.log("body", body);

    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "/record/?type=simulation";
      const token = localStorage.getItem("access_token");
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // console.log("not ok");
        const errorMessage = await response.text();
        console.error("Server error:", errorMessage);
        return;
      }

      const data = await response.json();
      router.push(urlBackPage);

      if (!data || !data.data) {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Error :", error);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const colorClass =
      totalSeconds <= 30
        ? "text-red-500 animate-pulse font-[500]"
        : totalSeconds <= 60
        ? "text-yellow-500 font-[500]"
        : "";
    return (
      <p className={`${colorClass} text-center rounded-md  bg-cus-dark-gray`}>
        {minutes}m {seconds}s
      </p>
    );
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  if (!item) {
    return <div>No data found</div>;
  }

  return (
    <section className="wrapper">
      <h1 className="title">Papan Informasi</h1>
      <h2 className="text-center text-md mt-2 mb-6 ">{item.headline}</h2>
      <div className="w-8/12  flex flex-col justify-center border-2 border-cus-black rounded-[0.8rem] px-10 py-6 text-lg">
        <p>Kategori : {item.kategori}</p>
        <p>Nama: {item.nama}</p>
        <br />
        <p>Detail: </p>

        <p>{item.detail}</p>
      </div>
      <div className="flex w-full items-center">
        {timeLeft !== null ? (
          <p className="flex flex-col w-[10rem] py-2 px-4">
            {formatTime(timeLeft)}
          </p>
        ) : (
          <></>
        )}
        <div className="ml-auto">
          <ArrowButton
            text={"Selanjutnya"}
            onClick={handleToInformationBoard}
          />
        </div>
      </div>
    </section>
  );
}

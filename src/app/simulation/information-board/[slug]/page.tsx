"use client";
import NavButton from "@/components/NavButton";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Kandidat } from "../page";

export default function DetailHeading() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const data = searchParams.get("data");
  const [item, setItem] = useState<Kandidat | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const urlNextPage = "/simulation/information-check";
  const urlBackPage = "/simulation/information-board";

  useEffect(() => {
    const expiryTime = localStorage.getItem("expiryTime");
    if (expiryTime) {
      const currentTime = new Date().getTime();
      const expiryDate = new Date(expiryTime).getTime();
      const timeRemaining = expiryDate - currentTime;
      if (timeRemaining <= 0) {
        localStorage.setItem("expiryTime", "0"); // Mark as expired
        router.push(urlNextPage);
      } else {
        setTimeLeft(timeRemaining);
        const pageInfoEnterTime = localStorage.getItem("pageInfoEnterTime");
        if (pageInfoEnterTime == null || pageInfoEnterTime == "") {
          setTimeLeft(timeRemaining);
        }
      }
    } else {
      router.push(urlNextPage);
    }
  }, [router]);

  useEffect(() => {
    if (timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev !== null) {
            const newTimeLeft = prev - 1000;
            if (newTimeLeft <= 0) {
              localStorage.setItem("expiryTime", "0");
              clearInterval(timer);
              handleToInformationBoard();
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
    const expiryTime = localStorage.getItem("expiryTime");
    if (expiryTime) {
      const currentTime = new Date().getTime();
      const expiryDate = new Date(expiryTime).getTime();
      const timeRemaining = expiryDate - currentTime;
      if (timeRemaining <= 0) {
        localStorage.setItem("expiryTime", "0"); // Mark as expired
        router.push(urlNextPage);
      } else {
        const enterTime = new Date();
        localStorage.setItem("pageSlugEnterTime", enterTime.toISOString());
      }
    } else {
      router.push(urlNextPage);
    }
  }, [router]);

  const handleToInformationBoard = async () => {
    const pageSlugEnterTime = localStorage.getItem("pageSlugEnterTime") || "0";
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

    console.log("body", body);

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
        console.log("not ok");
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

  if (!data) {
    return <div>Loading...</div>;
  }

  if (!item) {
    return <div>No data found</div>;
  }

  return (
    <section className="w-[100vw] h-[100svh] flex flex-col justify-between items-center py-20 px-36 text-cus-black">
      <div className="w-[40svw] h-[10svh] border rounded-3xl flex justify-center items-center bg-cus-dark-gray font-normal text-5xl ">
        Papan Informasi
      </div>
      <h2 className=" text-2xl my-4">{item.headline}</h2>
      <div className="w-8/12 h-[60svh] flex flex-col justify-center border-2 border-cus-black rounded-3xl p-10 text-2xl">
        <p>Kategori : {item.kategori}</p>
        <p>Nama: {item.nama}</p>
        <p>Detail: {item.detail}</p>

        <p>
          {`{Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vehicula
          nisl in vehicula tincidunt. Donec vestibulum purus at vulputate
          faucibus. Vivamus malesuada justo aliquam libero tempus, id pharetra
          leo tristique. Quisque convallis tortor ac maximus placerat. Sed
          tincidunt sollicitudin augue rhoncus aliquet. Nunc facilisis vitae
          eros eu venenatis. Cras lacinia ornare arcu, nec convallis felis
          fermentum condimentum. Proin placerat vitae turpis ut semper. Fusce
          nec nisl lectus. Donec efficitur iaculis ligula. Donec in lectus
          finibus, iaculis lorem sollicitudin, feugiat tortor. Mauris mauris
          urna, pellentesque id velit ut, aliquam ultrices lorem.}`}
        </p>
      </div>
      <button
        onClick={handleToInformationBoard}
        className="self-end font-normal text-2xl w-[10rem]"
      >
        Lanjutkan
      </button>
    </section>
  );
}

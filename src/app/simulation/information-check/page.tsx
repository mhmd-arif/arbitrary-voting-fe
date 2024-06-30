"use client";
import NavButton from "@/components/NavButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function InformationCheck() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [text, setText] = useState("");
  const urlNextPage = "/simulation/final-answer";

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    console.log(e.target.value);
  };

  const handleClick = async () => {
    if (text === "") {
      alert("Mohon isikan text anda");
      return;
    }

    const body = {
      information_check_simulation: text,
    };

    console.log("body", body);

    try {
      if (typeof window !== "undefined") {
        const url = process.env.NEXT_PUBLIC_API_URL + "/participant/";
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;
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

        router.push(urlNextPage);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error :", error);
    }

    router.push(urlNextPage);
  };

  return (
    <section className="w-[100vw] h-[100svh] flex flex-col justify-between items-center py-20 px-16 text-cus-black">
      <div className="w-[40svw] h-[10svh] border rounded-3xl flex justify-center items-center bg-cus-dark-gray font-normal text-5xl ">
        Information Check
      </div>

      <div className="w-[80svw] h-[60svh] flex flex-col my-10 pt-32 text-5xl font-semibold">
        <label htmlFor="long-text">
          Silakan Ceritakan Beberapa hal mengenai Pilihan yang Tersedia
        </label>
        <textarea
          id="long-text"
          className="shadow appearance-none border rounded-lg w-[70rem] h-[40rem] mt-4 py-2 px-3 text-cus-black/80 leading-tight focus:outline-none focus:shadow-outline text-[1.3rem] font-medium"
          value={text}
          onChange={handleInputChange}
        />
      </div>
      <button
        onClick={handleClick}
        className="self-end font-normal text-2xl w-[10rem]"
      >
        Lanjutkan
        <Image
          src={"/arrow.svg"}
          alt="arrow"
          width={100}
          height={100}
          className="w-full"
        />
      </button>
    </section>
  );
}

"use client";
import NavButton from "@/components/NavButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function QuestionnaireSim() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const urlNextPage = "/real-test";

  const [text, setText] = useState("");

  const handleInput = (value: string) => {
    setText(value);
  };

  const handleClick = async () => {
    if (text === "") {
      alert("Mohon isikan text anda");
      return;
    }

    router.push(urlNextPage);
  };

  return (
    <section className="w-[100vw] h-[100svh] flex flex-col justify-between items-center py-20 px-16 text-cus-black">
      <div className="w-[40svw] h-[10svh] border rounded-3xl flex justify-center items-center bg-cus-dark-gray font-normal text-5xl ">
        Kuesioner
      </div>

      <div className="w-[80svw] h-[60svh] flex flex-col my-10 pt-32 text-5xl font-semibold">
        <label>1.Pertanyaan pertama</label>
        <input
          type="text"
          id="input-initial"
          className="shadow appearance-none border rounded w-[40svw] mt-4 py-2 px-3 text-cus-light-gray leading-tight focus:outline-none focus:shadow-outline text-4xl"
          placeholder="kotak jawaban "
          onChange={(e) => handleInput(e.target.value)}
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

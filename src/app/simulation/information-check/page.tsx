"use client";
import NavButton from "@/components/NavButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import ArrowButton from "@/components/ArrowButton";
import BackButton from "@/components/BackButton";

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
    <section className="wrapper">
      <div className="title">Information Check</div>

      <div className="content">
        <label htmlFor="long-text">
          Silakan Ceritakan Beberapa hal mengenai Pilihan yang Tersedia
        </label>
        <textarea
          id="long-text"
          className="input-style"
          style={{ fontSize: "1.25rem", width: "80%", height: "80%" }}
          value={text}
          onChange={handleInputChange}
        />
      </div>
      <div className="w-full flex justify-between">
        <BackButton />
        <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
      </div>
    </section>
  );
}

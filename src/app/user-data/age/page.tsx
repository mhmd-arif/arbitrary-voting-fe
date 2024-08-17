"use client";
import { useGlobalContext } from "@/context/GlobalContext";
import { useEffect, useState } from "react";
import ArrowButton from "@/components/ArrowButton";

import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function Age() {
  const [userAge, setUserAge] = useState("");
  const { user, updateUser } = useGlobalContext();
  const router = useRouter();
  const nextPageUrl = "/user-data/gender";

  const handleAgeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setUserAge(inputValue);
    updateUser("usia", parseInt(inputValue, 10));
  };

  const handleNextPageClick = () => {
    if (userAge === "") {
      alert("Mohon isikan usia anda");
      return;
    }

    const isNumber = !isNaN(Number(userAge));
    if (!isNumber) {
      alert("Mohon masukkan usia dengan benar (angka)");
      return;
    }

    if (Number(userAge) < 18 || Number(userAge) > 100) {
      alert("Usia minimal 18 tahun - 100 tahun");
      return;
    }

    router.push(nextPageUrl);
  };

  return (
    <section className="wrapper">
      <div className="spacer"></div>

      <div className="content">
        <label htmlFor="user-age">Usia</label>
        <input
          type="text"
          id="user-age"
          className="input-style"
          placeholder="contoh: 22"
          onChange={handleAgeInput}
        />
      </div>
      <div className="spacer"></div>
      <div className="spacer"></div>
      <div className="w-full flex justify-between">
        <BackButton />
        <ArrowButton text={"Selanjutnya"} onClick={handleNextPageClick} />
      </div>
    </section>
  );
}

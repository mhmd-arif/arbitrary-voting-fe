"use client";
import NavButton from "@/components/NavButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import BackButton from "@/components/BackButton";
import ArrowButton from "@/components/ArrowButton";

const options = ["nilai 1", "nilai 2", "nilai 3", "nilai 4", "nilai 5"];

export default function Question() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState("");

  const urlNextPage = "/end ";

  const handleOptionChange = (option: any) => {
    setSelectedOption(option);
    console.log(option);
  };

  const handleInput = (value: string) => {
    setText(value);
  };

  const handleClick = async () => {
    if (selectedOption === "") {
      alert("Mohon pilih jawaban");
      return;
    }

    router.push(urlNextPage);
  };

  return (
    <section className="wrapper">
      <h1 className="title">Kuesioner</h1>

      <div className="content">
        <label>1.Pertanyaan pertama</label>

        <div className="grid grid-cols-5 text-[1rem] mt-[1.5rem] gap-x-[3rem]">
          {options.map((option, index) => (
            <div
              key={option}
              className={`py-2 border-4 rounded-md text-center cursor-pointer ${
                selectedOption === option
                  ? "bg-cus-dark-gray border-black"
                  : "border-cus-dark-gray"
              }`}
              onClick={() => handleOptionChange(option)}
            >
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>
      </div>

      <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
    </section>
  );
}

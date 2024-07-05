"use client";
import NavButton from "@/components/NavButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import BackButton from "@/components/BackButton";
import ArrowButton from "@/components/ArrowButton";

const options = [" 1", " 2", " 3", " 4", " 5"];

export default function Question() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState("");

  const urlNextPage = "/real-test/end ";

  const handleOptionChange = (option: any) => {
    setSelectedOption(option);
    // console.log(option);
  };

  const handleClick = async () => {
    if (selectedOption === "") {
      alert("Mohon pilih jawaban");
      return;
    }

    const body = {
      participant_question_answer: [
        {
          question: "Pertanyaan 1",
          answer: parseInt(selectedOption),
        },
        {
          question: "Pertanyaan 2",
          answer: "Jawaban 2",
        },
      ],
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

        const data = await response.json();
        console.log(data.data);

        if (!response.ok) {
          // console.log("not ok");
          const errorMessage = await response.text();
          console.error("Server error:", errorMessage);
          setLoading(false);
          return;
        }

        // router.push(urlNextPage);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error :", error);
    }

    // router.push(urlNextPage);
  };

  return (
    <section className="wrapper">
      <h1 className="title">Kuesioner</h1>

      <div className="content">
        <label>1. Pertanyaan 1</label>

        <div className="w-[80%] ml-[1.8rem] grid grid-cols-5 text-[1rem] mt-[1.5rem] gap-x-[3rem] ">
          {options.map((option, index) => (
            <div
              key={option}
              className={`py-2 border-4 rounded-md text-center cursor-pointer  ${
                selectedOption === option
                  ? "bg-cus-dark-gray border-black"
                  : "border-cus-dark-gray"
              }`}
              onClick={() => handleOptionChange(option)}
            >
              <p className="text-[1.3rem]">{option}</p>
            </div>
          ))}
        </div>
      </div>

      <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
    </section>
  );
}

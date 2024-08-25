"use client";
import { useRouter } from "next/navigation";
import { useDebugValue, useEffect, useState } from "react";
import ArrowBackButton from "@/components/ArrowBackButton";
import ArrowButton from "@/components/ArrowButton";

const options = ["1", "2", "3", "4", "5", "6", "7"];

interface Question {
  id: number;
  question: string;
  type: string;
  scale: number;
}

interface Answer {
  question: string;
  selectedOption: string;
}

export default function Question() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]); // Store question and answer
  const [error, setError] = useState<string>("");

  const urlNextPage = "/real-test/end";

  // useEffect(() => {
  //   console.log("answers", answers);
  // }, [answers]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL + `/question`;
        const token = localStorage.getItem("access_token");
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        setQuestions(data.data);
        setAnswers(
          data.data.map((q: Question) => ({
            question: q.question,
            selectedOption: "",
          }))
        ); // Initialize answers array
        setLoading(false);

        if (!data || !data.data) {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        // Handle error
      }
    };

    fetchData();
  }, []);

  const handleNext = () => {
    if (!answers[currentQuestionIndex].selectedOption) {
      setError("Harap jawab pertanyaan sebelum melanjutkan.");
      return;
    }
    setError(""); // Clear any previous error

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleOptionChange = (option: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = {
      question: questions[currentQuestionIndex].question,
      selectedOption: option,
    }; // Store selected option along with question
    setAnswers(updatedAnswers);
    setError(""); // Clear error when an option is selected
  };

  const handleClick = async () => {
    if (!answers[currentQuestionIndex].selectedOption) {
      setError("Harap jawab pertanyaan sebelum melanjutkan.");
      return;
    }
    setError(""); // Clear any previous error

    const body = {
      participant_question_answer: answers,
    };

    // console.log("body", body);

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
          // console.log("not ok");
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
      <h1 className="title">Kuesioner</h1>
      <div className="content h-full pt-8">
        {questions.length > 0 && (
          <>
            <div>
              <h2 className="text-[2rem]">
                Pertanyaan {currentQuestionIndex + 1}
              </h2>
              <label className="text-[1.8rem]">
                {questions[currentQuestionIndex].question}
              </label>
            </div>

            <div className="w-[80%] ml-[1.8rem] grid grid-cols-7 text-[1rem] mt-[1.5rem] gap-x-[3rem] pt-6 ">
              {options.map((option) => (
                <div
                  key={option}
                  className={`py-2 border-4 rounded-md text-center cursor-pointer ${
                    answers[currentQuestionIndex].selectedOption === option
                      ? "bg-cus-dark-gray border-black"
                      : "border-cus-dark-gray"
                  }`}
                  onClick={() => handleOptionChange(option)}
                >
                  <p className="text-[1.3rem]">{option}</p>
                </div>
              ))}
            </div>
            {error && (
              <p className="text-red-500 text-[1.5rem] pt-8">{error}</p>
            )}
          </>
        )}
      </div>

      <div className="w-full flex justify-between">
        {currentQuestionIndex > 0 && (
          <ArrowBackButton text={"Kembali"} onClick={handlePrevious} />
        )}

        {currentQuestionIndex < questions.length - 1 ? (
          <ArrowButton text={"Selanjutnya"} onClick={handleNext} />
        ) : (
          <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
        )}
      </div>
    </section>
  );
}

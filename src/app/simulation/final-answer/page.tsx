"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArrowButton from "@/components/ArrowButton";
import BackButton from "@/components/BackButton";

interface ElectionData {
  partai: string;
  kandidat: {
    nama: string;
  }[];
}

const fetchData = async (token: any, url: any) => {
  try {
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
    // console.log("Fetched data:", data);
    // console.log(data.data);

    if (!data || !data.data) {
      throw new Error("Invalid data format");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export default function FinalAnswer() {
  const [isloading, setIsloading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ElectionData[]>([]);

  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("");
  const [polParty, setPolParty] = useState("");

  const urlNextPage = "/simulation/questionnaire";

  useEffect(() => {
    const type = localStorage.getItem("type");
    const token = localStorage.getItem("access_token");
    const url = process.env.NEXT_PUBLIC_API_URL + `/candidate?type=${type}`;

    console.log(url, token, type);

    fetchData(token, url)
      .then((fetchedData) => {
        const resData = fetchedData;
        console.log(resData);
        setData(resData);

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // const handleOptionChange = (e: any) => {
  //   const { value, name } = e.target;
  //   console.log(value, name);
  //   setSelectedOption(value);
  //   const tempAnswer = `{"partai": "${name}", "kandidat": "${value}"}`;
  //   setAnswer(tempAnswer);
  // };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
  };

  // const handleOptionChange = (event: any, partai: any) => {
  //   const { value } = event.target;
  //   console.log(`Selected Candidate: ${value}, Partai: ${partai}`);
  //   setPolParty(partai);
  //   setSelectedOption(value);
  // };

  const handleClick = async () => {
    if (selectedOption === "") {
      alert("Mohon isikan pilihan anda");
      return;
    }

    const body = JSON.stringify({
      final_answer_simulation: `{kandidat: ${selectedOption}}`,
      end_date_simulation: new Date()
        .toISOString()
        .replace("T", " ")
        .split(".")[0],
    });

    console.log("body", body);

    try {
      const type = localStorage.getItem("type");
      const token = localStorage.getItem("access_token");
      const url = process.env.NEXT_PUBLIC_API_URL + `/candidate?type=${type}`;

      const response = await fetch(url, {
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);
      const data = await response.json();
      console.log("Fetched data:", data);

      if (!response.ok) {
        console.log("not ok");
        const errorMessage = await response.text();
        console.error("Server error:", errorMessage);
        setLoading(false);
        return;
      }

      router.push(urlNextPage);

      setLoading(false);
    } catch (error) {
      console.error("Error :", error);
    }

    router.push(urlNextPage);
  };

  if (isloading) {
    return <div>loading</div>;
  }

  return (
    <section className="wrapper">
      <h1 className="title">Pilihan Akhir</h1>
      <h2 className="text-center text-md mt-2 mb-4">
        SILAKAN MEMPELAJARI INFORMASI YANG DISEDIAKAN <br />
        UNTUK MENENTUKAN PILIHAN ANDA
      </h2>

      <div className=" border w-[100%] h-[100%] mb-2 overflow-x-auto overflow-y-auto border-cus-black ">
        <div className="grid-container">
          {data.map((item) => (
            <div key={item.partai} className="border border-black text-center">
              <h2 className="font-bold text-[0.875rem] my-[0.3rem]">
                {item.partai}
              </h2>
              {item.kandidat.map((cdt) => (
                <div
                  key={cdt.nama}
                  className={`{can-be-clicked p-1 cursor-pointer hover:bg-cus-dark-gray ${
                    selectedOption === cdt.nama ? "bg-cus-dark-gray" : ""
                  }`}
                  onClick={() => setSelectedOption(cdt.nama)}
                >
                  <label
                    htmlFor={cdt.nama}
                    className="font-semibold text-[0.75rem] cursor-pointer"
                  >
                    {cdt.nama}
                  </label>
                  <input
                    type="radio"
                    id={cdt.nama}
                    name={item.partai}
                    value={cdt.nama}
                    checked={selectedOption === cdt.nama}
                    onChange={(e) => handleOptionChange(e)}
                    className="ml-2"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex justify-between">
        <BackButton />
        <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
      </div>
    </section>
  );
}

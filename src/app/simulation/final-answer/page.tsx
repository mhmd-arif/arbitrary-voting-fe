"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { Data, generateData } from "./generateData";

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
    <section className="w-[100vw] h-[100svh] flex flex-col justify-between items-center pt-20 pb-5 px-16 text-cus-black gap-y-4">
      <div className="w-[40svw] h-[10svh] border rounded-3xl flex justify-center items-center bg-cus-dark-gray font-normal text-5xl ">
        Pilihan Akhir
      </div>
      <div className="text-center text-2xl">
        SILAKAN MEMPELAJARI INFORMASI YANG DISEDIAKAN <br />
        UNTUK MENENTUKAN PILIHAN ANDA
      </div>

      <main className="my-elements border w-[90svw] h-[35rem] overflow-x-auto overflow-y-auto border-cus-black ">
        <div className="grid-container">
          {data.map((item) => (
            <div key={item.partai} className="border border-black text-center">
              <h2 className="font-bold text-xl my-[0.3rem]">{item.partai}</h2>
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
                    className="font-semibold text-md  cursor-pointer"
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
      </main>
      <button
        className="self-end font-normal text-2xl px-4 py-1 bg-cus-dark-gray rounded-md"
        onClick={handleClick}
      >
        Simpan
      </button>
    </section>
  );
}

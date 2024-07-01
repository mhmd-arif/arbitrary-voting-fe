"use client";
import TableCell from "@/components/TableCell";
import Link from "next/link";
// import { Item, generateData, Data, Header } from "./generateData";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArrowButton from "@/components/ArrowButton";
import { useGlobalContext } from "@/context/GlobalContext";

export interface Kategori {
  id: number;
  nama: string;
}

export interface Kandidat {
  id: number;
  kategori: string;
  nama: string;
  partai: string;
  headline: string;
  detail: string;
  kandidat: number;
}

const fetchData = async (
  token: any,
  url: any
): Promise<{ kategori: Kategori[]; kandidat: Kandidat[] }> => {
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
    console.log("Fetched data:", data);
    console.log(data.data);

    if (!data || !data.data) {
      throw new Error("Invalid data format");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export default function InformationPage() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [kandidat, setKandidat] = useState<Kandidat[]>([]);

  const { activeCategory, updateActiveCategory } = useGlobalContext();

  const router = useRouter();
  const urlNextPage = "/real-test/information-check";

  useEffect(() => {
    const type = localStorage.getItem("type");
    const token = localStorage.getItem("access_token");
    const url = process.env.NEXT_PUBLIC_API_URL + `/information?type=${type}`;
    fetchData(token, url)
      .then((fetchedData) => {
        const { kategori, kandidat } = fetchedData;

        setKategori(kategori);
        setKandidat(kandidat);

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const expiryTime = localStorage.getItem("expiryTime");
    if (expiryTime) {
      const currentTime = new Date().getTime();
      const expiryDate = new Date(expiryTime).getTime();
      const timeRemaining = expiryDate - currentTime;
      if (timeRemaining > 0) {
        setTimeLeft(timeRemaining);
        const pageInfoEnterTime = localStorage.getItem("pageInfoEnterTime");
        if (pageInfoEnterTime == null || pageInfoEnterTime == "") {
          setTimeLeft(timeRemaining);
          const enterTime = new Date();
          localStorage.setItem("pageInfoEnterTime", enterTime.toISOString());
        }
      } else {
        setTimeLeft(null);
      }
    }
  }, [router]);

  useEffect(() => {
    if (timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev !== null) {
            const newTimeLeft = prev - 1000;
            if (newTimeLeft <= 0) {
              setTimeLeft(null);
              clearInterval(timer);
            }
            return newTimeLeft;
          }
          return prev;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, router]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const colorClass =
      totalSeconds <= 30
        ? "text-red-500 animate-pulse font-[500]"
        : totalSeconds <= 60
        ? "text-yellow-500 font-[500]"
        : "";
    return (
      <p className={`${colorClass} text-center rounded-md  bg-cus-dark-gray`}>
        {minutes}m {seconds}s
      </p>
    );
  };

  const handleClick = async () => {
    setLoading(true);

    const body = {
      end_date: new Date().toISOString().replace("T", " ").split(".")[0],
    };

    console.log("body", body);

    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "/participant/";
      const token = localStorage.getItem("access_token");

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

      const data = await response.json();
      console.log("Fetched data:", data);
      const resData = data.data;

      // console.log(resData);
      setLoading(false);
      localStorage.setItem("pageInfoEnterTime", "");
      localStorage.setItem("pageSlugEnterTime", "");
      localStorage.setItem("expiryTime", "");
      router.push(urlNextPage);

      if (!data || !data.data) {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Error :", error);
    }
    // router.push(urlNextPage);
  };

  // const numberOfAdditionalCandidates = 20;

  // const additionalCandidates = Array.from(
  //   { length: numberOfAdditionalCandidates },
  //   (v, i) => ({
  //     id: i + 101,
  //     kategori: `Cat ${(i + 1) % 6}`,
  //     nama: `Kandidat p ${i + 101}`,
  //     headline: `Headline ${i + 101}`,
  //     detail: `Detail ${i + 101}`,
  //     kandidat: i + 101,
  //   })
  // );

  // const extendedKandidat = [...kandidat, ...additionalCandidates];

  const handleActiveCategory = (category: string) => {
    updateActiveCategory("nama", category);
  };

  return (
    <section className="wrapper">
      <h1 className="title">Papan Informasi</h1>
      <h2 className="text-center text-md mt-2 mb-6">
        SILAKAN MEMPELAJARI INFORMASI YANG DISEDIAKAN <br />
        UNTUK MENENTUKAN PILIHAN ANDA
      </h2>
      {loading ? (
        <nav className="w-[80%] grid grid-cols-5 my-auto text-center ">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="py-4 border border-cus-black bg-cus-dark-gray animate-pulse "
            >
              loading.. kategori
            </div>
          ))}
        </nav>
      ) : (
        <></>
      )}

      <div className="w-full h-[70%] flex flex-col items-center mb-4">
        <nav className="w-[80%]  grid grid-flow-col  mb-6 text-center">
          {kategori.map((item, index) => (
            <div
              key={index}
              className={` py-4 border border-cus-black cursor-pointer ${
                activeCategory.nama === item.nama ? "bg-cus-dark-gray" : ""
              }`}
              onClick={() => handleActiveCategory(item.nama)}
            >
              {item.nama}
            </div>
          ))}
        </nav>
        <div
          className={`${
            loading ? "animate-pulse bg-cus-dark-gray" : ""
          } w-full h-full border border-cus-black `}
        >
          <div className="w-[100%] max-h-[80%] grid grid-cols-5 text-center  overflow-y-auto ">
            {kandidat
              .filter((item) => item.kategori === activeCategory.nama)
              .map((item) => (
                <div
                  key={item.id}
                  className="w-full border border-cus-black cursor-pointer hover:bg-cus-dark-gray"
                >
                  <TableCell
                    data={{
                      id: item.id,
                      kategori: item.kategori,
                      nama: item.nama,
                      partai: item.partai,
                      headline: item.headline,
                      detail: item.detail,
                      kandidat: item.kandidat,
                    }}
                    rootPath={"real-test/information-board"}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="self-end">
        {timeLeft !== null ? (
          <div className="flex flex-col">
            <p>
              lanjutkan membaca <br /> setidaknya selama
            </p>
            {formatTime(timeLeft)}
          </div>
        ) : (
          <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
        )}
      </div>
    </section>
  );
}

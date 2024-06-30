"use client";
import TableCell from "@/components/TableCell";
import Link from "next/link";
// import { Item, generateData, Data, Header } from "./generateData";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArrowButton from "@/components/ArrowButton";

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
  const [headerLength, setHeaderLength] = useState<number | null>(null);
  const [minWidth, setMinWidth] = useState<number | null>(null);
  const [isloading, setIsloading] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [kandidat, setKandidat] = useState<Kandidat[]>([]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const router = useRouter();
  const urlPageNext = "/simulation/information-check";

  const url = process.env.NEXT_PUBLIC_API_URL + "/information?type=simulation";

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetchData(token, url)
      .then((fetchedData) => {
        const { kategori, kandidat } = fetchedData;

        setKategori(kategori);
        console.log(kategori);
        setKandidat(kandidat);
        console.log(kandidat.length, kandidat);

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  useEffect(() => {
    const expiryTime = localStorage.getItem("expiryTime");
    if (expiryTime) {
      const currentTime = new Date().getTime();
      const expiryDate = new Date(expiryTime).getTime();
      const timeRemaining = expiryDate - currentTime;
      if (timeRemaining <= 0) {
        localStorage.setItem("expiryTime", "0"); // Mark as expired
        router.push(urlPageNext);
      } else {
        setTimeLeft(timeRemaining);
        const pageInfoEnterTime = localStorage.getItem("pageInfoEnterTime");
        if (pageInfoEnterTime == null || pageInfoEnterTime == "") {
          setTimeLeft(timeRemaining);
          const enterTime = new Date();
          localStorage.setItem("pageInfoEnterTime", enterTime.toISOString());
        }
      }
    } else {
      router.push(urlPageNext);
    }
  }, [router]);

  useEffect(() => {
    if (timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev !== null) {
            const newTimeLeft = prev - 1000;
            if (newTimeLeft <= 0) {
              localStorage.setItem("expiryTime", "0");
              clearInterval(timer);
              router.push(urlPageNext);
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
    return `${minutes}m ${seconds}s`;
  };

  const handleClick = async () => {
    alert("Mohon isikan pilihan anda");
  };

  const numberOfAdditionalCandidates = 20;

  const additionalCandidates = Array.from(
    { length: numberOfAdditionalCandidates },
    (v, i) => ({
      id: i + 101,
      kategori: `Cat ${(i + 1) % 6}`,
      nama: `Kandidat p ${i + 101}`,
      headline: `Headline ${i + 101}`,
      detail: `Detail ${i + 101}`,
      kandidat: i + 101,
    })
  );

  const extendedKandidat = [...kandidat, ...additionalCandidates];

  // const extendedKandidat = [
  //   ...kandidat,
  //   ...new Array(1).fill({
  //     id: 1,
  //     kategori: "Cat 1",
  //     nama: "Kandidatp 1",
  //     headline: "Headline 1",
  //     detail: "Detail 1",
  //     kandidat: 1,
  //   }),
  // ];

  const handleActiveCategory = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <section className="wrapper">
      <div className="title">Papan Informasi</div>
      <div className="text-center text-md mt-2 mb-6">
        SILAKAN MEMPELAJARI INFORMASI YANG DISEDIAKAN <br />
        UNTUK MENENTUKAN PILIHAN ANDA
      </div>
      <div className="w-full h-full flex flex-col items-center ">
        <nav className="w-[80%]  grid grid-flow-col  mb-6 text-center">
          {kategori.map((item, index) => (
            <div
              key={index}
              className={` py-4 border border-cus-black cursor-pointer ${
                activeCategory === item.nama ? "bg-cus-dark-gray" : ""
              }`}
              onClick={() => handleActiveCategory(item.nama)}
            >
              {item.nama}
            </div>
          ))}
        </nav>
        <div className="w-full h-full border border-cus-black">
          <div className="grid-container w-[100%] max-h-[100%] grid grid-cols-5 text-center border border-cus-black overflow-y-auto ">
            {extendedKandidat
              .filter((item) => item.kategori === activeCategory)
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
                      // partai: item.partai,
                      headline: item.headline,
                      detail: item.detail,
                      kandidat: item.kandidat,
                    }}
                    rootPath={"simulation/information-board"}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      <ArrowButton text={"Selanjutnya"} onClick={handleClick} />

      {/* {timeLeft !== null ? (
        <p>Sisa waktu: {formatTime(timeLeft)}</p>
      ) : (
        <p>Loading...</p>
      )} */}
    </section>
  );
}

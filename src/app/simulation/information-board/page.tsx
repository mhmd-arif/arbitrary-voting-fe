"use client";
import TableCell from "@/components/TableCell";
import Link from "next/link";
import { Item, generateData, Data, Header } from "./generateData";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function InformationPage() {
  const [headerLength, setHeaderLength] = useState<number | null>(null);
  const [minWidth, setMinWidth] = useState<number | null>(null);
  const [isloading, setIsloading] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [kandidat, setKandidat] = useState<Kandidat[]>([]);

  const router = useRouter();
  const urlPageNext = "/simulation/information-check";

  const url = process.env.NEXT_PUBLIC_API_URL + "/information?type=simulation";

  useEffect(() => {
    const token = localStorage.getItem("access_token");
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
  }, [url]);

  useEffect(() => {
    setIsloading(true);
    setHeaderLength(kategori.length);
    if (headerLength) {
      setMinWidth(18 * headerLength + 1 * (headerLength - 1));
    }
    setIsloading(false);
  }, [headerLength, minWidth, isloading, kategori.length]);

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

  if (isloading || minWidth === null || headerLength === null) {
    return <div>loading</div>;
  }

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  // const handleNavigateToPageC = () => {
  //   const pageInfoEnterTime = localStorage.getItem("pageInfoEnterTime") || "0";
  //   const enterTime = new Date(pageInfoEnterTime).getTime();
  //   const currentTime = new Date().getTime();
  //   const timeSpentOnPageB = Math.round((currentTime - enterTime) / 1000);
  //   localStorage.setItem("pageInfoExitTime", new Date().toISOString());
  //   localStorage.setItem("timeSpentOnPageB", timeSpentOnPageB.toString());
  //   localStorage.setItem("expiryTime", "0");
  //   router.push(urlPageNext);
  // };

  return (
    <section className="w-[100vw] h-[100svh] flex flex-col justify-between items-center pt-20 pb-10 px-16  text-cus-black gap-y-4">
      <div className="w-[40svw] h-[10svh]  border rounded-3xl flex justify-center items-center bg-cus-dark-gray font-normal text-5xl ">
        Papan Informasi
      </div>
      <div className="text-center text-2xl">
        SILAKAN MEMPELAJARI INFORMASI YANG DISEDIAKAN <br />
        UNTUK MENENTUKAN PILIHAN ANDA
      </div>

      <main className="my-element border max-w-[80svw] max-h-[35rem] overflow-x-auto overflow-y-auto border-cus-black ">
        <div
          style={{
            minWidth: `${minWidth}rem`,
            gridTemplateColumns: `repeat(${headerLength}, minmax(0, 1fr))`,
          }}
          className={`header-table sticky top-0 z-10 grid grid-cols-${headerLength} gap-[1rem] mx-auto w-auto pr-[1.75rem] `}
        >
          {kategori.map((cat) => (
            <div
              key={cat.id}
              className="flex w-full justify-center self-center bg-cus-dark-gray"
            >
              <div className="min-w-[18rem] h-[8rem] relative z-0 border border-cus-black flex items-center justify-center ">
                {cat.nama}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            minWidth: `${minWidth}rem`,
            gridTemplateColumns: `repeat(${headerLength}, minmax(0, 1fr))`,
          }}
          className={`my-element grid gap-4 pr-[1.75rem] pt-2 mx-auto overflow-y-auto `}
        >
          {kategori.map((cat) => (
            <div key={cat.id} className="flex flex-col">
              {kandidat
                .filter((item) => item.kategori === cat.nama)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex min-w-[18rem] h-[10rem] justify-center self-center mb-2"
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
                      rootPath={"simulation/information-board"}
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </main>
      <p className="self-end font-normal text-xl w-[10rem] text-center">
        tunggu hingga waktu habis
      </p>
      {/* <button
        onClick={handleNavigateToPageC}
        className="self-end font-normal text-2xl w-[10rem]"
      >
        Lanjutkan
      </button> */}

      {timeLeft !== null ? (
        <p>Sisa waktu: {formatTime(timeLeft)}</p>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
}

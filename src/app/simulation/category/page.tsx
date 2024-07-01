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

export default function Category() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [kandidat, setKandidat] = useState<Kandidat[]>([]);

  const { activeCategory, updateActiveCategory } = useGlobalContext();

  const router = useRouter();
  const urlNextPage = "/simulation/information-board";

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
    // setLoading(false);
  }, [url]);

  const handleClick = async () => {
    if (activeCategory.nama === "") {
      alert("Mohon pilih kategori");
      return;
    }
    setLoading(true);

    const body = {
      start_date_simulation: new Date()
        .toISOString()
        .replace("T", " ")
        .split(".")[0],
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
      setLoading(false);
      router.push(urlNextPage);

      if (!data || !data.data) {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Error :", error);
    }

    const expiryTime = localStorage.getItem("expiryTime");

    if (expiryTime == null || expiryTime == "") {
      const expiryDate = new Date();

      expiryDate.setMinutes(expiryDate.getMinutes() + 0);
      expiryDate.setSeconds(expiryDate.getSeconds() + 30);

      localStorage.setItem("expiryTime", expiryDate.toISOString());
      router.push(urlNextPage);
    }

    router.push(urlNextPage);
  };

  const handleActiveCategory = (category: string) => {
    updateActiveCategory("nama", category);
  };

  return (
    <section className="wrapper">
      <h1 className="title">Papan Informasi</h1>
      <div className="w-full h-[80%] flex flex-col items-center">
        <h2 className="text-center text-md mt-4 mb-6">
          Silakan Pilih Kategori yang Anda Minati
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
          <nav className="w-[80%]  grid grid-cols-5 my-auto text-center">
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
        )}
      </div>

      <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
    </section>
  );
}

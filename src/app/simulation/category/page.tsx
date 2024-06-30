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

  // const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { activeCategory, updateActiveCategory } = useGlobalContext();

  useEffect(() => {
    console.log(activeCategory);
  }, [activeCategory]);

  const router = useRouter();
  const urlPageNext = "/simulation/information-board";

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

  const handleClick = async () => {
    alert("Mohon isikan pilihan anda");
  };

  const handleActiveCategory = (category: string) => {
    updateActiveCategory("nama", category);
  };

  return (
    <section className="wrapper">
      <h1 className="title">Papan Informasi</h1>
      <div className="w-full h-full flex flex-col items-center">
        <h2 className="text-center text-md mt-4 mb-6">
          Silakan Pilih Kategori yang Anda Minati
        </h2>

        <nav className="w-[80%]  grid grid-flow-col my-auto text-center">
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
      </div>

      <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
    </section>
  );
}

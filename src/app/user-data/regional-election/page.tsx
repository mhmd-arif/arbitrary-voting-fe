"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArrowButton from "@/components/ArrowButton";
import BackButton from "@/components/BackButton";

interface PolParties {
  id: number;
  nama: string;
}

export default function RegionalElection() {
  const [polParties, setPolParties] = useState<string>("");
  const { user, updateUser } = useGlobalContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [partaiData, setPartaiData] = useState<PolParties[]>([]);

  const router = useRouter();
  const urlNextPage = "/user-data/national-election";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          process.env.NEXT_PUBLIC_API_URL + `/candidate/regional-political/`;

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        });
        const data = await response.json();
        console.log(data.data);
        setPartaiData(data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);

        // Handle error
      }
    };

    fetchData();
  }, []);

  const handleInput = (newValue: string) => {
    setPolParties(newValue);
    updateUser("partai_daerah", newValue);
  };

  const handleClick = () => {
    if (polParties === "") {
      alert("Mohon pilih partai politik anda");
      return;
    }
    router.push(urlNextPage);
  };

  return (
    <section className="wrapper">
      <div className="spacer"></div>
      <div className="content">
        <label htmlFor="dropdown">
          Partai Yang Anda Pilih Pada Pemilu Daerah Sebelumnya
        </label>
        <div className="dropdown-wrapper">
          <select
            id="dropdown"
            className="input-style"
            value={polParties}
            onChange={(e) => handleInput(e.target.value)}
          >
            <option value="" className="text-cus-dark-gray">
              Kotak Jawaban
            </option>
            {loading && <option>Loading...</option>}
            {partaiData.map((item) => (
              <option key={item.id} value={item.nama}>
                {item.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full flex justify-between">
        <BackButton />
        <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
      </div>
    </section>
  );
}

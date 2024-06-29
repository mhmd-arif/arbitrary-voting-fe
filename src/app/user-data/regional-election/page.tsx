"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArrowButton from "@/components/ArrowButton";

interface PolParties {
  id: number;
  nama: string;
}

export default function RegionalElection() {
  const [polParties, setPolParties] = useState<string>("");
  const { user, updateUser } = useGlobalContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PolParties[]>([]);

  const router = useRouter();
  const urlNextPage = "/user-data/national-election";

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
        <label>Partai Yang Anda Pilih Pada Pemilu Daerah Sebelumnya</label>
        <select
          id="dropdown"
          className="input-style"
          value={polParties}
          onChange={(e) => handleInput(e.target.value)}
        >
          <option value="" className="text-cus-dark-gray">
            Kotak Jawaban
          </option>
          <option value="PDIP" className="text-cus-dark-gray">
            PDIP
          </option>
          <option value="PAN" className="text-cus-dark-gray">
            PAN
          </option>
          <option value="Gerindra" className="text-cus-dark-gray">
            Gerindra
          </option>
        </select>
      </div>

      <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
    </section>
  );
}

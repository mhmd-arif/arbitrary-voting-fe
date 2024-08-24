"use client";
import ArrowButton from "@/components/ArrowButton";
import { useGlobalContext } from "@/context/GlobalContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

interface PolParties {
  id: number;
  nama: string;
}

export default function NationalElection() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const [polParties, setPolParties] = useState<string>("");
  const [partaiData, setPartaiData] = useState<PolParties[]>([]);

  const { user, updateUser, setUser } = useGlobalContext();

  const url = process.env.NEXT_PUBLIC_API_URL + "/participant/";
  const urlNextPage = "/simulation";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          process.env.NEXT_PUBLIC_API_URL + `/candidate/national-political/`;

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        });
        const data = await response.json();
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

  const handleClick = async () => {
    if (polParties === "") {
      alert("Mohon pilih partai politik anda");
      return;
    }

    if (!user) {
      console.log("user undefined");
      // setLoading(false);
      return;
    }

    const reqBody = JSON.stringify(user);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      // // console.log("Fetched data:", data);

      if (!response.ok) {
        // console.log("not ok");
        const errorMessage = await response.text();
        console.error("Server error:", errorMessage);
        setError(true);
        // return;
      }

      const resData = data.data;
      localStorage.setItem("access_token", resData.access_token);
      localStorage.setItem("type", resData.type);
      localStorage.setItem("is_double_test", resData.is_double_test);
      localStorage.setItem("second_type", resData.second_type);
      router.push(urlNextPage);

      if (!data || !data.data) {
        throw new Error("Invalid data format");
        return;
      }
    } catch (error) {
      console.error("Error :", error);
    }

    // router.push(urlNextPage);
  };

  const handleInput = (newValue: string) => {
    setPolParties(newValue);
    updateUser("partai_nasional", newValue);
  };

  return (
    <section className="wrapper">
      <div className="spacer"></div>
      <div className="content">
        <label>Partai Yang Anda Pilih Pada Pemilu Nasional Sebelumnya</label>
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

      <div className="spacer"></div>
      <div className="spacer"></div>
      <div className="spacer"></div>
      <div className="spacer"></div>
      <div className="spacer"></div>
      <div className="spacer"></div>
      <div className="spacer"></div>
      <div className="spacer"></div>

      <div className="w-full flex justify-between">
        {loading ? (
          <p className="self-end">Loading...</p>
        ) : (
          <>
            <BackButton />
            <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
          </>
        )}
      </div>
    </section>
  );
}

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
  const [agreement, setAgreement] = useState<string>("");

  const { user, updateUser, setUser } = useGlobalContext();

  const url = process.env.NEXT_PUBLIC_API_URL + "/participant/";
  const urlNextPage = "/simulation/category";

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
      router.push(urlNextPage);

      if (!data || !data.data) {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Error :", error);
    }

    // for autoNext
    const fetchData = async () => {
      try {
        const url =
          process.env.NEXT_PUBLIC_API_URL +
          `/information/auto-next?type=simulation`;
        const token = localStorage.getItem("access_token");

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        });
        const data = await response.json();

        localStorage.setItem("autoNext", data.data.auto);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    let tempTimeLimit = 2;

    // for timeLimit
    const fetchDataTime = async () => {
      try {
        const url =
          process.env.NEXT_PUBLIC_API_URL +
          `/information/time-limit?type=simulation`;
        const token = localStorage.getItem("access_token");

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        });
        const data = await response.json();
        console.log(data.data);
        tempTimeLimit = data.data.time;
      } catch (error) {
        console.error(error);
      }
    };

    fetchDataTime();

    // for agreement
    const body = {
      start_date_simulation: new Date()
        .toISOString()
        .replace("T", " ")
        .split(".")[0],
    };

    // console.log("body", body);

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

      // console.log("response", response);

      if (!response.ok) {
        console.log("not ok");
        const errorMessage = await response.text();
        console.error("Server error:", errorMessage);
        setLoading(false);
        return;
      }

      const data = await response.json();
      // console.log("Fetched data:", data);
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

    if (expiryTime == null || expiryTime == "" || tempTimeLimit) {
      const expiryDate = new Date();

      expiryDate.setMinutes(expiryDate.getMinutes() + tempTimeLimit);
      expiryDate.setSeconds(expiryDate.getSeconds() + 1);

      localStorage.setItem("expiryTime", expiryDate.toISOString());

      const enterTime = new Date();
      localStorage.setItem("pageInfoEnterTime", enterTime.toISOString());
      router.push(urlNextPage);
    }

    router.push(urlNextPage);
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

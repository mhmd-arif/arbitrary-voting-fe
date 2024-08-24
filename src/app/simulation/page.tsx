"use client";
import NavButton from "@/components/NavButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ArrowButton from "@/components/ArrowButton";
import BackButton from "@/components/BackButton";

export default function Simulation() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [agreement, setAgreement] = useState<string>("");
  const [timeLimit, setTimeLimit] = useState<number>(3);

  const urlNextPage = "/simulation/category";

  useEffect(() => {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (
        key === "type" ||
        key === "access_token" ||
        key === "ally-supports-cache" ||
        key === "is_double_test" ||
        key === "second_type"
      ) {
        return;
      }
      localStorage.setItem(key, "");
    });
  });

  useEffect(() => {
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
        // console.log(data);
        setTimeLimit(data.data.time);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);

        // Handle error
      }
    };

    fetchDataTime();
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const type = localStorage.getItem("type");
        const url =
          process.env.NEXT_PUBLIC_API_URL +
          `/information/auto-next?type=simulation}`;

        const token = localStorage.getItem("access_token");
        // console.log("autonext type realtest", type);

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        });
        const data = await response.json();
        // console.log(data.data);
        localStorage.setItem("autoNext", data.data.auto);
        // setLoading(false);
      } catch (error) {
        console.error(error);
        // setLoading(false);
        // Handle error
      }
    };

    fetchData();
  }, []);

  const handleClick = async () => {
    setLoading(true);

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

    if (expiryTime == null || expiryTime == "" || timeLimit) {
      const expiryDate = new Date();

      expiryDate.setMinutes(expiryDate.getMinutes() + timeLimit);
      expiryDate.setSeconds(expiryDate.getSeconds() + 1);

      localStorage.setItem("expiryTime", expiryDate.toISOString());

      const enterTime = new Date();
      localStorage.setItem("pageInfoEnterTime", enterTime.toISOString());
      router.push(urlNextPage);
    }

    router.push(urlNextPage);
  };

  return (
    <section className="wrapper">
      <h1 className="title">Simulasi Pemilihan</h1>
      <p className="description" id="short-desc">
        Tahap ini merupakan simulasi untuk pengenalan mengenai aplikasi
      </p>
      <div className="w-full flex justify-between">
        <BackButton />
        <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
      </div>
    </section>
  );
}

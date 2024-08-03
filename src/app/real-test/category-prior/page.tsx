"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArrowButton from "@/components/ArrowButton";

interface Kategori {
  id: number;
  nama: string;
}

const fetchData = async (token: any, url: any): Promise<Kategori[]> => {
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

    if (!Array.isArray(data.data)) {
      throw new Error("Invalid data format");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export default function Ctegoryprior() {
  const [items, setItems] = useState<Kategori[]>([]);
  const [selectedItems, setSelectedItems] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const urlNextPage = "/real-test/information-board";

  useEffect(() => {
    const type = localStorage.getItem("type");
    const token = localStorage.getItem("access_token");
    const url =
      process.env.NEXT_PUBLIC_API_URL + `/information/category?type=${type}`;

    console.log("test1", type, token, url);

    fetchData(token, url)
      .then((fetchedData) => {
        setItems(fetchedData);
        // setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    // setLoading(false);
  }, []);

  const handleItemClick = (item: Kategori) => {
    const isSelected = selectedItems.includes(item);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else if (selectedItems.length < 5) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // const handleClick = async () => {
  //   console.log(
  //     "handleSubmit",
  //     selectedItems,
  //     "asdad",
  //     JSON.stringify({ selectedItems })
  //   );
  //   return;
  //   // const apiUrl = "https://api.example.com/submit";

  //   // try {
  //   //   const response = await fetch(apiUrl, {
  //   //     method: "POST",
  //   //     headers: {
  //   //       "Content-Type": "application/json",
  //   //     },
  //   //     body: JSON.stringify({ selectedItems }),
  //   //   });

  //   //   if (!response.ok) {
  //   //     throw new Error("Failed to submit");
  //   //   }

  //   //   alert("Submitted successfully");
  //   // } catch (error) {
  //   //   console.error("Error submitting:", error);
  //   //   alert("Error submitting");
  //   // }
  // };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const handleClick = async () => {
    if (selectedItems.length < 5) {
      alert("Mohon urutkan minimal 5 pilihan");
      return;
    }

    // const body = selectedItems.reduce(
    //   (result: { [key: string]: number }, item, index) => {
    //     result[item.nama] = index + 1;
    //     return result;
    //   },
    //   {}
    // );

    const body = {
      prioritas_kategori: selectedItems.reduce(
        (result: { [key: string]: number }, item, index) => {
          result[item.nama] = index + 1;
          return result;
        },
        {}
      ),
    };

    console.log("body", body);

    try {
      if (typeof window !== "undefined") {
        const url = process.env.NEXT_PUBLIC_API_URL + "/participant/";
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;
        const response = await fetch(url, {
          method: "PUT",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        // console.log(data.data);

        if (!response.ok) {
          // console.log("not ok");
          const errorMessage = await response.text();
          console.error("Server error:", errorMessage);
          setLoading(false);
          return;
        }

        // router.push(urlNextPage);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error :", error);
    }

    // router.push(urlNextPage);
  };

  return (
    <section className="wrapper">
      <h1 className="title">Prioritas Isu</h1>
      {/* */}

      {/* <div className="content">
        <label htmlFor="long-text" className="label">
          Silakan Ceritakan Beberapa hal mengenai Pilihan yang Tersedia
        </label>
        <textarea
          id="long-text"
          className="input-style"
          style={{ fontSize: "1.25rem", width: "80%", height: "80%" }}
          value={text}
          onChange={handleInputChange}
        />
      </div> */}

      <div className="content">
        <p className="label-long-text">
          Silakan Urutkan Isu Sesuai Prioritas Anda. <br /> Nomor 1 menunjukan
          prioritas paling tinggi dan nomor 5 menunjukkan prioritas paling
          rendah
        </p>
        <p></p>
        <div className="grid grid-cols-5 mt-[3rem]">
          {items.map((item) => {
            const priority = selectedItems.indexOf(item) + 1;
            return (
              <div
                key={item.id}
                className="button-prio"
                onClick={() => handleItemClick(item)}
              >
                {item.nama}
                {priority > 0 && (
                  <div className="priorityIndicator">{priority}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={clearSelection}
        className="py-2 px-4 bg-cus-dark-gray rounded-lg"
      >
        Kosongkan Jawaban
      </button>
      {/*  */}

      <div className="flex w-full items-center">
        <div className="ml-auto">
          <ArrowButton text={"Selanjutnya"} onClick={handleClick} />
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArrowButton from "@/components/ArrowButton";

export interface Kategori {
  id: number;
  nama: string;
}

const fetchData = async (
  token: any,
  url: any
): Promise<{ kategori: Kategori[] }> => {
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

interface Item {
  id: number;
  name: string;
}

const dummyItems: Item[] = [
  { id: 1, name: "Isu 1" },
  { id: 2, name: "Isu 2" },
  { id: 3, name: "Isu 3" },
  { id: 4, name: "Isu 4" },
  { id: 5, name: "Isu 5" },
  { id: 6, name: "Isu 6" },
  { id: 7, name: "Isu 7" },
  { id: 8, name: "Isu 8" },
  { id: 9, name: "Isu 9" },
  { id: 10, name: "Isu 10" },
];

const fetchItems = async (): Promise<Item[]> => {
  // Replace with your actual API endpoint
  const response = await fetch("https://api.example.com/items");
  const data = await response.json();
  return data;
};

export default function Ctegoryprior() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  // useEffect(() => {
  //   const loadItems = async () => {
  //     const fetchedItems = await fetchItems();
  //     setItems(fetchedItems);
  //   };

  //   loadItems();
  // }, []);

  useEffect(() => {
    // Using dummy data instead of fetching
    setItems(dummyItems);
  }, []);

  const handleItemClick = (item: Item) => {
    const isSelected = selectedItems.includes(item);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else if (selectedItems.length < 5) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSubmit = async () => {
    console.log(
      "handleSubmit",
      selectedItems,
      "asdad",
      JSON.stringify({ selectedItems })
    );
    return;
    // const apiUrl = "https://api.example.com/submit";

    // try {
    //   const response = await fetch(apiUrl, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ selectedItems }),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Failed to submit");
    //   }

    //   alert("Submitted successfully");
    // } catch (error) {
    //   console.error("Error submitting:", error);
    //   alert("Error submitting");
    // }
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const handleClick = async () => {
    console.log("handleClick");
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
                {item.name}
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

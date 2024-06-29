"use client";
import { useGlobalContext } from "@/context/GlobalContext";
import { useEffect, useState } from "react";
import NavButton from "@/components/NavButton";
import { useRouter } from "next/navigation";
import ArrowButton from "@/components/ArrowButton";

export default function Gender() {
  const { user, updateUser } = useGlobalContext();
  const [selectedGender, setSelectedGender] = useState<string>("");
  const router = useRouter();
  const nextPageRoute = "/user-data/regional-election";

  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedGender(selectedValue);
    updateUser("jenis_kelamin", selectedValue);
  };

  const navigateToNextPage = () => {
    if (selectedGender === "") {
      alert("Mohon isikan jenis kelamin anda");
      return;
    }
    router.push(nextPageRoute);
  };

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

  return (
    <section className="wrapper">
      <div className="spacer"></div>

      <div className="content">
        <label>Jenis Kelamin</label>
        <select
          id="gender-dropdown"
          className="input-style"
          value={selectedGender}
          onChange={handleGenderChange}
        >
          <option value="" className="text-cus-dark-gray">
            Pilih jenis kelamin
          </option>
          <option value="L" className="text-cus-dark-gray">
            Laki-Laki
          </option>
          <option value="P" className="text-cus-dark-gray">
            Perempuan
          </option>
        </select>
      </div>

      <ArrowButton text="Selanjutnya" onClick={navigateToNextPage} />
    </section>
  );
}

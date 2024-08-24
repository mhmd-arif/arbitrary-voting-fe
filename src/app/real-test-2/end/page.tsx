"use client";
import NavButton from "@/components/NavButton";
import ArrowButton from "@/components/ArrowButton";
import { useRouter } from "next/navigation";

export default function End() {
  const urlNextPage = "/";
  const router = useRouter();

  return (
    <section className="wrapper">
      <div className="title ">Test Selesai</div>
      <div className="description text-center flex justify-center items-center">
        <p>Selesai</p>
      </div>
      <div className="custom-btn"></div>
    </section>
  );
}

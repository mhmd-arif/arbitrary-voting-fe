"use client";
import NavButton from "@/components/NavButton";

export default function Home() {
  return (
    <main>
      <div className="container h-screen ">
        <h1 className="title">Nama Penelitian</h1>

        <p className="description ">
          DESKRIPSI PENELITIAN <br /> Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. In vehicula nisl in vehicula tincidunt. Donec
          vestibulum purus at vulputate faucibus. Vivamus malesuada justo
          aliquam libero tempus, id pharetra leo tristique. Quisque convallis
          tortor ac maximus placerat. Sed tincidunt sollicitudin augue rhoncus
          aliquet. Nunc facilisis vitae eros eu venenatis. Cras lacinia ornare
          arcu, nec convallis felis fermentum condimentum. Proin placerat vitae
          turpis ut semper. Fusce nec nisl lectus. Donec efficitur iaculis
          ligula. Donec in lectus finibus, iaculis lorem sollicitudin, feugiat
          tortor. Mauris mauris urna, pellentesque id velit ut, aliquam ultrices
          lorem.
        </p>

        <NavButton href={"/simulation"} text={"Selanjutnya"} />
      </div>
    </main>
  );
}

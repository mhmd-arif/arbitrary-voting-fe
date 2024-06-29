import { ButtonProps } from "react-bootstrap";
import Image from "next/image";

type CustomButtonProps = ButtonProps & {
  text: string;
};

const ArrowButton = ({ text, ...rest }: CustomButtonProps) => {
  return (
    <button
      {...rest}
      className="self-end font-normal text-2xl max-w-[10rem] py-4 px-2 rounded-md active:bg-cus-dark-gray"
    >
      {text}
      <Image
        src={"/arrow.svg"}
        alt="arrow"
        width={100}
        height={100}
        className="w-full"
      />
    </button>
  );
};

export default ArrowButton;

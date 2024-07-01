import { ButtonProps } from "react-bootstrap";
import Image from "next/image";

type CustomButtonProps = ButtonProps & {
  text: string;
};

const ArrowButton = ({ text, ...rest }: CustomButtonProps) => {
  return (
    <button {...rest} className="custom-btn self-end">
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

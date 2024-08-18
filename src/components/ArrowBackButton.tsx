import { ButtonProps } from "react-bootstrap";
import Image from "next/image";

type CustomButtonProps = ButtonProps & {
  text: string;
};

const ArrowBackButton = ({ text, ...rest }: CustomButtonProps) => {
  return (
    <button {...rest} className="custom-btn self-end mr-auto">
      {text}
      <Image
        src={"/arrow-back.svg"}
        alt="arrow"
        width={100}
        height={100}
        className="w-full flip-x"
      />
    </button>
  );
};

export default ArrowBackButton;

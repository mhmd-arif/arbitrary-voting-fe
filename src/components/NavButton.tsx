import { useRouter } from "next/navigation";
import { ButtonProps } from "react-bootstrap";
import Image from "next/image";

type CustomButtonProps = ButtonProps & {
  href: string;
  text: string;
};

const NavButton = ({ href, text, ...rest }: CustomButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  return (
    <button {...rest} onClick={handleClick} className="custom-btn">
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

export default NavButton;

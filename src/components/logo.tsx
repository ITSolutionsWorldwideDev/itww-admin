import darkLogo from "/images/logo/logo-dark.png";
import logo from "/images/logo/logo.png";
import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-12 mx-10">
      <Image
        src={"/images/logo/logo.png"}
        fill
        className="dark:hidden"
        alt="NextAdmin logo"
        role="presentation"
        quality={100}
      />

      <Image
        src={"/images/logo/logo-dark.png"}
        fill
        className="hidden dark:block"
        alt="NextAdmin logo"
        role="presentation"
        quality={100}
      />
    </div>
  );
}

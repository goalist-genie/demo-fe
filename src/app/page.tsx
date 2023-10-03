import logoSrc from "@assets/logo.svg";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" relative h-[100vh] flex justify-center items-center">
      <div className="flex flex-col gap-20">
        <Image src={logoSrc} alt="logo" className="w-[540px] h-auto"/>
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-center h-[77px] rounded-full bg-accent text-white text-2xl font-semibold cursor-pointer">Sign In</div>
          <div className="flex items-center justify-center h-[77px] rounded-full bg-white text-secondary text-2xl font-semibold border border-secondary cursor-pointer">Create Account</div>
        </div>
      </div>
    </div>
  )
}

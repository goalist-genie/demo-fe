import logoSrc from "@assets/logo.svg";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className=" relative h-[100vh] flex justify-center items-center">
      <div className="flex flex-col gap-20">
        <Image src={logoSrc} alt="logo" className="w-[540px] h-auto" priority/>
        <div className="flex flex-col gap-10">
          <Link href="/signin" className="flex items-center justify-center h-[77px] rounded-full bg-gradient-to-r from-[#1E4CC6] to-[#5282FF] text-white text-2xl font-semibold cursor-pointer">Sign In</Link>
          <Link href="/register" className="flex items-center justify-center h-[77px] rounded-full bg-white text-secondary text-2xl font-semibold border border-secondary cursor-pointer">Create Account</Link>
        </div>
      </div>
    </div>
  )
}

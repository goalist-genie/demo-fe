'use client';

import logoSrc from "@assets/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const [name, setName] = useState<string>("admin");
  const [email, setEmail] = useState<string>("admin@goalist.co.jp");
  const [pw, setPw] = useState<string>("admin@123");
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

  const handleRegister = () => {
    
  }

  return (
    <div className=" relative h-[100vh] flex justify-center items-center">
      {
        !isSuccessful &&
        <div className="flex flex-col gap-20">
          <Image src={logoSrc} alt="logo" className="w-[342px] h-auto" priority/>
          <div className="flex flex-col gap-4">
            <input placeholder="Name" type="text" className="rounded-lg border border-gray p-4" value={name} onChange={(e) => setName(e.target.value)}/>
            <input placeholder="Email" type="email" className="rounded-lg border border-gray p-4" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input placeholder="Password" type="password" className="rounded-lg border border-gray p-4" value={pw} onChange={(e) => setPw(e.target.value)}/>
            <input placeholder="Confirm Password" type="password" className="rounded-lg border border-gray p-4" value={pw} onChange={(e) => setPw(e.target.value)}/>
            <div className="flex items-center justify-center h-[77px] rounded-full bg-gradient-to-r from-[#1E4CC6] to-[#5282FF] text-white text-2xl font-semibold cursor-pointer mt-6" onClick={() => handleRegister()}>Sign Up</div>
          </div>
          <div className="text-center">Already have an account? <a href="/signin" className="text-secondary font-semibold">Sign In</a></div>
        </div>
      }
      {
        isSuccessful &&
        <div className="flex flex-col gap-20">
          <Image src={logoSrc} alt="logo" className="w-[342px] h-auto" priority/>
          <div className="flex flex-col gap-4">
            <div className="text-center text-secondary">Thank you for signing up!</div>
            <div className="text-center">Sign in now and get started!</div>
            <Link href="/signin" className="flex items-center justify-center h-[77px] rounded-full bg-gradient-to-r from-[#1E4CC6] to-[#5282FF] text-white text-2xl font-semibold cursor-pointer">Sign In</Link>
          </div>
          <div className="text-center">Already have an account? <a href="/signin" className="text-secondary font-semibold">Sign In</a></div>
        </div>
      }
    </div>
  )
}

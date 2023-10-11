'use client';

import logoSrc from "@assets/logo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface IUser {
  name: string;
  email: string;
  role: string;
}

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("admin@goalist.co.jp");
  const [pw, setPw] = useState<string>("admin@123");

  const handleSignin = () => {
    const user: IUser = {
      email: email,
      name: "admin",
      role: "ADMIN"
    }
    localStorage.setItem("user", JSON.stringify(user));
    router.push("/projects");
  }

  return (
    <div className="relative h-[100vh] flex justify-center items-center">
      <div className="flex flex-col gap-20">
        <Image src={logoSrc} alt="logo" className="w-[342px] h-auto" priority/>
        <div className="flex flex-col gap-4">
          <input placeholder="Email" type="email" className="rounded-lg border border-gray p-4" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <input placeholder="Password" type="password" className="rounded-lg border border-gray p-4" value={pw} onChange={(e) => setPw(e.target.value)}/>
          <div className="flex items-center justify-center h-[77px] rounded-full bg-accent text-white text-2xl font-semibold cursor-pointer mt-6" onClick={() => handleSignin()}>Sign In</div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="text-center underline cursor-pointer">Forgot Password?</div>
          <div className="text-center">Don’t have an account? <a href="/register" className="text-secondary font-semibold">Sign Up</a></div>
        </div>
      </div>
    </div>
  )
}

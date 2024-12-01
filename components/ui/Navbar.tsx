"use client";

import Image from "next/image";
import { AuthDialog } from "../auth-dialog";
import { ThemeToggle } from "../theme-toggle";
import navLogo from "../../app/images/cryptocurrencies.png";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function Navbar() {
  const nav = useRouter();
  const { data: session } = useSession();
  console.log(session?.user);
  return (
    <nav className="box-border cursor-pointer fixed py-6 bg-[rgba(255,255,255,0.95)] dark:bg-[rgba(0,0,0,0.95)] z-50 flex top-0 w-full items-center justify-between px-16">
      <div
        onClick={() => nav.push("/")}
        className="text-2xl flex items-center gap-2 font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-neutral-50 dark:to-neutral-400"
      >
        <Image
          src={navLogo}
          alt="Logo"
          className={`${"filter dark:invert-[1]"}`}
          width={35}
          height={35}
        />
        CryptoPulse
      </div>
      
      <div className="flex items-center gap-3 justify-center">
        {session?.user?.image && (
          <Image
            src={`${session?.user?.image}`}
            alt="Profile"
            className="rounded-full"
            width={35}
            height={35}
          />

        )}
        {!session?.user?.email && <AuthDialog factor={true} />} <ThemeToggle />
      </div>
    </nav>
  );
}

export default Navbar;

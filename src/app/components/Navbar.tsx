"use client";
import {
  ChevronDown,
  CircleUser,
  Dot,
  Ellipsis,
  EllipsisVertical,
  LayoutDashboard,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";
import { Geist, JetBrains_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession, signOut } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";
const GeistFont = Geist({
  subsets: ["latin"],
});
const JetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
});
export default function Navbar() {
  const { data: session, isPending } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const Pathname = usePathname();
  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };
  const router = useRouter();
  return (
    <>
      <div className="fixed left-0 z-50 w-full h-20 bg-white flex top-0 justify-between text-center content-center items-center border-b border-[#C6C6CD] p-5">
        <div className="flex gap-18 text-center content-center items-center">
          <div className={`${GeistFont.className} text-3xl font-bold`}>
            <Link href={"/"}>DevLog</Link>
          </div>
          <div className="md:block hidden">
            <ul
              className={`${JetBrainsMono.className} text-[#191C1E] font-medium text-lg flex gap-6`}
            >
              <li>
                <Link
                  className={`transition-all duration-300 px-2 ${Pathname === "/" ? "underline rounded-xs underline-offset-3 " : ""}`}
                  href={"/"}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className={`transition-all px-2 duration-300 ${Pathname === "/posts" ? "rounded-xs  underline underline-offset-3 " : ""}`}
                  href={"/posts"}
                >
                  Feed
                </Link>
              </li>
              <li>
                <Link
                  className={`transition-all px-2 duration-300 ${Pathname === "/about" ? "underline rounded-xs underline-offset-3 " : ""}`}
                  href={"/about"}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  className={`transition-all px-2 duration-300 ${Pathname === "/contact" ? "underline rounded-xs underline-offset-2 " : ""}`}
                  href={"/contact"}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex gap-5 items-center flex-row">
          <div className="flex items-center gap-4">
            {isPending && (
              <div className="flex">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} className="text-[#00687A]" animate={{y : [0,-8,0]}} transition={{duration: 0.6, repeat:Infinity, delay : i * 0.15}} >
                    <Dot size={48} />
                  </motion.span>
                ))}
              </div>
            )}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className=" cursor-pointer  rounded-full gap-auto flex-row px-3  bg-white shadow-lg border py-2 gap-7  font-semibold flex items-center justify-between">
                    {session?.user?.image ? (
                      <div className="rounded-full relative h-10 w-10 items-center border-2 border-[#00687A] justify-center">
                        <Image
                          src={session?.user?.image}
                          fill
                          className="rounded-full object-cover"
                          alt={session?.user?.name}
                        />
                      </div>
                    ) : (
                      <span className="bg-[#00687A] rounded-full  h-10 w-10 text-center text-white flex items-center justify-center text-white">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className="-translate-x-2 cursor-pointer border-1 rounded-full">
                      <ChevronDown size={24} />
                    </span>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link
                      href={"/dashboard/analytics"}
                      className="flex justify-between items-center gap-5"
                    >
                      <span>
                        <LayoutDashboard />
                      </span>{" "}
                      <span className={`${JetBrainsMono.className}`}>
                        Dashboard
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href={"/profile"}
                      className="flex justify-center items-center gap-5"
                    >
                      <span>
                        <CircleUser />
                      </span>
                      <span className={`${JetBrainsMono.className}`}>
                        Profile
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut();
                      router.push("/auth");
                    }}
                  >
                    <div className="flex justify-center items-center gap-5">
                      <span>
                        <LogOut className="text-red-500" />
                      </span>
                      <span
                        className={`text-red-500 ${JetBrainsMono.className}`}
                      >
                        Logout
                      </span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {!session && !isPending && (
                  <div className="flex gap-4 items-center">
                    <motion.div
                      className="md:block hidden"
                      whileTap={{ scale: 1.05 }}
                      whileHover={{ scale: 0.9 }}
                    >
                      <Link
                        href={"/auth?mode=signup"}
                        className="bg-[#191C1E]  text-white px-4 py-2 rounded-sm"
                      >
                        SignUp
                      </Link>
                    </motion.div>
                    <motion.div
                      className="md:block hidden"
                      whileTap={{ scale: 1.05 }}
                      whileHover={{ scale: 0.9 }}
                    >
                      <Link
                        href={"/auth?mode=login"}
                        className="outline-[#191C1E]  outline-2 -outline-offset-2  text-[#191C1E] px-4 py-2 rounded-sm"
                      >
                        Login
                      </Link>
                    </motion.div>
                  </div>
                )}
              </>
            )}
          </div>
          <div>
            <motion.div className="block md:hidden" onClick={toggleOpen}>
              {isOpen ? <EllipsisVertical /> : <EllipsisVertical />}
            </motion.div>
          </div>
          <AnimatePresence>
            {isOpen && (
              <div
                onClick={() => setIsOpen(false)}
                className="fixed inset-0  z-20"
              >
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  exit={{ x: -100, opacity: 0 }}
                  className="bg-[#f7f9fb]   left-0  fixed mt-24 md:hidden border-[#c6c6cd] py-8 p-4 justify-center w-[220px]   text-center items-center mx-4 z-12 my-3 border rounded-md flex "
                >
                  <div
                    className="absolute flex top-4 left-4 bg-[#191C1E]  text-white rounded-full p-1 shadow"
                    onClick={toggleOpen}
                  >
                    <X />
                  </div>
                  <ul
                    className={`flex flex-col gap-4 ${JetBrainsMono.className} top-3 relative text-[#191C1E] text-xl font-medium`}
                  >
                    <li>
                      <Link
                        href={"/"}
                        className={`${Pathname === "/" ? "underline underline-offset-3 rounded-sm px-2" : ""}`}
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={"/posts"}
                        className={`${Pathname === "/posts" ? "underline rounded-sm underline-offset-3 px-2 " : ""}`}
                      >
                        Feed
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={"/about"}
                        className={`${Pathname === "/about" ? "underline underline-offset-3 rounded-sm  px-2" : ""}`}
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`${Pathname === "/contact" ? "underline underline-offset-3  rounded-sm px-2" : ""}`}
                        href={"/contact"}
                      >
                        Contact
                      </Link>
                    </li>

                    {!session && !isPending && (
                      <>
                        <div className="flex gap-4">
                          <motion.div
                            whileTap={{ scale: 1.05 }}
                            whileHover={{ scale: 0.9 }}
                          >
                            <Link
                              href={"/auth?mode=signup"}
                              className="bg-[#191C1E]  text-white px-2 py-1 rounded-sm"
                            >
                              SIGNUP
                            </Link>
                          </motion.div>
                          <motion.div
                            whileTap={{ scale: 1.05 }}
                            whileHover={{ scale: 0.9 }}
                          >
                            <Link
                              href={"/auth?mode=login"}
                              className="outline-[#191C1E]  outline-2  text-[#191C1E] px-3 py-1 rounded-sm"
                            >
                              LOGIN
                            </Link>
                          </motion.div>
                        </div>
                      </>
                    )}
                  </ul>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

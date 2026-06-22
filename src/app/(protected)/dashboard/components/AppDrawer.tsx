"use client";
import { AnimatePresence, spring } from "framer-motion";
import {
  ChartBarBigIcon,
  FileIcon,
  LayoutDashboard,
  Rss,
  SquareMenu,
  StickyNotePlus,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Libertinus_Sans, Poppins } from "next/font/google";
import Link from "next/link";
const librtinusSans = Libertinus_Sans({
  subsets: ["latin"],
  weight: ["400"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});
export default function AppDrawer() {
  const pathName = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 z-30 bg-white border p-2 block rounded-full shadow-lg xl:hidden left-5"
      >
        <LayoutDashboard size={36} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              transition={{ damping: 25, stiffness: 220, type: spring }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              initial={{ y: "100%" }}
              className="right-0 left-0 bg-white overflow-y-auto flex flex-col gap-5 h-[65vh] bottom-0 fixed z-50 p-6 rounded-t-3xl"
            >
              <div className="flex border-b pb-5 justify-between text-center items-center  text-2xl">
                <span className={`${librtinusSans.className} font-bold`}>
                  Dashboard
                </span>
                <span>
                  <X
                    strokeWidth={2}
                    onClick={() => setOpen(false)}
                    size={40}
                    className="bg-white border p-2 rounded-full shadow-lg"
                  />
                </span>
              </div>
              <div>
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-2">
                    <span>
                      <SquareMenu />
                    </span>
                    <span className={`text-2xl ${librtinusSans.className}`}>
                      Main Menu
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-start gap-12 items-center">
                    <div className="flex  flex-col  justify-center items-center text-center duration-300  gap-2 text-sm transition-all">
                      <Link
                        href="/dashboard/analytics"
                        className={`border border-[#00687A] transition-all   duration-300 rounded-full flex  items-center text-center justify-center  bg-white shadow-lg ${pathName === "/dashboard/analytics" ? "" : "hover-:bg-accent p-2"}`}
                      >
                        <span>
                          <LayoutDashboard
                            className={`${pathName === "/dashboard/analytics" ? " bg-[#00687A] text-white p-2 rounded-full " : "text-[#00687A] hover:bg-accent"}`}
                            size={pathName === "/dashboard/analytics" ? 54 : 32}
                            strokeWidth={2}
                          />
                        </span>
                      </Link>
                      <span className={`${poppins.className} text-sm`}>
                        Dashboard
                      </span>
                    </div>
                    <div className="flex  flex-col  justify-center items-center text-center duration-300  gap-2 text-sm transition-all">
                      <Link
                        href="/dashboard/feed"
                        className={`border border-[#00687A] transition-all   duration-300 rounded-full flex  items-center text-center justify-center  bg-white shadow-lg ${pathName === "/dashboard/feed" ? "" : "hover-:bg-accent p-2"}`}
                      >
                        <span>
                          <Rss
                            className={`${pathName === "/dashboard/feed" ? " bg-[#00687A] text-white p-2 rounded-full " : "text-[#00687A] hover:bg-accent"}`}
                            size={pathName === "/dashboard/feed" ? 54 : 32}
                            strokeWidth={2}
                          />
                        </span>
                      </Link>
                      <span className={`${poppins.className} text-sm`}>
                        Feed
                      </span>
                    </div>
                    <div className="flex flex-col  justify-center items-center text-center duration-300  gap-2 text-sm transition-all">
                      <Link
                        href="/dashboard/create-post"
                        className={`border border-[#00687A] transition-all   duration-300 rounded-full flex  items-center text-center justify-center  bg-white shadow-lg ${pathName === "/dashboard/create-post" ? "" : "hover-:bg-accent p-2"}`}
                      >
                        <span>
                          <StickyNotePlus
                            className={`${pathName === "/dashboard/create-post" ? " bg-[#00687A] text-white p-2 rounded-full " : "text-[#00687A] hover:bg-accent"}`}
                            size={
                              pathName === "/dashboard/create-post" ? 54 : 32
                            }
                            strokeWidth={2}
                          />
                        </span>
                      </Link>
                      <span className={`${poppins.className} text-sm`}>
                        Create Post
                      </span>
                    </div>
                    <div className="flex flex-col  justify-center items-center text-center duration-300  gap-2 text-sm transition-all">
                      <Link
                        href="/dashboard/post"
                        className={`border border-[#00687A] transition-all duration-300 rounded-full flex  items-center text-center justify-center  bg-white shadow-lg ${pathName === "/dashboard/create-post" ? "p-2" : "hover-:bg-accent "}`}
                      >
                        <span>
                          <StickyNotePlus
                            className={`${pathName === "/dashboard/post" ? " bg-[#00687A] text-white p-2 rounded-full " : "text-[#00687A] hover:bg-accent"}`}
                            size={
                              pathName === "/dashboard/post" ? 54 : 32
                            }
                            strokeWidth={2}
                          />
                        </span>
                      </Link>
                      <span className={`${poppins.className} text-sm`}>
                        Post
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

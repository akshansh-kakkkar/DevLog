"use client";
import { MoveRight, Route } from "lucide-react";
import { Libertinus_Serif } from "next/font/google";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Suspense } from "react";
import { useSession } from '@/lib/auth-client';

const LibertinusSerif = Libertinus_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
});

function HeroContent() {
  const {data : session} = useSession();
  
  const searchParams = useSearchParams();
  useEffect(() => {
    const toastType = searchParams.get("toast");
    if (toastType === "signup-success") {
      toast.success(
        <div>
          Account Created Successfully{" "}
          <a
            href="https://github.com/akshansh-kakkkar"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Hire this guy
          </a>
        </div>,
      );
    }
    if (toastType === "login-success") {
      toast.success(
        <div>
          Login Success{" "}
          <a
            href="https://www.linkedin.com/in/akshansh-kakkar-94b945381/r"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Hire this guy
          </a>
        </div>,
      );
    }
    if (toastType === "google-login-success") {
      toast.success(
        <div>
          Login Success{" "}
          <a
            href="https://github.com/akshansh-kakkkar"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Hire this guy
          </a>
        </div>,
      );
    }
    if (toastType === "google-signup-success") {
      toast.success(
        <div>
          Account Created Successfully.
          <a
            href="https://www.linkedin.com/in/akshansh-kakkar-94b945381/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Hire this guy
          </a>
        </div>,
      );
    }
    if (toastType === "github-signup-success") {
      toast.success(
        <div>
          Account Created Successfully.{" "}
          <a
            href="https://github.com/akshansh-kakkkar"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Hire this guy
          </a>
        </div>,
      );
    }
    if (toastType === "github-login-success") {
      toast.success(
        <div>
          Login Success{" "}
          <a
            href="https://www.linkedin.com/in/akshansh-kakkar-94b945381/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Hire this guy
          </a>
        </div>,
      );
    }
  }, []);

  return (
    <div
      className={`flex flex-col gap-8 p-5 via-white via-80% flex-1 justify-center items-center bg-[#f7fbfc] `}
    >
      <div
        className={`${LibertinusSerif.className} font-bold text-6xl text-center `}
      >
        The Pulse of{" "}
        <span className="text-[#00687A] font-bold">Modern Articles</span>
      </div>
      <div
        className={`${LibertinusSerif.className} font-[600] text-md sm:text-xl sm:w-180 flex text-center text-[#45464D]`}
      >
        Discover thoughtful articles, fresh perspectives, and meaningfull ideas
        in one place. Read high quality articles crafted from scratch by our
        online community to simply the complex stuff.
      </div>
      <div className="flex sm:flex-row flex-col gap-4 sm:gap-12 items-center">
        <motion.div whileHover={{ scale: 0.95 }} whileTap={{ scale: 1.1 }}>
          <Link
            className={`bg-[#191C1E] text-2xl  md:text-3xl group flex gap-3 text-white px-8 rounded-sm p-4 ${LibertinusSerif.className}`}
            href={"/auth"}
          >
            <div className="flex justify-center items-center  gap-7">
              <span>Get Started</span>
              <span className="group-hover:translate-x-2 transition-all duration-300">
                <MoveRight />
              </span>
            </div>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 0.95 }} whileTap={{ scale: 1.1 }}>
          <Link
            className={`border-[#191c1e] flex text-2xl md:text-3xl text-[#191C1E] border-2 px-6 rounded-sm p-4 ${LibertinusSerif.className}`}
            href={"/about"}
          >
            <div className="flex gap-7 justify-center items-center group">
              <span>Explore Feed</span>{" "}
              <span className="transition-all duration-300  group-hover:translate-x-2 ">
                <Route />
              </span>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex-1 bg-[#f7fbfc]"></div>}>
      <HeroContent />
    </Suspense>
  );
}

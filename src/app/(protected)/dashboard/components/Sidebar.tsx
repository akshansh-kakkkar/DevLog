"use client";
import {
  ChartBarBigIcon,
  FilesIcon,
  LayoutDashboard,
  Rss,
  SquareMenu,
  StickyNotePlus,
} from "lucide-react";
import { Libertinus_Sans, Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "800"],
});
const Libretinus = Libertinus_Sans({
  subsets: ["latin"],
  weight: ["700"],
});
const SideBar = () => {
  const pathName = usePathname();
  return (
    <div className="w-[280px]  xl:block hidden fixed left-0 top-[82px]  border-r bg-white h-[90vh]">
      <div className="flex flex-col gap-2">
        <div
          className={`mt-12 ml-7 text-lg text-[#76777D] items-center capitalize  uppercase flex gap-3 ${Libretinus.className}`}
        >
          <span>
            <SquareMenu />
          </span>
          <span>Main Menu</span>
        </div>
        <div className="ml-12 mt-6">
          <Link
            href="/dashboard/analytics"
            className={`${pathName === "/dashboard/analytics" ? "w-[185px]  rounded-lg p-2 text-white bg-[#00687A]" : "hover:bg-accent"} p-2 w-[185px] rounded-lg flex justify-start transition-all duration-300 gap-2 items-center text-[#45464D]  text-center text-md ${poppins.className} font-medium`}
          >
            <span>
              <LayoutDashboard />
            </span>
            <span>Dashboard</span>
          </Link>
        </div>
        <div className="ml-12 mt-2">
          <Link
            href="/dashboard/feed"
            className={`${pathName === "/dashboard/feed" ? "w-[185px]  rounded-lg p-2 text-white bg-[#00687A]" : "hover:bg-accent"} w-[185px] p-2 rounded-lg flex justify-start transition-all duration-300 gap-2 items-center text-[#45464D]  text-center text-md ${poppins.className} font-medium`}
          >
            <span>
              <Rss />
            </span>
            <span>Feed</span>
          </Link>
        </div>
        <div className="ml-12 mt-2">
          <Link
            href="/dashboard/create-post"
            className={`${pathName === "/dashboard/create-post" ? "w-[185px]  rounded-lg p-2 text-white bg-[#00687A]" : "hover:bg-accent"} p-2 w-[185px] rounded-lg flex justify-start transition-all duration-300 gap-2 items-center text-[#45464D]  text-center text-md ${poppins.className} font-medium`}
          >
            <span>
              <StickyNotePlus />
            </span>
            <span>Create Posts</span>
          </Link>
        </div>
        <div className="ml-12 mt-2">
          <Link
            href="/dashboard/post"
            className={`${pathName === "/dashboard/post" ? "w-[185px]  rounded-lg p-2 text-white bg-[#00687A]" : "hover:bg-accent"} p-2 w-[185px] rounded-lg flex justify-start transition-all duration-300 gap-2 items-center text-[#45464D]  text-center text-md ${poppins.className} font-medium`}
          >
            <span>
              <FilesIcon />
            </span>
            <span>Posts</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SideBar;

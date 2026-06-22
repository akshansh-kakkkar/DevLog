"use client";
import { useSession } from "@/lib/auth-client";
import { Geist, Libertinus_Sans, JetBrains_Mono } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BookText, Code, Eye, Globe, Loader2, Mail, MapPin, Users } from "lucide-react";
import BioModal from "./components/BioModel";
import Link from "next/link";
import { toast } from "sonner";

const geist = Geist({
  subsets: ["latin"],
});
const libretnusSans = Libertinus_Sans({
  subsets: ["latin"],
  weight: ["400"],
});
const JetBrains = JetBrains_Mono({
  subsets: ["latin"],
});
export default function overView() {
  const [user, setUser] = useState<any>(null);
  const [stats, setstats] = useState({totalPosts : 0, totalReads : 0})
  const { data: session } = useSession();
  const [showbioModal, setShowbioModal] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const userId = session?.user?.id;
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [userId]);
  useEffect(()=>{
    const getStats = async()=>{
      try{
        setStatsLoading(true)
     const res = await fetch('/api/dashboard/stats');
     const data = await res.json();
     setstats(data)
      }
      catch(error){
        toast.error("Something went wrong ")
      }
      finally{
        setStatsLoading(false)
      }
    } 

  })
    const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);
  };
  return (
    <div className=" bg-[#F7F9FB] ">
      {statsLoading?(
        <Loader2 size={64} className="animate-spin text-[#00687A]" />
      ) : (

      <div className="flex md:mx-22 flex-col gap-8">

        <div className="flex  sm:justify-start justify-center flex-col gap-4 border-[#C6C6CD] border-b-2 pb-2 ">
          <div
            className={`${geist.className} text-[#2D2D2D] text-4xl font-semibold`}
          >
            Account Overview
          </div>
          <div className={`${geist.className} text-[#45464D]`}>
            Real-time engagement and profile metrics.
          </div>
        </div>
        <div className="flex sm:justify-start sm:flex-row justify-center flex-col  gap-8">
          <div className={`flex gap-8 justify-center sm:justify-start`}>
            <div className="w-[128px] relative   rounded-lg h-[128px]">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  className="rounded-lg  border-5 border-[#00687A] "
                  fill
                  alt={session.user.name}
                />
              ) : (
                <div
                  className={`${geist.className} flex justify-center items-center h-full bg-[#00687A] text-9xl text-white rounded-lg`}
                >
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center  items-start gap-2 text-start ">
            <h1 className={` text-4xl ${libretnusSans.className} `}>
              {" "}
              {session?.user?.name}
            </h1>
            <p
              onClick={() => setShowbioModal(true)}
              className={`line-clamp-2 text-md cursor-pointer break-words md:w-[70%] ${libretnusSans.className} text-[#45464D]`}
            >
              {user?.bio || "Bio Not Available"}
            </p>
            <BioModal
              open={showbioModal}
              bio={user?.bio}
              name={session?.user?.name || ""}
              onClose={() => setShowbioModal(false)}
            />
            <div
              className={`${JetBrains.className} flex  flex-col sm:flex-row gap-2 sm:gap-8 text-[#76777D]`}
            >
              <div className="flex gap-2">
                <span>
                  <Mail />
                </span>
                <span>{session?.user.email}</span>
              </div>
              <div className="flex gap-2">
                <span>
                  <MapPin />
                </span>
                <span>{user?.location || "N/A"} </span>
              </div>
            </div>
          </div>
        </div>
        {(user?.github ||
          user?.linkedinUrl ||
          user?.websiteUrl ||
          user?.instagramUrl) && (
            <div className="flex flex-col gap-8">
              <p
                className={`${geist.className} font-semibold text-[#45464D] text-2xl`}
              >
                Social Links
              </p>
              <div className="md:flex grid grid-cols-2 md:flex-row   md:items-center gap-6">
                {user?.github && (
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`transition-all col-span-1 w-30 duration-300 ${libretnusSans.className} flex gap-2 text-xl items-center bg-[#F2F4F6] w-fit py-1 px-2 rounded-lg border-2 border-[#C6C6CD] hover:border-[#00687A] font-bold `}
                    href={user?.github}
                  >
                    <span>
                      <Image
                        src={"/images/github.png"}
                        alt="github"
                        width={32}
                        height={32}
                      />
                    </span>
                    <span>GitHub</span>
                  </Link>
                )}
                {user?.linkedinUrl && (
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`transition-all col-span-1 duration-300 w-24 ${libretnusSans.className} flex gap-2 text-xl items-center bg-[#F2F4F6] w-fit py-1 px-2 rounded-lg border-2 border-[#C6C6CD] hover:border-[#00687A] font-bold `}
                    href={user?.linkedinUrl}
                  >
                    <span>
                      <Image
                        src={"/images/linkedin.png"}
                        alt="github"
                        width={32}
                        height={32}
                      />
                    </span>
                    <span>Linkedin</span>
                  </Link>
                )}
                {user?.instagramUrl && (
                  <Link
                    className={`transition-all col-span-1 w-30 duration-300 ${libretnusSans.className} flex gap-2 text-xl items-center bg-[#F2F4F6] w-fit py-1 px-2 rounded-lg border-2 border-[#C6C6CD] hover:border-[#00687A] font-bold `}
                    href={user?.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>
                      <Image
                        src={"/images/instagram.png"}
                        alt="github"
                        width={32}
                        height={32}
                      />
                    </span>
                    <span>Instagram</span>
                  </Link>
                )}
                {user?.websiteUrl && (
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`transition-all col-span-1 w-30 duration-300 ${libretnusSans.className} flex gap-2 text-xl items-center bg-[#F2F4F6] w-fit py-1 px-2 rounded-lg border-2 border-[#C6C6CD] hover:border-[#00687A] font-bold `}
                    href={user?.websiteUrl}
                  >
                    <span>
                      <Globe />
                    </span>
                    <span>Website</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        <div className="flex flex-col gap-8">
          <p
            className={`${geist.className} font-semibold text-[#45464D] text-2xl`}
          >
            Statistics
          </p>
          <div className=" flex flex-col w-full md:grid md:grid-cols-2 gap-12  justify-center items-center">
            <div className=" bg-whtie w-full border-1 flex gap-12 flex-col border-[#C6C6CD] p-6 rounded-xl">
              <div className="flex justify-between items-center">
                <p className={`${JetBrains.className} text-[#76777D]`}>POSTS PUBLISHED</p>
                <div><BookText className="text-[#76777D]" /></div>
              </div>
              <div className={`${geist.className} text-[#00687A] text-7xl`}>
                {stats.totalPosts}
              </div>
            </div>
            <div className="bg-whtie w-full border-1 flex gap-12 flex-col border-[#C6C6CD] p-6 rounded-xl">
              <div className="flex justify-between items-center">
                <p className={`${JetBrains.className} text-[#76777D]`}>VIEWS</p>
                <div><Eye className="text-[#76777D]" /></div>
              </div>
              <div className={`${geist.className} text-[#00687A] text-7xl`}>
                {formatNumber(stats.totalReads)}
              </div>
            </div>
          </div>
        </div>
      </div>
            )}

    </div>
  );
}

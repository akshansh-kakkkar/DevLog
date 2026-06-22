"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Geist, JetBrains_Mono, Libertinus_Sans } from "next/font/google";
import { CircleAlert, Globe, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { set } from "zod";
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
});
const geist = Geist({
  subsets: ["latin"],
});
const libretnusSans = Libertinus_Sans({
  subsets: ["latin"],
  weight: ["400"],
});
export default function Page() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then(setUser).
      finally(()=>setLoading(false));
  }, [id]);
  if (!user && !loading) return null;
  return (
<>
{loading ? ( 
    <div className="flex justify-center items-center w-full h-full">
        <Loader2 className="animate-spin text-[#00687A] " size={64} />
    </div>
) : (

    <div className="mx-12 mt-22 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:justify-start md:items-start justify-center items-center gap-6">
        <div
          className={`${jetbrains.className}  relative w-48 border-6 h-48 border-[#00687A] bg-[#00687A] rounded-lg flex justify-center items-center text-center]`}
        >
          {user.image ? (
            <Image
              src={user.image}
              className="absolute rounded-lg"
              alt={user.name}
              fill
            />
          ) : (
            <div className="text-8xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div
            className={`md:text-6xl text-2xl text-[#252a2d] text-center font-bold ${geist.className} capitalize`}
          >
            {user.name}
          </div>

          <div
            className={` p-2 break-words text-lg flex-wrap max-w-130 line-clamp-3 text-gray-600`}
          >
            {user.bio || "No Bio Availabe"}
          </div>
          <div className="flex text-gray-600 gap-2">
            <span>
              <MapPin />
            </span>
            <span>{user.location}</span>
          </div>
        </div>
      </div>
      <div>
        <div
          className={`${geist.className} p-2 border-t-2  text-2xl font-semibold text-[#191C1E]`}
        >
          About
        </div>
        { user.bio ? (
        <div className={`${jetbrains.className} break-words text-gray-600 text-md`}>
          {user.bio}
        </div>) : (
                      <div className="w-full  p-12  flex-col text-center mb-24 sm:mb-0 gap-2 flex justify-center items-center   bg-white border rounded-lg ">
            <div>
              <CircleAlert
                size={64}
                className={`rounded-full p-2 text-[#00687A] bg-[#00687a21]`}
              />
            </div>
            <p
              className={`${jetbrains.className} text-2xl text-center  font-semibold`}
            >
                User has not provider their bio
            </p>
          </div>
        )}
      </div>
      <div>
        <div
          className={`${geist.className} border-t-2 p-2 pt-4 text-2xl font-semibold text-[#191C1E]`}
        >
          Social Links
        </div>
        {
            user?.github || user?.linkedinUrl || user?.instagramUrl ||user?.websiteUrl ? (
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
            ) : (
          <div className="w-full  p-12  flex-col text-center mb-24 sm:mb-0 gap-2 flex justify-center items-center   bg-white border rounded-lg ">
            <div>
              <CircleAlert
                size={64}
                className={`rounded-full p-2 text-[#00687A] bg-[#00687a21]`}
              />
            </div>
            <p
              className={`${jetbrains.className} text-2xl text-center  font-semibold`}
            >
                User has not provider any of their social links
            </p>
          </div>
            )
        }
 
      </div>
    </div>
    )}

</>
  );
}

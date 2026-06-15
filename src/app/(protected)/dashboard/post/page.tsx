import { JetBrains_Mono, Libertinus_Sans, Poppins, Geist } from 'next/font/google';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
});
const libretinusSans = Libertinus_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const poppins2 = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});
const geist = Geist({
    subsets : ['latin']
})
export default function Page() {
  return (
    <div className="mt-12 mx-5 md:mx-12 lg:mx-22 flex gap-7 flex-col">
          <div className="flex  sm:justify-start justify-center flex-col gap-4 border-[#C6C6CD] border-b-2 pb-2 ">
            <div
              className={`${geist.className} text-[#2D2D2D] text-4xl font-semibold`}
            >
              My Posts
            </div>
            <div className={`${geist.className} text-[#45464D]`}>
              Manage your technical articles from here.
            </div>
          </div>
            <div>
                
            </div>
    </div>
  );
}

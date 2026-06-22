"use client"
import Link from "next/link";
import { Geist, JetBrains_Mono } from 'next/font/google';
import { usePathname } from "next/navigation";


const geist = Geist({
    subsets : ['latin']
})
const JetBrainsMono = JetBrains_Mono({
    subsets : ['latin']
})
export default function Footer(){
    const Pathname = usePathname()
    return(
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-[#C6C6CD] p-8">
            <div className={`${geist.className} text-2xl text-[#191C1E] font-bold`}>DevLog</div>
            <div className={`${geist.className} text-md text-[#45464D]`}>&copy; DevLog. All rights reserved.</div>
            <div>
                <ul className={`flex gap-5 sm:gap-8 text-lg ${JetBrainsMono.className} text-[#45464D]  font-medium`}>
                    <li><Link href={'https://www.github.com/akshansh-kakkkar'} className={`underline-offset-2 hover:text-black hover:underline ${Pathname === 'https://www.github.com/akshansh-kakkkar' ? "underline underline-offset-2" : ""}`} target="_blank" rel="noopener noreferrer">Github</Link></li>
                    <li><Link className={`underline-offset-2 ${Pathname === "/about" ? "underline underline-offset-2" : ""} hover:text-black hover:underline`} href={'/about'}>About</Link></li>
                    <li><Link className={`hover:text-black hover:underline underline-offset-2 ${Pathname === '/contact' ? "underline underline-offset-2" :""}`} href={'/contact'}>Contact</Link></li>
                    <li><Link className={`hover:text-black hover:underline underline-offset-2 ${Pathname === '/posts' ? "underline underline-offset-2" : ""}`} href={'/dashboard/post'}>Posts</Link></li>
                </ul>
            </div>
        </div>
    )
}
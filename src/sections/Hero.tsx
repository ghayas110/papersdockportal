"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
export default function Hero() {
    const router = useRouter();
    return (
        <section
            className="flex flex-col justify-center items-center text-center h-screen"
        >
            <div style={{ textAlign: "center", fontSize: "30px",padding:15 }} className="mb-4 text-white text-xl sm:text-2xl lg:text-3xl ">
                &ldquo;Empowering students globally to achieve top grades in A levels-computer science through affordable education.&rdquo;
            </div>
            <div className="mb-7">
                {/* Replace this with your actual logo image */}
                <Image src="/images/logo/logo00002.png" alt="Papers Dock" width={300} height={10} />
                <Image src="/images/logo/logo00001.png" alt="Papers Dock" width={300} height={10} />
            </div>
            <button style={{ textAlign: "center", borderRadius: "10px", borderColor: "white", color: "white", backgroundColor: "#1C3A50" }}
                className="bg-[#1C3A50] hover:bg-[#1C3A50] text-white font-bold py-2 px-4 rounded-full" onClick={()=>{router.push("/auth/signin")}}
            >
                Student Portal
            </button>
            <div style={{ textAlign: "center", fontSize: "30px" }} className="mt-4 text-white text-lg sm:text-xl">
                PapersDock: Anchoring Your Journey to Top Grades!
            </div>
        </section>
    );
}

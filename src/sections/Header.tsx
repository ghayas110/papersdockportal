"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MenuData from './menuData'
const Header = () => {
   // Navbar toggle
   const [navbarOpen, setNavbarOpen] = useState(false);
   const navbarToggleHandler = () => {
     setNavbarOpen(!navbarOpen);
   };
 
   // Sticky Navbar
   const [sticky, setSticky] = useState(false);
   const handleStickyNavbar = () => {
     if (window.scrollY >= 80) {
       setSticky(true);
     } else {
       setSticky(false);
     }
   };
   useEffect(() => {
     window.addEventListener("scroll", handleStickyNavbar);
   });
 
   // submenu handler
   const [openIndex, setOpenIndex] = useState(-1);
   const handleSubmenu = (index: number)=> {
     if (openIndex === index) {
       setOpenIndex(-1);
     } else {
       setOpenIndex(index);
     }
   };
 
   const usePathName = usePathname();
 
  return (
   <header className="header relative  z-10 flex items-center justify-center ">
<div style={{width:"90%",backgroundColor:'#1c1c1c',borderRadius:"10px",marginTop:20,height:"80px" }} className=" h-10, flex items-center justify-between px-4 py-4 md:px-5 lg:px-8 rounded-3xl ">


<div>
<Link href="/">
      <Image src="/images/logo/logo1.png" alt="logo" width={100} height={50} />
    </Link>
</div>

    <ul className="flex items-center gap-4">


    {
      MenuData.map((item)=>{
        return <li key={item.id} className='cursor-pointer,hover:text-primary,duration-300 text-white'>
          <Link className='' href={item.path} >{item.title}</Link>
          </li>
      })

    }
        </ul>
  
<div>
    <Link
                  href="/auth/signin"
                  style={{ backgroundColor: '#B09F4E' }}
                  className="  px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-opacity-90 md:block md:px-9 lg:px-6 xl:px-9"
                >
                  Portal
                </Link>
</div>
</div>
   </header>
  )
}

export default Header

//typescript rafcce
import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/sections/Header";
import Hero from "@/sections/Hero";
import Resource from "../Resource/page";
import Footer from "../Footer/page";
import Contact from "../Contact/page";

export const metadata: Metadata = {
    title: "PapersDock",
    description: "Eduction Platform",
};  

export default function HomeScreen() {
    return (
        <section className="bg-zinc-800 h-screen">
        <Header/>
     <Hero/>
     <Resource/>
     <Contact/>

        </section>
    );
}

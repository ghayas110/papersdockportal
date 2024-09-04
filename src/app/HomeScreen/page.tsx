import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/sections/Header";
import Hero from "@/sections/Hero";
import Resource from "../Resource/page";
import Footer from "../Footer/page";
import Contact from "../Contact/page";
import Stats from "@/sections/Stats";

export const metadata: Metadata = {
    title: "PapersDock",
    description: "Education Platform",
};  

export default function HomeScreen() {
    return (
        <section
          
            style={{
                background: "linear-gradient(#010E24,#4e7387,#010E24, #010E24,#010E24, #4e7387, #010E24)",
            }}
        >
            <Header />
            <Hero />
            <Stats/>
            <Resource />
            <Contact />
        </section>
    );
}

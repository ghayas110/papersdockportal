
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SignIn from "./auth/signin/page";
import HomeScreen from "./HomeScreen/page";

export const metadata: Metadata = {
  title:
    "PapersDock",
  description: "Eduction Platform",
};

export default function Home() {
  return (
 <HomeScreen/>
  );
}

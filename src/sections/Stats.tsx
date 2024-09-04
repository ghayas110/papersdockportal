"use client";
import React, { useEffect, useState } from "react";
import { FaEye, FaUser, FaVideo } from "react-icons/fa"; // Importing icons
import { motion } from "framer-motion"; // For animations

const Stats = () => {
  const [subscriber, setSubscriber] = useState<{ value: any; label: string; icon: JSX.Element }[] | undefined>();

  useEffect(() => {
    fetchSubscriber();
  }, []);

  const fetchSubscriber = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCbOwD2JG5N9DePz3xIw56pg&key=AIzaSyDHsu2C6n000D9UnbKADiClkh2RJTzhZx4"
      );
      const data = await response.json();
      if (response.ok) {
        const stats = [
          { value: data?.items[0]?.statistics?.viewCount, label: "View Count", icon: <FaEye className="text-4xl " /> },
          { value: data?.items[0]?.statistics?.subscriberCount, label: "Subscribers", icon: <FaUser className="text-4xl text-green-500" /> },
          { value: data?.items[0]?.statistics?.videoCount, label: "Videos", icon: <FaVideo className="text-4xl text-red-500" /> },
        ];
        setSubscriber(stats);
      }
    } catch (error) {
      console.error("Failed to fetch assignments", error);
    }
  };

  return (
    <div className="flex justify-center items-center flex-wrap w-full mt-20 gap-16">
      {subscriber &&
        subscriber.map((stat, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center p-10 bg-gray-800 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: index * 0.3 }}
          >
            <div className="mb-4">{stat.icon}</div>
            <p className="text-center text-white font-bold text-lg">{stat.label}</p>
            <p className="text-4xl font-palanquin font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
    </div>
  );
};

export default Stats;

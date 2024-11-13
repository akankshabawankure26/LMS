import React, { useEffect } from "react";
import { Center, Heading } from "@chakra-ui/react";
import AccessDenied from "./components/AccessDenied";

// Function to set times for 8 AM and 6 PM today
export function setDailyAccessTimes() {
  const today = new Date().toDateString(); // e.g., "Tue Nov 12 2024"

  // Check if times are already set for today
  if (localStorage.getItem('accessDate') !== today) {
    // Create new Date objects for 8 AM and 6 PM
    const startTime = new Date();
    startTime.setHours(5, 0, 0, 0);

    const endTime = new Date();
    endTime.setHours(6, 0, 0, 0);

    // Store in localStorage
    localStorage.setItem('startTime', startTime.getTime());
    localStorage.setItem('endTime', endTime.getTime());
    localStorage.setItem('accessDate', today); // Update the date marker


  }
}

// Run daily setup
//setDailyAccessTimes();

// Check access based on time


const Home = () => {
  useEffect(() => {
    const storedStartTime = parseInt(localStorage.getItem('startTime'), 10);
    const storedEndTime = parseInt(localStorage.getItem('endTime'), 10);
    const currentTime = Date.now();
    if (currentTime >= storedStartTime && currentTime <= storedEndTime) {
      <Home />
      console.log("Access allowed. Welcome!");
    } else {
      <AccessDenied />
      console.log("Access denied. The website is only accessible from 8 AM to 6 PM.");
    }
  })
  return (
    <>
      <Center height={"80vh"}>
        <Heading>Welcome to Layout Management System </Heading>
      </Center>
    </>
  );
};

export default Home;

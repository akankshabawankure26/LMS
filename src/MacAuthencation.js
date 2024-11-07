
import { useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

function MacFetching() {

    const [macAdd, setMacAdd] = useState(""); // State to store the fetched MAC address
    const toast = useToast();
    const [check, setCheck] = useState(false);

    // Function to fetch the MAC address from the PHP backend
    const fetchMacAddress = async () => {
        try {
            const response = await fetch('http://localhost/backend_lms/macfetching.php', {
                method: 'GET',  // Make a GET request
            });
            console.log('Response OK:', response.ok);
            console.log('Raw Response:', response);

            // Check if the request was successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Log the raw response body (before parsing it as JSON)
            const rawText = await response.text();

            // Try to parse the response as JSON
            try {
                const result = JSON.parse(rawText);
                console.log(result);
                const { macAddress } = result;

                // Print the result in the console
                console.log('MAC Address:', macAddress);
                setMacAdd(macAddress);  // Set the MAC address in state
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        } catch (error) {
            console.error('Error fetching MAC address:', error);
        }
    };

    // Function to check the MAC address (after fetching it)
    const checkMac = async (macAdd) => {
        console.log("MAC Address in checkMac:", macAdd);
        try {
            const response = await fetch('http://localhost/backend_lms/macauthenticate.php', {
                method: 'POST', // Method is POST
                headers: {
                    'Content-Type': 'application/json', // Setting the content type as JSON
                },
                body: JSON.stringify({
                    macAddress: macAdd, // Sending the macAddress state as the request body
                }),
            });
            console.log("Data fetching...");
            const result = await response.json();

            console.log(result);
            if (result.status === 'success') {
                // toast({
                //     title: "Success",
                //     description: "Mac Address valid",
                //     status: "success",
                //     position: "top-right",
                // });
                localStorage.setItem("MacAuthenticate", true );
                setCheck(true);

                console.log("Success");
            } else {
                console.log("Error: MAC Address not valid");
                toast({
                    title: "Error",
                    description: "Mac Address not valid",
                    status: "error",
                    position: "top-right",
                });

            }
        } catch (error) {
            console.error("Error during MAC authentication:", error);
            toast({
                title: "Error",
                description: "An error occurred during MAC authentication.",
                status: "error",
                position: "top-right",
            });
        }
    };

    // Use useEffect to fetch data when the component mounts
    useEffect(() => {
        const fetchAndCheckMac = async () => {
            await fetchMacAddress();  // Wait for the MAC address to be fetched
            if (macAdd) {
                checkMac(macAdd);  // Call checkMac only after macAdd is set
            }
        };

        fetchAndCheckMac();
    }, [macAdd]);  // Dependency array includes macAdd to trigger recheck when it updates


    return (
<></>
    );
}

export default MacFetching;


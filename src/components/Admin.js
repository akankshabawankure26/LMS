import React, { useState,useEffect } from "react";
import {
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  VStack,
  Center,
  InputGroup,
  InputRightElement,
  Checkbox,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admin = ({ onLogin }) => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  //mac authentication
  const [macAdd, setMacAdd] = useState(""); // State to store the fetched MAC address
  
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
        localStorage.setItem("MacAuthenticate", "true");
        

        console.log("Success");
      } else {
        console.log("Error: MAC Address not valid");
        toast({
          title: "Error",
          description: "Mac Address not valid",
          status: "error",
          position: "top-right",
  
        });
        localStorage.setItem("MacAuthenticate", "false");


      }
    } catch (error) {
      console.error("Error during MAC authentication:", error);
      toast({
        title: "Error",
        description: "An error occurred during MAC authentication.",
        status: "error",
        position: "top-right",
      });
      localStorage.setItem("MacAuthenticate", "false");

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





  const handleClick = () => setShow(!show);

  const getUserRole = async () => {
    const url = "http://localhost/backend_lms/getUserRight.php";
    let fData = new FormData();
    fData.append("email", email);
    fData.append("password", password);

    try {
      const response = await axios.post(url, fData);
      const userRight = response.data["userRight"];
      localStorage.setItem("userRight", userRight);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogin = async () => {
    const url = "http://localhost/backend_lms/loginhandler.php";
    let fData = new FormData();
    fData.append("email", email);
    fData.append("password", password);

    try {
      const response = await axios.post(url, fData);
      if (response.data === true) {
        localStorage.setItem("email", email);
        localStorage.setItem("adminData", JSON.stringify({ email, password }));

        onLogin();
        navigate("/");
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Please check your email and password and try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Please check your connection and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleKeyPressFromEmail = (event) => {
    if (event.key === "Enter") {
      document.getElementById("password").focus();
    }
  };

  const handleKeyPressFromPass = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const isMacAuthenticated = localStorage.getItem("MacAuthenticate") === "true";

  return (
    <>
      
      <Container maxW="7xl" p={{ base: 5, md: 10 }}>
        {isMacAuthenticated ? (
        <Center>
          <Stack spacing={4}>
            <Heading fontSize="2xl" textAlign="center">
              Welcome to Layout Management System
              <br />
              Admin Login
            </Heading>

            <VStack
              as="form"
              boxSize={{ base: "xs", sm: "sm", md: "md" }}
              h="max-content !important"
              rounded="lg"
              boxShadow="lg"
              p={{ base: 5, sm: 10 }}
              spacing={8}
            >
              <VStack spacing={4} w="100%">
                <FormControl id="email">
                  <FormLabel>Enter Your ID</FormLabel>
                  <Input
                    rounded="md"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyPressFromEmail}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <InputGroup size="md">
                    <Input
                      rounded="md"
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyPressFromPass}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" rounded="md" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </VStack>
              <VStack w="100%">
                <Stack direction="row" justifyContent="space-between" w="100%">
                  <Checkbox colorScheme="green" size="md">
                    Remember me
                  </Checkbox>
                  <Link fontSize={{ base: "md", sm: "md" }}>Forgot password?</Link>
                </Stack>
                <Button
                  bg="blue.300"
                  color="white"
                  _hover={{ bg: "blue.500" }}
                  rounded="md"
                  w="100%"
                  onClick={() => {
                    handleLogin();
                    getUserRole();
                  }}
                >
                  Log in
                </Button>
              </VStack>
            </VStack>
          </Stack>
        </Center>
          ) : (
           <Center>
             <Heading fontSize="2xl" textAlign="center">
               Access Denied
             </Heading>
           </Center>
          )
        }
      </Container>
    </>
          
  );
};

export default Admin;






 
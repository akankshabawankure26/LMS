import React, { useState } from "react";
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

const UserLogin = ({ onLogin }) => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const handleLogin = () => {
    // const validEmail = "admin@example.com";
    // const validPassword = "admin123";

    // if (email === validEmail && password === validPassword) {
     
      // const adminData = {
      //   email: email,
      //   rights:"admin"
      // };
      console.log(email,"this is email");
      localStorage.setItem("email", email);

      onLogin();
      // navigate("/");
      // toast({
      //   title: "Login Successful",
      //   description: "Welcome back!",
      //   status: "success",
      //   duration: 5000,
      //   isClosable: true,
      // });
    // } else {
      // toast({
      //   title: "Login Failed",
      //   description: "Please check your email and password and try again.",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      // });
    // }
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

  return (
    <Container maxW="7xl" p={{ base: 5, md: 10 }}>
      <Center>
        <Stack spacing={4}>
          <Heading fontSize="2xl" textAlign={"center"}>
            Welcome to Layout Management System
            <br />
            User Login
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
                    <Button
                      h="1.75rem"
                      size="sm"
                      rounded="md"
                      onClick={handleClick}
                    >
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
                <Link fontSize={{ base: "md", sm: "md" }}>
                  Forgot password?
                </Link>
              </Stack>
              <Button
                bg="blue.300"
                color="white"
                _hover={{
                  bg: "blue.500",
                }}
                rounded="md"
                w="100%"
                onClick={handleLogin}
              >
                Log in
              </Button>
            </VStack>
          </VStack>
        </Stack>
      </Center>
    </Container>
  );
};

export default UserLogin;

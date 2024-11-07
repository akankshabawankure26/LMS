import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Spinner,
  useToast,
  Button,
  HStack,
  Center,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [loginState, setState] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost/backend_lms/getuser.php"
      );

      
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        throw new Error("Response data is not an array");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error fetching data",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(
        `http://localhost/backend_lms/deleteuser.php?id=${userId}`
      );

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== userId)
      );

      toast({
        title: "User deleted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error deleting user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const url = "http://localhost/backend_lms/edituser.php";
    const formData = new FormData();

    formData.append("userId", editFormData.userId);
    formData.append("userName", editFormData.userName);
    formData.append("userEmail", editFormData.userEmail);
    formData.append("userCity", editFormData.userCity);
    formData.append("userState", editFormData.userState);
    formData.append("userAddress", editFormData.userAddress);

    try {
      const response = await axios.post(url, formData);
      console.log("Response:", response);
      if (response && response.data && response.data.status === "success") {
        console.log("User updated successfully:", response.data.message);
        toast({
          title: "User updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.userId === editFormData.userId
              ? { ...user, ...editFormData }
              : user
          )
        );
        setIsModalOpen(false);
      } else {
        console.error("Error updating user:", response.data.message);

        toast({
          title: "Error updating user",
          status: "error",
          duration: 3000,
          isClosable: true,
        });

        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error in handleUpdateUser:", error);

      toast({
        title: "Error updating user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      setIsModalOpen(false);
    }
  };

  // const handleUsertoggle =async(e)=>{

  //   const url = "http://localhost/backend_lms/edituser.php";
  //   const formData = new FormData();

  // }
  const handleToggle = async (userId, field) => {
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("field", field);

      const response = await axios.post(
        "http://localhost/backend_lms/toggleadd.php", 
        formData
      );

      if (response.data.status === "success") {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.userId === userId
              ? { ...user, [field]: response.data.newValue }
              : user
          )
        );
        toast({
          title: "Permission updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error toggling permission:", error);
      toast({
        title: "Error toggling permission",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUserStatus = (userDetails) => {
    console.log("userDetails", userDetails);
  };

  return (
    <>
      <Box p={4} width="100%" margin="auto">
        <Center mb={"15px"}>
          <VStack>
            <Heading fontSize={"28px"}>User Details</Heading>
          </VStack>
        </Center>
        {loading ? (
          <Center>
            {" "}
            <Spinner />
          </Center>
        ) : (
          <Table variant="simple">
            <Thead bg={"black"}>
              <Tr>
                <Th bg="black" color="white" fontSize="14px">
                  ID
                </Th>
                <Th bg="black" color="white" fontSize="14px">
                  Name
                </Th>
                <Th bg="black" color="white" fontSize="14px">
                  Email
                </Th>
                <Th bg="black" color="white" fontSize="14px">
                  Address
                </Th>
                <Th bg="black" color="white" fontSize="14px">
                  City
                </Th>
                <Th bg="black" color="white" fontSize="14px">
                  State
                </Th>
                <Th bg="black" color="white" fontSize="14px">
                  Rights
                </Th>
                <Th bg="black" color="white" fontSize="14px">
                  Login Status
                </Th>
                {/* <Th
                  bg="black"
                  textAlign={"center"}
                  color="white"
                  fontSize="14px"
                >
                  Toggle
                </Th> */}

                <Th bg="black" color="white" fontSize="14px">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {Array.isArray(users) &&
                users.map((user) => (
                  <Tr key={user.userId}>
                    <Td>{user.userId}</Td>
                    <Td>{user.userName}</Td>
                    <Td>{user.userEmail}</Td>
                    <Td>{user.userAddress}</Td>
                    <Td>{user.userCity}</Td>
                    <Td>{user.userState}</Td>

                    <Td>{user.userRights}</Td>

                    {user.IsActive === "1" ? (
                      <Td>
                        {" "}
                        <Button
                          colorScheme="green"
                          size="sm"
                          onClick={() => handleUserStatus(user)}
                        >
                          Active
                        </Button>{" "}
                      </Td>
                    ) : (
                      <Td>
                        {" "}
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleUserStatus(user)}
                        >
                          In Active
                        </Button>{" "}
                      </Td>
                    )}
                    {/* <Td display={"flex"} gap={2}>
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={() => handleToggle(user.userId, "Add")}
                      >
                        Add
                      </Button>
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={() => handleToggle(user.userId, "Delete")}
                      >
                        Delete
                      </Button>
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={() => handleToggle(user.userId, "Edit")}
                      >
                        Edit
                      </Button>
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={() => handleToggle(user.userId, "View")}
                      >
                        View
                      </Button>
                    </Td> */}

                    <Td>
                      <HStack>
                        <Button
                          colorScheme="teal"
                          onClick={() => {
                            setIsModalOpen(true);
                            setEditFormData({
                              userId: user.userId,
                              userName: user.userName,
                              userEmail: user.userEmail,
                              userAddress: user.userAddress,
                              userCity: user.userCity,
                              userState: user.userState,
                            });
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={() => handleDeleteUser(user.userId)}
                        >
                          Delete
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        )}
      </Box>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleUpdateUser}>
            <ModalBody>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  value={editFormData.userName}
                  onChange={handleEditUserChange}
                  placeholder="User Name"
                  name="userName"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={editFormData.userEmail}
                  onChange={handleEditUserChange}
                  placeholder="Email"
                  name="userEmail"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Address</FormLabel>
                <Input
                  type="text"
                  value={editFormData.userAddress}
                  onChange={handleEditUserChange}
                  placeholder="Address"
                  name="userAddress"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>City</FormLabel>
                <Input
                  type="text"
                  value={editFormData.userCity}
                  onChange={handleEditUserChange}
                  name="userCity"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>State</FormLabel>
                <Input
                  type="text"
                  value={editFormData.userState}
                  onChange={handleEditUserChange}
                  name="userState"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" type="submit">
                Save Changes
              </Button>
              <Button onClick={() => setIsModalOpen(false)} ml={4}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserList;

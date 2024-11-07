import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  VStack,
  Center,
  Heading,
  useToast,
  Table,
  Thead,
  Tr,
  HStack,
  Td,
  Tbody,
  Th,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Skeleton,
  Spinner,
  position,
} from "@chakra-ui/react";
import axios from "axios";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { warning } from "framer-motion";

const AddBlock = () => {
  const [show, setShow] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const toast = useToast();
  const [projects, setProjects] = useState([]);
  const [block, setBlock] = useState([]);
  const [editState, setEditState] = useState(false);
  const [temp, setTemp] = useState([]);
  const [formData, setFormData] = useState({
    projectName: "",
    blockName: "",
    areaSqft: "",
    areaSqmt: "",
    ratePerSqft: "",
  });

  //fetch only project name
  const fetchProject = async () => {
    setTableLoading(true);
    try {
      const response = await axios.get(
        // "http://localhost/backend_lms/getprojects.php"
        "http://localhost/backend_lms/getprojects.php"
      );
      if (response.data) {
        setTableLoading(false);
        setProjects(response.data);
      }
    } catch (error) {
      setTableLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleCloseModel = () => {
    setIsModalOpen(false);
    setEditState(false);
  };

  const fetchData = async () => {
    setTableLoading(true);
    try {
      const response = await axios.get(
        "http://localhost/backend_lms/getblock.php"
        // "http://localhost/backend_lms/getblock.php"
      );

      setBlock(response.data);
      setTemp(response.data);
      if (response.data) {
        setTableLoading(false);
      }
    } catch (error) {
      setTableLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (value) {
      setShow(true);
    } else {
      setShow(false);
    }
    if (name === "projectName") {
      const result = temp.filter((item) => item.projectName == value);
      setBlock(result);
    }
  };

  const onAddBlock = async (e) => {
    setAddLoading(true);
    e.preventDefault();
    const url = "http://localhost/backend_lms/addblock.php";
    // const url = "http://localhost/backend_lms/addblock.php";
    const fData = new FormData();
    fData.append("projectName", formData.projectName);
    fData.append("blockName", formData.blockName);
    fData.append("areaSqft", formData.areaSqft);
    fData.append("areaSqmt", formData.areaSqmt);
    fData.append("ratePerSqft", formData.ratePerSqft);

    const findProject = block.find(
      (element) =>
        formData.projectName === element.projectName &&
        formData.blockName === element.blockName
    );
    if (findProject) {
      toast({
        title: `Block Already exist`,
        status: "warning",
        position: "top-right",
        isClosable: true,
      });
      setAddLoading(false);
      return;
    }
    try {
      const response = await axios.post(url, fData);
      toast({
        title: "Block added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      if (response.data) {
        // Clear the form data after successful submission
        setFormData({
          projectName: "",
          blockName: "",
          areaSqft: "",
          areaSqmt: "",
          ratePerSqft: "",
        });
        setAddLoading(false);
        fetchData();
      }
    } catch (error) {
      console.log(error.toJSON());
      setAddLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const handleDelete = (projectId) => {
    setProjectIdToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };

  // const confirmDelete = async () => {
  //   setDelLoading(true)
  //   try {
  //     // Make a DELETE request to your API endpoint for deleting a project
  //     await axios.delete(
  //       `http://localhost/backend_lms/deleteblock.php?id=${projectIdToDelete}`
  //     )
  //     .then((res)=> {
  //       if(res.data){
  //         toast({
  //           title: "Project deleted successfully!",
  //            status: "success",
  //           duration: 3000,
  //           position: "top-right",
  //           isClosable: true,
  //         });
  //         fetchData()
  //         setDelLoading(false)
  //       }
  //     })
  //     // Update the projects state after successful deletion
  //     // setBlock(block.filter((project) => project.id !== projectIdToDelete));

  //   } catch (error) {
  //     setDelLoading(false)
  //     console.error("Error deleting project:", error);
  //   } finally {
  //     // Reset the state after handling delete
  //     setIsDeleteDialogOpen(false);
  //     setProjectIdToDelete(null);
  //     setDelLoading(false)
  //   }
  // };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editFormData, setEditFormData] = useState({
    id: "",
    projectName: "",
    blockName: "",
    areaSqft: "",
    areaSqmt: "",
    ratePerSqft: "",
  });

  const handleEditBlockChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditBlockSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    console.log("edit Project", editFormData.projectName);
    console.log("edit block", editFormData.blockName);

    const findBlock = block.find(
      (element) =>
        editFormData.projectName === element.projectName &&
        editFormData.blockName === element.blockName
    );
    console.log(findBlock);
    if (findBlock) {
      console.log("found", findBlock);
      console.log("if call");
      // toast({
      //   title: `Block Already exist`,
      //   status: "warning",
      //   position: "top-right",
      //   isClosable: true,
      // });
      setEditLoading(false);

    }

    const url = "http://localhost/backend_lms/editblock.php";
    // const url = "http://localhost/backend_lms/editblock.php";
    console.log("api called");
    try {
      const formData = new FormData();
      formData.append("id", editFormData.id);
      formData.append("projectName", editFormData.projectName);
      formData.append("blockName", editFormData.blockName);
      formData.append("areaSqft", editFormData.areaSqft);
      formData.append("areaSqmt", editFormData.areaSqmt);
      formData.append("ratePerSqft", editFormData.ratePerSqft);

      const response = await axios.post(url, formData);
      console.log(response && response.data && response.data.status === "success");
      if (response && response.data ) {
        // Close the modal after successful submission
        setIsModalOpen(false);
        setEditLoading(false);
        console.log("block edited..");
        // Fetch updated block data (make sure this function is implemented correctly)
        fetchData();
        // Show a success toast message
        toast({
          title: "Block updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Handle error response
        console.error("Error updating block. Response:", response);

        // Show an error toast message
        toast({
          title: "Error updating block",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setEditLoading(false);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error in handleEditBlockSubmit:", error);
      setEditLoading(false);
      // Show an error toast message
      toast({
        title: "Error updating block",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const confirmDelete = async () => {
    setDelLoading(true);
    try {
      // Make a DELETE request to your API endpoint for deleting a project
      const response = await axios.delete(
        `http://localhost/backend_lms/deleteblock.php?id=${projectIdToDelete}`
        //  `http://localhost/backend_lms/deleteblock.php?id=${projectIdToDelete}`
      );
      if (response.data) {
        toast({
          title: "Project deleted successfully!",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });

        // Update the blocks state after successful deletion
        setBlock((prevBlocks) =>
          prevBlocks.filter((block) => block.id !== projectIdToDelete)
        );
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error deleting project",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    } finally {
      // Reset the state after handling delete
      setIsDeleteDialogOpen(false);
      setProjectIdToDelete(null);
      setDelLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchProject();
  }, []);

  return (
    <>
      <Box p={4} width="100%">
        <Center pb={4}>
          <Heading fontSize={"25px"}>Add Block</Heading>
        </Center>
        <form onSubmit={onAddBlock}>
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <FormControl>
              <FormLabel>Project Name</FormLabel>
              <Select
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="Select Project"
                required
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.projectName}>
                    {project.projectName}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Block Name</FormLabel>
              <Input
                type="text"
                name="blockName"
                value={formData.blockName}
                onChange={handleChange}
                placeholder="Enter Block Name"
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Area (in sqft)</FormLabel>
              <Input
                type="number"
                name="areaSqft"
                value={formData.areaSqft}
                onChange={handleChange}
                placeholder="Enter Area (sqft)"
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Area (in sqmt)</FormLabel>
              <Input
                type="number"
                name="areaSqmt"
                value={formData.areaSqmt}
                onChange={handleChange}
                placeholder="Enter Area (sqmt)"
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Rate (per sqft)</FormLabel>
              <Input
                type="number"
                name="ratePerSqft"
                value={formData.ratePerSqft}
                onChange={handleChange}
                placeholder="Enter Rate (per sqft)"
                required
              />
            </FormControl>
            {addLoading ? (
              <Button
                mt={8}
                isLoading
                loadingText="Submitting"
                colorScheme="teal"
                variant="outline"
              >
                Submit
              </Button>
            ) : (
              <Button colorScheme="green" color={"white"} type="submit" mt={8}>
                SUBMIT
              </Button>
            )}
          </Grid>
          <Center></Center>
        </form>
      </Box>
      <Box>
        <Center mb={"15px"}>
          <VStack>
            <Heading fontSize={"25px"}>Block Details</Heading>
          </VStack>
        </Center>
        <Table variant="simple" colorScheme="blue">
          <Thead>
            <Tr>
              <Th bg="blue.500" color="white" fontSize="13px">
                Sr No.
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Project Name
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Block Name
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Area sqft
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Area sqmt
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Rate PerSqft
              </Th>
              <Th bg="blue.500" color="white" fontSize="14px">
                Action
              </Th>
            </Tr>
          </Thead>
          {!show ? (
            <Box width={"500px"} top={50} position={"relative"} left={"600px"}>
              <Heading>Select Your Project First</Heading>
            </Box>
          ) : tableLoading ? (
            <Tbody>
              {block.map((blockItem, index) => (
                <Tr key={blockItem.id}>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>

                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          ) : (
            <Tbody>
              {block.map((blockItem, index) => (
                <Tr key={blockItem.id}>
                  <Td>{index + 1}</Td>
                  <Td>{blockItem.projectName}</Td>
                  <Td>{blockItem.blockName}</Td>
                  <Td>{blockItem.areaSqft}</Td>
                  <Td>{blockItem.areaSqmt}</Td>
                  <Td>{blockItem.ratePerSqft}</Td>
                  <Td>
                    <HStack>
                      <Button
                        colorScheme="red"
                        onClick={() => handleDelete(blockItem.id)} // Pass projectId to handleDelete
                      >
                        Delete
                      </Button>
                      <DeleteConfirmationDialog
                        isOpen={isDeleteDialogOpen}
                        onClose={() => setIsDeleteDialogOpen(false)}
                        onConfirm={confirmDelete}
                        loadingDel={delLoading}
                      />
                      <Button
                        colorScheme="green"
                        onClick={() => {
                          setIsModalOpen(true);
                          setEditFormData({
                            id: blockItem.id,
                            projectName: blockItem.projectName,
                            blockName: blockItem.blockName,
                            areaSqft: blockItem.areaSqft,
                            areaSqmt: blockItem.areaSqmt,
                            ratePerSqft: blockItem.ratePerSqft,
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>
      </Box>
      <Modal isOpen={isModalOpen} onClose={handleCloseModel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Block</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleEditBlockSubmit}>
            <ModalBody>
              <FormControl mb={4}>
                <FormLabel>Project Name</FormLabel>
                <Select
                  name="projectName"
                  value={editFormData.projectName || ""}
                  // onChange={handleEditBlockChange}
                  placeholder={editFormData.projectName}
                >
                  {editFormData.projectName}
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Block Name</FormLabel>
                <Input
                  type="text"
                  name="blockName"
                  value={editFormData.blockName || ""}
                  onChange={handleEditBlockChange}
                  readOnly
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Area (in sqft)</FormLabel>
                <Input
                  type="number"
                  name="areaSqft"
                  value={editFormData.areaSqft || ""}
                  onChange={handleEditBlockChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Area (in sqmt)</FormLabel>
                <Input
                  type="number"
                  name="areaSqmt"
                  value={editFormData.areaSqmt || ""}
                  onChange={handleEditBlockChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Rate (per sqft)</FormLabel>
                <Input
                  type="number"
                  name="ratePerSqft"
                  value={editFormData.ratePerSqft || ""}
                  onChange={handleEditBlockChange}
                  required
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              {editLoading ? (
                <Button
                  isLoading
                  loadingText="Submitting"
                  colorScheme="teal"
                  variant="outline"
                >
                  Submit
                </Button>
              ) : (
                <Button colorScheme="blue" type="submit">
                  Save Changes
                </Button>
              )}
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

export default AddBlock;

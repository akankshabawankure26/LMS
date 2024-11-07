import React, { useState, useEffect } from "react";
import {
  Box,
  Center,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Grid,
  FormControl,
  FormLabel,
  Button,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  HStack,
  VStack,
  Spinner,
  Skeleton,
} from "@chakra-ui/react";
import axios from "axios";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttarakhand",
  "Uttar Pradesh",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Lakshadweep",
  "Puducherry",
];

const projectTypes = [
  "Residential Plotting",
  "Residential Multi",
  "Residential Cum Commercial",
  "Commercial Plotting",
  "Commercial Multi",
];

const AddProject = () => {
  // const [searchQuery, setSearchQuery] = useState("");
  // const [filteredMaster, setFilteredMaster] = useState([]);
  const [tableloading, setLoading] = useState(false);
  const [delloading, setDelLoading] = useState(false);
  const [addloading, setAddLoading] = useState(false);
  const [editloading, setEditLoading] = useState(false);
  const toast = useToast();

  const [projects, setProjects] = useState([]); //this state use for fetching
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);
  const [userRight, setUserRight] = useState(localStorage.getItem("userRight"));

  //this use for fecthing projects

  // useEffect(() => {
  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost/backend_lms/getprojects.php"
  //     );
  //     setProjects(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost/backend_lms/getprojects.php"
      );
      // console.log(response.data); // Log the response data
      if (response.data) {
        setProjects(response.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  // }, []);
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    projectName: "",
    location: "",
    city: "",
    state: "",
    projectType: "",
    totalLandArea: "",
    totalSalableArea: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onAdd = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    const isProjectNameExists = projects.some(
      (project) => project.projectName === formData.projectName
    );

    if (isProjectNameExists) {
      // Show an error toast if the project name already exists
      toast({
        title: "Project name already exists!",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
      setAddLoading(false);
      return;
    }
    // const url = "http://localhost/backend_lms/addproject.php";
    const url = "http://localhost/backend_lms/addproject.php";


    let fData = new FormData();
    fData.append("projectName", formData.projectName);
    fData.append("city", formData.city);
    fData.append("state", formData.state);
    fData.append("location", formData.location);
    fData.append("projectType", formData.projectType);
    fData.append("totalLandArea", formData.totalLandArea);
    fData.append("totalSalableArea", formData.totalSalableArea);

    try {
      const response = await axios.post(url, fData);
      toast({
        title: "Project added successfully!",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });

      setProjects([
        ...projects,
        { ...response.data, id: response.data.projectId },
      ]);
      setAddLoading(false);
      // Clear the form data after successful submission
      setFormData({
        projectName: "",
        location: "",
        city: "",
        state: "",
        projectType: "",
        totalLandArea: "",
        totalSalableArea: "",
      });
      fetchData();
    } catch (error) {
      console.log(error.toJSON());
      setAddLoading(false);
    }
  };

  const handleDelete = (projectId) => {
    setProjectIdToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setDelLoading(true);
    try {
      // Make a DELETE request to your API endpoint for deleting a project
      await axios
        .delete(
          `http://localhost/backend_lms/deleteproject.php?id=${projectIdToDelete}`
        )
        .then((res) => {
          console.log(res.data);
          toast({
            title: "Project deleted successfully!",
            status: "success",
            duration: 3000,
            position: "top-right",
            isClosable: true,
          });
          setDelLoading(false);
          fetchData();
        });
      // Update the projects state after successful deletion
      // setProjects(
      //   projects.filter((project) => project.id !== projectIdToDelete)
      // );
    } catch (error) {
      console.error("Error deleting project:", error);
      setDelLoading(false);
    } finally {
      // Reset the state after handling delete
      setDelLoading(false);
      setIsDeleteDialogOpen(false);
      setProjectIdToDelete(null);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editFormData, setEditFormData] = useState({
    id: "",
    projectName: "",
    location: "",
    city: "",
    state: "",
    projectType: "",
    totalLandArea: "",
    totalSalableArea: "",
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditClick = (project) => {
    setIsModalOpen(true);
    setEditFormData({
      id: project.id,
      projectName: project.projectName,
      location: project.location,
      city: project.city,
      state: project.state,
      projectType: project.projectType,
      totalLandArea: project.totalLandArea,
      totalSalableArea: project.totalSalableArea,
    });
  };

  const handleEditSubmit = async (e) => {
    setEditLoading(true);
    e.preventDefault();
    const url = "http://localhost/backend_lms/editproject.php";

    try {
      const formData = new FormData();
      formData.append("id", editFormData.id);
      formData.append("projectName", editFormData.projectName);
      formData.append("location", editFormData.location);
      formData.append("city", editFormData.city);
      formData.append("state", editFormData.state);
      formData.append("projectType", editFormData.projectType);
      formData.append("totalLandArea", editFormData.totalLandArea);
      formData.append("totalSalableArea", editFormData.totalSalableArea);

      const response = await axios.post(url, formData);

      if (response && response.data && response.data.status === "success") {
        // Close the modal after successful submission
        setIsModalOpen(false);
        setEditLoading(false);
        // Fetch updated projects data (make sure this function is implemented correctly)
        fetchData();

        // Show a success toast message
        toast({
          title: "Project updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Handle error response
        console.error("Error updating project. Response:", response);
        setEditLoading(false);
        // Show an error toast message
        toast({
          title: "Error updating project",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error in handleEditSubmit:", error);
      setEditLoading(false);
      // Show an error toast message
      toast({
        title: "Error updating project",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // const userPermission = async () => {
  //   const url = "http://localhost/backend_lms/getUserPermission.php";
  //   const response = await axios.post(url,userRight);


  // }

  useEffect(() => {
    fetchData();
  }, []);

  console.log("component");
  return (
    <>
      <Box p={4} width="100%">
        <Center pb={4}>
          <Heading fontSize={"25px"}>Add Project</Heading>
        </Center>
        <form onSubmit={onAdd}>
          <Grid templateColumns="repeat(4, 1fr)" gap={4}>
            <FormControl>
              <FormLabel>Project Name</FormLabel>
              <Input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>City</FormLabel>
              <Input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>State</FormLabel>
              <Select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder="Select State"
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Project Type</FormLabel>
              <Select
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                required
                placeholder="Select Project Type"
              >
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Total Land Area (in sqmt)</FormLabel>
              <Input
                type="number"
                name="totalLandArea"
                value={formData.totalLandArea}
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Total Salable Area (in sqmt)</FormLabel>
              <Input
                type="number"
                name="totalSalableArea"
                value={formData.totalSalableArea}
                onChange={handleChange}
                required
              />
            </FormControl>

            {addloading ? (
              <Button colorScheme="blue" mt={8}>
                <Spinner size="md" color="white" />
              </Button>
            ) : (
              <Button
                colorScheme="blue"
                type="submit"
                mt={8}
              >
                Add Project
              </Button>
            )}

          </Grid>
          <Center></Center>
        </form>
      </Box>

      <Box>
        <Center mb={"12px"}>
          <VStack>
            <Heading fontSize={"25px"}>Project Details</Heading>
          </VStack>
        </Center>
        <Table variant="simple" colorScheme="blue">
          <Thead>
            <Tr>
              <Th bg="blue.500" color="white" fontSize="13px">
                Sr No.
              </Th>
              <Th bg="blue.500" color="white" fontSize="14px">
                Project Name
              </Th>
              <Th bg="blue.500" color="white" fontSize="14px">
                Location
              </Th>
              <Th bg="blue.500" color="white" fontSize="14px">
                City
              </Th>
              <Th bg="blue.500" color="white" fontSize="14px">
                State
              </Th>
              <Th bg="blue.500" color="white" fontSize="14px">
                Project Type
              </Th>
              <Th bg="blue.500" color="white" fontSize="14px">
                Total Land Area(Sqmt)
              </Th>
              <Th bg="blue.500" color="white" fontSize="14px">
                Total Salable Area(Sqmt)
              </Th>
              <Th bg="blue.500" color="white" fontSize="14px">
                Action
              </Th>
            </Tr>
          </Thead>
          {tableloading ? (
            <Tbody>
              {projects.map((project, index) => (
                <Tr key={project.id}>
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

                  <Td textAlign={"center"}>
                    <Skeleton height="20px" />
                  </Td>
                  <Td textAlign={"center"}>
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
              {projects.map((project, index) => (
                <Tr key={project.id}>
                  <Td>{index + 1}</Td>
                  <Td>{project.projectName}</Td>
                  <Td>{project.location}</Td>
                  <Td>{project.city}</Td>
                  <Td>{project.state}</Td>
                  <Td>{project.projectType}</Td>
                  {/* <Td textAlign={"center"}>{project.totalLandArea}</Td>
                   */}
                  <Td textAlign={"center"}>
                    {project.totalLandArea
                      ? Number(project.totalLandArea).toFixed(2)
                      : "0.00"}
                  </Td>
                  <Td textAlign={"center"}>{project.totalSalableArea}</Td>
                  <Td>
                    <HStack>
                      <Button
                        colorScheme="red"
                        onClick={() => handleDelete(project.id)}
                      >
                        Delete
                      </Button>

                      <DeleteConfirmationDialog
                        isOpen={isDeleteDialogOpen}
                        loadingDel={delloading}
                        onClose={() => setIsDeleteDialogOpen(false)}
                        onConfirm={confirmDelete}
                      />
                      <Button
                        colorScheme="teal"
                        onClick={() => handleEditClick(project)}
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

      {/* Modal Code */}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Project</ModalHeader>
          <ModalCloseButton />

          <form onSubmit={handleEditSubmit}>
            <ModalBody>
              <FormControl mb={4}>
                <FormLabel>Project Name</FormLabel>
                <Input
                  type="text"
                  name="projectName"
                  value={editFormData.projectName || ""}
                  onChange={handleEditChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Location</FormLabel>
                <Input
                  type="text"
                  name="location"
                  value={editFormData.location || ""}
                  onChange={handleEditChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>City</FormLabel>
                <Input
                  type="text"
                  name="city"
                  value={editFormData.city || ""}
                  onChange={handleEditChange}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>State</FormLabel>
                <Select
                  name="state"
                  value={editFormData.state}
                  onChange={handleEditChange}
                  required
                  placeholder="Select State"
                >
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Project Type</FormLabel>
                <Input
                  type="text"
                  name="projectType"
                  value={editFormData.projectType || ""}
                  onChange={handleEditChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Total Land Area(in Sqmt)</FormLabel>
                <Input
                  type="number"
                  name="totalLandArea"
                  value={editFormData.totalLandArea || ""}
                  onChange={handleEditChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Total Salable Area</FormLabel>
                <Input
                  type="number"
                  name="totalSalableArea"
                  value={editFormData.totalSalableArea || ""}
                  onChange={handleEditChange}
                  required
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              {editloading ? (
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

export default AddProject;

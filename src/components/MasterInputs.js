import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Grid,
  Center,
  HStack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import axios from "axios";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
const MasterInputs = () => {
  const toast = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);
  const [userRight, setUserRight] = useState(localStorage.getItem("userRight"));
  // const [selectedRows, setSelectedRows] = useState([]);
  const [projects, setProjects] = useState([]);
  const [master, setMaster] = useState([]);
  // const [searchQuery, setSearchQuery] = useState("");
  // const [filteredMaster, setFilteredMaster] = useState([]);
  const [formData, setFormData] = useState({
    projectName: "",
    guideline: "",
    registryMalePercent: "",
    registryFemalePercent: "",
    serviceType: "",
    serviceValue: "",

    maintenanceType: "",
    maintenanceValue: "",

    miscType: "",
    miscValue: "",

    brokerageValue: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost/backend_lms/getprojects.php"
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // const handleCheckboxChange = (id) => {
  //   const isSelected = selectedRows.includes(id);

  //   if (isSelected) {
  //     setSelectedRows((prevSelectedRows) =>
  //       prevSelectedRows.filter((rowId) => rowId !== id)
  //     );
  //   } else {
  //     setSelectedRows((prevSelectedRows) => [...prevSelectedRows, id]);
  //   }
  // };

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost/backend_lms/getmaster.php"
  //     );
  //     setMaster(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // fetchData();
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost/backend_lms/getmaster.php"
      );

      // Assuming response.data is an array, or an array can be extracted
      // Adjust this line based on the structure of your API response
      const data = Array.isArray(response.data) ? response.data : [];

      setMaster(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMaster([]); // Set master to an empty array in case of an error
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const onAddMaster = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const isDuplicate = master.some(
      (item) => item.projectName === formData.projectName
    );

    if (isDuplicate) {
      toast({
        title: "Duplicate project!",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
      return;
    }

    const url = "http://localhost/backend_lms/setQuery.php";
    let query =
      "INSERT INTO `master` (`id`, `projectName`, `guideline`, `registryMalePercent`, `registryFemalePercent`, `serviceType`, `serviceValue`, `maintenanceType`, `maintenanceValue`, `miscType`, `miscValue`, `brokerageValue`) VALUES (NULL, '" +
      formData.projectName +
      "', '" +
      formData.guideline +
      "', '" +
      formData.registryMalePercent +
      "', '" +
      formData.registryFemalePercent +
      "', '" +
      formData.serviceType +
      "', '" +
      formData.serviceValue +
      "', '" +
      formData.maintenanceType +
      "', '" +
      formData.maintenanceValue +
      "', '" +
      formData.miscType +
      "', '" +
      formData.miscValue +
      "', '" +
      formData.brokerageValue +
      "');";

    let fData = new FormData();
    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);
      toast({
        title: "Master Input added successfully!",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
      fetchData();

      // Clear the form data after successful submission
      setFormData({
        projectName: "",
        guideline: "",
        registryMalePercent: "",
        registryFemalePercent: "",
        serviceType: "",
        serviceValue: "",
        maintenanceType: "",
        maintenanceValue: "",
        miscType: "",
        miscValue: "",
        brokerageValue: "",
      });
    } catch (error) {
      console.log(error.toJSON());
    }
  };

  useEffect(() => {
    fetchData(); // You should define and implement the fetchData function
  }, [onAddMaster]); // This dependency array might be adjusted based on your actual use case

  const handleDelete = (projectId) => {
    setProjectIdToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // Make a DELETE request to your API endpoint for deleting a project
      await axios.delete(
        `http://localhost/backend_lms/deletemaster.php?id=${projectIdToDelete}`
      );
      // Update the projects state after successful deletion
      setMaster(master.filter((project) => project.id !== projectIdToDelete));
      toast({
        title: "Project deleted successfully!",
        // status: "danger",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      // Reset the state after handling delete
      setIsDeleteDialogOpen(false);
      setProjectIdToDelete(null);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    projectName: "",
    guideline: "",
    registryMalePercent: "",
    registryFemalePercent: "",
    serviceType: "",
    serviceValue: "",

    maintenanceType: "",
    maintenanceValue: "",

    miscType: "",
    miscValue: "",

    brokerageValue: "",
  });
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditClick = (m) => {
    setIsModalOpen(true);
    setEditFormData({
      id: m.id,
      projectName: m.projectName,
      guideline: m.guideline,

      registryMalePercent: m.registryMalePercent,
      registryFemalePercent: m.registryFemalePercent,
      serviceType: m.serviceType,
      serviceValue: m.serviceValue,

      maintenanceType: m.maintenanceType,
      maintenanceValue: m.maintenanceValue,

      miscType: m.miscType,
      miscValue: m.miscValue,

      brokerageValue: m.brokerageValue,
    });
  };
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost/backend_lms/editmaster.php";
      const formData = new FormData();
      formData.append("id", editFormData.id);
      formData.append("guideline", editFormData.guideline);
      formData.append("projectName", editFormData.projectName);
      formData.append("registryMalePercent", editFormData.registryMalePercent);
      formData.append(
        "registryFemalePercent",
        editFormData.registryFemalePercent
      );
      formData.append("serviceType", editFormData.serviceType);
      formData.append("serviceValue", editFormData.serviceValue);
      formData.append("maintenanceType", editFormData.maintenanceType);
      formData.append("maintenanceValue", editFormData.maintenanceValue);
      formData.append("miscType", editFormData.miscType);
      formData.append("miscValue", editFormData.miscValue);
      formData.append("brokerageValue", editFormData.brokerageValue);

      console.log("FormData:", formData);

      const response = await axios.post(url, formData);

      console.log("Response:", response);

      if (response && response.data && response.data.status === "success") {
        setIsModalOpen(false);
        fetchData();
        toast({
          title: "Project updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error("Error updating project. Response:", response);
        toast({
          title: "Error updating project",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error in handleEditSubmit:", error);
      toast({
        title: "Error updating project",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box p={4} width="100%" position={"relative"} bottom={"0rem"}>
        <Center pb={4}>
          <Heading fontSize={"25px"}>Master Inputs</Heading>
        </Center>
        <form onSubmit={onAddMaster}>
          <Grid templateColumns="repeat(6, 1fr)" gap={4}>
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
              <FormLabel>Guideline (Per Sqmt)</FormLabel>
              <Input
                type="text"
                name="guideline"
                value={formData.guideline}
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Registry Male (%)</FormLabel>
              <Input
                type="text"
                name="registryMalePercent"
                value={formData.registryMalePercent}
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Registry Female (%)</FormLabel>
              <Input
                type="text"
                name="registryFemalePercent"
                value={formData.registryFemalePercent}
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Service Type</FormLabel>
              <Select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                placeholder="Select Type"
              >
                <option value="PerSqmt">Per Sqmt</option>
                <option value="Lumpsum">Lumpsum</option>
                {/* Add service type options here */}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Service Value</FormLabel>
              <Input
                type="number"
                name="serviceValue"
                value={formData.serviceValue}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Maintenance Type</FormLabel>
              <Select
                name="maintenanceType"
                value={formData.maintenanceType}
                onChange={handleChange}
                placeholder="Select Type"
              >
                <option value="PerSqmt">Per Sqft</option>
                <option value="Lumpsum">Lumpsum</option>
                {/* Add maintenance type options here */}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Maintenance Value</FormLabel>
              <Input
                type="number"
                name="maintenanceValue"
                value={formData.maintenanceValue}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Misc Type</FormLabel>
              <Select
                name="miscType"
                value={formData.miscType}
                onChange={handleChange}
                placeholder="Select Type"
              >
                <option value="PerSqmt">Per Sqft</option>
                <option value="Lumpsum">Lumpsum</option>
                {/* Add misc type options here */}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Misc Value</FormLabel>
              <Input
                type="number"
                name="miscValue"
                value={formData.miscValue}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Brokerage %</FormLabel>
              <Input
                type="number"
                name="brokerageValue"
                value={formData.brokerageValue}
                onChange={handleChange}
              />
            </FormControl>
            <Button colorScheme="blue" type="submit" mt={8}
              isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
            >
              Submit
            </Button>
          </Grid>
        </form>
      </Box>
      <Box>
        <Box display={"inline"}>
          <Center mb={"12px"}>
            <VStack>
              <Heading fontSize={"25px"}>Master Inputs Details</Heading>
            </VStack>
          </Center>
        </Box>
        <Table
          variant="simple"
          colorScheme="blue"
          style={{ borderCollapse: "collapse" }}
        >
          <Thead>
            <Tr>

              <Th
                bg="blue.500"
                color="white"
                fontSize="0.8rem"
                style={{ padding: "10px" }}
              >
                Sr No.
              </Th>
              <Th
                bg="blue.500"
                color="white"
                fontSize="0.8rem"
                style={{ padding: "9px" }}
              >
                Project Name
              </Th>
              <Th
                bg="blue.500"
                color="white"
                fontSize="0.8rem"
                style={{ padding: "9px" }}
              >
                Guideline
              </Th>
              <Th
                bg="blue.500"
                color="white"
                fontSize="0.8rem"
                style={{ padding: "9px" }}
              >
                Registry Male %
              </Th>
              <Th
                bg="blue.500"
                color="white"
                fontSize="0.8rem"
                style={{ padding: "9px" }}
              >
                Registry Female %
              </Th>
              <Th
                bg="blue.500"
                color="white"
                fontSize="0.8rem"
                style={{ padding: "9px" }}
              >
                Service Type
              </Th>
              <Th
                bg="blue.500"
                color="white"
                fontSize="0.8rem"
                style={{ padding: "9px" }}
              >
                Service Value
              </Th>

              <Th
                bg="blue.500"
                color="white"
                fontSize="0.8rem"
                style={{ padding: "9px" }}
              >
                Maintenance Type
              </Th>
              <Th
                bg="blue.500"
                color="white"
                fontSize="0.8rem"
                style={{ padding: "9px" }}
              >
                Maintenance Value
              </Th>

              <Th
                bg="blue.500"
                color="white"
                fontSize="0.8rem"
                style={{ padding: "9px" }}
              >
                Misc Type
              </Th>
              <Th
                bg="blue.500"
                color="white"
                fontSize="0.8rem"
                style={{ padding: "9px" }}
              >
                Misc Value
              </Th>

              <Th
                bg="blue.500"
                color="white"
                fontSize="0.8rem"
                style={{ padding: "9px" }}
              >
                Brokerage %
              </Th>
              <Th
                bg="blue.500"
                color="white"
                fontSize="0.8rem"
                style={{ padding: "10px" }}
              >
                Action
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {master.map((master, index) => (
              <Tr key={master.id}>

                <Td style={{ padding: "9px" }}>{index + 1}</Td>
                <Td style={{ padding: "9px" }}>{master.projectName}</Td>
                <Td style={{ padding: "9px" }}>{master.guideline}</Td>
                <Td style={{ padding: "9px" }}>{master.registryMalePercent}</Td>
                <Td style={{ padding: "9px" }}>
                  {master.registryFemalePercent}
                </Td>
                <Td style={{ padding: "9px" }}>{master.serviceType}</Td>
                <Td style={{ padding: "9px" }}>{master.serviceValue}</Td>
                <Td style={{ padding: "9px" }}>{master.maintenanceType}</Td>
                <Td style={{ padding: "9px" }}>{master.maintenanceValue}</Td>

                <Td style={{ padding: "9px" }}>{master.miscType}</Td>
                <Td style={{ padding: "9px" }}>{master.miscValue}</Td>
                <Td style={{ padding: "9px" }}>{master.brokerageValue}</Td>
                <Td>
                  <HStack>
                    <Button
                      colorScheme="teal"
                      onClick={userRight !== "SalesPerson" && userRight !== "Manager" ? () => handleEditClick(master) : undefined}
                    >
                      Edit
                    </Button>


                    <Button
                      colorScheme="red"
                      onClick={userRight !== "SalesPerson" && userRight !== "Manager" ? () => handleDelete(master.id) : undefined}
                    >
                      Delete
                    </Button>
                    <DeleteConfirmationDialog
                      isOpen={isDeleteDialogOpen}
                      onClose={() => setIsDeleteDialogOpen(false)}
                      onConfirm={confirmDelete}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Selected Rows</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSaveChanges}>
            <ModalBody>
              <FormControl>
                <FormLabel>Project Name</FormLabel>
                <Input
                  type="text"
                  value={editFormData.projectName || ""}
                  name="projectName"
                  onChange={handleEditChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Guideline (Per Sqmt)</FormLabel>
                <Input
                  type="number"
                  value={editFormData.guideline || ""}
                  name="guideline"
                  onChange={handleEditChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Registry Male (%)</FormLabel>
                <Input
                  type="number"
                  value={editFormData.registryMalePercent || ""}
                  name="registryMalePercent"
                  onChange={handleEditChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Registry Female (%)</FormLabel>
                <Input
                  type="number"
                  value={editFormData.registryFemalePercent || ""}
                  name="registryFemalePercent"
                  onChange={handleEditChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Service Type</FormLabel>
                <Select
                  name="serviceType"
                  value={editFormData.serviceType || ""}
                  onChange={handleEditChange}
                  placeholder="Select Type"
                >
                  <option value="PerSqmt">Per Sqmt</option>
                  <option value="Lumpsum">Lumpsum</option>
                  {/* Add more options as needed */}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Service Value</FormLabel>
                <Input
                  type="number"
                  value={editFormData.serviceValue || ""}
                  name="serviceValue"
                  onChange={handleEditChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Maintenance Type</FormLabel>
                <Select
                  name="maintenanceType"
                  value={editFormData.maintenanceType || ""}
                  onChange={handleEditChange}
                  placeholder="Select Type"
                >
                  <option value="PerSqmt">Per Sqmt</option>
                  <option value="Lumpsum">Lumpsum</option>
                  {/* Add more options as needed */}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Maintenance Value</FormLabel>
                <Input
                  type="number"
                  value={editFormData.maintenanceValue || ""}
                  name="maintenanceValue"
                  onChange={handleEditChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Misc Type</FormLabel>
                <Select
                  name="miscType"
                  value={editFormData.miscType || ""}
                  onChange={handleEditChange}
                  placeholder="Select Type"
                >
                  <option value="PerSqmt">Per Sqmt</option>
                  <option value="Lumpsum">Lumpsum</option>
                  {/* Add more options as needed */}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Misc Value</FormLabel>
                <Input
                  type="number"
                  value={editFormData.miscValue || ""}
                  name="miscValue"
                  onChange={handleEditChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Brokerage %</FormLabel>
                <Input
                  type="number"
                  value={editFormData.brokerageValue || ""}
                  name="brokerageValue"
                  onChange={handleEditChange}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" type="submit">
                Save Changes
              </Button>
              <Button
                colorScheme="gray"
                ml={2}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MasterInputs;

import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Container,
  Stack,
} from "@chakra-ui/react";

import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const states = [
  "AP|Andhra Pradesh",
  "AR|Arunachal Pradesh",
  "AS|Assam",
  "BR|Bihar",
  "CT|Chhattisgarh",
  "GA|Goa",
  "GJ|Gujarat",
  "HR|Haryana",
  "HP|Himachal Pradesh",
  "JK|Jammu and Kashmir",
  "JH|Jharkhand",
  "KA|Karnataka",
  "KL|Kerala",
  "MP|Madhya Pradesh",
  "MH|Maharashtra",
  "MN|Manipur",
  "ML|Meghalaya",
  "MZ|Mizoram",
  "NL|Nagaland",
  "OR|Odisha",
  "PB|Punjab",
  "RJ|Rajasthan",
  "SK|Sikkim",
  "TN|Tamil Nadu",
  "TG|Telangana",
  "TR|Tripura",
  "UT|Uttarakhand",
  "UP|Uttar Pradesh",
  "WB|West Bengal",
  "AN|Andaman and Nicobar Islands",
  "CH|Chandigarh",
  "DN|Dadra and Nagar Haveli",
  "DD|Daman and Diu",
  "DL|Delhi",
  "LD|Lakshadweep",
  "PY|Puducherry",
];

const AddContractor = () => {
  const [contractorData, addcontractorData] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    contractorName: "",
    contact: "",
    email: "",
    address: "",
    city: "",
    state: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    companyName: "",
    contractorName: "",
    contact: "",
    email: "",
    address: "",
    city: "",
    state: "",
  });

  const handleEditPlotChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const [editId, setEditId] = useState("");

  const toast = useToast();

  const onAdd = async () => {
    const url = "http://localhost/backend_lms/setQuery.php";
    // const url = "http://localhost/backend_lms/setQuery.php";
    let query =
      "INSERT INTO `contractor` (`id`, `companyName`, `contractorName`, `contact`, `emailid`, `address`, `city`, `state`) VALUES (NULL, '" +
      formData.companyName +
      "', '" +
      formData.contractorName +
      "', '" +
      formData.contact +
      "', '" +
      formData.email +
      "', '" +
      formData.address +
      "', '" +
      formData.city +
      "', '" +
      formData.state +
      "');";

    let fData = new FormData();
    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);
      toast({
        title: "Contractor added successfully!",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
      loadContractor();

      // Clear the form data after successful submission
      setFormData({
        companyName: "",
        contractorName: "",
        contact: "",
        email: "",
        address: "",
        city: "",
        state: "",
      });
    } catch (error) {
      console.log(error.toJSON());
    }
  };

  const editData = async () => {
    const url = "http://localhost/backend_lms/setQuery.php";
    // const url = "http://localhost/backend_lms/setQuery.php";

    let query =
      "UPDATE `contractor` SET `companyName` = '" +
      document.getElementById("mi2").value +
      "', `contractorName` = '" +
      document.getElementById("mi3").value +
      "', `contact` = '" +
      document.getElementById("mi4").value +
      "', `emailid` = '" +
      document.getElementById("mi5").value +
      "', `address` = '" +
      document.getElementById("mi6").value +
      "', `city` = '" +
      document.getElementById("mi7").value +
      "', `state` = '" +
      document.getElementById("mi8").value +
      "' WHERE `id` = '" +
      editId +
      "';";

    //alert(query);

    let fData = new FormData();
    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);
      toast({
        title: "Contractor Edited successfully!",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });

      loadContractor();
      setEditId("0");
      setIsModalOpen(false);
      document.getElementById("mi2").value = "";
      document.getElementById("mi3").value = "";
      document.getElementById("mi4").value = "";
      document.getElementById("mi5").value = "";
      document.getElementById("mi6").value = "";
      document.getElementById("mi7").value = "";
      document.getElementById("mi8").value = "";

      // Clear the form data after successful submission
    } catch (error) {
      console.log(error.toJSON());
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic for form submission
    console.log("Form Data:", formData);
  };

  const setModalData = async (index) => {
    let query = "SELECT * FROM `contractor` where id = '" + index + "';";
    // alert(query);

    const url = "http://localhost/backend_lms/getQuery.php";
    // const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          //  addcontractorData(response.data.phpresult);
          console.log(response.data.phpresult);
          //document.getElementById('mi1').value = response.data.phpresult[0]['id'];
          document.getElementById("mi2").value =
            response.data.phpresult[0]["companyName"];
          document.getElementById("mi3").value =
            response.data.phpresult[0]["contractorName"];
          document.getElementById("mi4").value =
            response.data.phpresult[0]["contact"];
          document.getElementById("mi5").value =
            response.data.phpresult[0]["emailid"];
          document.getElementById("mi6").value =
            response.data.phpresult[0]["address"];
          document.getElementById("mi7").value =
            response.data.phpresult[0]["city"];
          document.getElementById("mi8").value =
            response.data.phpresult[0]["state"];
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const loadContractor = async () => {
    let query = "SELECT * FROM `contractor`;";
    // alert(query);

    const url = "http://localhost/backend_lms/getQuery.php";
    // const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          addcontractorData(response.data.phpresult);
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const onDelete = async (index) => {
    let query =
      "DELETE FROM `contractor` WHERE id  = " + projectIdToDelete + ";";

    /*  alert(query); */
    const url = "http://localhost/backend_lms/setQuery.php";
    // const url = "http://localhost/backend_lms/setQuery.php";

    let fData = new FormData();
    fData.append("query", query);

    axios
      .post(url, fData)
      .then((response) => {
        toast({
          title: "Project deleted successfully!",
          // status: "danger",
          duration: 3000,
          position: "top",
          isClosable: true,
        });

        loadContractor();
      })
      .catch((error) => {
        console.log(error.toJSON());
      });

    setIsDeleteDialogOpen(false);
    setProjectIdToDelete(null);
  };

  const handleEditPlotSubmit = async (index) => {
    let query = "";

    /*  alert(query); */
    const url = "http://localhost/backend_lms/setQuery.php";
    // const url = "http://localhost/backend_lms/setQuery.php";

    let fData = new FormData();
    fData.append("query", query);

    axios
      .post(url, fData)
      .then((response) => {
        toast({
          title: "Project deleted successfully!",
          // status: "danger",
          duration: 3000,
          position: "top",
          isClosable: true,
        });

        loadContractor();
      })
      .catch((error) => {
        console.log(error.toJSON());
      });

    setIsDeleteDialogOpen(false);
    setProjectIdToDelete(null);
  };

  const handleDelete = (projectId) => {
    setProjectIdToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };

  useEffect(() => {
    // Call the loadContractor function when the component mounts
    loadContractor();
  }, []);

  return (
    <>
      {" "}
      <Box p={4} width="100%" margin="auto">
        <Center pb={8}>
          <Heading>Add Contractor</Heading>
        </Center>
        <form onSubmit={handleSubmit}>
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <FormControl colSpan={3} isRequired>
              <FormLabel>Contractor Company Name</FormLabel>
              <Input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl colSpan={3} isRequired>
              <FormLabel>Contractor Name</FormLabel>
              <Input
                type="text"
                name="contractorName"
                value={formData.contractorName}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl colSpan={1} isRequired>
              <FormLabel>Contact</FormLabel>
              <Input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl colSpan={1} isRequired>
              <FormLabel>Email ID</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl colSpan={2} isRequired>
              <FormLabel>Address</FormLabel>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl colSpan={1} isRequired>
              <FormLabel>City</FormLabel>
              <Input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl colSpan={1} isRequired>
              <FormLabel>State</FormLabel>
              <Select
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Select State"
              >
                {states.map((state) => {
                  const [code, name] = state.split("|");
                  return (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  );
                })}
              </Select>
            </FormControl>

            <Button
              colSpan={3}
              colorScheme="blue"
              type="submit"
              onClick={onAdd}
              mt={8}
            >
              Add Contractor
            </Button>
          </Grid>
        </form>
      </Box>
      {/* <Container maxW="10xl" px={{ base: 6, md: 3 }} py={14}>
        <Stack
          direction={{ base: "column", md: "row" }}
          justifyContent="center"
        >
          <Box w="100%" overflowX="auto">
            <Center pb={4}>
              <Heading> Contractor List</Heading>
            </Center>
            <Table>
              <Thead>
                <Tr>
                  <Th bg="blue.500" color="white" fontSize="16px">
                    Contractor ID
                  </Th>
                  <Th bg="blue.500" color="white" fontSize="16px">
                    Company Name
                  </Th>
                  <Th bg="blue.500" color="white" fontSize="16px">
                    Contractor Name
                  </Th>
                  <Th bg="blue.500" color="white" fontSize="16px">
                    Contact
                  </Th>
                  <Th bg="blue.500" color="white" fontSize="16px">
                    Email
                  </Th>
                  <Th bg="blue.500" color="white" fontSize="16px">
                    Address
                  </Th>
                  <Th bg="blue.500" color="white" fontSize="16px">
                    City
                  </Th>
                  <Th bg="blue.500" color="white" fontSize="16px">
                    State
                  </Th>
                  <Th bg="blue.500" color="white" fontSize="16px">
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {contractorData.map((contractor) => (
                  <Tr key={contractor.id}>
                    <Td>{contractor.id}</Td>
                    <Td>{contractor.companyName}</Td>
                    <Td>{contractor.contractorName}</Td>
                    <Td>{contractor.contact}</Td>
                    <Td>{contractor.emailid}</Td>
                    <Td>{contractor.address}</Td>
                    <Td>{contractor.city}</Td>
                    <Td>{contractor.state}</Td>
                    <Td>
                      <HStack>
                        <Button
                          colorScheme="teal"
                          onClick={() => {
                            setIsModalOpen(true);
                            setModalData(contractor.id);
                            setEditId(contractor.id);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={() => handleDelete(contractor.id)}
                        >
                          Delete
                        </Button>
                        <DeleteConfirmationDialog
                          isOpen={isDeleteDialogOpen}
                          onClose={() => setIsDeleteDialogOpen(false)}
                          onConfirm={onDelete}
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
              <ModalHeader>Edit Block</ModalHeader>
              <ModalCloseButton />
              <form onSubmit={handleEditPlotSubmit}>
                <ModalBody> */}
      {/*   <FormControl mb={4}>
                <FormLabel>Contractor ID</FormLabel>
                <Input
                  type="number"
                  name="plotNo"
                  id="mi1"
                  disabled
                />
              </FormControl> */}
      {/* <FormControl mb={4}>
                    <FormLabel>Company Name</FormLabel>
                    <Input type="text" name="areaSqft" id="mi2" required />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Contractor Name</FormLabel>
                    <Input type="text" name="areaSqft" id="mi3" required />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Contact</FormLabel>
                    <Input type="text" name="areaSqmt" id="mi4" required />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Email</FormLabel>
                    <Input type="text" name="ratePerSqft" id="mi5" required />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Address</FormLabel>
                    <Input type="text" name="areaSqft" id="mi6" required />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>City</FormLabel>
                    <Input type="text" name="areaSqft" id="mi7" required />
                  </FormControl>
                  <FormControl colSpan={1} isRequired>
                    <FormLabel>State</FormLabel>
                    <Select
                      name="state"
                      id="mi8"
                      value={editFormData.state}
                      onChange={handleEditPlotChange}
                      placeholder="Select State"
                    >
                      {states.map((state) => {
                        const [code, name] = state.split("|");
                        return (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        );
                      })}
                    </Select>
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" type="button" onClick={editData}>
                    Save Changes
                  </Button>
                  <Button onClick={() => setIsModalOpen(false)} ml={4}>
                    Cancel
                  </Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        </Stack>
      </Container> */}
    </>
  );
};

export default AddContractor;

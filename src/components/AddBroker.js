import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Center,
  Heading,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
} from "@chakra-ui/react";

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

const AddBroker = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    brokerName: "",
    contact: "",
    email: "",
    address: "",
    city: "",
    state: "",
  });

  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic for form submission
    console.log("Form Data:", formData);
  };
  const onAdd = async () => {
    const url = "http://localhost/backend_lms/setQuery.php";
    // const url = "http://localhost/backend_lms/setQuery.php";
    let query =
      "INSERT INTO `broker` (`id`, `companyName`, `brokerName`, `contact`, `emailid`, `address`, `city`, `state`) VALUES (NULL, '" +
      formData.companyName +
      "', '" +
      formData.brokerName +
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
        title: "Broker added successfully!",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });

      // Clear the form data after successful submission
      setFormData({
        companyName: "",
        brokerName: "",
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

  return (
    <Box p={4} width="100%" margin="auto">
      <Center pb={8}>
        <Heading>Add Broker</Heading>
      </Center>
      <form onSubmit={handleSubmit}>
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <FormControl colSpan={3} isRequired>
            <FormLabel>Company Name</FormLabel>
            <Input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl colSpan={3} isRequired>
            <FormLabel>Broker Name</FormLabel>
            <Input
              type="text"
              name="brokerName"
              value={formData.brokerName}
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
            <FormLabel>Email</FormLabel>
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
        </Grid>
        <Button colorScheme="blue" type="submit" mt={8} onClick={onAdd}>
          Add Broker
        </Button>
      </form>
    </Box>
  );
};

export default AddBroker;

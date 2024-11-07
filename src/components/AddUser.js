import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Grid,
  GridItem,
  Center,
  Heading,
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
const AddUser = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    confirmPassword: "",
    userRights: "",
    userName: "",
    userContact: "",
    userEmail: "",
    userAddress: "",
    userCity: "",
    userState: "",
    userStatus:"active"
  });
  const passwordMatch = formData.password === formData.confirmPassword;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onAddUser = async (e) => {
    e.preventDefault();

    // Validate the password match
    if (!passwordMatch) {
      // You can handle the password mismatch here (e.g., show an error message)
      toast({
        title: "Error",
        description: "Passwords do not match.",
        status: "error",
        position: "top-right",
      });

      return;
    }

    // Prepare the data for submission using FormData
    const formDataObject = new FormData();
    formDataObject.append("userId", formData.userId);
    formDataObject.append("password", formData.password);
    formDataObject.append("userRights", formData.userRights);
    formDataObject.append("userName", formData.userName);
    formDataObject.append("userContact", formData.userContact);
    formDataObject.append("userEmail", formData.userEmail);
    formDataObject.append("userAddress", formData.userAddress);
    formDataObject.append("userCity", formData.userCity);
    formDataObject.append("userState", formData.userState);
    formDataObject.append("userStatus", formData.userStatus);

    // Add your logic for making an API request to add the user
    try {
    
      const response = await fetch("http://localhost/backend_lms/adduser.php", {
        method: "POST",
        body: formDataObject,
      });

      const result = await response.json();

      if (result.status === "success") {
        // Handle success, e.g., show a success message
        toast({
          title: "Success",
          description: "User added successfully",
          status: "success",
          position: "top-right",
        });

        // Optionally, you can reset the form after successful submission
        setFormData({
          userId: "",
          password: "",
          confirmPassword: "",
          userRights: "",
          userName: "",
          userContact: "",
          userEmail: "",
          userAddress: "",
          userCity: "",
          userState: "",
        });
      } else {
        // Handle error, e.g., show an error message
        console.error("Error adding user:", result.message);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error adding user:", error);
    }
  };

  return (
    <Box p={4} width="100%" margin="auto">
      <Center pb={8}>
        <Heading fontSize={"25px"}>Add User </Heading>
      </Center>
      <form onSubmit={onAddUser}>
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          <GridItem colSpan={1}>
            <FormControl isRequired>
              <FormLabel> ID (Mandatory)</FormLabel>
              <Input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={1}>
            <FormControl isRequired>
              <FormLabel>Password (Mandatory)</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                borderColor={passwordMatch ? "green " : "red "}
                borderWidth={passwordMatch ? "2px" : "2px"}
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={1}>
            <FormControl isRequired>
              <FormLabel>Confirm Password (Mandatory)</FormLabel>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                borderColor={passwordMatch ? "green" : "red"}
                borderWidth={passwordMatch ? "2px" : "2px"}
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={1}>
            <FormControl isRequired>
              <FormLabel> Rights (Admin/User) (Mandatory)</FormLabel>
              <Select
                name="userRights"
                value={formData.userRights}
                onChange={handleChange}
                placeholder="Please Select Rights"
              >
                <option value=" Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Buyer">Buyer</option>
                <option value="Contractor">Contractor</option>
                <option value="Broker">Broker</option>


              </Select>
            </FormControl>
          </GridItem>

          <GridItem colSpan={1}>
            <FormControl isRequired>
              <FormLabel> Name (Mandatory)</FormLabel>
              <Input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={1}>
            <FormControl>
              <FormLabel> Contact Number</FormLabel>
              <Input
                type="text"
                name="userContact"
                value={formData.userContact}
                onChange={handleChange}
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={1}>
            <FormControl>
              <FormLabel> Email ID</FormLabel>
              <Input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl>
              <FormLabel>State</FormLabel>
              <Select
                name="userState"
                value={formData.userState}
                onChange={handleChange}
                placement="bottom-start"
              >
                <option value="" disabled>
                  Select State
                </option>
                {states.map((state) => {
                  const [code, name] = state.split("|");
                  return (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl>
              <FormLabel> Address</FormLabel>
              <Input
                type="text"
                name="userAddress"
                value={formData.userAddress}
                onChange={handleChange}
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={1}>
            <FormControl>
              <FormLabel> City</FormLabel>
              <Input
                type="text"
                name="userCity"
                value={formData.userCity}
                onChange={handleChange}
              />
            </FormControl>
          </GridItem>

          <Button colSpan={3} colorScheme="blue" type="submit" mt={8}>
            Add User
          </Button>
        </Grid>
      </form>
    </Box>
  );
};

export default AddUser;

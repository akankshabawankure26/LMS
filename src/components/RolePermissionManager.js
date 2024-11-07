
import React, { useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Checkbox, Button } from "@chakra-ui/react";
import axios from "axios";
const RolePermissionManager = () => {

  const [permissions, setPermissions] = useState({
    addProject: { managerView: false, managerEdit: false, managerDelete: false, userView: false, userEdit: false, userDelete: false },
    addBlock: { managerView: false, managerEdit: false, managerDelete: false, userView: false, userEdit: false, userDelete: false },
    addPlot: { managerView: false, managerEdit: false, managerDelete: false, userView: false, userEdit: false, userDelete: false },
    masterInput: { managerView: false, managerEdit: false, managerDelete: false, userView: false, userEdit: false, userDelete: false },
    bookingStatus: { managerView: false, managerEdit: false, managerDelete: false, userView: false, userEdit: false, userDelete: false },
    onHoldPlots: { managerView: false, managerEdit: false, managerDelete: false, userView: false, userEdit: false, userDelete: false },
    paymentApprove: { managerView: false, managerEdit: false, managerDelete: false, userView: false, userEdit: false, userDelete: false },
    paymentAdd: { managerView: false, managerEdit: false, managerDelete: false, userView: false, userEdit: false, userDelete: false },
  });

  const handleCheckboxChange = (action, role, permissionType) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [action]: {
        ...prevPermissions[action],
        [`${role}${permissionType}`]: !prevPermissions[action][`${role}${permissionType}`],
      },
    }));
  };

  const handleSave = async () => {
    const url = "http://localhost/backend_lms/savepermission.php"; // Your backend PHP file
    try {
      // Post the permissions data to the backend
      console.log("Before response");
      const response = await axios.post(url, { permissions });

      // Handle the response from PHP
      if (response.data.status === "success") {
        console.log("Success:", response.data.message);
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      console.error("Error saving permissions:", error); // Handle any errors
    }
    console.log("after try-catch");
  };


  return (
    <Box width="80%" margin="auto" mt={5}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Action</Th>
            <Th colSpan={3} paddingLeft={"200px"}>Manager</Th>
            <Th colSpan={3} paddingLeft={"200px"}>User</Th>
          </Tr>
          <Tr>
            <Th></Th>
            <Th isNumeric pr={"8px"}>View</Th>
            <Th isNumeric>Edit</Th>
            <Th isNumeric pr={"10px"}>Delete</Th>
            <Th isNumeric pr={"8px"}>View</Th>
            <Th isNumeric>Edit</Th>
            <Th isNumeric pr={"10px"}>Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(permissions).map((action) => (
            <Tr key={action}>
              <Td>{action}</Td>
              <Td isNumeric>
                <Checkbox
                  isChecked={permissions[action].managerView}
                  onChange={() => handleCheckboxChange(action, "manager", "View")}
                />
              </Td>
              <Td isNumeric>
                <Checkbox
                  isChecked={permissions[action].managerEdit}
                  onChange={() => handleCheckboxChange(action, "manager", "Edit")}
                />
              </Td>
              <Td isNumeric>
                <Checkbox
                  isChecked={permissions[action].managerDelete}
                  onChange={() => handleCheckboxChange(action, "manager", "Delete")}
                />
              </Td>
              <Td isNumeric>
                <Checkbox
                  isChecked={permissions[action].userView}
                  onChange={() => handleCheckboxChange(action, "user", "View")}
                />
              </Td>
              <Td isNumeric>
                <Checkbox
                  isChecked={permissions[action].userEdit}
                  onChange={() => handleCheckboxChange(action, "user", "Edit")}
                />
              </Td>
              <Td isNumeric>
                <Checkbox
                  isChecked={permissions[action].userDelete}
                  onChange={() => handleCheckboxChange(action, "user", "Delete")}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>

      </Table>

      <Button mt={4} colorScheme="teal" onClick={handleSave}>
        Save
      </Button>
    </Box>
  );
};

export default RolePermissionManager;

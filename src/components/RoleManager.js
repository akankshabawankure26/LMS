import Nav from '../Nav';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Center,
    Text,
    Button,
    Input,
    FormControl,
    FormLabel,
    useToast,
    Flex
} from "@chakra-ui/react";
import axios from 'axios';
import { useEffect, useState } from "react";

function RoleManager() {
    const [roles, setRoles] = useState([]);
    const [newRoleName, setNewRoleName] = useState('');
    const [editRoleName, setEditRoleName] = useState('');
    const [editRoleId, setEditRoleId] = useState(null);
    const toast = useToast();

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await axios.get('http://localhost/backend_lms/getroles.php');
            // Ensure roles data is an array
            if (Array.isArray(response.data)) {
                setRoles(response.data);
            } else {
                console.error("Unexpected roles data format:", response.data);
                setRoles([]); 
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setRoles([]); // Clear roles on error to prevent map error
            toast({
                title: "Error",
                description: "Failed to fetch roles.",
                status: "error",
            });
        }
    };

    const handleCreateRole = async () => {
        try {
            const response = await axios.post('http://localhost/backend_lms/create_role.php', 
                { roleName: newRoleName },
                { headers: { 'Content-Type': 'application/json' } }
            );
            if (response.data.status === "success") {
                toast({
                    title: "Role Created",
                    description: "New role has been created successfully.",
                    status: "success",
                });
                setNewRoleName('');
                fetchRoles();
            }
        } catch (error) {
            console.error("Error creating role:", error);
            toast({
                title: "Error",
                description: "Failed to create role.",
                status: "error",
            });
        }
    };

    const handleUpdateRole = async () => {
        try {
            const response = await axios.post('http://localhost/backend_lms/updaterole.php', {
                roleId: editRoleId,
                roleName: editRoleName
            });
            if (response.data.status === "success") {
                toast({
                    title: "Role Updated",
                    description: "Role has been updated successfully.",
                    status: "success",
                });
                setEditRoleName('');
                setEditRoleId(null);
                fetchRoles();
            }
        } catch (error) {
            console.error("Error updating role:", error);
            toast({
                title: "Error",
                description: "Failed to update role.",
                status: "error",
            });
        }
    };

    const handleDeleteRole = async (roleId) => {
        try {
            const response = await axios.delete(`http://localhost/backend_lms/deleterole.php?roleId=${roleId}`);
            if (response.data.status === "success") {
                toast({
                    title: "Role Deleted",
                    description: "Role has been deleted successfully.",
                    status: "success",
                });
                fetchRoles();
            }
        } catch (error) {
            console.error("Error deleting role:", error);
            toast({
                title: "Error",
                description: "Failed to delete role.",
                status: "error",
            });
        }
    };

    return (
        <div>
            <Center>
                <Text fontSize="30px" fontWeight="600" p="20px">
                    Role Manager
                </Text>
            </Center>

            <Flex direction="column" align="center" p="20px">
                <FormControl mb="4">
                    <FormLabel>Create New Role</FormLabel>
                    <Input
                        placeholder="Role Name"
                        id='roleName'
                        name='roleName'
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                    />
                    <Button mt="2" colorScheme="teal" onClick={handleCreateRole}>
                        Create Role
                    </Button>
                </FormControl>

                {editRoleId && (
                    <FormControl mb="4">
                        <FormLabel>Update Role</FormLabel>
                        <Input
                            placeholder="Role Name"
                            value={editRoleName}
                            onChange={(e) => setEditRoleName(e.target.value)}
                        />
                        <Button mt="2" colorScheme="teal" onClick={handleUpdateRole}>
                            Update Role
                        </Button>
                    </FormControl>
                )}
            </Flex>

            <Table variant="simple" w={"100%"} colorScheme="blue">
                <Thead>
                    <Tr bg="gray.800">
                        <Th color="white">ID</Th>
                        <Th color="white">Role Name</Th>
                        <Th color="white">Actions</Th>
                    </Tr>
                </Thead>

                <Tbody>
                    {roles.length > 0 ? (
                        roles.map((role) => (
                            <Tr key={role.id}>
                                <Td>{role.id}</Td>
                                <Td>{role.role_name}</Td>
                                <Td>
                                    <Button
                                        colorScheme="yellow"
                                        onClick={() => {
                                            setEditRoleId(role.id);
                                            setEditRoleName(role.role_name);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        colorScheme="red"
                                        ml="2"
                                        onClick={() => handleDeleteRole(role.id)}
                                    >
                                        Delete
                                    </Button>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan="3">
                                <Center>No roles available</Center>
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
        </div>
    );
}

export default RoleManager;

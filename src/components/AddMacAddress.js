


import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react';

const AddMacAddress = () => {
    const [macAddress, setMacAddress] = useState('');
    const toast = useToast(); // Toast notification for user feedback

    const handleInputChange = (e) => {
        setMacAddress(e.target.value);
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('macAddress', macAddress);
        
        try {
            const response = await fetch('http://localhost/backend_lms/savemacaddress.php', {
                method: 'POST',
                body: formData, 
            });
    
            const result = await response.json();
    
            if (result.status === 'success') {
                toast({
                    title: "Success",
                    description: "Mac Address saved successfully",
                    status: "success",
                    position: "top-right",
                  });
            } else {
                //console.error("Error adding user:", result.message);
                toast({
                    title: "Success",
                    description: "Mac Address already present in database..",
                    status: "error",
                    position: "top-right",
                  });
            }
        } catch (error) {
            toast({
                title: 'Error Saving MAC Address.',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            //console.error("Error adding user:", error);
        }
    };

    return (
        <Box width="500px" height="200px" margin="auto" mt={100} p={5} mb={200} borderWidth="1px" borderRadius="lg">
            <FormControl id="mac-address" isRequired>
                <FormLabel>Enter MAC Address</FormLabel>
                <Input
                    type="text"
                    mt={4}
                    value={macAddress}
                    name='macAddress'
                    onChange={handleInputChange}
                    placeholder="00-00-00-00-00-00"
                />
            </FormControl>
            <Button mt={8} colorScheme="teal" onClick={handleSave}>
                Save
            </Button>
        </Box>
    );
};

export default AddMacAddress;

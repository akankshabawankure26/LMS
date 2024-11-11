import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Icon,
  IconButton,
  useDisclosure,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";
import { RiFlashlightFill } from "react-icons/ri";
import ProfileDropdown from "./components/ProfileDropdown";

const Nav = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("white", "gray.800");
  const [userRight, setUserRight] = useState(localStorage.getItem("userRight"));

  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const handleLogoutClick = () => {
    handleLogout(); // Ensure that handleLogout is called when the button is clicked
    navigate("/admin");
  };

  return (
    <Box
      px={4}
      bg={bgColor}
      borderBottom={"gray 1px solid "}
    // position={"fixed"}
    // top={0}
    // zIndex={100}
    >
      <Flex h={16} alignItems="center" mx="auto">
        <HStack spacing={4} alignItems="center">
          <Icon as={RiFlashlightFill} h={8} w={8} />
          <Text fontSize="xl" fontWeight="bold">
            LMS
          </Text>
        </HStack>

        <HStack
          spacing={8}
          alignItems="center"
          justifyContent="center" // Center the menu items
        >
          <HStack
            as="nav"
            spacing={6}
            d={{ base: "none", md: "flex" }}
            alignItems="center"
            justifyContent="center" // Center the menu items
          >
            <Text
              fontWeight={"600"}
              mr={"15px"}
              cursor={"pointer"}
              as={Link}
              to="/"
            >
              DashBoard
            </Text>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FaChevronDown />}
                bg="transparent"
              >
                Master
              </MenuButton>
              <MenuList>
                {(userRight !== "SalesPerson" && userRight !== "Manager") && (
                  <>
                    <MenuItem as={Link} to="/addproject">
                      Add Projects
                    </MenuItem>
                    <MenuItem as={Link} to="/addblock">
                      Add Block
                    </MenuItem>
                    <MenuItem as={Link} to="/addplot">
                      Add Plot
                    </MenuItem>
                  </>
                )}
                <MenuItem as={Link} to="/masterinputs">
                  Master Inputs
                </MenuItem>
              </MenuList>
            </Menu>


            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FaChevronDown />}
                bg={"transparent"}
              >
                Booking
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/bookingstatus">
                  Booking Status
                </MenuItem >
                <MenuItem as={Link} to="/holdedplots" >
                  On-Hold Plots
                </MenuItem>
                <MenuItem as={Link} to="/newbooking">
                  New Booking
                </MenuItem>
                <MenuItem as={Link} to="/PaymentTransaction">
                  Payment Transaction
                </MenuItem>
              </MenuList>
            </Menu>



            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FaChevronDown />}
                bg={"transparent"}
              >
                Report
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/bookinglist">
                  Booking List
                </MenuItem>
                <MenuItem as={Link} to="/transactionreport">
                  Transaction Report
                </MenuItem>
                <MenuItem
                  as={Link}
                  to="/balancereport
                "
                >
                  Balance Report
                </MenuItem>
                <MenuItem as={Link} to="/historicalreport">
                  Historical Transaction Report
                </MenuItem>
              </MenuList>
            </Menu>
            {(userRight !== "SalesPerson" && userRight !== "Manager") && (
              <>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<FaChevronDown />}
                    bg={"transparent"}
                  >
                    User
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={Link} to="/adduser">
                      Add User
                    </MenuItem>
                    <MenuItem as={Link} to="/userlist">
                      User List
                    </MenuItem>
                    <MenuItem as={Link} to="/rolemanager">User Role</MenuItem>
                    <MenuItem as={Link} to="/rolepermission">User Role Permission</MenuItem>
                    <MenuItem as={Link} to="/addmacaddress">Add MAC Address</MenuItem>
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<FaChevronDown />}
                    bg={"transparent"}
                  >
                    Contractor
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={Link} to="/addcontractor">
                      Add Contractor
                    </MenuItem>
                    <MenuItem as={Link} to="/contractorlist">
                      Contractor List
                    </MenuItem>
                    <MenuItem as={Link} to="/contractorledger">
                      {" "}
                      Contractor Ledger
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<FaChevronDown />}
                    bg={"transparent"}
                  >
                    Broker
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={Link} to="/addbroker">
                      {" "}
                      Add Broker
                    </MenuItem>
                    <MenuItem as={Link} to="/brokerlist">
                      Broker List
                    </MenuItem>
                    <MenuItem as={Link} to="/brokerledger">
                      Broker Ledger
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            )}
            <Box>
              <Text fontWeight={"bold"}>Hello Admin</Text>
            </Box>
          </HStack>

          {/* Conditionally render the hamburger icon on mobile devices */}
          {isMobile && (
            <IconButton
              size="md"
              icon={isOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
              aria-label="Open Menu"
              d={{ base: "inherit", md: "none" }}
              onClick={isOpen ? onClose : onOpen}
            />
          )}
        </HStack>

        {/* Render the Logout button on the right side */}
        <ProfileDropdown handleLogout={handleLogout} />
      </Flex>

      {/* Mobile Screen Links */}
      {isOpen ? (
        <Box pb={4} d={{ base: "inherit", md: "none" }}>
          <Stack as="nav" spacing={2}></Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Nav;

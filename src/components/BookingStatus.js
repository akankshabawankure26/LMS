import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Box,
  Flex,
  Center,
  Text,
  Input,
  Button,
  Spinner,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Select,
  FormLabel,
  Heading,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const BookingStatus = () => {
  const [bookings, setBooking] = useState([]);
  const [temp, setTemp] = useState([]);
  const [status, setStatus] = useState([]);
  const [date, setDate] = useState([]);
  const [onholdPlot, setOnholdPlot] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState([]);
  const [selectedPlottype, setSelectedPlottype] = useState([]);
  const [selectedPlotstatus, setSelectedPlotstatus] = useState([]);
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");

  const [highlightedRow, setHighlightedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(null);
  const [totalArea, setTotalArea] = useState(0);
  const [totalAreamt, setTotalAreamt] = useState(0);
  const toast = useToast();

  const [formData, setFormData] = useState({
    customerName: "",
    contactNo: "",
    remarks: "",
    address: "",
  });

  const getDate = new Date();
  const day = getDate.getDate();
  const month = getDate.getMonth() + 1; // Months are zero-indexed, so January is 0
  const year = getDate.getFullYear();
  const TodayDate = `${day}/${month}/${year}`;

  // render no project function
  function initialFunction() {
    return (
      <>
        <Heading>No Project Selected</Heading>
      </>
    );
  }
  if (selectedProject.length > 0) {
    initialFunction();
  }

  const handleCheckboxChange = (value, state, setter) => {
    if (state.includes(value)) {
      setter(state.filter((item) => item !== value));
    } else {
      setter([...state, value]);
    }
  };

  const loadBooking = async () => {
    let query = "SELECT * FROM booking where IsActive='1';";
    const url = "http://localhost/backend_lms/getQuery.php";
    // const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          // setStatus(response.data.phpresult);
          const formattedData = response.data.phpresult.map((item) => {
            return {
              ...item,
              bookingDate: new Date(item.bookingDate).toLocaleDateString(
                "en-GB"
              ),
            };
          });
          setStatus(formattedData);
        }
      }
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  const loadDate = async () => {
    let query = "SELECT registryDate FROM registry;";

    // const url = "https://lkgexcel.com/backend/getQuery.php";
    const url = "http://localhost/backend_lms/getQuery.php";

    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        const formattedData = response.data.phpresult.map((item) => {
          return {
            ...item,
            registryDate: new Date(item.registryDate).toLocaleDateString(
              "en-GB"
            ),
          };
        });
        setDate(formattedData);
      }
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  const fetchData = async () => {
  
    try {
      const response = await axios.get(
        "http://localhost/backend_lms/getplot.php"
        // "https://lkgexcel.com/backend/getplot.php"
      );
      setBooking(response.data);
      setTemp(response.data);
      setCount(filteredBookings.length);
      // console.log("booking", response.data)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching plot data:", error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${day}${month}${year}`;
  };

  const formatDate1 = (prop) => {
    console.log("this is props", prop);
    const [year, month, day] = prop.split("/");
    return `${day}${month}${year}`;
  };

  // Function to compare two objects (assuming they match by id)
  const objectsMatch = (obj1, obj2) =>
    obj1.projectName === obj2.projectName &&
    obj1.blockName === obj2.blockName &&
    obj1.plotNo === obj2.plotNo;

  const handleFind = () => {
    let fromDate = Number(formatDate(selectedFromDate));
    let toDate = Number(formatDate(selectedToDate));

    console.log("*", fromDate);
    console.log("*", toDate);

    // Modify the array using map
    const modifyData = status.map((el) => ({
      ...el,
      bookingDate: Number(formatDate1(el.bookingDate)),
    }));
    console.log(modifyData);
    const newData = modifyData.filter(
      (el) => fromDate <= +el.bookingDate && toDate >= +el.bookingDate
    );
    console.log("this is new data", newData);

    //  setBooking(newData)
    // let finalDate = newData.filter((item)=> status.includes(item.id))
    // console.log("finalDate",finalDate);

    // Filter array1 to get objects that match in array2
    const filteredArray = temp.filter((obj1) =>
      newData.some((obj2) => objectsMatch(obj1, obj2))
    );
    console.log("finalDate", filteredArray);
    setBooking(filteredArray);
    setSelectedToDate("");
    setSelectedFromDate("");
  };

  const getUniqueValues = (key) => {
    return [...new Set(bookings.map((item) => item[key]))]; //
  };

  const projectOptions = getUniqueValues("projectName");
  const blockOptions = getUniqueValues("blockName");
  const plotOptions = getUniqueValues("plotNo");
  const plotType = getUniqueValues("plotType");
  const plotStatus = getUniqueValues("plotStatus");

  const filteredBookings = bookings.filter(
    (item) =>
      (!selectedProject.length ||
        selectedProject.includes("Select All") ||
        selectedProject.includes(item.projectName)) &&
      (!selectedBlock.length ||
        selectedBlock.includes("Select All") ||
        selectedBlock.includes(item.blockName)) &&
      (!selectedPlot.length ||
        selectedPlot.includes("Select All") ||
        selectedPlot.includes(item.plotNo)) &&
      (!selectedPlottype.length ||
        selectedPlottype.includes("Select All") ||
        selectedPlottype.includes(item.plotType)) &&
      (!selectedPlotstatus.length ||
        selectedPlotstatus.includes("Select All") ||
        selectedPlotstatus.includes(item.plotStatus))
  );

  const clearFilters = () => {
    fetchData();
    setSelectedFromDate("");
    setSelectedToDate("");
    setSelectedProject([]);
    setSelectedBlock([]);
    setSelectedPlot([]);
    setSelectedPlottype([]);
    setSelectedPlotstatus([]);
    setHighlightedRow(null);
  };

  useEffect(() => {
    fetchData();
    loadBooking();
    loadDate();
    setSelectedFromDate("");
    setSelectedToDate("");
  }, []);
  console.log("booking", bookings);

  useEffect(() => {
    const totalSQFT = filteredBookings.reduce((accumulator, currentItem) => {
      return accumulator + Number(currentItem.areaSqft);
    }, 0);
    setTotalArea(totalSQFT);
    const totalSMT = filteredBookings.reduce((accumulator, currentItem) => {
      return accumulator + Number(currentItem.areaSqmt);
    }, 0);
    setTotalAreamt(totalSMT);
  }, [filteredBookings]);

  // console.log(filteredBookings[1])
  console.log(filteredBookings[highlightedRow]);
  let data = filteredBookings[highlightedRow];

  const handleOnHold = (props) => {
    onOpen();
    setOnholdPlot(props);
  };

  const handleRemain = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditPlotSubmit = async () => {
    // const url = "https://lkgexcel.com/backend/editplot.php";
    const url = "http://localhost/backend_lms/editplot.php";
    const formData1 = new FormData();

    formData1.append("id", onholdPlot.id);
    formData1.append("projectName", onholdPlot.projectName);
    formData1.append("blockName", onholdPlot.blockName);
    formData1.append("plotNo", onholdPlot.plotNo);
    formData1.append("areaSqft", onholdPlot.areaSqft);
    formData1.append("areaSqmt", onholdPlot.areaSqmt);
    formData1.append("ratePerSqft", onholdPlot.ratePerSqft);
    formData1.append("plotType", onholdPlot.plotType);
    formData1.append("plotStatus", "Hold");

    try {
      const response = await axios.post(url, formData1);

      if (response.data.status === "success") {
        console.log("Plot updated successfully:", response.data.message);

        toast({
          title: "Plot updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchData();
      } else {
        console.error("Error updating plot:", response);

        toast({
          title: "Error updating plot",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error in handleEditPlotSubmit:", error);

      toast({
        title: "Error updating plot",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // **********************************************************************************************

  const sendDataToBackend = async (e) => {
    e.preventDefault();

    const mergeData = {
      ...formData,
      ...onholdPlot,
      ...{ TodayDate },
      plotStatus: "Hold",
    };
    console.log("this is merge data", mergeData);

    try {
      const response = await axios.post(
        "http://localhost/backend_lms/addhold.php",
        mergeData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status != "error") {
        console.log("this is response", response);

        handleEditPlotSubmit();
        onClose();
      } else {
        console.log("this is response", response);
        toast({
          title: "Something wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      }
    } catch (error) {
      console.log("error occur to fetch", error);
    }
  };

  console.log("hey pavan this is filteredBookings", filteredBookings);
  console.log("hey pavan this is status", status);

  //****************************************************************************************************

  return (
    <>
      <Center>
        <Text fontSize="30px" fontWeight="600" p="20px">
          Booking Status
        </Text>
      </Center>
      <Box mb={4} boxShadow={"md"} p={2}>
        <Flex justifyContent={"space-evenly"}>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select Projects
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Checkbox
                  isChecked={selectedProject.includes("Select All")}
                  onChange={() =>
                    handleCheckboxChange(
                      "Select All",
                      selectedProject,
                      setSelectedProject
                    )
                  }
                >
                  Select All
                </Checkbox>
              </MenuItem>
              {projectOptions.map((project) => (
                <MenuItem key={project}>
                  <Checkbox
                    isChecked={selectedProject.includes(project)}
                    onChange={() =>
                      handleCheckboxChange(
                        project,
                        selectedProject,
                        setSelectedProject
                      )
                    }
                  >
                    {project}
                  </Checkbox>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select Blocks
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Checkbox
                  isChecked={selectedBlock.includes("Select All")}
                  onChange={() =>
                    handleCheckboxChange(
                      "Select All",
                      selectedBlock,
                      setSelectedBlock
                    )
                  }
                >
                  Select All
                </Checkbox>
              </MenuItem>
              {blockOptions.map((block) => (
                <MenuItem key={block}>
                  <Checkbox
                    isChecked={selectedBlock.includes(block)}
                    onChange={() =>
                      handleCheckboxChange(
                        block,
                        selectedBlock,
                        setSelectedBlock
                      )
                    }
                  >
                    {block}
                  </Checkbox>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* plot no filter */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select Plots
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Checkbox
                  isChecked={selectedPlot.includes("Select All")}
                  onChange={() =>
                    handleCheckboxChange(
                      "Select All",
                      selectedPlot,
                      setSelectedPlot
                    )
                  }
                >
                  Select All
                </Checkbox>
              </MenuItem>
              {plotOptions.map((plot) => (
                <MenuItem key={plot}>
                  <Checkbox
                    isChecked={selectedPlot.includes(plot)}
                    onChange={() =>
                      handleCheckboxChange(plot, selectedPlot, setSelectedPlot)
                    }
                  >
                    {plot}
                  </Checkbox>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          {/* plot type filter */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select Plots type
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Checkbox
                  isChecked={selectedPlottype.includes("Select All")}
                  onChange={() =>
                    handleCheckboxChange(
                      "Select All",
                      selectedPlottype,
                      setSelectedPlottype
                    )
                  }
                >
                  Select All
                </Checkbox>
              </MenuItem>
              {plotType.map((plot) => (
                <MenuItem key={plot}>
                  <Checkbox
                    isChecked={selectedPlottype.includes(plot)}
                    onChange={() =>
                      handleCheckboxChange(
                        plot,
                        selectedPlottype,
                        setSelectedPlottype
                      )
                    }
                  >
                    {plot}
                  </Checkbox>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          {/* plot status filter */}

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Plots status
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Checkbox
                  isChecked={selectedPlotstatus.includes("Select All")}
                  onChange={() =>
                    handleCheckboxChange(
                      "Select All",
                      selectedPlotstatus,
                      setSelectedPlotstatus
                    )
                  }
                >
                  Select All
                </Checkbox>
              </MenuItem>
              {plotStatus.map((plot) => (
                <MenuItem key={plot}>
                  <Checkbox
                    isChecked={selectedPlotstatus.includes(plot)}
                    onChange={() =>
                      handleCheckboxChange(
                        plot,
                        selectedPlotstatus,
                        setSelectedPlotstatus
                      )
                    }
                  >
                    {plot}
                  </Checkbox>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Box display={"flex"}>
            <Text mt={2}>From:</Text>
            <Input
              type="date"
              placeholder="Search From Date"
              w={"auto"}
              ml={"2%"}
              value={selectedFromDate}
              onChange={(event) => setSelectedFromDate(event.target.value)}
            />
            <Text mt={2} ml={2}>
              To:
            </Text>
            <Input
              type="date"
              // value={selectedToDate}
              placeholder="Search to Date"
              w={"auto"}
              ml={"2%"}
              value={selectedToDate}
              onChange={(event) => setSelectedToDate(event.target.value)}
            />
            <Button onClick={handleFind}>Find</Button>
          </Box>

          <Button ml={2} onClick={clearFilters} colorScheme="red">
            Clear Filters
          </Button>
        </Flex>
      </Box>
      {loading ? (
        <Center>
          <Spinner
            size="xl"
            position={"relative"}
            top={"5rem"}
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
          />
        </Center>
      ) : !selectedProject.length > 0 ? (
        <Heading textAlign={"center"} position={"relative"} top={100}>
          Select Project first
        </Heading>
      ) : (
        <>
          {" "}
          <FormLabel fontWeight={700}>
            Total Booking : ({filteredBookings.length})
          </FormLabel>{" "}
          <Box w={"100%"}>
            <Table variant="simple" w={"100%"} colorScheme="blue">
              <Thead>
                <Tr bg="gray.800">
                  <Th color="white" bg={"white"}></Th>
                  <Th color="white" bg={"white"}></Th>
                  <Th color="white" bg={"white"}></Th>
                  <Th color="white" bg={"white"}></Th>
                  <Th color="white">{totalArea}</Th>
                  <Th color="white">{totalAreamt}</Th>
                </Tr>
              </Thead>

              <Thead>
                <Tr bg="gray.800">
                  <Th color="white">Sr No.</Th>
                  <Th color="white">ProjectName</Th>
                  <Th color="white">BlockName</Th>
                  <Th color="white">PlotNo.</Th>
                  <Th color="white">AreaSqft</Th>
                  <Th color="white">AreaSqmt</Th>
                  <Th color="white">PlotType</Th>
                  <Th color="white">PlotStatus</Th>
                  <Th color="white">BookingDate</Th>
                  <Th color="white">CustName</Th>
                  <Th color="white">CustNo.</Th>
                  <Th color="white">RegistryDate</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredBookings.map((plotItem, index) => (
                  <Tr
                    key={plotItem.id}
                    onClick={() => setHighlightedRow(index)}
                    style={{
                      background:
                        highlightedRow === index ? "#FFFAF0" : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <Td>{index + 1}</Td>
                    <Td fontWeight={700}>{plotItem.projectName}</Td>
                    <Td>{plotItem.blockName}</Td>
                    <Td>{plotItem.plotNo}</Td>
                    <Td>{plotItem.areaSqft}</Td>
                    <Td>{plotItem.areaSqmt}</Td>
                    <Td>{plotItem.plotType}</Td>

                    <Td>
                      {/* {plotItem.plotStatus !== "Booked" &&  <Badge
              colorScheme={
                plotItem.plotStatus === "Available"
                  ? "black"
                  : "gray"
              }
            >
              {plotItem.plotStatus}
            </Badge>}    */}
                      {plotItem.plotStatus === "Booked" && (
                        <Box display={"flex"} gap={1}>
                          {" "}
                          <FormLabel
                            bg={"yellow"}
                            textAlign={"center"}
                            p={"1px"}
                          >
                            {plotItem.plotStatus.toUpperCase()}
                          </FormLabel>{" "}
                          <Box>
                            {" "}
                            {plotItem.plotStatus === "Booked" ? (
                              <Button size={"xs"} colorScheme="blue">
                                AP
                              </Button>
                            ) : (
                              <Button size={"xs"} colorScheme="black">
                                AP
                              </Button>
                            )}
                          </Box>
                        </Box>
                      )}

                      {plotItem.plotStatus === "Available" && (
                        <Box>
                          {" "}
                          <FormLabel p={"1px"} display={"flex"} gap={1}>
                            {plotItem.plotStatus.toUpperCase()}{" "}
                            {plotItem.plotStatus === "Available" ? (
                              <Button
                                size={"xs"}
                                colorScheme="blue"
                                onClick={() => handleOnHold(plotItem)}
                              >
                                OH
                              </Button>
                            ) : (
                              <Button size={"xs"} colorScheme="black">
                                Change Available
                              </Button>
                            )}{" "}
                          </FormLabel>{" "}
                        </Box>
                      )}

                      {plotItem.plotStatus === "Hold" && (
                        <Box>
                          {" "}
                          <FormLabel p={"1px"} display={"flex"} gap={1}>
                            {plotItem.plotStatus.toUpperCase()}
                            {plotItem.plotStatus === "Hold" ? (
                              <Button size={"xs"} colorScheme="blue">
                                AV
                              </Button>
                            ) : (
                              <Button size={"xs"} colorScheme="black">
                                Change Available
                              </Button>
                            )}
                          </FormLabel>{" "}
                        </Box>
                      )}

                      {plotItem.plotStatus === "Registered" && (
                        <FormLabel bg={"green"} p={"1px"} color={"white"}>
                          {plotItem.plotStatus.toUpperCase()}
                        </FormLabel>
                      )}
                    </Td>

                    {status
                      .filter(
                        (book) =>
                          book.projectName === plotItem.projectName &&
                          book.blockName === plotItem.blockName &&
                          book.plotNo === plotItem.plotNo
                      )
                      .map((book) => (
                        <React.Fragment key={book.id}>
                          <Td>{book.bookingDate}</Td>
                          <Td>{book.customerName}</Td>
                          <Td>{book.customerContact}</Td>
                          <Td>{book.registryDate}</Td>
                        </React.Fragment>
                      ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </>
      )}

      {/* ************************************************************************ */}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add To Hold Plot</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display={"flex"} gap={4}>
              <FormControl mb={2}>
                <FormLabel>PROJECT NAME</FormLabel>
                <Input
                  placeholder="PROJECT NAME"
                  value={onholdPlot.projectName}
                />
              </FormControl>
              <FormControl mb={2}>
                <FormLabel>BLOCK NAME</FormLabel>
                <Input placeholder="BLOCK NAME" value={onholdPlot.blockName} />
              </FormControl>
            </Box>

            <Box display={"flex"} gap={4}>
              <FormControl mb={2}>
                <FormLabel>PLOT NAME</FormLabel>
                <Input placeholder="PLOT NAME" value={onholdPlot.plotNo} />
              </FormControl>
              <FormControl mb={2}>
                <FormLabel>AREASQFT</FormLabel>
                <Input placeholder="AREASQFT" value={onholdPlot.areaSqft} />
              </FormControl>
            </Box>
            <Box display={"flex"} gap={4}>
              <FormControl mb={2}>
                <FormLabel>AREASQMT</FormLabel>
                <Input placeholder="AREASQMT" value={onholdPlot.areaSqmt} />
              </FormControl>
              <FormControl mb={2}>
                <FormLabel>PLOTTYPE</FormLabel>
                <Input placeholder="PLOTTYPE" value={onholdPlot.plotType} />
              </FormControl>

              <FormControl mb={2}>
                <FormLabel>PLOTSTATUS</FormLabel>
                <Input placeholder="PLOTTYPE" value={onholdPlot.plotStatus} />
              </FormControl>
            </Box>
            <Box display={"flex"} gap={4}>
              <FormControl mb={2}>
                <FormLabel>ToDay Date</FormLabel>
                <Input
                  placeholder="Date"
                  value={TodayDate}
                  onChange={handleRemain}
                />
              </FormControl>
              <FormControl mb={2}>
                <FormLabel>CUSTOMER NAME</FormLabel>
                <Input
                  placeholder="Enter Your NAME"
                  name="customerName"
                  type="text"
                  onChange={handleRemain}
                  value={formData.customerName}
                />
              </FormControl>
            </Box>
            <Box display={"flex"} gap={4}>
              {/* <FormControl mb={2}>
              <FormLabel>ADDRESS</FormLabel>
              <Input placeholder="ADDRESS" />
            </FormControl> */}
              <FormControl mb={2}>
                <FormLabel>CONTACT NO.</FormLabel>
                <Input
                  placeholder="Enter Contect No."
                  name="contactNo"
                  type="text"
                  onChange={handleRemain}
                  value={formData.contactNo}
                />
              </FormControl>

              <FormControl mb={2}>
                <FormLabel>REMARKS</FormLabel>
                <Input
                  placeholder="Enter Remark"
                  name="remarks"
                  type="text"
                  onChange={handleRemain}
                  value={formData.remarks}
                />
              </FormControl>
            </Box>
            <Box display={"flex"} gap={4}>
              <FormControl mb={2}>
                <FormLabel>ADDRESS</FormLabel>
                <Input
                  placeholder="Address"
                  type="text"
                  name="address"
                  onChange={handleRemain}
                  value={formData.address}
                />
              </FormControl>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="green" onClick={sendDataToBackend}>
              Hold Plot
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );

  //   </>
  // );
};

export default BookingStatus;

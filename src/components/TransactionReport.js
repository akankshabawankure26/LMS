import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Center,
  Heading,
  Flex,
  Spinner,
  Checkbox,
  Tfoot,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Button,
  FormLabel,
  Text,
  Wrap,
  Radio,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { ChevronDownIcon } from "@chakra-ui/icons";
const TransactionReport = () => {
  const [transaction, setTransaction] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState([]);
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [filteredPlots, setFilteredPlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedStatusDate, setSelectedStatusDate] = useState(null);
  const [selectedStatusEndDate, setSelectedStatusEndDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(["All"]);
  const [talliedStatus, setTalliedStatus] = useState({});
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectPayment, setSelectPayment] = useState("All");
  const [selectTally, setSelectTally] = useState("All");
  const[render, setRender] =useState(false);
  const toast =useToast();



  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleCheckboxChange = (value, state, setter) => {
    if (state.includes(value)) {
      setter(state.filter((item) => item !== value));
    } else {
      setter([...state, value]);
    }
  };

  const handlePaymentChange = (method) => {
    setSelectPayment(method);
  };
  const handleTalliedChange = (method) => {
    setSelectTally(method);
  };

  const handleStatusChange = (status) => {
    if (selectedStatus.includes(status) && selectedStatus.length === 1) {
      setSelectedStatus(["All"]);
    } else if (selectedStatus.includes(status) && status !== "All") {
      setSelectedStatus(selectedStatus.filter((item) => item !== status));
    } else {
      if (selectedStatus.includes("All")) {
        setSelectedStatus([status]);
      } else if (status === "All") {
        setSelectedStatus(["All"]);
      } else {
        setSelectedStatus([...selectedStatus, status]);
      }
    }
  };

  const loadTransaction = async () => {
    let query = "SELECT * FROM transaction where status='Active' AND action =' ';";

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {

      //  console.log(response.data.phpresult)   
          setTransaction(response.data.phpresult);
          console.log("Tansactions : ", response.data.phpresult);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };
  useEffect(() => {
    loadTransaction();
  }, []);


  const getUniqueValues = (key) => {
    return [...new Set(transaction.map((item) => item[key]))];
  };

  const projectOptions = getUniqueValues("projectName");
  let temp = 0;

  const filteredBookings = transaction
    .filter((item) => {
      const itemDate = new Date(item.date).toISOString().split("T")[0];
      const statusDate = new Date(item.statusDate).toISOString().split("T")[0];

      return (
        (!selectedProject.length ||
          selectedProject.includes("Select All") ||
          selectedProject.includes(item.projectName)) &&
        (!selectedBlock.length ||
          selectedBlock.includes("Select All") ||
          selectedBlock.includes(item.blockName)) &&
        (!selectedPlot.length ||
          selectedPlot.includes("Select All") ||
          selectedPlot.includes(item.plotno)) &&
        (!selectedDate || itemDate >= selectedDate) &&
        (!selectedEndDate || itemDate <= selectedEndDate) &&
        (!selectedStatusDate || statusDate >= selectedStatusDate) &&
        (!selectedStatusEndDate || statusDate <= selectedStatusEndDate) &&
        (selectedStatus[0] === "All" ||
          selectedStatus.includes(item.transactionStatus)) &&
        (selectPayment === "All" || item.paymentType === selectPayment) &&
        (selectTally === "All" || item.TallyStatus === selectTally
        )
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const clearFilters = () => {
    setSelectedProject([]);
    setSelectedBlock([]);
    setSelectedPlot([]);
    setSelectedDate(null);
    setSelectedStatusDate(null);
    setSelectedStatus(["All"]);
    setSelectedEndDate(null);
    setSelectPayment("All");
    setSelectTally("All");
    setSelectedEndDate("");
    setSelectedStatusEndDate("");
  };
  useEffect(() => {
    const blocks = getUniqueValues("blockName").filter(
      (block) =>
        !selectedProject.length ||
        block === "Select All" ||
        transaction.some(
          (item) =>
            item.projectName === selectedProject[0] && item.blockName === block
        )
    );
    setFilteredBlocks([...blocks]);

    const plots = getUniqueValues("plotno").filter(
      (plot) =>
        !selectedProject.length ||
        plot === "Select All" ||
        transaction.some(
          (item) =>
            item.projectName === selectedProject[0] && item.plotno === plot
        )
    );
    setFilteredPlots([...plots]);
  }, [selectedProject, transaction]);

  const totalAmount = filteredBookings.reduce(
    (total, booking) => total + parseFloat(booking.amount),
    0
  );



const handleTally = async (props) => {
  console.log("tallydata", props);

  const url = "http://localhost/backend_lms/TransactionTally.php";
  const data = {
      id: props.id,
  };

  try {
      const response = await axios.post(url, data, {
          headers: {
              'Content-Type': 'application/json'
          }
      });

      if (response && response.data && response.data.status === "success") {
          console.log(" successfully:", response.data.message);
          toast({
              title: "Tally successfully!",
              status: "success",
              duration: 3000,
              isClosable: true,
          });
          setRender((prev) => !prev);
      } else {
          console.error("Error :", response.data.message);
          toast({
              title: "Error ",
              status: "error",
              duration: 3000,
              isClosable: true,
          });
      }
  } catch (error) {
      console.error("Error in handleTally:", error);
      toast({
          title: "Error",
          status: "error",
          duration: 3000,
          isClosable: true,
      });
  }
};
const handleNotTally = async (props) => {
  console.log("tallydata", props);

  const url = "http://localhost/backend_lms/ReUpdateTransactionTally.php";
  const formData = new FormData();

  formData.append("id", props.id);
  formData.append("TallyStatus", "Not Tallied");

  try {
    const response = await axios.post(url, formData);

    if (response && response.data && response.data.status === "success") {
      console.log(" successfully:", response.data.message);
      toast({
        title: " Not Tally successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setRender((prev) => !prev);
    } else {
      console.error("Error :", response.data.message);
      toast({
        title: "Error ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  } catch (error) {
    console.error("Error in handleEdit:", error);
    toast({
      title: "Error",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};

useEffect(() => {
  loadTransaction();
}, [render]);

const groupedEntries = filteredBookings.reduce((acc, entry) => {
  const key = `${entry.projectName}-${entry.blockName}-${entry.plotno}`;
  if (!acc[key]) {
    acc[key] = { ...entry, amount: Number(entry.amount) };
  } else {
    acc[key].amount += Number(entry.amount); 
  }
  return acc;
}, {});

const showdataOfTable = Object.values(groupedEntries);



  return (
    <>
      <Center>
        <Heading size={"md"}>Transaction Report</Heading>
      </Center>
      
      <Box maxW={"100%"} overflowX={"scroll"} marginTop={"2rem"}>
        <Flex justifyContent={"space-evenly"} p={"30px"} wrap={"wrap"}>
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
              {filteredBlocks.map((block) => (
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
              {filteredPlots.map((plot) => (
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
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select Status
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Checkbox
                  isChecked={selectedStatus.includes("All")}
                  onChange={() => handleStatusChange("All")}
                >
                  All
                </Checkbox>
              </MenuItem>
              <MenuItem>
                <Checkbox
                  isChecked={selectedStatus.includes("Pending")}
                  onChange={() => handleStatusChange("Pending")}
                >
                  Pending
                </Checkbox>
              </MenuItem>
              <MenuItem>
                <Checkbox
                  isChecked={selectedStatus.includes("Clear")}
                  onChange={() => handleStatusChange("Clear")}
                >
                  Clear
                </Checkbox>
              </MenuItem>
              <MenuItem>
                <Checkbox
                  isChecked={selectedStatus.includes("PDC")}
                  onChange={() => handleStatusChange("PDC")}
                >
                  PDC
                </Checkbox>
              </MenuItem>
              <MenuItem>
                <Checkbox
                  isChecked={selectedStatus.includes("Provisional")}
                  onChange={() => handleStatusChange("Provisional")}
                >
                  Provisional
                </Checkbox>
              </MenuItem>
              <MenuItem>
                <Checkbox
                  isChecked={selectedStatus.includes("Bounced")}
                  onChange={() => handleStatusChange("Bounced")}
                >
                  Bounced
                </Checkbox>
              </MenuItem>
            </MenuList>
          </Menu>
          {/* select paymeny filter start*/}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select Payment
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Radio
                  isChecked={selectPayment === "All"}
                  onChange={() => handlePaymentChange("All")}
                  flexGrow={1}
                >
                  All
                </Radio>
              </MenuItem>
              <MenuItem>
                <Radio
                  isChecked={selectPayment === "Bank"}
                  onChange={() => handlePaymentChange("Bank")}
                  flexGrow={1}
                >
                  Bank
                </Radio>
              </MenuItem>
              <MenuItem>
                <Radio
                  isChecked={selectPayment === "Cash"}
                  onChange={() => handlePaymentChange("Cash")}
                  flexGrow={1}
                >
                  Cash
                </Radio>
              </MenuItem>
            </MenuList>
          </Menu>


          {/* select tally filter start*/}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select Tally/Not
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Radio
                  isChecked={selectTally === "All"}
                  onChange={() => handleTalliedChange("All")}
                  flexGrow={1}
                >
                  All
                </Radio>
              </MenuItem>
              <MenuItem>
                <Radio
                  isChecked={selectTally === "tally"}
                  onChange={() => handleTalliedChange("Tallied")}
                  flexGrow={1}
                >
                  Tallied
                </Radio>
              </MenuItem>
              <MenuItem>
                <Radio
                  isChecked={selectTally === "Not Tallied"}
                  onChange={() => handleTalliedChange("Not Tallied")}
                  flexGrow={1}
                >
                  Not Tallied
                </Radio>
              </MenuItem>
            </MenuList>
          </Menu>
{/* select tally filter end*/}





          <Box display={"flex"}>
            <FormLabel
              textAlign={"center"}
              fontSize={"17px"}
              minWidth={"fit-content"}
              mt={"5px"}
            >
              Select Date:
            </FormLabel>
            <Box display="flex" alignItems="center">
              <Text marginRight="4px">From</Text>
              <Text marginRight="4px">:</Text>
            </Box>
            <Input
              type="date"
              id="date"
              value={selectedDate || ""}
              onChange={(e) => setSelectedDate(e.target.value)}
              _hover={{ cursor: "pointer" }}
            />
            <Box display={"flex"} alignItems={"center"}>
              <Text mr={"4px"}>To</Text>
              <Text mr={"4px"}>:</Text>
            </Box>
            <Input
              _hover={{ cursor: "pointer" }}
              type="date"
              value={selectedEndDate }
              onChange={(e) => setSelectedEndDate(e.target.value)}
            />
          </Box>
        </Flex>

        <Flex justifyContent={"center"}>
          <Box display={"flex"}>
            <FormLabel
              textAlign={"center"}
              fontSize={"17px"}
              minWidth={"fit-content"}
              mt={"5px"}
            >
              Select Status Date:
            </FormLabel>
            <Box display="flex" alignItems="center">
              <Text marginRight="4px">From</Text>
              <Text marginRight="4px">:</Text>
            </Box>
            <Input
              type="date"
              id="statusDate"
              value={selectedStatusDate || ""}
              onChange={(e) => setSelectedStatusDate(e.target.value)}
              _hover={{ cursor: "pointer" }}
            />
            <Box display="flex" alignItems="center">
              <Text marginRight="4px">To</Text>
              <Text marginRight="4px">:</Text>
            </Box>
            <Input
              type="date"
              value={selectedStatusEndDate }
              onChange={(e) => setSelectedStatusEndDate(e.target.value)}
              _hover={{ cursor: "pointer" }}
            />
          </Box>
          {
            /* In Not working conding */
            // <Menu>
            //   <MenuButton
            //     as={Button}
            //     rightIcon={<ChevronDownIcon />}
            //     marginLeft={"20px"}
            //   >
            //     Select Tallied/Not
            //   </MenuButton>
            //   <MenuList>
            //     <MenuItem>
            //       <Radio
            //         // isChecked={selectPayment === "All"}
            //         // onChange={() => handlePaymentChange("All")}
            //         flexGrow={1}
            //       >
            //         All
            //       </Radio>
            //     </MenuItem>
            //     <MenuItem>
            //       <Radio
            //         // isChecked={selectPayment === "Bank"}
            //         // onChange={() => handlePaymentChange("Bank")}
            //         flexGrow={1}
            //       >
            //         Tallied
            //       </Radio>
            //     </MenuItem>
            //     <MenuItem>
            //       <Radio
            //         // isChecked={selectPayment === "Cash"}
            //         // onChange={() => handlePaymentChange("Cash")}
            //         flexGrow={1}
            //       >
            //         Not Tallied
            //       </Radio>
            //     </MenuItem>
            //   </MenuList>
            // </Menu>




          }
          <Button ml={2} onClick={clearFilters} colorScheme="red">
            Clear Filters
          </Button>
        </Flex>
        {loading ? (
          <Flex align="center" justify="center" h="70vh">
            <Spinner
              size="xl"
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
            />
          </Flex>
        ) : (
          <>
            <Flex>
              <Box>
                <Text p={5} fontWeight={"bold"}>
                  Count :- {filteredBookings.length}
                </Text>
              </Box>
              <Box>
                <Text p={5} fontWeight={"bold"}>
                  Total Amount :- {totalAmount}
                </Text>
              </Box>
            </Flex>
            <Table variant="simple">
              <TableContainer>
                <Thead>

                  {selectedProject.length >0 && 
                  <Tr>
                    <Td colSpan={6}></Td>
                    <Td
                      textAlign="right"
                      border="1px solid black"
                      bg={"#121212"}
                      color={"white"}
                      fontWeight={"bold"}
                    >
                      {totalAmount}
                    </Td>

                    <Td colSpan={8}></Td>
                  </Tr>
                  }
                  <Tr border="1px solid black" bg={"#121212"}>
                    <Th border="1px solid white" color={"white"}>
                      {" "}
                      SrNo
                    </Th>
                    <Th
                      border="1px solid white"
                      color={"white"}
                      p={"18px"}
                      textAlign={"center"}
                    >
                      Project Name
                    </Th>
                    <Th
                      border="1px solid white"
                      color={"white"}
                      p={"18px"}
                      textAlign={"center"}
                    >
                      Block Name
                    </Th>
                    <Th
                      border="1px solid white"
                      color={"white"}
                      p={"18px"}
                      textAlign={"center"}
                    >
                      Plot No
                    </Th>
                    <Th
                      border="1px solid white"
                      color={"white"}
                      p={"18px"}
                      textAlign={"center"}
                    >
                      Date
                    </Th>
                    <Th
                      border="1px solid white"
                      color={"white"}
                      p={"18px"}
                      textAlign={"center"}
                    >
                      Payment Type
                    </Th>
                    <Th
                      border="1px solid white"
                      color={"white"}
                      p={"18px"}
                      textAlign={"center"}
                    >
                      Amount
                    </Th>
                    <Th
                      border="1px solid white"
                      color={"white"}
                      p={"18px"}
                      textAlign={"center"}
                    >
                      Bank Mode
                    </Th>

                    <Th
                      border="1px solid white"
                      color={"white"}
                      p={"18px"}
                      textAlign={"center"}
                    >
                      Cheq No
                    </Th>
                    <Th
                      border="1px solid white"
                      color={"white"}
                      p={"18px"}
                      textAlign={"center"}
                    >
                      Bank Name
                    </Th>
                    <Th
                      border="1px solid white"
                      color={"white"}
                      p={"18px"}
                      textAlign={"center"}
                    >
                      Transaction Status
                    </Th>
                    <Th
                      border="1px solid white"
                      color={"white"}
                      p={"18px"}
                      textAlign={"center"}
                    >
                      Status Date
                    </Th>
                    <Th
                      border="1px solid white"
                      color={"white"}
                      p={"18px"}
                      textAlign={"center"}
                    >
                      Remakrs
                    </Th>
                    <Th
                      border="1px solid white"
                      color={"white"}
                      p={"18px"}
                      textAlign={"center"}
                    >
                      Tallied / Not
                    </Th>
                    <Th
                      border="1px solid white"
                      color={"white"}
                      p={"18px"}
                      textAlign={"center"}
                    >
                      Tally
                    </Th>
                    {/* <Th border="1px solid white" color={"white"} p={"18px"}>
                      Amount
                    </Th> */}
                  </Tr>
                </Thead>
                <Tbody>
                  {selectedProject.length > 0 && showdataOfTable.map((data, index) => (
                    <Tr
                      key={data.srNo}
                      onClick={() => setSelectedRowIndex(index)}
                      bg={
                        selectedRowIndex === index ? "green.100" : "transparent"
                      }
                      height={"50px"}
                    >
                      <Td
                        border="1px solid black"
                        p={"10px"}
                        textAlign={"center"}
                      >
                        {index + 1}
                      </Td>
                      <Td border="1px solid black" p={"10px"}>
                        {data.projectName}
                      </Td>
                      <Td border="1px solid black" p={"10px"}>
                        {data.blockName}
                      </Td>
                      <Td border="1px solid black" p={"10px"}>
                        {data.plotno}
                      </Td>
                      <Td border="1px solid black" p={"10px"}>
                        {data.date ? new Date(data.date)
                                .toLocaleDateString("en-GB")
                                .replace(/\//g, "/")
                            : ""}
                      </Td>
                      <Td border="1px solid black" p={"10px"}>
                        {data.paymentType}
                      </Td>
                      <Td border="1px solid black" textAlign={"end"}>
                        {data.amount}
                      </Td>
                      <Td border="1px solid black" p={"10px"}>
                        {data.bankMode}
                      </Td>
                      <Td border="1px solid black" p={"10px"}>
                        {data.cheqNo}
                      </Td>
                      <Td border="1px solid black" p={"10px"}>
                        {data.bankName}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"10px"}
                        style={{
                          backgroundColor:
                            data.transactionStatus === "Clear"
                              ? "#22c35e"
                              : data.transactionStatus === "Provisional" ||
                                data.transactionStatus === "Pending" ||
                                data.transactionStatus === "PDC"
                              ? "#ECC94B"
                              : "inherit",
                          color:
                            data.transactionStatus === "Clear"
                              ? "white"
                              : data.transactionStatus === "Provisional" ||
                                data.transactionStatus === "Pending" ||
                                data.transactionStatus === "PDC"
                              ? "black"
                              : data.transactionStatus === "Bounced"
                              ? "red" // Set text color to red when status is "Bounced"
                              : "inherit",
                          textDecoration:
                            data.transactionStatus === "Bounced"
                              ? "line-through"
                              : "none",
                        }}
                      >
                        {data.transactionStatus}
                      </Td>

                      <Td border="1px solid black" p={"10px"}>
                        {/* {data.statusDate } */}
                        {data.statusDate ? new Date(data.statusDate)
                                .toLocaleDateString("en-GB")
                                .replace(/\//g, "/")
                            : ""}
                      </Td>
                      <Td border="1px solid black" p={"10px"}>
                        {data.remarks}
                      </Td>
                      <Td
                          border="1px solid black"
                          textAlign={"right"}
                          style={{ color: "white" }}
                          backgroundColor={data.TallyStatus==="Tallied" ?  "green":"red"}
                        >
                          {data.TallyStatus}
                        </Td>
                        <Td border="1px solid black">
                          {data.TallyStatus === "Tallied" ? (
                            <Button
                              colorScheme="teal"
                              onClick={() => handleNotTally(data)}
                            >
                              Not Tally
                            </Button>
                          ) : (
                            <Button
                              colorScheme="teal"
                              onClick={() => handleTally(data)}
                            >
                              Tally
                            </Button>
                          )}
                        </Td>
                      {/* <Td border="1px solid black" p={"10px"}>{data.amount}</Td> */}
                    </Tr>
                  ))}
                 
                </Tbody>
              </TableContainer>
            </Table>
          </>
        )}
      </Box>
    </>
  );
};

export default TransactionReport;

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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import { ChevronDownIcon } from "@chakra-ui/icons";

const ContractorLedger = () => {
  const [transaction, setTransaction] = useState([]);
  const [temp, setTemp] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState([]);
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [filteredPlots, setFilteredPlots] = useState([]);

  const handleCheckboxChange = (value, state, setter) => {
    if (state.includes(value)) {
      setter(state.filter((item) => item !== value));
    } else {
      setter([...state, value]);
    }
  };

  const loadTransaction = async () => {
    let query = "SELECT * FROM contractorTransaction;";

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);
      if (response && response.data) {
        if (response.data.phpresult) {
          setTransaction(response.data.phpresult);
          setTemp(response.data.phpresult);
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

  const getUniqueContractor = (key) => {
    return [...new Set(transaction.map((item) => item[key]))];
  };
  const projectOptions = getUniqueValues("projectName");
  const contractorOptions = getUniqueContractor("contractor");

  const filteredBookings = transaction.filter(
    (item) =>
      (!selectedProject.length ||
        selectedProject.includes("Select All") ||
        selectedProject.includes(item.projectName)) &&
      (!selectedContractor.length ||
        selectedContractor.includes("Select All") ||
        selectedContractor.includes(item.contractor)) &&
      (!selectedBlock.length ||
        selectedBlock.includes("Select All") ||
        selectedBlock.includes(item.blockName)) &&
      (!selectedPlot.length ||
        selectedPlot.includes("Select All") ||
        selectedPlot.includes(item.plotNo))
  );

  const clearFilters = () => {
    setSelectedProject([]);
    setSelectedContractor([]);
    setSelectedBlock([]);
    setSelectedPlot([]);
    
  };
console.log("setSelectedContractor",setSelectedContractor);
    console.log("setSelectedProject",setSelectedProject);

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const year = date.getFullYear();
  //   return `${day}-${month}-${year}`;
  // };

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const year = date.getFullYear();
  //   console.log('zzzzzzzzzzzzzz',day,month,year)
  //   return `${day}-${month}-${year}`;
  // };


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

    const plots = getUniqueValues("plotNo").filter(
      (plot) =>
        !selectedProject.length ||
        plot === "Select All" ||
        transaction.some(
          (item) =>
            item.projectName === selectedProject[0] && item.plotNo === plot
        )
    );
    setFilteredPlots([...plots]);
  }, [selectedProject, transaction]);
  

  const  handleBalance = (val) => {
    if(val === "0"){

      const newTransction = temp.filter((item)=> item.totalBalance == "0")
      console.log("newTran", newTransction)
      setTransaction(newTransction)
    }else{
      const newTransction = temp.filter((item)=> item.totalBalance != "0")
      console.log("newTran", newTransction)
      setTransaction(newTransction)
    }
   
  }



useEffect(()=> {
  const totalSum = filteredBookings.reduce((accumulator, currentValue) => {
    return accumulator + parseInt(currentValue.totalPayable);
  }, 0);

  console.log("totalSum",totalSum)
},[selectedProject,transaction])




let finalBalance = 0;
  let finalPable = 0;
  let finalPaid = 0;

  console.log("aaaaaaaaaaaaa", filteredBookings);

  filteredBookings.forEach((obj) => {
    finalBalance += parseInt(obj.totalBalance);
    finalPable += parseInt(obj.totalPayable);
    finalPaid += parseInt(obj.totalPaid);
  });

  console.log("Final Balance:", finalBalance);
  console.log("Final Payable:", finalPable);
  console.log("Final Paid:", finalPaid);



  return (
    <>

      <Center>
        <Heading size={"md"}>Contractor Ledger</Heading>
      </Center>
      <Box maxW={"100%"} overflowX={"scroll"} marginTop={"2rem"}>
        <Flex justifyContent={"space-evenly"}>

  {/* contractor select tag */}
     
 
  <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select Contractors
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Checkbox
                  isChecked={selectedContractor.includes("Select All")}
                  onChange={() =>
                    handleCheckboxChange(
                      "Select All",
                      selectedContractor,
                      setSelectedContractor
                    )
                  }
                >
                  Select All
                </Checkbox>
              </MenuItem>
              {contractorOptions.map((contractor) => (
                <MenuItem key={contractor}>
                  <Checkbox
                    isChecked={selectedContractor.includes(contractor)}
                    onChange={() =>
                      handleCheckboxChange(
                        contractor,
                        selectedContractor,
                        setSelectedContractor
                      )
                    }
                  >
                    {contractor}
                  </Checkbox>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
           {/* contractor select tag */}

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
          <Select width={"200px"} onChange={(e)=>handleBalance(e.target.value)} placeholder='Select Total Amt Balance'>
  <option value='0'>Zero</option>
  <option value='nonZero'>Non-Zero</option>
  
</Select>



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



            <Text p={5} fontWeight={"bold"}>
          {selectedContractor.length>0 &&  <div>Count :- {filteredBookings.length}</div>}   
            </Text>
            <Table variant="simple" >

              <TableContainer>

            <Thead>
              <Tr bg="gray.800" >
              <Th color="white" bg={"white"}></Th>
              <Th color="white"  bg={"white"}></Th>
              <Th color="white" bg={"white"}></Th>
              <Th color="white" bg={"white"}></Th>
              <Th color="white" bg={"white"}></Th>
              <Th color="white" bg={"white"}></Th>
              <Th color="white"> {selectedContractor.length>0 ? <p style={{ color: "yellow" }}>{finalPable}</p> : "0"} </Th>
              <Th color="white">{selectedContractor.length>0 ? <p style={{ color: "yellow" }}>{finalPaid}</p> : "0"}   </Th>
              <Th color="white">{selectedContractor.length>0 ? <p style={{ color: "yellow" }}>{finalBalance}</p> : "0"}   </Th>

            </Tr>
            </Thead>

                <Thead>
                  <Tr border="1px solid black" bg={"#121212"}>
                    <Th border="1px solid black" color={"white"} p={"22px"}>
                      {" "}
                      SrNo
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"22px"}>
                      Contractor
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"22px"}>
                      Project
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"22px"}>
                      Block
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"22px"}>
                      Plot
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"22px"}>
                      Const Amt
                    </Th>
                    {/* <Th border="1px solid black" color={"white"} p={"22px"}>
                      Less (%)
                    </Th> */}
                     <Th border="1px solid black" color={"white"} p={"26px"}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <p>Total Amt Payable</p>
                        <p
                          style={{
                            margin: "0 10px 0 10px",
                          }}
                        >
                          :-
                        </p>
                       
                        {/* {selectedContractor.length>0 ? <p style={{ color: "yellow" }}>{finalPable}</p> : "0"}  */}
                        
                      </div>
                    </Th>
                  
                  
                    <Th border="1px solid black" color={"white"} p={"26px"}>
                      {" "}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <p>Total Amt Paid</p>
                       
                        {/* <p style={{ color: "yellow" }}>{finalPaid}</p> */}
                        {/* {selectedContractor.length>0 ? <p style={{ color: "yellow" }}>{finalPaid}</p> : "0"}     */}
                      </div>
                    </Th>
                   
                   
                    <Th border="1px solid black" color={"white"} p={"26px"}>
                      {" "}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <p>Total Amt Bal</p>
                       
             {selectedContractor.length>0 ? <p style={{ color: "yellow" }}>{finalBalance}</p> : "0"}          
                      </div>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                
                  {selectedContractor.length>0 &&  filteredBookings.map((data, index) => (

                    <Tr key={data.srNo}>
                      <Td border="1px solid black">{index + 1}</Td>
                      <Td border="1px solid black">{data.contractor}</Td>
                      <Td border="1px solid black">{data.projectName}</Td>
                      <Td border="1px solid black">{data.blockName}</Td>
                      <Td border="1px solid black">{data.plotNo}</Td>
                      <Td border="1px solid black">{data.constAmt}</Td>
                      {/* <Td border="1px solid black">{data.lessPercent}</Td> */}
                      <Td border="1px solid black">{data.totalPayable}</Td>
                      <Td border="1px solid black">{data.totalPaid}</Td>
                      <Td border="1px solid black">{data.totalBalance}</Td>
                     
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

export default ContractorLedger;

import React, { useState, useEffect,useRef } from "react";
import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Center,
  Heading,
  useToast,
  Table,
  Thead,
  Tr,
  HStack,
  Td,
  Tbody,
  Th,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

import PaginationControl from "./PaginationControl";
const AddPlot = () => {
  const [finalPlot, setFinalPlot] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMaster, setFilteredMaster] = useState([]);
  const [projects, setProjects] = useState([]);
  const [getblock, setBlock] = useState([]);
  const [plot, setPlot] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [availableRateUpdate, setAvailableRateUpdate] = useState([]);
  const [updatedRates, setUpdatedRates] = useState({});
  const [formData, setFormData] = useState({
    projectName: "",
    blockName: "",
    plotNo: "",
    areaSqft: "",
    areaSqmt: "",
    ratePerSqft: "",
    plotType: "",
    plotStatus: "Available",
  });
  const [show, setShow] = useState(false);
  const [editableAreaSqft, setEditableAreaSqft] = useState("");
  const [editableAreaSqmt, setEditableAreaSqmt] = useState("");
  const [editableRatePerSqft, setEditableRatePerSqft] = useState("");
  const [matchCase, setMatchCase] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();
  const [editFormData, setEditFormData] = useState({
    id: "",
    projectName: "",
    blockName: "",
    plotNo: "",
    areaSqft: "",
    areaSqmt: "",
    ratePerSqft: "",
    plotType: "",
    plotStatus: "Available",
  });
  const [updatePlotRate, setUpadtePlotRate] = useState("");
  const [editPlotLoading, setEditLoading] = useState(false);

  const fetchDataProject = async () => {
    try {
      const response = await axios.get(
        "http://localhost/backend_lms/getprojects.php"
        // "http://localhost/backend_lms/getprojects.php"
      );
      //console.log(response);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };


  const fetchDataBlock = async () => {
    try {
      const response = await axios.get(
        // "http://localhost/backend_lms/getblock.php"
        "http://localhost/backend_lms/getblock.php"
      );
      //console.log(response);
      setBlock(response.data);
    } catch (error) {
      console.error("Error fetching block data:", error);
    }
  };

  const fetchDataPlot = async () => {
    try {
      const response = await axios.get(
        // "http://localhost/backend_lms/getplot.php"
        "http://localhost/backend_lms/getplot.php"
      );
      setPlot(response.data);
    } catch (error) {
      console.error("Error fetching plot data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value) {
      setShow(true);
    } else {
      setShow(false);
    }
    console.log(name)
    // console.log("inside function")
    //  if(name === "blockName"){
    //   console.log("inside block if")
    //   setBlockSelect(value)
    //  }
    if (name === "projectName") {
      const result = plot.filter((item) => item.projectName == value);
      setAvailableRateUpdate(result);
      setFilteredMaster(result);
    }
    if (name === "blockName") {
      console.log("inside block if");
      const result = availableRateUpdate.filter(
        (item) => item.blockName == value
      );
      setAvailableRateUpdate(result);
      setFilteredMaster(result);
    }
    //  if(blockSelect && plotSelect){
    //   console.log("condition")
    // const result = plot.filter((item) => item.blockName == blockSelect  && item.projectName == plotSelect)
    // console.log("final filter", result)
    //  }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
    const result = plot.filter((item) => item.projectName == value);
    if (result.length > 0) {
      setFinalPlot(result);
      //  setFilteredMaster(result)
      // console.log("re", result)
    }

    if (!value) {
      setFilteredMaster(plot);
    }

    if (name === "projectName") {
      setSelectedProject(value);
    }

    switch (name) {
      case "areaSqft":
        setEditableAreaSqft(value);
        break;
      case "areaSqmt":
        setEditableAreaSqmt(value);
        break;
      case "ratePerSqft":
        setEditableRatePerSqft(value);
        break;
      default:
        break;
    }

    if (name === "blockName" && matchCase) {
      setEditableAreaSqft(matchCase.areaSqft || "");
      setEditableAreaSqmt(matchCase.areaSqmt || "");
      setEditableRatePerSqft(matchCase.ratePerSqft || "");
    }

  };

  
  const onAddPlot = async (e) => {
    e.preventDefault();

    const url = "http://localhost/backend_lms/addplot.php";
    const fData = new FormData();
    fData.append("projectName", formData.projectName);
    fData.append("blockName", formData.blockName);
    fData.append("plotNo", formData.plotNo);
    fData.append("areaSqft", formData.areaSqft);
    fData.append("areaSqmt", formData.areaSqmt);
    fData.append("ratePerSqft", formData.ratePerSqft);
    fData.append("plotType", formData.plotType);
    fData.append("plotStatus", formData.plotStatus);

    let filterData = currentItems.filter((el) =>
      el.plotNo === formData.plotNo && el.blockName === formData.blockName
    );
    if (filterData) {
      if (filterData.length > 0) {
        toast({
          title: `Plot with number ${formData.plotNo} already exists in block ${formData.blockName}`,
          status: "error",
          isClosable: true,
        });
        return;
      }
    }

    try {
      await axios.post(url, fData);
      toast({
        title: "Plot added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setFormData({
        projectName: "",
        blockName: "",
        plotNo: "",
        areaSqft: "",
        areaSqmt: "",
        ratePerSqft: "",
        plotType: "",
        plotStatus: "Available",
      });

      fetchDataPlot();
    } catch (error) {
      console.log("Error adding plot:", error);
    }
  };



  useEffect(() => {
    const filteredData = plot.filter((item) =>
      item.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedData = [...filteredData].sort((a, b) => b.id - a.id);

    setFilteredMaster(sortedData);
    setTotalItems(sortedData.length);
    
  }, [plot, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMaster.slice(indexOfFirstItem, indexOfLastItem);

  // const changePage = (newPage) => {
  //   setCurrentPage(newPage);
  // };

  const handleDelete = (projectId) => {
    setProjectIdToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        // `http://localhost/backend_lms/deleteplot.php?id=${projectIdToDelete}`
        `http://localhost/backend_lms/deleteplot.php?id=${projectIdToDelete}`
      );

      setPlot(plot.filter((project) => project.id !== projectIdToDelete));

      toast({
        title: "Plot deleted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting plot:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setProjectIdToDelete(null);
    }
  };

  const handleEditPlotChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {

    let valueMatch = getblock.find(
      (i) =>
        i.blockName === formData.blockName &&
        i.projectName === formData.projectName
    );
    setMatchCase(valueMatch);

    setFormData((prevData) => ({
      ...prevData,
      areaSqft: valueMatch ? valueMatch.areaSqft : "",
      areaSqmt: valueMatch ? valueMatch.areaSqmt : "",
      ratePerSqft: valueMatch ? valueMatch.ratePerSqft : "",
    }));
  }, [formData.blockName, formData.projectName, getblock]);

  const handleEditPlotSubmit = async (e) => {
    setEditLoading(true);
    e.preventDefault();

    const url = "http://localhost/backend_lms/editplot.php";
    // const url = "http://localhost/backend_lms/editplot.php";
    const formData = new FormData();

    formData.append("id", editFormData.id);
    formData.append("projectName", editFormData.projectName);
    formData.append("blockName", editFormData.blockName);
    formData.append("plotNo", editFormData.plotNo);
    formData.append("areaSqft", editFormData.areaSqft);
    formData.append("areaSqmt", editFormData.areaSqmt);
    formData.append("ratePerSqft", editFormData.ratePerSqft);
    formData.append("plotType", editFormData.plotType);
    formData.append("plotStatus", editFormData.plotStatus);

    try {
      const response = await axios.post(url, formData);

      if (response && response.data && response.data.status === "success") {
        console.log("Plot updated successfully:", response.data.message);
        setEditLoading(false);
        toast({
          title: "Plot updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setIsModalOpen(false);
        fetchDataPlot();
      } else {
        console.error("Error updating plot:", response.data.message);
        setEditLoading(false);
        toast({
          title: "Error updating plot",
          status: "error",
          duration: 3000,
          isClosable: true,
        });

        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error in handleEditPlotSubmit:", error);
      setEditLoading(false);
      toast({
        title: "Error updating plot",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      setIsModalOpen(false);
      
    }
  };

  // const handleupdatePlotRate = () => {
  //   console.log("updated plot rate", updatePlotRate);
  //   setUpadtePlotRate("");
  //   const AvailablePlot = filteredMaster.filter(
  //     (item) => item.plotStatus === "Available"
  //   );
  //   // console.log("filter", AvailablePlot)

  //   const newfilter = AvailablePlot.map(
  //     (item) => (item.ratePerSqft = updatePlotRate)
  //   );
  //   console.log(newfilter);
  // };


  //   const[fData, setfdata] = useState('')

  // const handleRateChange = (e)=>{

  //   const { name, value } = e.target;
  //   setfdata((prevData) => ({ ...prevData, [name]: value }));

  // }


  const handleupdatePlotRate = async () => {
    
    console.log(formData.projectName);
    if(!formData.projectName){
      alert("Please fill in the project name");
      return;
    }

    if (!formData.blockName) {
      alert("Please fill in the block name");
      return;
    }


    if (formData.projectName !== "" && formData.blockName !== "") {
      const availablePlot = currentItems.filter((item) => item.plotStatus === "Available");
      console.log("availablePlot", availablePlot);

      if (availablePlot.length > 0) {
        let projectname = availablePlot[0].projectName;
        let blockname = availablePlot[0].blockName;

        console.log(projectname);
        console.log(blockname);
        const url = "http://localhost/backend_lms/editPlotRate.php";
        const formData = new FormData();
        formData.append("projectName", projectname);
        formData.append("blockName", blockname);
        //formData.append("plotno", plotno);
        formData.append("ratePerSqft", updatePlotRate);

        try {
          const response = await axios.post(url, formData);

          if (response && response.data && response.data.status === "success") {
            console.log("Plot ratePerSqft successfully:", response.data.message);
            toast({
              title: "Rate Per Sqft Updated successfully!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            fetchDataPlot();
            // fetchDataProject();
            // fetchDataBlock();

            setUpdatedRates(prev => ({
              ...prev,
              [`${projectname}-${blockname}`]: true
            }));

            setUpadtePlotRate("");
          }

        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("No available plot found.");
      }
    }
    else {
      console.log("Please select the projectName and Blockname...")
    }
  };


  useEffect(() => {
    fetchDataProject();
    fetchDataPlot();
    fetchDataBlock();
  }, []);

  // console.log("plotttt",plot)
  return (
    <>
      <Box p={4} width="100%">
        <Center pb={4}>
          <Heading fontSize={"25px"}>Add Plot </Heading>
        </Center>
        <form onSubmit={onAddPlot}>
          <Grid templateColumns="repeat(5, 1fr)" gap={4}>
            <FormControl>
              <FormLabel>Project Name</FormLabel>
              <Select
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="Select Project"
                id="projectName"
                required
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.projectName}>
                    {project.projectName}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Block Name</FormLabel>
              <Select
                name="blockName"
                value={formData.blockName}
                onChange={handleChange}
                placeholder="Select Block"
                displayEmpty
                required
              >
                {getblock
                  .filter((block) => block.projectName === selectedProject)
                  .map((block) => (
                    <option key={block.id} value={block.blockName}>
                      {block.blockName}
                    </option>
                  ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Plot No</FormLabel>
              <Input
                type="text"
                name="plotNo"
                value={formData.plotNo}
                onChange={handleChange}
                placeholder="Enter Plot No"
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Area (in sqft)</FormLabel>
              <Input
                type="number"
                name="areaSqft"
                value={
                  editableAreaSqft !== "" ? editableAreaSqft : formData.areaSqft
                }
                onChange={handleChange}
                placeholder="Enter Area (sqft)"
                required
                border={matchCase ? "2px solid green" : "1px solid #E5EAEF"}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Area (in sqmt)</FormLabel>
              <Input
                type="number"
                name="areaSqmt"
                value={
                  editableAreaSqmt !== "" ? editableAreaSqmt : formData.areaSqmt
                }
                onChange={handleChange}
                placeholder="Enter Area (sqmt)"
                required
                border={matchCase ? "2px solid green" : "1px solid #E5EAEF"}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Rate (per sqft)</FormLabel>
              <Input
                type="number"
                name="ratePerSqft"
                value={
                  editableRatePerSqft !== ""
                    ? editableRatePerSqft
                    : formData.ratePerSqft
                }
                onChange={handleChange}
                placeholder="Enter Rate (per sqft)"
                required
                border={matchCase ? "2px solid green" : "1px solid #E5EAEF"}
              />
            </FormControl>

            <FormControl gridColumn="span 1">
              <FormLabel>Plot Type</FormLabel>
              <Select
                name="plotType"
                value={formData.plotType}
                onChange={handleChange}
                placeholder="Select Plot Type"
                required
              >
                {/* Populate the dropdown with plot types */}
                <option value="Normal">Normal</option>
                <option value="EWS">EWS</option>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="4BHK">4BHK</option>
                <option value="5BHK">5BHK</option>
                {/* Add more options as needed */}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Plot Status</FormLabel>
              <Select
                name="plotStatus"
                value={formData.plotStatus}
                onChange={handleChange}
                placeholder="Select Plot Status"
                required
              >
                <option value="Available">Available</option>
              </Select>
            </FormControl>
            <Button colorScheme="blue" type="submit" mt={8}>
              Add Plot
            </Button>
          </Grid>
        </form>
      </Box>
      <Box>
        <hr />
        <Box
          mb={"15px"}
          mt={5}
          p={"0px 10px"}
          display={"flex"}
          justifyContent={"space-between"}
        >
          {/* <VStack>
            <Input
              type="text"
              w={"100%"}
              placeholder="Search by Project Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </VStack> */}

          {/* update plot rate start */}
          <Box w={"100%"} bg={"blue.300"} p={2}>
            <Box display={"flex"} gap={5} w={"30%"}>
              <Input
                type="number"
                textColor={"black"}
                bg={"white"}
                w={"100%"}
                placeholder="Enter Plot Rate"
                name="ratePerSqft"
                value={updatePlotRate}
                onChange={(e) => setUpadtePlotRate(e.target.value)}
              />
              <Button
                bg={"black"}
                colorScheme="none"
                color={"white"}
                onClick={handleupdatePlotRate}
              >
                Update Rate
              </Button>
            </Box>
          </Box>


          {/* update plot rate end */}
          {/* <Box>
<PaginationControl
              changePage={changePage}
              page={currentPage}
              total={totalItems}
              limit={itemsPerPage}
            />
</Box> */}
        </Box>
        <Table variant="simple" colorScheme="blue">
          <Thead>
            <Tr>
              <Th bg="blue.500" color="white" fontSize="13px">
                Sr No.
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Project Name
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Block Name
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Plot No.
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Area sqft
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Area sqmt
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Rate PerSqft
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Plot Type
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                plot Status
              </Th>{" "}
              <Th bg="blue.500" color="white" fontSize="14px">
                Action
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {!show ? (
              <Box
                width={"500px"}
                top={50}
                position={"relative"}
                left={"600px"}
              >
                <Heading>Select Your Project First</Heading>
              </Box>
            ) : (
              currentItems.map((plotItem, index) => (
                <Tr key={plotItem.id}>
                  <Td>{index + 1}</Td>
                  <Td>{plotItem.projectName}</Td>
                  <Td>{plotItem.blockName}</Td>
                  <Td>{plotItem.plotNo}</Td>

                  <Td>{plotItem.areaSqft}</Td>
                  <Td>{plotItem.areaSqmt}</Td>


                  {
                    <Td style={{ backgroundColor: updatedRates[`${plotItem.projectName}-${plotItem.blockName}`] ? "pink" : "white" }}>{plotItem.ratePerSqft}</Td>

                  }









                  <Td>{plotItem.plotType}</Td>
                  <Td>
                    {plotItem.plotStatus === "Booked" && (
                      <Text
                        fontWeight={500}
                        bg={"yellow"}
                        textAlign={"center"}
                        p={"1px"}
                      >
                        {plotItem.plotStatus.toUpperCase()}
                      </Text>
                    )}
                    {plotItem.plotStatus === "Available" && (
                      <Text fontWeight={500} p={"1px"}>
                        {plotItem.plotStatus.toUpperCase()}
                      </Text>
                    )}
                    {plotItem.plotStatus === "Registered" && (
                      <Text
                        fontWeight={500}
                        bg={"green"}
                        p={"1px"}
                        color={"white"}
                      >
                        {plotItem.plotStatus.toUpperCase()}
                      </Text>
                    )}
                  </Td>

                  <Td>
                    <HStack>
                      <Button
                        colorScheme="red"
                        onClick={() => handleDelete(plotItem.id)}
                      >
                        Delete
                      </Button>
                      <DeleteConfirmationDialog
                        isOpen={isDeleteDialogOpen}
                        onClose={() => setIsDeleteDialogOpen(false)}
                        onConfirm={confirmDelete}
                      />
                      <Button
                        colorScheme="teal"
                        onClick={() => {
                          setIsModalOpen(true);
                          setEditFormData({
                            id: plotItem.id,
                            projectName: plotItem.projectName,
                            blockName: plotItem.blockName,
                            areaSqft: plotItem.areaSqft,
                            areaSqmt: plotItem.areaSqmt,
                            plotNo: plotItem.plotNo,
                            ratePerSqft: plotItem.ratePerSqft,
                            plotType: plotItem.plotType,
                            plotStatus: plotItem.plotStatus,
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Block</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleEditPlotSubmit}>
            <ModalBody>
              <FormControl mb={4}>
                <FormLabel>Project Name</FormLabel>
                <Select
                  name="projectName"
                  value={editFormData.projectName || ""}
                  onChange={handleEditPlotChange}
                  placeholder={editFormData.projectName}
                >
                  {editFormData.projectName}
                  {/* {projects.map((project) => (
                    <option key={project.id} value={project.projectName}>
                      {project.projectName}
                    </option>
                  ))} */}
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Block Name</FormLabel>
                <Select
                  disabled
                  name="blockName"
                  value={editFormData.blockName}
                  onChange={handleEditPlotChange}
                  placeholder="Select Block"
                  required
                >
                  {getblock.map((block) => (
                    <option key={block.id} value={block.blockName}>
                      {block.blockName}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Plot No.</FormLabel>
                <Input
                  type="text"
                  name="plotNo"
                  value={editFormData.plotNo || ""}
                  onChange={handleEditPlotChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Area (in sqft)</FormLabel>
                <Input
                  type="number"
                  name="areaSqft"
                  value={editFormData.areaSqft || ""}
                  onChange={handleEditPlotChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Area (in sqmt)</FormLabel>
                <Input
                  type="number"
                  name="areaSqmt"
                  value={editFormData.areaSqmt || ""}
                  onChange={handleEditPlotChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Rate (per sqft)</FormLabel>
                <Input
                  type="number"
                  name="ratePerSqft"
                  value={editFormData.ratePerSqft || ""}
                  onChange={handleEditPlotChange}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Plot Type</FormLabel>
                <Select
                  name="plotType"
                  value={editFormData.plotType}
                  onChange={handleEditPlotChange}
                  placeholder="Select Plot Type"
                  required
                >
                  {/* Populate the dropdown with plot types */}
                  <option value="Normal">Normal</option>
                  <option value="EWS">EWS</option>
                  {/* Add more options as needed */}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Plot Status</FormLabel>
                <Select
                  disabled
                  name="plotStatus"
                  value={editFormData.plotStatus}
                  // onChange={handleEditPlotChange}
                  placeholder=" select plot status"
                  required
                >
                  <option value={editFormData.plotStatus}>{editFormData.plotStatus}</option>

                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              {editPlotLoading ? (
                <Button colorScheme=" blue" isLoading>
                  Save Changes
                </Button>
              ) : (
                <Button colorScheme="blue" type="submit">
                  Save Changes
                </Button>
              )}
              <Button onClick={() => setIsModalOpen(false)} ml={4}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddPlot;

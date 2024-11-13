import Nav from '../Nav'
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
  Toast,


} from "@chakra-ui/react";
import axios from 'axios';
import { useEffect, useState } from "react";


function HoldedPlots() {


  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [userRight, setUserRight] = useState(localStorage.getItem("userRight"));


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost/backend_lms/getholdplot.php');
        setData(response.data);
        // console.log("pavan trial data hai",data);
      } catch (error) {
        console.log(error.message);
        setError(error.message)
      }
    };

    fetchData();
  }, []);



  const releasePlot = async (props) => {
    console.log("this is props", props);

    const url = "http://localhost/backend_lms/editplot.php";

    const formData = new FormData();

    formData.append("id", props.ID);
    formData.append("plotStatus", "Available");
    formData.append("projectName", props.ProjectName);
    formData.append("blockName", props.BlockName);
    formData.append("plotNo", props.PlotNo);
    formData.append("areaSqft", props.AreaSqft);
    formData.append("areaSqmt", props.AreaSqmt);
    formData.append("ratePerSqft", props.ratePerSqft);
    formData.append("plotType", props.PlotType);


    console.log(props.ProjectName);


    try {
      const response = await axios.post(url, formData);
      if (response && response.data && response.data.status === "success") {

        alert("Do You Really Want To Release Plot")
        console.log(response.data);

        holdedPlotDlete(props.ID);
      }

    } catch (error) {
      console.error("Error in handleEditPlotSubmit:", error);
      Toast({
        title: "Error updating Status",
        status: "error",
      });

    }

  };

  const holdedPlotDlete = async (ID) => {
    console.log("IT IS ID PAVA", ID);
    console.log("DELETE FunctioN CALL");

    try {
      const url = `http://localhost/backend_lms/deleteHoldedPlot.php?id=${ID}`;
      console.log(ID);

      const response = await axios.delete(url);
      if (response) {
        console.log(response);
        Toast({
          title: "Plot Released Successfully",
          status: "Success",
        });


      }
      window.location.reload();

    } catch (error) {

      console.log(error);
      Toast({
        title: "Error To Unhold Plot",
        status: "error",
      });

    }



  }

  console.log(data)
  return (
    <div>
      <Nav />
      <Center>

        <Text fontSize="30px" fontWeight="600" p="20px">
          Holded Plots
        </Text>
      </Center>

      {error && <div>Error: Something went wronge to fetch data from backend</div>}


      <Table variant="simple" w={"100%"} colorScheme="blue">
        <Thead>
          <Tr bg="gray.800" >

            <Th color="white">ID No.</Th>
            <Th color="white">ProjectName</Th>
            <Th color="white">BlockName</Th>
            <Th color="white">PlotNo.</Th>
            <Th color="white">AreaSqft</Th>
            <Th color="white">AreaSqmt</Th>
            <Th color="white">PlotType</Th>
            <Th color="white">PlotStatus</Th>
            <Th color="white">HoldDate</Th>
            <Th color="white">Customer Name</Th>
            <Th color="white">Customer Mobile No.</Th>
            <Th color="white">Address</Th>
            <Th color="white">RetPerSqft</Th>
            <Th color="white">Remark</Th>
            <Th color="white"> </Th>
          </Tr>
        </Thead>

        <Tbody>
          {data.map((item, index) => (
            <Tr key={index}>
              <Td>{item.ID}</Td>
              <Td>{item.ProjectName}</Td>
              <Td>{item.BlockName}</Td>
              <Td>{item.PlotNo}</Td>
              <Td>{item.AreaSqft}</Td>
              <Td>{item.AreaSqmt}</Td>
              <Td>{item.PlotType}</Td>
              <Td>{item.plotStatus}</Td>
              <Td>{item.HoldDate}</Td>
              <Td>{item.CustName}</Td>
              <Td>{item.CustNumber}</Td>
              <Td>{item.Address}</Td>
              <Td>{item.ratePerSqft}</Td>
              <Td>{item.Remark}</Td>
              <Th ><Button bg={"red.400"} onClick={() => releasePlot(item)} isDisabled={userRight === "SalesPerson" || userRight === "Manager"}>Release</Button></Th>
            </Tr>
          ))}
        </Tbody>

      </Table>

    </div>
  )
}

export default HoldedPlots
import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  TableContainer,
  Divider,
} from '@chakra-ui/react';
import axios from 'axios';
import { useReactToPrint } from "react-to-print";

function PrintTransactionList() {
  const [transactionData, setTransactionData] = useState([]);
  const [error, setError] = useState(null);
  const componentRef = useRef(); // Ref for the printable component
  const [showButtons, setShowButtons] = useState(true);
  const [showPayment, setShowPayment] = useState(true);
  const [showAction, setShowAction] = useState(true);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setShowButtons(false); // Hide the buttons before printing
      setShowPayment(false);
      setShowAction(false);
    },
    onAfterPrint: () => {
      setShowButtons(true); // Show the buttons after printing
      setShowPayment(true);
      setShowAction(true);
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost/backend_lms/transactionlist.php');
        setTransactionData(response.data);
      } catch (error) {
        console.log(error.message);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Divider w={"50%"} bg={"#121212"} />
      <Box mx={"50px"} mt={"20px"}>
        {/* Ref applied to the component that will be printed */}
        <Box ref={componentRef}>
          <TableContainer width="70%" mx="auto"> {/* Reduced table width */}
            <Table size={"sm"}>
              <Thead>
                <Tr bg={"#121212"}>
                  <Th color={"white"} border="1px solid black" p={"4px"} py={3} pl={10}> {/* Reduced padding */}
                    SrNo.
                  </Th>
                  <Th color={"white"} border="1px solid black" p={"4px"} py={3}>Date</Th>
                  <Th color={"white"} border="1px solid black" p={"4px"} py={3}>Type</Th>
                  <Th color={"white"} border="1px solid black" p={"4px"} py={3}>Amount</Th>
                  <Th color={"white"} border="1px solid black" p={"4px"} py={3}>Bank Mode</Th>
                  <Th color={"white"} border="1px solid black" p={"4px"} py={3}>Chq/Ref No</Th>
                  <Th color={"white"} border="1px solid black" p={"4px"} py={3}>Bank Name</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactionData.map((res, index) => (
                  <Tr key={index}>
                    <Td border="1px solid black" p={"4px"}>{index + 1}</Td> {/* Reduced padding */}
                    <Td border="1px solid black" p={"4px"}>
                      {res.date ? new Date(res.date).toLocaleDateString('en-GB') : ''}
                    </Td>
                    <Td border="1px solid black" p={"4px"}>{res.paymentType}</Td>
                    <Td border="1px solid black" p={"4px"}>{res.amount}</Td>
                    <Td border="1px solid black" p={"4px"}>{res.bankMode}</Td>
                    <Td border="1px solid black" p={"4px"}>{res.cheqNo}</Td>
                    <Td border="1px solid black" p={"4px"}>{res.bankName}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Box mx={"250px"} mt={"20px"}>
      {showAction && (
        <Button onClick={handlePrint} className="hide-on-print">
          Print
        </Button>
      )}
      </Box>
    </div>
  );
}

export default PrintTransactionList;

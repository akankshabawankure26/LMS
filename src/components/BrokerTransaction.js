import {
  Box,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Tbody,
  HStack,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  Center,
} from "@chakra-ui/react";
import { DataContext, useData } from "../Context";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const BrokerTransaction = () => {
  // const { constructionData } = useData();
  const toast = useToast();
  const [fetchData, setFetchData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [paymentSubmitLoading, setPaymentSubmitLOading] = useState(false);
  const [netAmount, setNetAmount] = useState(0);
  const [brokerageValue, setBrokerageValue] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);
  const [amountBalance, setAmountBalance] = useState(0);
  const [transaction, setTransaction] = useState([""]);
  const [transactionDate, setTransactionDate] = useState("");
  const [totalPaid, setTotalPaid] = useState(0);
  const [amount, setAmount] = useState("");
  const [cheqNo, setCheqNo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const { storeData, goData, handleToggle } = useContext(DataContext);
  const [editData, setEditData] = useState({
    amount: "",
    cheq: "",
    remarks: "",
    date: "",
  });
  let navigate = useNavigate();
  const loadBrokerAmounts = async () => {
    const { projectName, blockName, brokerName, plotNo } = goData;

    const query = `SELECT totalPaid, totalBalance, totalPayable FROM brokerTransaction WHERE projectName='${projectName}' AND blockName='${blockName}' AND broker='${brokerName}' AND plotNo='${plotNo}'`;

    const url = "http://localhost/backend_lms/getQuery.php";
    const formData = new FormData();
    formData.append("query", query);

    try {
      const response = await axios.post(url, formData);
      if (
        response &&
        response.data &&
        response.data.phpresult &&
        response.data.phpresult.length > 0
      ) {
        const reversedResult = response.data.phpresult.reverse(); // Reverse the order of the array
        const { totalPaid, totalBalance, totalPayable } = reversedResult[0];
        setTotalPaid(totalPaid);
        setAmountBalance(totalBalance);
        setTotalPayable(totalPayable);
      } else {
        // No matching data found
        setTotalPaid(0);
        setAmountBalance(0);
        setTotalPayable(0);
      }
    } catch (error) {
      console.log("Error fetching broker transaction data:", error);
    }
  };

  const loadTransaction = async () => {
    let query = "SELECT * FROM `brokerTransaction`;";

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setTransaction(response.data.phpresult);
          console.log("master coming");
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  useEffect(() => {
    const fetchDataItem = fetchData.find(
      (data) =>
        data.projectName === goData.projectName &&
        data.blockName === goData.blockName &&
        data.plotNo === goData.plotNo
    );
    setNetAmount(fetchDataItem?.netAmount || 0);
  }, [fetchData, goData]);

  useEffect(() => {
    const masterDataItem = masterData.find(
      (data) => data.projectName === goData.projectName
    );
    setBrokerageValue(masterDataItem?.brokerageValue || 0);
  }, [masterData, goData]);

  useEffect(() => {
    const calculatedTotalPayable = (netAmount * brokerageValue) / 100;
    setTotalPayable(calculatedTotalPayable);

    // Calculate the total balance based on the difference between totalPayable and totalPaid
    const calculatedAmountBalance = calculatedTotalPayable - totalPaid;
    setAmountBalance(calculatedAmountBalance);
  }, [netAmount, brokerageValue, totalPaid]); // Make sure totalPaid is in the dependency array

  const handlePaymentSubmit = async () => {
    setPaymentSubmitLOading(true);
    try {
      const paidAmount = parseFloat(amount);
      const updatedTotalPaid = Number(totalPaid) + paidAmount;
      const updatedAmountBalance = totalPayable - updatedTotalPaid;

      const data = {
        broker: goData.brokerName,
        projectName: goData.projectName,
        blockName: goData.blockName,
        plotNo: goData.plotNo,
        netAmount: netAmount,
        brokerage: brokerageValue,
        amount: paidAmount, // The amount paid in this transaction
        totalPayable: totalPayable, // Total payable remains the same
        totalPaid: updatedTotalPaid, // Updated total paid
        totalBalance: updatedAmountBalance, // Updated total balance
        cheq: cheqNo,
        date: transactionDate,
        remarks: remarks,
      };
console.log("laaaaa",data);
      // Prepare the SQL query string
      const query = `INSERT INTO brokerTransaction (projectName, blockName, plotNo, broker, netAmount, brokerage, amount, totalPayable, totalPaid, totalBalance, cheq, date, remarks) VALUES ('${data.projectName}', '${data.blockName}', '${data.plotNo}', '${data.broker}', '${data.netAmount}', '${data.brokerage}', '${data.amount}', '${data.totalPayable}', '${data.totalPaid}', '${data.totalBalance}', '${data.cheq}', '${data.date}', '${data.remarks}')`;

     
      // Here you can add logic to save the payment transaction to your backend
      const setQueryUrl = "http://localhost/backend_lms/setQuery.php";
      const formData = new FormData();
      formData.append("query", query);

      const response = await axios.post(setQueryUrl, formData);

      if (response.status === 200) {
        console.log("Payment transaction saved successfully:", response.data);
        setPaymentSubmitLOading(false);
        // Optionally, you can update state variables or perform any additional actions after successful submission
      } else {
        console.error("Failed to save payment transaction:", response.data);
        setPaymentSubmitLOading(false);
      }
      setTotalPaid(updatedTotalPaid);
      setAmountBalance(updatedAmountBalance);
      await loadTransaction();
      await loadBrokerAmounts();
      // Reset form fields after successful submission
      setTransactionDate("");
      setCheqNo("");
      setRemarks("");
      setAmount("");
    } catch (error) {
      setPaymentSubmitLOading(false);
      console.error("Error submitting payment:", error.message);
    }
  };

  const loadData = async () => {
    let query = "SELECT * FROM `booking`;";

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setFetchData(response.data.phpresult);
          // console.log();
          console.log("data coming", response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const loadMasterData = async () => {
    let query = "SELECT * FROM `master`;";

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setMasterData(response.data.phpresult);
          console.log("master coming");
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const handleDeleteTransaction = async (index) => {
    try {
      const deletedTransaction = transaction[index];
      const deletedAmount = parseFloat(deletedTransaction.amount);
      const updatedTotalPaid = totalPaid - deletedAmount;
      const updatedAmountBalance = totalPayable - updatedTotalPaid;

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this transaction?"
      );
      if (!confirmDelete) return; // If user cancels the deletion

      console.log("Deleting transaction:");
      console.log("Deleted Amount:", deletedAmount);
      console.log("Updated Total Paid:", updatedTotalPaid);
      console.log("Updated Amount Balance:", updatedAmountBalance);

      // Make a request to your backend to delete the transaction
      const url = "http://localhost/backend_lms/setQuery.php";
      const query = `DELETE FROM brokerTransaction WHERE id = ${deletedTransaction.id};`;
      const formData = new FormData();
      formData.append("query", query);

      const response = await axios.post(url, formData);
      console.log("Transaction deleted successfully:", response.data);

      // If deletion is successful, update the state
      const updatedTransactions = [...transaction];
      updatedTransactions.splice(index, 1);
      toast({
        title: "Payment deleted successfully!",

        duration: 3000,
        position: "top",
        isClosable: true,
      });
      setTotalPaid(updatedTotalPaid);
      setAmountBalance(updatedAmountBalance);
      setTransaction(updatedTransactions);
    } catch (error) {
      console.error("Error deleting transaction:", error.message);
    }
  };
  const handleEditDataChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleEditModalOpen = (id) => {
    const editRow = transaction.find((item) => item.id === id);
    if (editRow) {
      setEditData(editRow);
      setShowEditModal(true);
    } else {
      console.error("Row not found for editing");
    }
  };
  const handleCancelEdit = () => {
    setShowEditModal(false);
  };
  const handleSaveEdit = async () => {
    try {
      const editedAmountPaid = parseFloat(editData.amount);
      const originalTransaction = transaction.find(
        (item) => item.id === editData.id
      );

      if (!originalTransaction) {
        console.error("Edited transaction not found.");
        return;
      }

      const originalAmountPaid = parseFloat(originalTransaction.amount);
      const amountDifference = editedAmountPaid - originalAmountPaid;

      const updatedTotalPaid = Number(totalPaid) + amountDifference;
      const updatedTotalBalance = totalPayable - updatedTotalPaid;

      const editedData = {
        ...editData,
        totalPaid: updatedTotalPaid,
        totalBalance: updatedTotalBalance,
      };

      const url = "http://localhost/backend_lms/setQuery.php";
      const query = `UPDATE brokerTransaction 
                     SET 
                       amount = ${editedData.amount},
                       cheq = '${editedData.cheq}',
                       remarks = '${editedData.remarks}',
                       date = '${editedData.date}',
                       totalPaid = '${editedData.totalPaid}',
                       totalBalance = '${editedData.totalBalance}'
                     WHERE 
                       id = ${editedData.id}`;
      const formData = new FormData();
      formData.append("query", query);

      const response = await axios.post(url, formData);

      if (response.status === 200) {
        console.log(
          "Contractor transaction updated successfully:",
          response.data
        );
        toast({
          title: "Transaction updated successfully!",
          status: "success",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
        setShowEditModal(false);

        // Update local state if necessary
        setTotalPaid(updatedTotalPaid);
        setAmountBalance(updatedTotalBalance);

        // Reload data if needed
        loadTransaction();
      } else {
        console.error(
          "Failed to update contractor transaction:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error updating contractor transaction:", error.message);
    }
  };

  const handleBack = () => {
    handleToggle();
    navigate("/PaymentTransaction");
  };

  useEffect(() => {
    loadData();
    loadMasterData();
    loadTransaction();
    loadBrokerAmounts();
  }, []);

console.log("data", goData);

  return (
    <Box display={"flex"} height={"80vh"} maxW={"100vw"}>
      <Box flex={"15%"} borderRight={"1px solid grey"}>
        <VStack alignItems={"flex-start"} gap={8}>
          <Text fontSize={"18px"} fontWeight={"semibold"}>
            Broker :- {goData.brokerName}
          </Text>
          <Text fontSize={"18px"} fontWeight={"semibold"}>
            Project Name :- {goData.projectName}
          </Text>{" "}
          <Text fontSize={"18px"} fontWeight={"semibold"}>
            Block Name :- {goData.blockName}
          </Text>{" "}
          <Text fontSize={"18px"} fontWeight={"semibold"}>
            Plot No :- {goData.plotNo}
          </Text>
          <Text fontSize={"18px"} fontWeight={"semibold"}>
            Total Payable :- {totalPayable}
          </Text>
          <Text fontSize={"18px"} fontWeight={"semibold"}>
            Total Paid:-{totalPaid}
          </Text>
          <Text fontSize={"18px"} fontWeight={"semibold"}>
            Amount Balance :- {amountBalance}
          </Text>
          <Button colorScheme="teal" onClick={handleBack}>
            Go Back
          </Button>
        </VStack>
      </Box>
      <Box flex={"85%"} maxW={"80%"}>
        <Text marginLeft={"10px"}>Broker Transaction</Text>
        <Box
          display="flex"
          alignItems={"center"}
          justifyContent={"center"}
          mt={"15px"}
        >
          <HStack alignItems={"flex-start"}>
            <FormControl>
              <FormLabel>Date :-</FormLabel>
              <Input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Amount</FormLabel>
              <Input
                id="amount"
                type="number"
                value={amount} // Value from state
                onChange={(e) => setAmount(parseFloat(e.target.value))} // Update state onChange
              />
            </FormControl>

            {/* Input field for Cheq/Ref No */}
            <FormControl>
              <FormLabel>Chq/Ref No</FormLabel>
              <Input
                id="cheqNo"
                type="text"
                value={cheqNo} // Value from state
                onChange={(e) => setCheqNo(e.target.value)} // Update state onChange
              />
            </FormControl>

            {/* Input field for Remarks */}
            <FormControl>
              <FormLabel>Remarks</FormLabel>
              <Input
                id="remarks"
                type="text"
                value={remarks} // Value from state
                onChange={(e) => setRemarks(e.target.value)} // Update state onChange
              />
            </FormControl>
            {paymentSubmitLoading ? (
              <Button
                isLoading
                colorScheme="telegram"
                alignSelf={"flex-end"}
                size={"md"}
                w={"60%"}
                mt={"30px"}
                // onClick={handlePaymentSubmit}
              >
                Submit
              </Button>
            ) : (
              <Button
                colorScheme="telegram"
                alignSelf={"flex-end"}
                size={"md"}
                w={"60%"}
                mt={"30px"}
                onClick={handlePaymentSubmit}
              >
                Submit
              </Button>
            )}
          </HStack>
        </Box>
        <Table variant="simple" marginTop={"20px"} size="sm">
          <Thead>
            <Tr bg={"#121212"} color={"whitesmoke"}>
              <Th color={"white"} border="1px solid black">
                SrNo
              </Th>
              <Th color={"white"} border="1px solid black">
                Broker
              </Th>
              <Th color={"white"} border="1px solid black">
                Project
              </Th>
              <Th color={"white"} border="1px solid black">
                Block
              </Th>
              <Th color={"white"} border="1px solid black">
                Plot
              </Th>
           
              <Th color={"white"} border="1px solid black">
                Date
              </Th>
              <Th color={"white"} border="1px solid black">
                Amount
              </Th>{" "}
              <Th color={"white"} border="1px solid black">
                Cheq
              </Th>
              <Th color={"white"} border="1px solid black">
                Remarks
              </Th>
              <Th color={"white"} border="1px solid black">
                Action
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {transaction.map(
              (data, index) =>
                goData.projectName === data.projectName &&
                goData.blockName === data.blockName &&
                goData.brokerName === data.broker &&
                goData.plotNo === data.plotNo && (
                  <Tr key={index}>
                    <Td border="1px solid black">{index+1}</Td>
                    <Td border="1px solid black">{data.broker}</Td>
                    <Td border="1px solid black">{data.projectName}</Td>
                    <Td border="1px solid black">{data.blockName}</Td>
                    <Td border="1px solid black">{data.plotNo}</Td>
                    <Td border="1px solid black">{data.date}</Td>
                    <Td border="1px solid black">{data.amount}</Td>
                    <Td border="1px solid black">{data.cheq}</Td>
                    <Td border="1px solid black">{data.remarks}</Td>

                    <Td display={"flex"} border="1px solid black" gap={"5px"}>
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={() => handleEditModalOpen(data.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDeleteTransaction(index)}
                      >
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                )
            )}
          </Tbody>
        </Table>
      </Box>
      <Modal isOpen={showEditModal} onClose={handleCancelEdit}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                name="amount"
                value={editData.amount}
                onChange={handleEditDataChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Cheque Number</FormLabel>
              <Input
                type="text"
                name="cheq"
                value={editData.cheq}
                onChange={handleEditDataChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Remarks</FormLabel>
              <Input
                type="text"
                name="remarks"
                value={editData.remarks}
                onChange={handleEditDataChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                name="date"
                value={editData.date}
                onChange={handleEditDataChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveEdit}>
              Save
            </Button>
            <Button onClick={handleCancelEdit}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BrokerTransaction;

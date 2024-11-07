import {
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  HStack,
  Th,
  Td,
  Button,
  useToast,
} from "@chakra-ui/react";
import { DataContext, useData } from "../Context";
import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { useLocation, useNavigate } from "react-router-dom";

const ContractorTransaction = () => {
  // const { constructionData } = useData();
  const [isPrinting, setIsPrinting] = useState(true);
  const componentRef = useRef();
  const [amount, setAmount] = useState("");
  const [cheqNo, setCheqNo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [lessPercent, setLessPercent] = useState(0);
  const [transactionDate, setTransactionDate] = useState("");
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);
  const [fetchData, setFetchData] = useState([""]);
  const toast = useToast();
  const [showEditModal, setShowEditModal] = useState(false);
  const [constTransData, setConstTransData] = useState("");
  const {storeData,goData,handleToggle} = useContext(DataContext)
  const [editData, setEditData] = useState({
    amount: "",
    cheqNo: "",
    remarks: "",
    date: "",
  });

const localData = JSON.parse(localStorage.getItem("send"))

console.log("new", localData);
  const loadAmounts = async () => {
    const { projectName, blockName, contractor, plotNo } = goData;

    const query = `SELECT lessPercent, totalPaid, totalBalance, totalPayable FROM contractorTransaction WHERE projectName='${projectName}' AND blockName='${blockName}' AND contractor='${contractor}' AND plotNo='${plotNo}'`;

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
        const { lessPercent, totalPaid, totalBalance, totalPayable } =
          reversedResult[0];
        setLessPercent(lessPercent);
        setTotalPaid(totalPaid);
        setTotalBalance(totalBalance);
        setTotalPayable(totalPayable);
      } else {
        // No matching data found
        setLessPercent(0);
        setTotalPaid(0);
        setTotalBalance(0);
        setTotalPayable(0);
      }
    } catch (error) {
      console.log("Error fetching contractor transaction data:", error);
    }
  };
  const loadData = async () => {
    let query = "SELECT * FROM `contractorTransaction`;";

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setFetchData(response.data.phpresult);
          console.log("thisis constractor transaction",response.data.phpresult);
          setConstTransData(response.data.phpresult)
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const handleSubmit = async () => {
    try {
      const amountPaid = parseFloat(amount);
      const updatedTotalPaid = Number(totalPaid) + amountPaid;

      const updatedTotalBalance = totalPayable - updatedTotalPaid;

      const data = {
        contractor: goData.contractorName,
        projectName: goData.projectName,
        blockName: goData.blockName,
        plotNo: goData.plotNo,
        constAmt: goData.amount,

        lessPercent: lessPercent,
        date: transactionDate,
        cheqNo: cheqNo,
        remarks: remarks,
        totalPaid: updatedTotalPaid,
        totalBalance: updatedTotalBalance, // Assign the updated total balance
        totalPayable: totalPayable, // Assign the total payable without recalculating
        amount: amount,
      };

      const url = "http://localhost/backend_lms/setQuery.php";
      const query = `INSERT INTO contractorTransaction (contractor, projectName, blockName, plotNo, amount, lessPercent, cheqNo, remarks, transactionDate, totalPaid, totalBalance, totalPayable,constAmt) VALUES ('${data.contractor}', '${data.projectName}', '${data.blockName}', '${data.plotNo}', '${data.amount}', '${data.lessPercent}', '${data.cheqNo}', '${data.remarks}', '${data.date}', '${data.totalPaid}', '${data.totalBalance}', '${data.totalPayable}','${data.constAmt}')`;
      const formData = new FormData();
      formData.append("query", query);

      const response = await axios.post(url, formData);

      if (response.status === 200) {
        console.log(
          "Contractor transaction saved successfully:",
          response.data
        );
        toast({
          title: "Transaction added successfully!",
          status: "success",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
        setTotalPaid(updatedTotalPaid); // Update total paid state
        setTotalBalance(updatedTotalBalance); // Update total balance state
        loadData();
      } else {
        console.error("Failed to save contractor transaction:", response.data);
      }

      // Reset form fields after successful submission
      setAmount("");
      setCheqNo("");
      setRemarks("");
      setTransactionDate("");
    } catch (error) {
      console.error("Error saving contractor transaction:", error.message);
    }
  };

  const handleDeleteContractorTransaction = async (index) => {
    try {
      const deletedTransaction = fetchData[index];
      const deletedAmount = parseFloat(deletedTransaction.amount);

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this transaction?"
      );
      if (!confirmDelete) return; // If user cancels the deletion

      const url = "http://localhost/backend_lms/setQuery.php";
      const query = `DELETE FROM contractorTransaction WHERE id = ${deletedTransaction.id}`;
      const formData = new FormData();
      formData.append("query", query);

      const response = await axios.post(url, formData);

      if (response.status === 200) {
        console.log(
          "Contractor transaction deleted successfully:",
          response.data
        );

        // Calculate updated totalPaid and totalBalance
        const updatedTotalPaid = totalPaid - deletedAmount;
        const updatedTotalBalance = Number(totalBalance) + deletedAmount;

        // If deletion is successful, update the local state
        const updatedFetchData = [...fetchData];
        updatedFetchData.splice(index, 1);
        setFetchData(updatedFetchData);

        setTotalPaid(updatedTotalPaid);
        setTotalBalance(updatedTotalBalance);

        toast({
          title: "Transaction deleted successfully!",

          duration: 3000,
          position: "top",
          isClosable: true,
        });
      } else {
        console.error(
          "Failed to delete contractor transaction:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error deleting contractor transaction:", error.message);
    }
  };

  const navigate = useNavigate();

  const handlePrevious = () => {
    handleToggle()
    navigate("/PaymentTransaction")
  }

  // Calculate total payable only once when the component mounts
  useEffect(() => {
    const amtPayable =
    goData.amount - (goData.amount * lessPercent) / 100;
    const updatedTotalBalance = isNaN(amtPayable) ? 0 : amtPayable;
    setTotalPayable(updatedTotalBalance);
    setTotalBalance(updatedTotalBalance); // Initialize total balance with total payable
  }, [goData, lessPercent]);
  const handleCancelEdit = () => {
    setShowEditModal(false);
  };
  const handleEditDataChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleEditModalOpen = (id) => {
    const editRow = fetchData.find((item) => item.id === id);
    setEditData(editRow);
    setShowEditModal(true);
  };
  const handleSaveEdit = async () => {
    try {
      const editedAmountPaid = parseFloat(editData.amount);
      const originalTransaction = fetchData.find(
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
      const query = `UPDATE contractorTransaction 
                     SET 
                       amount = ${editedData.amount},
                       cheqNo = '${editedData.cheqNo}',
                       remarks = '${editedData.remarks}',
                       transactionDate = '${editedData.date}',
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
        setTotalBalance(updatedTotalBalance);

        // Reload data if needed
        loadData();
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
 

  useEffect(() => {
    loadData();
    loadAmounts();
  }, []);

const location = useLocation()

console.log("location",location);

console.log("this is pavan data",constTransData);
console.log("this is pavan data2",goData);


// function getAmount(constTransData, goData) {
//   const matchedItem = constTransData?.find(item => 
//     item.projectName === goData.projectName &&
//     item.blockName === goData.blockName &&
//     item.plotNo === goData.plotNo
//   );
  
//   return matchedItem ? matchedItem.amount : null;
// }

// const constamount = getAmount(constTransData, goData);
// console.log(amount);


console.log("fetchDataAAAAAAAAAAAAAAAAA",fetchData);



  return (
    <Box display={"flex"} height={"100vh"} maxW={"100vw"} ref={componentRef}>
      <Box flex={"22%"} borderRight={"1px solid grey"}>
        <VStack alignItems={"flex-start"} gap={8}>
          <Text fontSize={"18px"} fontWeight={"semibold"}>
            Contractor :- {goData.contractorName}
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
            Const Amount :- {""}
          </Text>
          <FormControl>
            <Flex align="center" justifyContent={"space-between"}>
              <FormLabel fontSize={"18px"} fontWeight={"semibold"}>
                Less (%) :-
              </FormLabel>
              <Input
                type="number"
                placeholder="Enter Value"
                w={"40%"}
                position={"relative"}
                right={"70px"}
                value={lessPercent}
                onChange={(e) => setLessPercent(parseFloat(e.target.value))}
              />
            </Flex>
          </FormControl>
          <Text fontSize={"18px"} fontWeight={"semibold"}>
            Payable :- {totalPayable}
          </Text>
          <Text fontSize={"18px"} fontWeight={"semibold"}>
            Paid :- {totalPaid}
          </Text>{" "}
          <Text fontSize={"18px"} fontWeight={"semibold"}>
            Bal :- {totalBalance}
          </Text>{" "}
            {/* go to previous */}
        <Box>
        <Button colorScheme='blue' variant='outline' ml={5} onClick={handlePrevious}>
    Go To Previous
  </Button>
        </Box>
          {/* go to previous */}
        </VStack>
      </Box>
      <Box flex={"80%"} maxW={"80%"}>
        <Text marginLeft={"10px"}>Contractor Transaction</Text>

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
                value={amount} 
                onChange={(e) => setAmount(parseFloat(e.target.value))} 
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

            <Button
              colorScheme="telegram"
              alignSelf={"flex-end"}
              size={"md"}
              w={"60%"}
              mt={"30px"}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </HStack>
        </Box>

        <Table variant="simple" marginTop={"20px"} size="sm">
          <Thead>
            <Tr bg={"#121212"} color={"whitesmoke"}>
              <Th color={"white"} border="1px solid black">
SR NO.
              </Th>
              <Th color={"white"} border="1px solid black">
                Contractor
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
              </Th>
              {/* <Th color={"white"} border="1px solid black">
                Less(%)
              </Th> */}
              <Th color={"white"} border="1px solid black">
                Cheque
              </Th>{" "}
              <Th color={"white"} border="1px solid black">
                Remarks
              </Th>
            
              <Th color={"white"} border="1px solid black">
                Action
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {fetchData.map(
              (data, index) =>
                goData.projectName === data.projectName &&
                goData.blockName === data.blockName &&
                goData.contractorName === data.contractor &&
                goData.plotNo === data.plotNo && (
                  <Tr key={index}>
                    <Td border="1px solid black">{index+1}</Td>
                    <Td border="1px solid black">{data.contractor}</Td>
                    <Td border="1px solid black">{data.projectName}</Td>
                    <Td border="1px solid black">{data.blockName}</Td>
                    <Td border="1px solid black">{data.plotNo}</Td>
                    <Td border="1px solid black">{data.transactionDate ? new Date(data.transactionDate)
                                .toLocaleDateString("en-GB")
                                .replace(/\//g, "/")
                            : ""}</Td>
                    <Td border="1px solid black">{data.amount}</Td>
                    {/* <Td border="1px solid black">{data.lessPercent}</Td> */}
                    <Td border="1px solid black">{data.cheqNo}</Td>
                    <Td border="1px solid black">{data.remarks}</Td>
                    {isPrinting && (
                      <>
                        <Td
                          display={"flex"}
                          border="1px solid black"
                          gap={"5px"}
                        >
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
                            onClick={() =>
                              handleDeleteContractorTransaction(index)
                            }
                          >
                            Delete
                          </Button>
                        </Td>
                      </>
                    )}
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
                name="cheqNo"
                value={editData.cheqNo}
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

export default ContractorTransaction;

import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { json, useNavigate } from "react-router-dom";
import {
  Input,
  FormControl,
  FormLabel,
  Box,
  Flex,
  useToast,
  VStack,
  Textarea,
  HStack,
  Divider,
  Text,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  TableContainer,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  filter,
} from "@chakra-ui/react";
import { DataContext, DataProvider, useData } from "../Context";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";


const PaymentTransaction = () => {
  const Nav = useNavigate();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const { constructionData, setConstructionData } = useData();
  const [display, setdisplay] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionIdToDelete, setTransactionIdToDelete] = useState(null);
  const toast = useToast();
  const [registryDateGet, setRegistryDateGet] = useState("");
  const [projectsData, setprojectsData] = useState([]);
  const [blockData, setblockData] = useState([]);
  const [plotData, setplotData] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [blockName, setBlockname] = useState("");
  const [plotName, setPlotName] = useState("");
  const [contractorName, setcontractorName] = useState("");
  const [brokerName, setbrokerName] = useState(" ");
  const [brokerData, setbrokerData] = useState([]);
  const [showButtons, setShowButtons] = useState(true);
  const [showPayment, setShowPayment] = useState(true);
  const [showAction, setShowAction] = useState(true);

  const [currentPlot, setCurrentPlot] = useState([]);
  const [contractorData, setcontractorData] = useState([]);
  const [tPlot, setPlot] = useState([]);
  const [transactionData, setTransactionData] = useState([]);

  const componentRef = useRef();
  const [transferProjectName, setTransferProjectName] = useState("");
  const [transferBlockName, setTransferBlockName] = useState("");
  const [transferPlotName, setTransferPlotName] = useState("");

  const [transferProject, setTransferProject] = useState([]);
  const [transferBlock, setTransferBlock] = useState([]);
  const [transferPlot, setTransferPlot] = useState([]);
  const [transferData, setTransferData] = useState({});
  const [transferredRows, setTransferredRows] = useState([]);
  // transfer all states
  const [isTransferAllModalOpen, setIsTransferAllModalOpen] = useState(false);
  const [transferAllProjectName, setTransferAllProjectName] = useState("");
  const [transferAllBlockName, setTransferAllBlockName] = useState("");
  const [transferAllPlotName, setTransferAllPlotName] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [transferAllProject, setTransferAllProject] = useState([]);
  const [transferAllBlock, setTransferAllBlock] = useState([]);
  const [transferAllPlot, setTransferAllPlot] = useState([]);
  const [AllPlot, setAllPlot] = useState([]);
  const [renderData, setrenderData] = useState(false);
  const [areaSqft, setAreaSqft] = useState(0);
  const [render, setRender] = useState(false);
  const [ratePerSqft, setRatePerSqft] = useState(0);
  const [totalAmt, setTotalAmt] = useState(0);
  const [discount, setDiscount] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [netAmt, setNetAmt] = useState(0);
  const [registryAmt, setRegistryAmt] = useState(0);
  const [serviceAmt, setServiceAmt] = useState(0);
  const [maintenanceAmt, setMaintenanceAmt] = useState(0);
  const [miscAmt, setMiscAmt] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [constYesNo, setConstYesNo] = useState(false);
  const [constAmt, setConstAmt] = useState(0);
  const [totalAmtPayable, setTotalAmtPayable] = useState(0);
  const [guidelineAmt, setGuidelineAmt] = useState(0);
  const [registryPercent, setRegistryPercent] = useState(0);
  const [bankAmtPayable, setBankAmtPayable] = useState(0);
  const [cashAmtPayable, setCashAmtPayable] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bankreceive, setBankreceive] = useState(0);
  const [cashReceive, setCashReceive] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);
  const [bankAmountPayable, setBankAmountPayable] = useState(0);
  const [cashAmountPayable, setCashAmountPayable] = useState(0);
  const { storeData, goData, toggle } = useContext(DataContext);
  const [custName, setCustName] = useState("");
  const [APVisible, setAPVisible] = useState(false);
  const [APTickVisible, setAPTickVisible] = useState(false);
  const [isApprove, setIsApprove] = useState(false);
  const [userRight, setUserRight] = useState(localStorage.getItem("userRight"));


  useEffect(() => {
    const calculatedTotalAmt = areaSqft * ratePerSqft;
    setTotalAmt(calculatedTotalAmt);

    const calculatedNetAmt =
      discount === "Yes"
        ? calculatedTotalAmt * (1 - discountPercent / 100)
        : calculatedTotalAmt;
    setNetAmt(calculatedNetAmt);

    const calculatedGrandTotal =
      Number(calculatedNetAmt) +
      Number(registryAmt) +
      Number(serviceAmt) +
      Number(maintenanceAmt) +
      Number(miscAmt);
    setGrandTotal(calculatedGrandTotal);

    setTotalAmtPayable(calculatedGrandTotal);
  }, [
    areaSqft,
    ratePerSqft,
    discount,
    discountPercent,
    registryAmt,
    serviceAmt,
    maintenanceAmt,
    miscAmt,
  ]);

  const calculateTotalAmount = (data) => {
    return data.reduce((total, item) => {
      return item.action === "" ? total + Number(item.amount) : total;
    }, 0);
  };

  const calculateBankreceive = (data) => {
    return data.reduce((total, item) => {
      return item.action == "" && item.paymentType == "Bank"
        ? total + Number(item.amount)
        : total;
    }, 0);
  };
  const calculateCashReceive = (data) => {
    return data.reduce((total, item) => {
      return item.action == "" && item.paymentType == "Cash"
        ? total + Number(item.amount)
        : total;
    }, 0);
  };

  const calculateTotalPayable = (data) => {
    return data.reduce((total, item) => {
      return total + Number(item.totalAmountPayable);
    }, 0);
  };
  const calculatebankAmountPayable = (data) => {
    return data.reduce((total, item) => {
      return total + Number(item.bankAmountPayable);
    }, 0);
  };

  const calculateCashAmountPayable = (data) => {
    return data.reduce((total, item) => {
      return total + Number(item.cashAmountPayable);
    }, 0);
  };

  useEffect(() => {
    if (transactionData) {
      const total = calculateTotalAmount(transactionData);
      setTotalAmount(total);
      const bankTotal = calculateBankreceive(transactionData);
      setBankreceive(bankTotal);
      const cashTotal = calculateCashReceive(transactionData);
      setCashReceive(cashTotal);
      const TotalPayable = calculateTotalPayable(currentPlot);
      setTotalPayable(TotalPayable);
      const BankPayable = calculatebankAmountPayable(currentPlot);
      setBankAmountPayable(BankPayable);
      const CashPayable = calculateCashAmountPayable(currentPlot);
      setCashAmountPayable(CashPayable);
    }

    console.log(totalAmount);
    console.log(totalPayable);
  }, [transactionData]);

  // useEffect(() => {
  //   const updatedTransactionData = transactionData.map((res, index) => {
  //     if (transferredRows.includes(index)) {
  //       return { ...res, Status: "Transferred" };
  //     }
  //     return res;
  //   });
  //   setTransactionData(updatedTransactionData);
  // }, [transferredRows]);
  const [newProjectName, setnewProjectName] = useState();

  const [newBlockName, setnewBlockName] = useState();
  const [newPlotNo, setnewPlotNo] = useState();

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const confirmTransferAll = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to transfer all transactions?"
    );

    if (isConfirmed) {
      transferTransactions();
    }
  };

  const transferTransactions = async () => {
    const updatedTransactionData = transactionData.map((item) => ({
      ...item,
      projectName: newProjectName,
      blockName: newBlockName,
      plotno: newPlotNo,
    }));

    console.log("updatedTransactionData!!!!!!!!!!!!", updatedTransactionData);
    const transferRemark = `Transfer to ${newProjectName} , ${newBlockName} , ${newPlotNo} on ${new Date().toISOString().split("T")[0]
      }`;
    const receivedRemark = ` Received from ${newProjectName} , ${newBlockName} , ${newPlotNo} on  ${new Date().toISOString().split("T")[0]
      }`;

    const url = "http://localhost/backend_lms/transferAll.php";
    let fData = new FormData();
    fData.append(
      "updatedTransactionData",
      JSON.stringify(updatedTransactionData)
    );
    fData.append("actionAll", transferRemark);
    fData.append("TRAll", receivedRemark);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        console.log("result", response.data);
        if (response.data.status) {
          toast({
            title: "Transactions Transferred",
            description: `Transactions from ${projectName}, ${blockName}, ${plotName} have been transferred to ${transferAllProjectName}, ${transferAllBlockName}, ${transferAllPlotName}`,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
        }
        setIsTransferAllModalOpen(false);
      }
    } catch (error) {
      console.log("Error to connect");
    }

    console.log(
      `Transactions from ${projectName}, ${blockName}, ${plotName} have been transferred to ${transferAllProjectName}, ${transferAllBlockName}, ${transferAllPlotName}`
    );
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const loadContractor = async () => {
    let query = "SELECT * FROM contractor;";
    // alert(query);

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setcontractorData(response.data.phpresult);
          // console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("please select proper input");
    }
  };

  const loadBroker = async () => {
    let query = "SELECT * FROM broker;";
    // alert(query);

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query); //  ok bye ummmmaaaa tooooooo i love you tooo bye gn
    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setbrokerData(response.data.phpresult);
          // console.log("Broker data");
          // console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      alert("Please Select Proper Input");
    }
  };


  const handlePrintButton = () => {

    Nav('/printTranList');
  };





  const loadProjects = async () => {
    let query = "SELECT * FROM project;";
    // alert(query);

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setprojectsData(response.data.phpresult);
          // console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      alert("Please Select Proper Input");
    }
  };

  const loadTransferProjects = async () => {
    let query = "SELECT * FROM project;";
    // alert(query);

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setTransferProject(response.data.phpresult);
          // console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      alert("Please Select Proper Input");
    }
  };

  const loadTransferAllProjects = async () => {
    let query = "SELECT * FROM project;";
    // alert(query);

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setTransferAllProject(response.data.phpresult);
          // console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      alert("Please Select Proper Input");
    }
  };

  const loadBlocks = async (pname) => {
    let query = "SELECT * FROM block where projectName = '" + pname + "' ;";
    // alert(query);

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setblockData(response.data.phpresult);
          // console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      alert("Please Select Proper Input");
    }
  };

  const loadTransferBlock = async (pname) => {
    let query = "SELECT * FROM block where projectName = '" + pname + "' ;";

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setTransferBlock(response.data.phpresult);
          // console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      alert("Please Select Proper Input");
    }
  };
  const loadTransferAllBlock = async (pname) => {
    let query = "SELECT * FROM block where projectName = '" + pname + "' ;";

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setTransferAllBlock(response.data.phpresult);
          // console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      alert("Please Select Proper Input");
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////
  const loadPlots = async (bname) => {
    // console.log("name", projectName);
    let query =
      "  SELECT * FROM plot where blockName = '" + bname + "' AND projectName ='" + projectName +
      "'AND plotStatus ='Booked' ;   ";

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();
    //////////////////////////////////////////////////////////////////////////////
    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setplotData(response.data.phpresult);
          // console.log("this is ",response.data.phpresult);
        }
      }
    } catch (error) {
      alert("Please Select Proper Input");
    }
  };
  const loadPlots1 = async (bname, projectName) => {
    // console.log("name", projectName);
    let query =
      "SELECT * FROM plot where blockName = '" +
      bname +
      "' AND projectName ='" +
      projectName +
      "';";

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setplotData(response.data.phpresult);
          // console.log("this is ",response.data.phpresult);
        }
      }
    } catch (error) {
      alert("Please Select Proper Input");
    }
  };

  const loadTransferPlot = async (bname) => {
    let query =
      "SELECT * FROM plot where blockName = '" +
      bname +
      "' AND projectName ='" +
      transferProjectName +
      "';";
    // alert(query);

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setTransferPlot(response.data.phpresult);
          // console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      alert("Please Select Proper Input");
    }
  };

  const loadTransferAllPlot = async (bname) => {
    let query =
      "SELECT * FROM plot where blockName = '" +
      bname +
      "' AND projectName ='" +
      transferAllProjectName +
      "';";
    // alert(query);

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setTransferAllPlot(response.data.phpresult);
          // console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      alert("Please Select Proper Input");
    }
  };

  const dataTransfer = async (plotName) => {
    let query =
      "SELECT * FROM booking where blockName = '" +
      transferBlockName +
      "' AND projectName ='" +
      transferProjectName +
      "' AND plotNo ='" +
      plotName +
      "'  ;";
    // alert(query);

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setPlot(response.data.phpresult);
          // console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      alert("Please Select Proper Input");
    }
  };

  const dataTransferAll = async (plotName) => {
    let query =
      "SELECT * FROM booking where blockName = '" +
      transferAllBlockName +
      "' AND projectName ='" +
      transferAllProjectName +
      "' AND plotNo ='" +
      plotName +
      "'  ;";
    // alert(query);

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setAllPlot(response.data.phpresult);
          // console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      alert("Please Select Proper Input");
    }
  };

  const unRegistry = async () => {
    const url = "http://localhost/backend_lms/setQuery.php";
    let query =
      "UPDATE plot SET plotStatus = 'Booked' WHERE plotNo = '" +
      plotName +
      "';";

    let fData = new FormData();
    fData.append("query", query);

    let query1 =
      "UPDATE booking SET registryDate = '' WHERE plotNo = '" + plotName + "'";
    const fData1 = new FormData();
    fData1.append("query", query1);

    try {
      const response = await axios.post(url, fData);
      const response1 = await axios.post(url, fData1);
      if (response) console.log("response", response);
      alert("Plot status updated to Booked.");
    } catch (error) {
      console.log(error.message);
    }
  };

  const [approvedPlotIds, setApprovedPlotIds] = useState(new Set());

  const onRegistry = async () => {
    if (!filterPlotOne[0].booked) {
      alert("ask for admin to Approve");
      return;
    }

    const userConfirmed = window.confirm(
      "Do you really want to registry this plot?"
    );

    if (!userConfirmed) {
      return;
    }
    const url = "http://localhost/backend_lms/setQuery.php";
    let query =
      "INSERT INTO registry (id, projectName, blockName, plotNo, plotType, customerName, customerAddress, customerContact, registryGender, areaSqft, rateAreaSqft, totalAmount, discountApplicable, discountPercent, netAmount, registryAmount, serviceAmount, maintenanceAmount, miscAmount, grandTotal, constructionApplicable, constructionContractor, constructionAmount, totalAmountPayable, guidelineAmount, registryPercent, bankAmountPayable,  cashAmountPayable,  registryDate) VALUES (NULL, '" +
      document.getElementById("projectName").value +
      "', '" +
      document.getElementById("blockName").value +
      "', '" +
      document.getElementById("plotNo").value +
      "', '" +
      document.getElementById("plotType").value +
      "', '" +
      document.getElementById("custName").value +
      "', '" +
      document.getElementById("custAddress").value +
      "', '" +
      currentPlot[0]["customerContact"] +
      "', '" +
      document.getElementById("registryGender").value +
      "', '" +
      document.getElementById("areaSqmt").value +
      "', '" +
      document.getElementById("ratePerSqmt").value +
      "', '" +
      document.getElementById("totalAmount").value +
      "', '" +
      document.getElementById("discountApplicable").value +
      "', '" +
      document.getElementById("discountPercent").value +
      "', '" +
      document.getElementById("netAmount").value +
      "', '" +
      document.getElementById("registryAmount").value +
      "', '" +
      document.getElementById("serviceAmount").value +
      "', '" +
      document.getElementById("maintenanceAmount").value +
      "', '" +
      document.getElementById("miscAmount").value +
      "', '" +
      document.getElementById("grandTotal").value +
      "', '" +
      document.getElementById("constructionApplicable").value +
      "', '" +
      document.getElementById("constructionContractor").value +
      "', '" +
      document.getElementById("constructionAmount").value +
      "', '" +
      document.getElementById("totalAmountPayable").value +
      "', '" +
      document.getElementById("guidelineAmount").value +
      "', '" +
      document.getElementById("registryPercent").value +
      "', '" +
      document.getElementById("bankAmountPayable").value +
      "', '" +
      document.getElementById("cashAmountPayable").value +
      "', '" +
      // document.getElementById("remarks").value +
      // "', '" +
      document.getElementById("registryD").value +
      "');";

    let fData = new FormData();
    fData.append("query", query);

    const app = console.log("this is data from query");
    try {
      const response = await axios.post(url, fData);
      updatePlotStatusRegistry();
      updateRegistryDate();
      updateRegistryDate01();
      toast({
        title: "Registry added successfully!",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const updatePlotStatusRegistry = async () => {
    const url = "http://localhost/backend_lms/setQuery.php";
    let query =
      "UPDATE plot SET plotStatus = 'Registered' WHERE plotNo = '" +
      plotName +
      "' AND projectName ='" +
      projectName +
      "' AND blockName  ='" +
      blockName +
      "' ;";

    let fData = new FormData();
    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);
      console.log("Plot status updated to Registered.");
    } catch (error) {
      console.log(error);
    }
  };

  const [registryDate, setRegistryDate] = useState("");

  const updateRegistryDate = async () => {
    const url = "http://localhost/backend_lms/setQuery.php";
    let query =
      "UPDATE brokertransaction SET RegistryDate = '" +
      registryDate +
      "' WHERE plotNo = '" +
      plotName +
      "';";
    // console.log("here i am coming 2");

    let fData = new FormData();
    fData.append("query", query);

    // console.log("here i am coming 3",query);
    try {
      const response = await axios.post(url, fData);
      // console.log("Registry date Updated");
    } catch (error) {
      console.log(error);
    }
  };
  const updateRegistryDate01 = async () => {
    const url = "http://localhost/backend_lms/setQuery.php";
    let query =
      "UPDATE booking SET RegistryDate = '" +
      registryDate +
      "' WHERE plotNo = '" +
      plotName +
      "';";

    let fData = new FormData();
    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);
    } catch (error) {
      console.log(error);
    }
  };

  const loadTransaction = async () => {
    console.log("current", currentPlot);
    let query =
      "SELECT * FROM transaction where Status ='Active' AND  blockName  = '" +
      document.getElementById("blockName").value +
      "' AND projectName ='" +
      document.getElementById("projectName").value +
      "'AND plotno ='" +
      document.getElementById("plotNo").value +
      "';";
    // alert(query);

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setTransactionData(response.data.phpresult);
          // console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const loadAmounts = async () => {
    let query =
      "SELECT sum(Amount) as asum FROM transaction where blockName = '" +
      document.getElementById("blockName").value +
      "' AND projectName ='" +
      document.getElementById("projectName").value +
      "'AND plotno ='" +
      document.getElementById("plotNo").value +
      "'  AND transactionStatus IN ('Provisional', 'PDC', 'Clear', 'Pending');";

    //alert(query);

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          document.getElementById("totalReceived").innerHTML =
            response.data.phpresult[0]["asum"];
          // console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const loadAmountsBAR = async () => {
    let query =
      "SELECT sum(Amount) as asum FROM transaction where blockName = '" +
      document.getElementById("blockName").value +
      "' AND projectName ='" +
      document.getElementById("projectName").value +
      "'AND plotno ='" +
      document.getElementById("plotNo").value +
      "' AND paymentType ='bank'  AND transactionStatus IN ('Provisional', 'PDC', 'Clear', 'Pending');";

    //alert(query);

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          // document.getElementById("bankReceived").innerHTML =
          //   response.data.phpresult[0]["asum"];
          // console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const loadAmountsCAR = async () => {
    let query =
      "SELECT sum(Amount) as asum FROM transaction where blockName = '" +
      document.getElementById("blockName").value +
      "' AND projectName ='" +
      document.getElementById("projectName").value +
      "'AND plotno ='" +
      document.getElementById("plotNo").value +
      "' AND paymentType ='cash'  AND transactionStatus IN ('Provisional', 'PDC', 'Clear', 'Pending');";

    //alert(query);

    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          // document.getElementById("cashReceived").innerHTML =
          //   response.data.phpresult[0]["asum"];
          // console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };
  const calcAmounts = () => {
    const totalReceivedElem = document.getElementById("totalReceived");
    const bankReceivedElem = document.getElementById("bankReceived");
    const cashReceivedElem = document.getElementById("cashReceived");
    const totalPayableElem = document.getElementById("totalPayable");
    const bankPayableElem = document.getElementById("bankPayable");
    const cashPayableElem = document.getElementById("cashPayable");

    if (
      totalReceivedElem &&
      bankReceivedElem &&
      cashReceivedElem &&
      totalPayableElem &&
      bankPayableElem &&
      cashPayableElem
    ) {
      const totalReceived = parseInt(totalReceivedElem.innerHTML) || 0;
      const bankReceived = parseInt(bankReceivedElem.innerHTML) || 0;
      const cashReceived = parseInt(cashReceivedElem.innerHTML) || 0;
      const totalPayable = parseInt(totalPayableElem.innerHTML) || 0;
      const bankPayable = parseInt(bankPayableElem.innerHTML) || 0;
      const cashPayable = parseInt(cashPayableElem.innerHTML) || 0;

      // document.getElementById("totalBalance").innerHTML =
      //   totalPayable - totalReceived;
      // document.getElementById("bankBalance").innerHTML =
      //   bankPayable - bankReceived;
      // document.getElementById("cashBalance").innerHTML = parseInt(
      //   cashPayable - cashReceived
      // );
    } else {
      // alert("One or more elements not found");
    }
  };

  const setData = async (plotName) => {
    let query =
      "SELECT * FROM booking where blockName = '" +
      blockName +
      "' AND projectName ='" +
      projectName +
      "' AND plotNo ='" +
      plotName +
      "' AND IsActive='1' ;";
    // alert(query);
    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          console.log("if response callllll", response.data);
          setCurrentPlot(response.data.phpresult);

          document.getElementById("plotType").value =
            response.data.phpresult[0]["plotType"];
          setCustName(response.data.phpresult[0]["customerName"]);

          // document.getElementById("custName").value =
          //   response.data.phpresult[0]["customerName"];
          document.getElementById("custAddress").value =
            response.data.phpresult[0]["customerAddress"];
          //    document.getElementById("customerContact").value = response.data.phpresult[0]['customerContact'];
          document.getElementById("registryGender").value =
            response.data.phpresult[0]["registryGender"];

          setAreaSqft(response.data.phpresult[0]["areaSqft"]);
          setRatePerSqft(response.data.phpresult[0]["rateAreaSqft"]);
          setTotalAmt(response.data.phpresult[0]["totalAmount"]);
          setDiscount(response.data.phpresult[0]["discountApplicable"]);
          setDiscountPercent(response.data.phpresult[0]["discountPercent"]);
          setNetAmt(response.data.phpresult[0]["netAmount"]);

          setRegistryAmt(response.data.phpresult[0]["registryAmount"]);

          setServiceAmt(response.data.phpresult[0]["serviceAmount"]);
          setMaintenanceAmt(response.data.phpresult[0]["maintenanceAmount"]);

          setMiscAmt(response.data.phpresult[0]["miscAmount"]);
          setGrandTotal(response.data.phpresult[0]["grandTotal"]);

          setConstYesNo(response.data.phpresult[0]["constructionApplicable"]);

          setcontractorName(
            response.data.phpresult[0]["constructionContractor"]
          );

          setbrokerName(response.data.phpresult[0]["broker"]);

          setTotalAmtPayable(response.data.phpresult[0]["totalAmountPayable"]);
          setConstAmt(response.data.phpresult[0]["constructionAmount"]);

          setGuidelineAmt(response.data.phpresult[0]["guidelineAmount"]);

          setRegistryPercent(response.data.phpresult[0]["registryPercent"]);

          setBankAmtPayable(response.data.phpresult[0]["bankAmountPayable"]);

          setCashAmtPayable(response.data.phpresult[0]["cashAmountPayable"]);
          document.getElementById("bookingDate").value =
            response.data.phpresult[0]["bookingDate"];
          document.getElementById("constructionAmount").value =
            response.data.phpresult[0]["constructionAmount"];

          document.getElementById("bankPayable").innerHTML =
            response.data.phpresult[0]["bankAmountPayable"];
          document.getElementById("cashPayable").innerHTML =
            response.data.phpresult[0]["cashAmountPayable"];
          loadAmounts(response.data.phpresult);
          loadAmountsBAR();
          loadAmountsCAR();
          setTimeout(function () {
            calcAmounts();
          }, 3000);
          loadTransaction(response.data.phpresult);
        }
      }
      setrenderData((prev) => !prev);
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const setData1 = async (projectName, blockName, plotName) => {
    let query =
      "SELECT * FROM booking where blockName = '" +
      blockName +
      "' AND projectName ='" +
      projectName +
      "' AND plotNo ='" +
      plotName +
      "' AND IsActive='1' ;";
    // alert(query);
    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setCurrentPlot(response.data.phpresult);

          document.getElementById("plotType").value =
            response.data.phpresult[0]["plotType"];
          document.getElementById("custName").value =
            response.data.phpresult[0]["customerName"];
          document.getElementById("custAddress").value =
            response.data.phpresult[0]["customerAddress"];

          document.getElementById("registryGender").value =
            response.data.phpresult[0]["registryGender"];

          setAreaSqft(response.data.phpresult[0]["areaSqft"]);
          setRatePerSqft(response.data.phpresult[0]["rateAreaSqft"]);
          setTotalAmt(response.data.phpresult[0]["totalAmount"]);
          setDiscount(response.data.phpresult[0]["discountApplicable"]);
          setDiscountPercent(response.data.phpresult[0]["discountPercent"]);
          setNetAmt(response.data.phpresult[0]["netAmount"]);

          setRegistryAmt(response.data.phpresult[0]["registryAmount"]);

          setServiceAmt(response.data.phpresult[0]["serviceAmount"]);
          setMaintenanceAmt(response.data.phpresult[0]["maintenanceAmount"]);

          setMiscAmt(response.data.phpresult[0]["miscAmount"]);
          setGrandTotal(response.data.phpresult[0]["grandTotal"]);

          setConstYesNo(response.data.phpresult[0]["constructionApplicable"]);

          setcontractorName(
            response.data.phpresult[0]["constructionContractor"]
          );

          setbrokerName(response.data.phpresult[0]["broker"]);

          setTotalAmtPayable(response.data.phpresult[0]["totalAmountPayable"]);
          setConstAmt(response.data.phpresult[0]["constructionAmount"]);

          setGuidelineAmt(response.data.phpresult[0]["guidelineAmount"]);

          setRegistryPercent(response.data.phpresult[0]["registryPercent"]);

          setBankAmtPayable(response.data.phpresult[0]["bankAmountPayable"]);

          setCashAmtPayable(response.data.phpresult[0]["cashAmountPayable"]);
          document.getElementById("bookingDate").value =
            response.data.phpresult[0]["bookingDate"];
          document.getElementById("constructionAmount").value =
            response.data.phpresult[0]["constructionAmount"];

          document.getElementById("bankPayable").innerHTML =
            response.data.phpresult[0]["bankAmountPayable"];
          document.getElementById("cashPayable").innerHTML =
            response.data.phpresult[0]["cashAmountPayable"];
          loadAmounts(response.data.phpresult);
          loadAmountsBAR();
          loadAmountsCAR();
          setTimeout(function () {
            calcAmounts();
          }, 3000);
          loadTransaction(response.data.phpresult);
        }
      }
      setrenderData((prev) => !prev);
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };
  const filterPlotOne = plotData?.filter((item) => item.plotNo === plotName);

  console.log("filter", filterPlotOne);

  const [mode, setMode] = useState("");

  // const selectMode = (e) => {
  //   const { name, value } = e.target;
  //   if (name === "paymentType" && value == "Cash") {
  //     document.getElementById("bankMode").value = "none";
  //     setMode(value);
  //   } else {
  //     document.getElementById("bankMode").value = "";
  //     setMode("");
  //   }
  // };

  const addPayment = async () => {
    const url = "http://localhost/backend_lms/setQuery.php";
    const date = document.getElementById("date").value;
    const paymentType = document.getElementById("paymentType").value;
    const amount = parseInt(document.getElementById("amount").value);
    const bankMode = document.getElementById("bankMode").value;
    const cheqNo = document.getElementById("cheqNo").value;
    const bankName = document.getElementById("bankName").value;
    const transactionStatus =
      document.getElementById("transactionStatus").value;
    const statusDate = document.getElementById("statusDate").value;
    const remarks = document.getElementById("remarks").value;

    if (!paymentType || paymentType === "Bank") {
      if (
        !date ||
        isNaN(amount) ||
        !bankMode ||
        !cheqNo ||
        !bankName ||
        !transactionStatus
      ) {
        alert("Please fill in all required fields.");
        return;
      }
    }

    if (!paymentType || paymentType === "Cash") {
      if (!date || isNaN(amount) || !transactionStatus) {
        alert("Please fill in all required fields.");
        return;
      }
    }

    try {
      // Subtract payment amount from total balance
      const totalBalanceElem = document.getElementById("totalBalance");
      let totalBalance = parseInt(totalBalanceElem.innerHTML) || 0;
      totalBalance -= amount;
      totalBalanceElem.innerHTML = totalBalance;
      // console.log(`Total Balance: ${totalBalance}`);

      // Subtract payment amount from bank balance if payment type is Bank
      const bankBalanceElem = document.getElementById("bankBalance");
      let bankBalance = parseInt(bankBalanceElem.innerHTML) || 0;
      if (paymentType === "Bank") {
        bankBalance -= amount;
        bankBalanceElem.innerHTML = bankBalance;
        // console.log(`Bank Balance: ${bankBalance}`);
      }

      // Subtract payment amount from cash balance if payment type is Cash
      const cashBalanceElem = document.getElementById("cashBalance");
      let cashBalance = parseInt(cashBalanceElem.innerHTML) || 0;
      if (paymentType === "Cash") {
        cashBalance -= amount;
        cashBalanceElem.innerHTML = cashBalance;
        // console.log(`Cash Balance: ${cashBalance}`);
      }

      // Update total received and bank received
      let totalReceivedElem = document.getElementById("totalReceived");
      let bankReceivedElem = document.getElementById("bankReceived");
      let cashReceivedElem = document.getElementById("cashReceived");
      let totalReceived = parseInt(totalReceivedElem.innerHTML) || 0;
      let bankReceived = parseInt(bankReceivedElem.innerHTML) || 0;
      let cashReceived = parseInt(cashReceivedElem.innerHTML) || 0;

      totalReceived += amount;
      totalReceivedElem.innerHTML = totalReceived;
      // console.log(`Total Received: ${totalReceived}`);

      if (paymentType === "Bank") {
        bankReceived += amount;
        bankReceivedElem.innerHTML = bankReceived;
        // cashReceived = 0;
        // console.log(`Bank Received: ${bankReceived}`);
      } else if (paymentType === "Cash") {
        cashReceived += amount;
        cashReceivedElem.innerHTML = cashReceived;
        // bankReceived = 0;
        // console.log(`Cash Received: ${cashReceived}`);
      }

      const query = `INSERT INTO transaction (id, projectName, blockName, plotno, date, paymentType, amount, bankMode, cheqNo, bankName, transactionStatus, statusDate, remarks, totalBalance, bankBalance, cashBalance, totalReceived, bankReceived, cashReceived, CustName) VALUES (NULL, '${projectName}', '${blockName}','${plotName}',  '${date}', '${paymentType}', '${amount}', '${bankMode}', '${cheqNo}', '${bankName}', '${transactionStatus}', '${statusDate}', '${remarks}', '${totalBalance}', '${bankBalance}', '${cashBalance}', '${totalReceived}', '${bankReceived}', '${cashReceived}','${custName}');`;

      const formData = new FormData();
      formData.append("query", query);

      const response = await axios.post(url, formData);

      toast({
        title: "Payment added successfully!",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });

      loadAmounts();
      loadTransaction();
      loadAmountsBAR();
      loadAmountsCAR();

      setTimeout(function () {
        calcAmounts();
      }, 500);

      // Reset form fields
      document.getElementById("date").value = "";
      document.getElementById("paymentType").value = "";
      document.getElementById("amount").value = "";
      document.getElementById("bankMode").value = "";
      document.getElementById("cheqNo").value = "";
      document.getElementById("bankName").value = "";
      document.getElementById("transactionStatus").value = "";
      document.getElementById("statusDate").value = "";
      document.getElementById("remarks").value = "";
    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    loadProjects();
    loadTransferProjects();
    loadTransferAllProjects();
    loadBroker();
    loadContractor();

  }, []);

  const deletePayment = async () => {
    const url = "http://localhost/backend_lms/setQuery.php";
    let query =
      "DELETE FROM transaction WHERE id = " + transactionIdToDelete + ";";

    let fData = new FormData();
    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);
      // console.log(fData);
      toast({
        title: "Payment deleted successfully!",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });

      // Call your load functions after deletion
      loadAmounts();
      loadTransaction();
      loadAmountsBAR();
      loadAmountsCAR();
      setTimeout(function () {
        calcAmounts();
      }, 3000);
    } catch (error) {
      console.log(error.toJSON());
    } finally {
      // Reset the state after handling delete
      setIsDeleteDialogOpen(false);
      setTransactionIdToDelete(null);
    }
  };

  const handleDeletePayment = (transactionId) => {
    setTransactionIdToDelete(transactionId);
    setIsDeleteDialogOpen(true);
  };

  const updateTransactionStatus = async () => {
    const url = "http://localhost/backend_lms/setQuery.php";
    const query =
      "UPDATE transaction SET Status = 'Cancelled' WHERE plotNo = '" +
      plotName +
      "';";

    const fData = new FormData();
    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);
      return true; // Indicate success
    } catch (error) {
      console.log(error.toJSON());
      return false; // Indicate failure
    }
  };
  const cancelPlot = async () => {
    // Display a confirmation dialog
    const userConfirmed = window.confirm(
      "Do you really want to cancel the plot?"
    );

    // Check if the user confirmed

    if (userConfirmed) {
      const url = "http://localhost/backend_lms/setQuery.php";
      let query =
        "UPDATE plot SET plotStatus = 'Available', isActive = 0, booked = '' WHERE plotNo = '" +
        plotName +
        "';";

      const fData = new FormData();
      fData.append("query", query);

      let query1 =
        "UPDATE booking SET IsActive  = '0' WHERE plotNo  = '" +
        plotName +
        "';";

      const fData1 = new FormData();
      fData1.append("query", query1);

      // let query2 =
      //   "UPDATE plot SET booked = '' WHERE plotNo = '" +
      //   plotName +
      //   "';";

      const fData2 = new FormData();
      // fData.append("query", query2);

      try {
        const response = await axios.post(url, fData);
        const response2 = await axios.post(url, fData1);
        const response23 = await axios.post(url, fData2);

        // Update transaction status
        const transactionStatusUpdated = await updateTransactionStatus(
          plotName
        );

        if (transactionStatusUpdated) {
          // Show success toast
          toast({
            title: "Plot canceled successfully!",
            status: "success",
            duration: 3000,
            position: "top",
            isClosable: true,
          });
          window.location.reload();
        } else {
          // Show error toast if transaction status update fails
          toast({
            title: "Failed to cancel plot. Please try again.",
            status: "error",
            duration: 3000,
            position: "top",
            isClosable: true,
          });
        }
      } catch (error) {
        console.log(error.toJSON());

        // Show error toast
        toast({
          title: "Failed to cancel plot. Please try again.",
          status: "error",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
      }
    }
  };
  const editPlot = async () => {
    // Display a confirmation dialog
    const userConfirmed = window.confirm(
      "Do you really want to edit the plot?"
    );

    // Check if the user confirmed
    if (userConfirmed) {
      const url = "http://localhost/backend_lms/setQuery.php";
      var updateQuery = "UPDATE booking SET ";
      updateQuery +=
        "projectName = '" +
        document.getElementById("projectName").value +
        "', ";
      updateQuery +=
        "blockName = '" + document.getElementById("blockName").value + "', ";
      updateQuery +=
        "plotNo = '" + document.getElementById("plotNo").value + "', ";
      updateQuery +=
        "plotType = '" + document.getElementById("plotType").value + "', ";
      updateQuery +=
        "customerName = '" + document.getElementById("custName").value + "', ";
      updateQuery +=
        "customerAddress = '" +
        document.getElementById("custAddress").value +
        "', ";
      updateQuery +=
        "areaSqft = '" + document.getElementById("areaSqmt").value + "', ";
      updateQuery +=
        "rateAreaSqft = '" +
        document.getElementById("ratePerSqmt").value +
        "', ";
      updateQuery +=
        "totalAmount = '" +
        document.getElementById("totalAmount").value +
        "', ";
      updateQuery +=
        "discountApplicable = '" +
        document.getElementById("discountApplicable").value +
        "', ";
      updateQuery +=
        "discountPercent = '" +
        document.getElementById("discountPercent").value +
        "', ";
      updateQuery +=
        "netAmount = '" + document.getElementById("netAmount").value + "', ";
      updateQuery +=
        "registryAmount = '" +
        document.getElementById("registryAmount").value +
        "', ";
      updateQuery +=
        "serviceAmount = '" +
        document.getElementById("serviceAmount").value +
        "', ";
      updateQuery +=
        "maintenanceAmount = '" +
        document.getElementById("maintenanceAmount").value +
        "', ";
      updateQuery +=
        "miscAmount = '" + document.getElementById("miscAmount").value + "', ";
      updateQuery +=
        "grandTotal = '" + document.getElementById("grandTotal").value + "', ";
      updateQuery +=
        "constructionApplicable = '" +
        document.getElementById("constructionApplicable").value +
        "', ";
      updateQuery +=
        "constructionContractor = '" +
        document.getElementById("constructionContractor").value +
        "', ";
      updateQuery +=
        "constructionAmount = '" +
        document.getElementById("constructionAmount").value +
        "', ";
      updateQuery +=
        "totalAmountPayable = '" +
        document.getElementById("totalAmountPayable").value +
        "', ";
      updateQuery +=
        "guidelineAmount = '" +
        document.getElementById("guidelineAmount").value +
        "', ";
      updateQuery +=
        "registryPercent = '" +
        document.getElementById("registryPercent").value +
        "', ";
      updateQuery +=
        "bankAmountPayable = '" +
        document.getElementById("bankAmountPayable").value +
        "', ";
      updateQuery +=
        "bookingDate = '" +
        document.getElementById("bookingDate").value +
        "', ";
      updateQuery +=
        "cashAmountPayable = '" +
        document.getElementById("cashAmountPayable").value +
        "', ";
      updateQuery +=
        "remarks = '" + document.getElementById("remarks").value + "' ";
      updateQuery += "WHERE id = '" + currentPlot[0]["id"] + "';";

      let fData = new FormData();
      fData.append("query", updateQuery);

      try {
        const response = await axios.post(url, fData);

        // Show success toast
        toast({
          title: "Plot Edited Successfully!",
          status: "success",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
        window.location.reload();
      } catch (error) {
        console.log(error.toJSON());

        // Show error toast
        toast({
          title: "Failed to cancel plot. Please try again.",
          status: "error",

          duration: 3000,
          position: "top",
          isClosable: true,
        });
      }
    }
  };

  const deletePlot = async () => {
    const userConfirmed = window.confirm(
      "Do you really want to delete the plot?"
    );

    if (userConfirmed) {
      const url = "http://localhost/backend_lms/setQuery.php";
      let query =
        "DELETE FROM booking WHERE blockName = '" +
        blockName +
        "' AND projectName = '" +
        projectName +
        "' AND plotNo = '" +
        plotName +
        "' ;";

      let fData = new FormData();
      fData.append("query", query);
      let query1 =
        "UPDATE plot SET plotStatus='Available' WHERE plotNo = '" +
        plotName +
        "' ;";

      let fData1 = new FormData();
      fData1.append("query", query1);
      try {
        const response = await axios.post(url, fData);
        const response1 = await axios.post(url, fData1);
        // Show success toast
        toast({
          title: "Plot deleted successfully!",
          status: "success",
          duration: 3000,
          position: "top",
          isClosable: true,
        });

        // Reload the page
        window.location.reload();
      } catch (error) {
        console.log(error.toJSON());

        // Show error toast
        toast({
          title: "Failed to delete plot. Please try again.",
          status: "error",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
      }
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    date: "",
    paymentType: "",
    amount: "",
    bankMode: "",
    cheqNo: "",
    bankName: "",
    transactionStatus: "",
    statusDate: "",
    remarks: "",
  });
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditClick = (project) => {
    setIsModalOpen(true);
    setEditFormData({
      id: project.id,
      date: project.date,
      paymentType: project.paymentType,
      amount: project.amount,
      bankMode: project.bankMode,
      cheqNo: project.cheqNo,
      bankName: project.bankName,
      transactionStatus: project.transactionStatus,
      statusDate: project.statusDate,
      remarks: project.remarks,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const url = "http://localhost/backend_lms/editpayment.php";
    const paymentType = document.getElementById("paymentType").value;
    const amount = parseInt(document.getElementById("amount").value);
    try {
      const formData = new FormData();
      formData.append("id", editFormData.id);
      formData.append("date", editFormData.date);
      formData.append("paymentType", editFormData.paymentType);
      formData.append("amount", editFormData.amount);
      formData.append("bankMode", editFormData.bankMode);
      formData.append("cheqNo", editFormData.cheqNo);
      formData.append("bankName", editFormData.bankName);
      formData.append("transactionStatus", editFormData.transactionStatus);
      formData.append("statusDate", editFormData.statusDate);
      formData.append("remarks", editFormData.remarks);

      const response = await axios.post(url, formData);

      if (response && response.data && response.data.status === "success") {
        // Close the modal after successful submission
        setIsModalOpen(false);
        const updatedAmount = parseFloat(editFormData.amount);
        const updatedPaymentType = editFormData.paymentType;

        // After updating balances, call calculation logic
        updateBalances(paymentType, amount, updatedPaymentType, updatedAmount);

        // Trigger recalculation logic
        recalculate();

        // Show a success toast message
        toast({
          title: "Project updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Other necessary updates...
        loadAmounts();
        loadTransaction();
        loadAmountsBAR();
        loadAmountsCAR();
        calcAmounts();
      } else {
        // Handle error response
        console.error("Error updating project. Response:", response);

        // Show an error toast message
        toast({
          title: "Error updating project",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error in handleEditSubmit:", error);

      toast({
        title: "Error updating project",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const recalculate = () => {
    loadAmounts();
    loadTransaction();
    loadAmountsBAR();
    loadAmountsCAR();
    calcAmounts();

  };

  const updateBalances = (
    paymentType,
    amount,
    updatedPaymentType,
    updatedAmount
  ) => {
    const totalBalanceElem = document.getElementById("totalBalance");
    let totalBalance = parseInt(totalBalanceElem.innerHTML) || 0;
    totalBalance -= amount;
    totalBalance += updatedAmount; // Add the updated amount
    totalBalanceElem.innerHTML = totalBalance;
    // console.log(`Total Balance: ${totalBalance}`);

    const bankBalanceElem = document.getElementById("bankBalance");
    let bankBalance = parseInt(bankBalanceElem.innerHTML) || 0;
    if (paymentType === "Bank") {
      bankBalance -= amount;
    }
    if (updatedPaymentType === "Bank") {
      bankBalance += updatedAmount; // Add the updated amount
      bankBalanceElem.innerHTML = bankBalance;
      // console.log(`Bank Balance: ${bankBalance}`);
    }

    const cashBalanceElem = document.getElementById("cashBalance");
    let cashBalance = parseInt(cashBalanceElem.innerHTML) || 0;
    if (paymentType === "Cash") {
      // Handle cash balance update
    }
    if (updatedPaymentType === "Cash") {
      cashBalance += updatedAmount; // Add the updated amount
      cashBalanceElem.innerHTML = cashBalance;
      // console.log(`Cash Balance: ${cashBalance}`);
    }
  };
  const handleTransferButtonClick = (props, index) => {
    let finalTransferData = { ...props, index: index };
    setTransferData(finalTransferData);
    setIsTransferModalOpen(true);
  };

  const trasnferTransactionStatus = async (id, selectedRow) => {
    // Initialize the properties in selectedRow if they are undefined
    selectedRow.cashReceived = selectedRow.cashReceived || 0;
    selectedRow.cashBalance = selectedRow.cashBalance || 0;
    selectedRow.bankReceived = selectedRow.bankReceived || 0;
    selectedRow.bankBalance = selectedRow.bankBalance || 0;
    selectedRow.totalBalance = selectedRow.totalBalance || 0;
    selectedRow.totalReceived = selectedRow.totalReceived || 0;

    // Convert values to numbers
    let cashReceived = Number(selectedRow.cashReceived);
    let cashBalance = Number(selectedRow.cashBalance);
    let bankReceived = Number(selectedRow.bankReceived);
    let bankBalance = Number(selectedRow.bankBalance);
    let totalBalance = Number(selectedRow.totalBalance);
    let totalReceived = Number(selectedRow.totalReceived);

    // Calculate new values based on payment type
    const amount = Number(selectedRow.amount);

    if (selectedRow.paymentType === "Cash") {
      cashReceived -= amount;
      cashBalance += amount;
    } else if (selectedRow.paymentType === "Bank") {
      bankReceived -= amount;
      bankBalance += amount;
    }

    // Update total balance and total received
    totalBalance += amount;
    totalReceived -= amount;

    // Update UI with the new values
    updateUI({
      cashReceived,
      cashBalance,
      bankReceived,
      bankBalance,
      totalBalance,
      totalReceived,
    });

    return {
      cashReceived,
      cashBalance,
      bankReceived,
      bankBalance,
      totalBalance,
      totalReceived,
    };
  };

  // Function to update the UI
  const updateUI = (updatedValues) => {
    if (updatedValues.cashReceived !== undefined) {
      document.getElementById("cashReceived").innerHTML =
        updatedValues.cashReceived;
    }
    if (updatedValues.cashBalance !== undefined) {
      document.getElementById("cashBalance").innerHTML =
        updatedValues.cashBalance;
    }
    if (updatedValues.bankReceived !== undefined) {
      document.getElementById("bankReceived").innerHTML =
        updatedValues.bankReceived;
    }
    if (updatedValues.bankBalance !== undefined) {
      document.getElementById("bankBalance").innerHTML =
        updatedValues.bankBalance;
    }
    if (updatedValues.totalBalance !== undefined) {
      document.getElementById("totalBalance").innerHTML =
        updatedValues.totalBalance;
    }
    if (updatedValues.totalReceived !== undefined) {
      document.getElementById("totalReceived").innerHTML =
        updatedValues.totalReceived;
    }
  };
  const insertTransaction = async (
    CustName,
    projectName,
    blockName,
    plotNo,
    date,
    paymentType,
    amount,
    bankMode,
    cheqNo,
    bankName,
    transactionStatus,
    statusDate,
    remarks,
    totalBalance,
    bankBalance,
    cashBalance,
    totalReceived,
    bankReceived,
    cashReceived,
    TR
  ) => {
    const url = "http://localhost/backend_lms/setQuery.php";

    // Construct the query to insert the transaction
    const query = `INSERT INTO transaction (CustName,projectName, blockName, plotno,date, paymentType, amount, bankMode, cheqNo, bankName,transactionStatus,statusDate, remarks,totalBalance,bankBalance,cashBalance,totalReceived,bankReceived,cashReceived,TR) 
      VALUES ('${CustName}','${projectName}', '${blockName}', '${plotNo}','${date}', '${paymentType}', ${amount}, '${bankMode}', '${cheqNo}', '${bankName}','${transactionStatus}','${statusDate}','${remarks}','${totalBalance}','${bankBalance}','${cashBalance}','${totalReceived}','${bankReceived}','${cashReceived}','${TR}')`;

    const updateQuery = `
      UPDATE transaction
      SET totalReceived = totalReceived + ${amount},
          cashReceived = cashReceived + ${paymentType === "Cash" ? amount : 0},
          bankReceived = bankReceived + ${paymentType === "Bank" ? amount : 0},
          cashBalance = cashBalance - ${paymentType === "Cash" ? amount : 0},
          bankBalance = bankBalance - ${paymentType === "Bank" ? amount : 0},
          totalBalance = totalBalance - ${amount}
      WHERE projectName = '${projectName}' AND blockName = '${blockName}' AND plotno = '${plotNo}'
      ORDER BY date DESC
      LIMIT 1
       `;

    const formData = new FormData();
    formData.append("query", query);

    try {
      const response = await axios.post(url, formData);

      formData.set("query", updateQuery);

      return response.data;
    } catch (error) {
      console.error("Error inserting transaction:", error);
      throw error;
    }
  };

  const handleTransfer = async (ID, rem) => {
    console.log("propsID", ID);
    console.log("rem", rem);
    if (transferData && transactionData[transferData.index]) {
      const selectedRow = transactionData[transferData.index];
      const fromProject = selectedRow.projectName;
      const fromBlock = selectedRow.blockName;
      const fromPlot = selectedRow.plotno;
      const Remark = rem;

      setTransferProjectName(selectedRow.projectName);
      setTransferBlockName(selectedRow.blockName);
      setTransferPlotName(selectedRow.plotno);

      const transferRemark = `Transfer to ${transferProjectName} , ${transferBlockName} , ${transferPlotName} on ${new Date().toISOString().split("T")[0]
        }`;
      const receivedRemark = ` Received from ${fromProject} , ${fromBlock} , ${fromPlot} on  ${new Date().toISOString().split("T")[0]
        }`;
      const confirmed = window.confirm(
        `Do you want to transfer this transaction from ${fromProject} ${fromBlock} ${fromPlot} to ${transferProjectName} ${transferBlockName} ${transferPlotName}?`
      );

      if (confirmed) {
        if (
          fromProject !== transferProjectName ||
          fromBlock !== transferBlockName ||
          fromPlot != transferPlotName
        ) {
          selectedRow.remarks = transferRemark;

          const transferredRow = {
            ...selectedRow,
            projectName: transferProjectName,
            blockName: transferBlockName,
            plotno: transferPlotName,
            remarks: Remark,
            TR: receivedRemark,
          };

          try {
            await insertTransaction(
              transferredRow.CustName,
              transferProjectName,
              transferBlockName,
              transferPlotName,
              transferredRow.date,
              transferredRow.paymentType,
              transferredRow.amount,
              transferredRow.bankMode,
              transferredRow.cheqNo,
              transferredRow.bankName,
              transferredRow.transactionStatus,
              transferredRow.statusDate,
              transferredRow.remarks,
              transferredRow.totalBalance,
              transferredRow.bankBalance,
              transferredRow.cashBalance,
              transferredRow.totalReceived,
              transferredRow.bankReceived,
              transferredRow.cashReceived,
              transferredRow.TR
            );
          } catch (error) {
            console.error("Error inserting transferred transaction:", error);
            return;
          }

          try {
            const url = "http://localhost/backend_lms/transferaction.php";
            let fData = new FormData();

            fData.append("id", ID);
            fData.append("action", transferRemark);

            const response = await axios.post(url, fData);
            console.log("response", response);

            if (response) {
              setRender((prev) => !prev);
            }
          } catch (error) {
            console.log(error);
          }
        }

        const updatedTransactionData = [...transactionData];
        updatedTransactionData[transferData.index] = selectedRow;

        setTransactionData(updatedTransactionData);

        const tableRow = document.getElementById(`row-${transferData.index}`);
        const remarksCell = tableRow.cells[tableRow.cells.length - 1];
        remarksCell.textContent = selectedRow.remarks;

        const logMessage = `Payment transaction for row ${transferData.index + 1
          } has been transferred from ${fromProject} ${fromBlock} ${fromPlot} to ${transferProjectName} ${transferBlockName} ${transferPlotName} with payment type: ${selectedRow.paymentType
          }, amount: ${selectedRow.amount}, bank mode: ${selectedRow.bankMode
          }, CHQ/REF NO: ${selectedRow.cheqNo}, bank name: ${selectedRow.bankName
          }`;
        console.log(logMessage);

        try {
          const statusUpdateSuccess = await trasnferTransactionStatus(
            selectedRow.id,
            selectedRow
          );
          if (!statusUpdateSuccess) {
            console.error("Failed to update transaction status.");
            return;
          }
        } catch (error) {
          console.error("Error updating transaction status:", error);
          return;
        }

        setTransferredRows([...transferredRows, transferData.index]);

        toast({
          title: "Transfer Successful",
          description: `Payment transaction has been transferred from ${fromProject} ${fromBlock} ${fromPlot} to ${transferProjectName} ${transferBlockName} ${transferPlotName}.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        // Reload the page
        // window.location.reload();

        setIsTransferModalOpen(false);
        loadTransaction();
      }
    } else {
      console.error("Error: Selected row data is undefined.");
    }
  };

  const handleContractorButtonClick = () => {
    let newData = { ...filterPlotOne[0], contractorName, constAmt };
    storeData(newData);
    navigate("/contractortransaction");
  };
  const handleBrokerButtonClick = () => {
    let newData = { ...filterPlotOne[0], brokerName };
    storeData(newData);
    navigate("/brokertransaction");
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (goData) {
      setProjectName(goData.projectName);
      setBlockname(goData.blockName);
      setPlotName(goData.plotNo);

      loadBlocks(goData.projectName);
      console.log("1");
      loadPlots1(goData.blockName, goData.projectName);
      console.log("2");
      if (toggle) {
        console.log("togglr", toggle);
        setData1(goData.projectName, goData.blockName, goData.plotNo);
      }
    }
    console.log(filterPlotOne);
  }, []);

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const response = await fetch(
          "http://worldtimeapi.org/api/timezone/Etc/UTC"
        );
        const data = await response.json();
        const utcDate = new Date(data.utc_datetime);
        const formattedDate = utcDate.toISOString().split("T")[0];
        setCurrentDate(formattedDate);
      } catch (error) {
        console.error("Error fetching date:", error);
      }
    };

    fetchDate();
  }, []);

  const HistoryShower = () => {
    navigate("/Plothistory", {
      state: {
        projectName,
        blockName,
        plotName,
      },
    });
  };


  const approveAction = async () => {
    let bookedStatus = filterPlotOne[0].booked;
    let id = filterPlotOne[0].id;
    console.log(
      "filterPlotOne[0]",
      filterPlotOne[0].id,
      filterPlotOne[0].booked
    );

    if (bookedStatus == "Approved") {
      console.log("call");
      let query = `UPDATE plot SET booked = '', mark = 0 WHERE id = ${id}`;
      const url = "http://localhost/backend_lms/getQuery.php";
      let fData = new FormData();
      fData.append("query", query);
      try {
        const response = await axios.post(url, fData);
        setApprovedPlotIds((prev) => new Set(prev).add(id));
        // setTimeout(()=>{
        if (response.data) {
          toast({
            title: "Approve Status Change Succesfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          // setAPVisible(false);
          // setAPTickVisible(false);
          // setIsApprove(false);
        }
        // },[5000]);
      } catch (error) {
        console.log(error.toJSON());
      }

    } else {
      const appro = alert("Do you really want to approve the Registry?")
      if (appro === true) {
        let query = `UPDATE plot SET booked = 'Approved' WHERE id = ${id}`;
        const url = "http://localhost/backend_lms/getQuery.php";
        let fData = new FormData();
        fData.append("query", query);
        try {
          const response = await axios.post(url, fData);
          setApprovedPlotIds((prev) => new Set(prev).add(id));
          if (response.data) {
            toast({
              title: "Plot is ready to Register",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            setAPVisible(true);
            setIsApprove(true);
          }

        } catch (error) {
          console.log(error.toJSON());
        }
      }
    }

  };

  const handleMark = async () => {
    let query =
      "Update plot SET mark = 1 WHERE  blockName  = '" +
      blockName +
      "' AND projectName ='" +
      projectName +
      "'AND plotno ='" +
      plotName +
      "';";
    const url = "http://localhost/backend_lms/getQuery.php";
    let fData = new FormData();
    fData.append("query", query);
    try {
      const response = await axios.post(url, fData);

      if (response.data) {
        toast({
          title: "Approve Status Change Succesfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setAPTickVisible(true);
      }
    } catch (error) {
      console.log(error.toJSON());
    }
  };
  console.log("log", filterPlotOne[0]);




  useEffect(() => {
    // If there's no registry date in the plot, set today's date as the default
    if (!currentPlot[0]?.registryDate) {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0]; // Format to YYYY-MM-DD
      setRegistryDate(formattedDate);
    } else {
      // If there's a registry date in currentPlot, use it
      setRegistryDate(currentPlot[0]?.registryDate);
    }
  }, [currentPlot]);


  return (
    <Box display={"flex"} height={"100vh"} maxW={"100vw"} ref={componentRef}>
      <Box flex={"20%"} borderRight={"1px solid grey"}>
        <VStack alignItems={"flex-start"} gap={0}>
          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="projectName" fontSize={"12px"}>
                Project Name
              </FormLabel>
              {goData.projectName ? (
                <Select
                  id="projectName"
                  value={projectName || goData.projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    loadBlocks(e.target.value);
                  }}
                  w={"60%"}
                >
                  {projectsData.map((project) => {
                    return (
                      <option
                        key={project.projectName}
                        value={project.projectName}
                      >
                        {project.projectName}
                      </option>
                    );
                  })}
                </Select>
              ) : (
                <Select
                  id="projectName"
                  // value={constructionData.projectName?constructionData.projectName:""}
                  placeholder="Select Project"
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    loadBlocks(e.target.value);
                  }}
                  w={"60%"}
                >
                  {projectsData.map((project) => {
                    return (
                      <option
                        key={project.projectName}
                        value={project.projectName}
                      >
                        {project.projectName}
                      </option>
                    );
                  })}
                </Select>
              )}
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="blockName" fontSize={"12px"}>
                Block Name
              </FormLabel>
              {goData.blockName ? (
                <Select
                  id="blockName"
                  placeholder="Select Block Name"
                  value={projectName || goData.projectName}
                  w={"60%"}
                ></Select>
              ) : (
                <Select
                  id="blockName"
                  placeholder="Select Block"
                  onChange={(e) => {
                    setBlockname(e.target.value);
                    loadPlots(e.target.value);
                  }}
                  w={"60%"}
                >
                  {blockData.map((block, index) => {
                    return (
                      <option key={index} value={block.blockName}>
                        {block.blockName}
                      </option>
                    );
                  })}
                </Select>
              )}
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="plotNo" fontSize={"12px"}>
                Plot No
              </FormLabel>
              {goData.plotNo ? (
                <Select
                  id="plotNo"
                  placeholder={plotName || goData.plotNo}
                  w={"60%"}
                ></Select>
              ) : (
                <Select
                  id="plotNo"
                  placeholder="Select Plot No"
                  // value={constructionData.plotNo?constructionData.plotNo:""}
                  onChange={(e) => {
                    setPlotName(e.target.value);
                    setData(e.target.value);
                  }}
                  w={"60%"}
                >
                  {plotData.map((plot) => {
                    return (
                      <option key={plot.plotNo} value={plot.plotNo}>
                        {plot.plotNo}
                      </option>
                    );
                  })}
                </Select>
              )}
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="plotType" fontSize={"12px"}>
                Plot Type
              </FormLabel>
              <Select id="plotType" w={"60%"} placeholder="Select ">
                <option value="Normal">Normal</option>
                <option value="EWS">EWS</option>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="4BHK">4BHK</option>
                <option value="5BHK">5BHK</option>
                {/* Add more options as needed */}
              </Select>
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="custName" fontSize={"12px"}>
                Cust Name
              </FormLabel>
              <Input
                id="custName"
                type="text"
                value={custName}
                placeholder="Enter Cust name"
                w={"60%"}
                isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="custAddress" fontSize={"12px"}>
                Cust Add
              </FormLabel>
              <Textarea
                id="custAddress"
                resize={"horizontal"}
                placeholder="Enter Address"
                w={"60%"}
                minH={"2.5rem"}
                isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel fontSize={"12px"}>Ares Sqft</FormLabel>
              <Input
                id="areaSqmt"
                type="number"
                value={areaSqft}
                onChange={(e) => setAreaSqft(Number(e.target.value))}
                placeholder="Enter Area Sqft"
                w={"60%"}
                isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="ratePerSqft" fontSize={"12px"}>
                Rate Per Sqft
              </FormLabel>
              <Input
                id="ratePerSqmt"
                type="number"
                value={ratePerSqft}
                onChange={(e) => setRatePerSqft(Number(e.target.value))}
                placeholder="Enter Rate Sqft"
                w={"60%"}
                isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="totalAmount" fontSize={"12px"}>
                Total Amt
              </FormLabel>
              <Input
                id="totalAmount"
                type="number"
                value={totalAmt}
                placeholder="Enter Amount"
                w={"60%"}
                isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="discount" fontSize={"12px"}>
                Discount
              </FormLabel>
              <Select
                id="discountApplicable"
                value={discount}
                onChange={(e) => {
                  setDiscount(e.target.value);

                }}
                placeholder="Select Discount"
                w={"60%"}
                isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                {/* Add more options as needed */}
              </Select>
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="discountPercent" fontSize={"12px"}>
                Discount%
              </FormLabel>
              <Input
                id="discountPercent"
                type="number"
                value={discountPercent}
                onChange={(e) => {
                  // Multiple statements need to be wrapped inside {}
                  setDiscountPercent(Number(e.target.value));
                  // updateOnChange();
                }}
                placeholder="Enter Discount%"
                w={"60%"}
                isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="netAmount" fontSize={"12px"}>
                Net Amt
              </FormLabel>
              <Input
                id="netAmount"
                type="number"
                value={Math.floor(netAmt)}
                onChange={(e) => setNetAmt(Number(e.target.value))}
                placeholder="Enter Amount"
                w={"60%"}
                isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="registryAmount" fontSize={"12px"}>
                Registry Amt
              </FormLabel>
              <Input
                id="registryAmount"
                type="number"
                value={registryAmt}
                onChange={(e) => setRegistryAmt(Number(e.target.value))}
                placeholder="Enter Registry"
                w={"60%"}
                isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="serviceAmount" fontSize={"12px"}>
                Service Amt
              </FormLabel>
              <Input
                id="serviceAmount"
                type="number"
                value={serviceAmt}
                onChange={(e) => setServiceAmt(Number(e.target.value))}
                placeholder="Enter Amount"
                w={"60%"}
                isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="maintenanceAmount" fontSize={"12px"}>
                Maintenace Amt
              </FormLabel>
              <Input
                id="maintenanceAmount"
                type="number"
                value={maintenanceAmt}
                onChange={(e) => setMaintenanceAmt(Number(e.target.value))}
                placeholder="Enter Amount"
                w={"60%"}
                isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="miscAmount" fontSize={"12px"}>
                Misc Amt
              </FormLabel>
              <Input
                id="miscAmount"
                type="number"
                value={miscAmt}
                onChange={(e) => setMiscAmt(Number(e.target.value))}
                placeholder="Enter Amount"
                w={"60%"}
                isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="grandTotal" fontSize={"12px"}>
                Grand Total
              </FormLabel>
              <Input
                id="grandTotal"
                type="number"
                value={grandTotal}
                onChange={(e) => setGrandTotal(Number(e.target.value))}
                placeholder="Enter Amount"
                w={"60%"}
                isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="construction" fontSize={"12px"}>
                Const Yes/No
              </FormLabel>
              <Select
                id="constructionApplicable"
                placeholder="Select"
                value={constYesNo}
                w={"60%"}
                isDisabled={userRight === "SalesPerson"}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                {/* Add more options as needed */}
              </Select>
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="contractor" fontSize={"12px"}>
                Contractor
              </FormLabel>
              <Select
                id="constructionContractor"
                placeholder="Select"
                value={contractorName}
                onChange={(e) => {
                  setcontractorName();
                }}
                w={"60%"}
                isDisabled={userRight === "SalesPerson"}
              >
                {contractorData.map((block) => {
                  return (
                    <option
                      key={block.contractorName}
                      value={block.contractorName}
                    >
                      {block.contractorName}
                    </option>
                  );
                })}
              </Select>
            </Flex>
          </FormControl>
          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="broker" fontSize={"12px"}>
                Broker
              </FormLabel>
              <Select
                id="broker"
                placeholder="Select"
                value={brokerName}
                onChange={(e) => {
                  setbrokerName(e.target.value); // Pass the selected value to setbrokerName
                }}
                w={"60%"}
                isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
              >
                {brokerData.map((block) => {
                  return (
                    <option key={block.brokerName} value={block.brokerName}>
                      {block.brokerName}
                    </option>
                  );
                })}
              </Select>
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="constructionAmount" fontSize={"12px"}>
                Const Amt
              </FormLabel>
              <Input
                id="constructionAmount"
                type="number"
                value={constAmt}
                onChange={(e) => setConstAmt(Number(e.target.value))}
                placeholder="Enter Amount"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="totalAmountPayable" fontSize={"12px"}>
                Total Amt Payable
              </FormLabel>
              <Input
                id="totalAmountPayable"
                type="number"
                value={totalAmtPayable}
                onChange={(e) => setTotalAmtPayable(Number(e.target.value))}
                placeholder="Enter Amount"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="guidelineAmount" fontSize={"12px"}>
                Guideline Amt
              </FormLabel>
              <Input
                id="guidelineAmount"
                type="number"
                value={guidelineAmt}
                onChange={(e) => setGuidelineAmt(Number(e.target.value))}
                placeholder="Enter Amount"
                w={"60%"}
                isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="registryPercent" fontSize={"12px"}>
                Registry%
              </FormLabel>
              <Input
                id="registryPercent"
                type="number"
                value={registryPercent}
                onChange={(e) => setRegistryPercent(Number(e.target.value))}
                placeholder="Enter Amount"
                w={"60%"}
                isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="bankAmountPayable" fontSize={"12px"}>
                Bank Amt Payable
              </FormLabel>
              <Input
                id="bankAmountPayable"
                type="number"
                placeholder="Enter Amount"
                w={"60%"}
                value={bankAmtPayable}
                onChange={(e) => setBankAmtPayable(Number(e.target.value))}
                isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="cashAmountPayable" fontSize={"12px"}>
                Cash Amt Payable
              </FormLabel>
              <Input
                id="cashAmountPayable"
                type="number"
                value={cashAmtPayable}
                onChange={(e) => setCashAmtPayable(Number(e.target.value))}
                placeholder="Enter Amount"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <Flex padding={"0px 4px 0px 4px"} alignSelf={"end"}>
            {showAction && (
              <>
                <HStack>
                  <Button onClick={handleContractorButtonClick} isDisabled={userRight === "SalesPerson" || userRight === "Manager"}>
                    Contractor
                  </Button>
                  <Button onClick={handleBrokerButtonClick} isDisabled={userRight === "SalesPerson" || userRight === "Manager"}>Broker</Button>
                  <Button colorScheme="blue" onClick={editPlot}>
                    {" "}
                    Save
                  </Button>
                </HStack>
              </>
            )}
          </Flex>
          {/* <Center>
            <hr style={{ width: "80%", marginTop: "10px" }} />
          </Center> */}
        </VStack>
      </Box>



      <Box flex={"80%"} maxW={"80%"}>
        <Box borderBottom={"1px solid black"} w={"100%"} p={2} pb={4}>
          <HStack justifyContent={"space-between"}>
            <Box maxW={"85%"}>
              <HStack marginLeft={2}>
                <FormControl>
                  <Flex
                    align="center"
                  // justifyContent={"space-between"}
                  // padding={"0px 4px 0px 4px"}
                  >
                    <FormLabel fontSize={"sm"}>Plot Status</FormLabel>
                    <Input
                      type="text"
                      value={filterPlotOne[0]?.plotStatus}
                      id="plotStatus"
                      w={"60%"}
                    />
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="center"
                  // justifyContent={"space-between"}
                  // padding={"0px 4px 0px 4px"}
                  >
                    <FormLabel fontSize={"sm"}> Gender</FormLabel>
                    <Input type="text" id="registryGender" w={"60%"} isDisabled={userRight === "SalesPerson" || userRight === "Manager"} />
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="center"
                  // justifyContent={"space-between"}
                  // padding={"0px 4px 0px 4px"}
                  >
                    <FormLabel fontSize={"sm"}>Booking </FormLabel>
                    <Input type="date" id="bookingDate" w={"60%"} isDisabled={userRight === "SalesPerson" || userRight === "Manager"} />
                  </Flex>
                </FormControl>
                <FormControl>

                  <Flex align="center">

                    {/* <FormLabel fontSize="sm">Registry Date</FormLabel>
                    <Input
                      type="date"
                      value={currentPlot[0]?.registryDate || ""}
                      id="registryD"
                      w="60%"
                      filterPlotOne
                      onChange={(e) => setRegistryDate(e.target.value)}
                      disabled={Boolean(currentPlot[0]?.registryDate)}
                    /> */}
                    <FormLabel fontSize="sm">Registry Date</FormLabel>
                    <Input
                      type="date"
                      value={registryDate}
                      id="registryD"
                      w="60%"
                      onChange={(e) => setRegistryDate(e.target.value)}
                      disabled={Boolean(currentPlot[0]?.registryDate) || (userRight === "SalesPerson" || userRight === "Manager")} // Disable input if registryDate already exists
                    />

                    {APVisible && (
                      <Button size="md" ml={2} colorScheme="blue" onClick={handleMark} isDisabled={userRight === "SalesPerson" || userRight === "Manager"}>
                        AP
                      </Button>
                    )}
                    {/* {filterPlotOne[0]?.booked === "Approved" && (
                      <Button
                        size="md"
                        ml={2}
                        colorScheme="blue"
                        onClick={handleMark}
                      >
                        AP
                      </Button>
                    )} */}

                    {APTickVisible && (
                      <Button
                        size="md"
                        ml={2}
                        colorScheme="blue"
                        leftIcon={<span style={{ color: "green" }} isDisabled={userRight === "SalesPerson" || userRight === "Manager"}>✔️</span>}
                      >
                        AP
                      </Button>
                    )}

                    {/* {filterPlotOne[0]?.mark === "1" && (
                      <Button
                        size="md"
                        ml={2}
                        colorScheme="blue"
                        leftIcon={<span style={{ color: "green" }}>✔️</span>}
                      >
                        AP
                      </Button>
                    )} */}
                  </Flex>
                </FormControl>

              </HStack>
              <Divider mt={4} />
              <HStack
                alignContent={"flex-start"}
                justifyContent={"space-between"}
                mt={4}
                mb={4}
              >
                <VStack>
                  <Text>
                    Total Payable ={" "}
                    <span id="totalPayable">{totalPayable}</span>
                    {console.log(totalPayable)}

                  </Text>
                  <Text>
                    Bank Payable ={" "}
                    <span id="bankPayable">{bankAmountPayable}</span>
                  </Text>
                  <Text>
                    Cash Payable ={" "}
                    <span id="cashPayable">{cashAmountPayable}</span>
                  </Text>
                </VStack>
                <VStack>
                  <Text>
                    Total Received = {""}
                    <span id="totalReceived">{totalAmount}</span>
                  </Text>
                  <Text>
                    Bank Received = <span id="bankReceived">{bankreceive}</span>
                  </Text>
                  <Text>
                    Cash Received = <span id="cashReceived">{cashReceive}</span>
                  </Text>
                </VStack>
                <VStack>
                  <Text>
                    {/* <span id="totalReceived">{totalAmount}</span> */}
                    Total Balance = <span id="totalBalance">{totalPayable - totalAmount}</span>
                  </Text>
                  <Text>
                    Bank Balance = <span id="bankBalance">{bankAmountPayable - bankreceive}</span>
                  </Text>
                  <Text>
                    Cash Balance = <span id="cashBalance">{cashAmountPayable - cashReceive}</span>
                  </Text>
                </VStack>
              </HStack>
            </Box>
            <VStack>
              {showButtons && (
                <>
                  {/* //filterPlotOne[0]?.booked === "Approved" */}
                  {isApprove ? (
                    <Button
                      colorScheme="blue"
                      size={"sm"}
                      ml={"6"}
                      onClick={approveAction}
                      className="hide-on-print"
                      isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
                    >
                      Un Approve
                    </Button>
                  ) : (
                    <Button
                      colorScheme="blue"
                      size={"sm"}
                      ml={"20"}
                      onClick={approveAction}

                      className="hide-on-print"
                      isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
                    >
                      To Approve
                    </Button>
                  )}
                  {filterPlotOne[0]?.plotStatus === "Registered" ? (
                    <Button
                      colorScheme="gray"
                      size={"sm"}
                      onClick={unRegistry}
                      className="hide-on-print"
                      isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
                    >
                      UnRegistry
                    </Button>
                  ) : (
                    <Button
                      colorScheme="gray"
                      size={"sm"}
                      onClick={onRegistry}
                      className="hide-on-print"
                      isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
                    >
                      Registry
                    </Button>
                  )}

                  <Button
                    isDisabled={filterPlotOne[0]?.plotStatus === "Registered"}
                    size={"sm"}
                    onClick={cancelPlot}
                    colorScheme="gray"
                    className="hide-on-print"
                    isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
                  >
                    Cancel Plot
                  </Button>
                  <Button
                    isDisabled={filterPlotOne[0]?.plotStatus === "Registered"}
                    size={"sm"}
                    colorScheme="gray"
                    onClick={deletePlot}
                    className="hide-on-print"
                    isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
                  >
                    Delete Plot
                  </Button>
                  <Button
                    size={"sm"}
                    colorScheme="gray"
                    className="hide-on-print"
                    onClick={() => {
                      setIsTransferAllModalOpen(true);
                    }}
                    isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
                  >
                    Transfer All
                  </Button>
                  <Button
                    size={"sm"}
                    colorScheme="gray"
                    className="hide-on-print"
                    onClick={HistoryShower}
                  >
                    History
                  </Button>
                </>
              )}
            </VStack>
          </HStack>
          <Divider w={"100%"} bg={"#121212"} />
          <HStack
            alignContent={"flex-start"}
            justifyContent={"space-between"}
            mt={4}
          >
            <Text>Payment Transaction</Text>
            {showPayment && (
              <>
                <Button
                  className="hide-on-print"
                  colorScheme="gray"
                  size="sm"
                  onClick={() => {

                    totalPayable > totalAmount ? setdisplay(!display) : setdisplay(display);

                  }}
                  disabled={totalPayable <= totalAmount}
                >
                  Add Payment
                </Button>
              </>
            )}
          </HStack>
          <Divider w={"100%"} bg={"#121212"} mt={4} />
          <Box display={display == true ? "flex" : "none"}>
            <VStack alignItems={"flex-start"}>
              <HStack gap={"15px"} p={3}>
                <FormControl>
                  <Flex
                    align="flex-start"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                    flexDirection={"column"}
                  >
                    <FormLabel fontSize={"sm"} margin={0}>
                      Date
                    </FormLabel>
                    <Input
                      id="date"
                      required
                      type="date"
                      isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
                    // w={"60%"}
                    // value={currentDate}
                    />
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="flex-start"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                    flexDirection={"column"}
                  >
                    <FormLabel fontSize={"sm"} margin={0}>
                      Payment Type
                    </FormLabel>
                    <Select
                      placeholder="Select"
                      id="paymentType"
                      name="paymentType"
                      // selectMode,
                      required
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank">Bank</option>
                      {/* Add more projects as needed */}
                    </Select>
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="flex-start"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                    flexDirection={"column"}
                  >
                    <FormLabel fontSize={"sm"} margin={0}>
                      Amount
                    </FormLabel>
                    <Input
                      id="amount"
                      type="number"
                      required
                    // w={"60%"}
                    />
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="flex-start"
                    flexDirection={"column"}
                  >
                    <FormLabel fontSize={"sm"} margin={0}>
                      bank Mode
                    </FormLabel>
                    <Select placeholder="Select " id="bankMode" required>
                      <option value="none">None</option>
                      <option value="cheque">Cheque/DD</option>
                      <option value="rtgs">RTGS/NEFT</option>
                      <option value="loan">Loan</option>
                      <option value="upi">UPI</option>

                      {/* Add more projects as needed */}
                    </Select>
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="flex-start"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                    flexDirection={"column"}
                  >
                    <FormLabel fontSize={"sm"} margin={0}>
                      Chq/Ref No
                    </FormLabel>
                    <Input
                      id="cheqNo"
                      type="text"
                      required
                    // w={"60%"}
                    />
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="flex-start"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                    flexDirection={"column"}
                  >
                    <FormLabel fontSize={"sm"} margin={0}>
                      bank Name
                    </FormLabel>
                    <Input
                      id="bankName"
                      required
                      type="text"
                    // w={"60%"}
                    />
                  </Flex>
                </FormControl>
              </HStack>
              <HStack gap={"15px"} p={3} pt={0}>
                <FormControl>
                  <Flex
                    align="flex-start"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                    flexDirection={"column"}
                  >
                    <FormLabel fontSize={"sm"} margin={0}>
                      Trasaction State
                    </FormLabel>
                    <Select id="transactionStatus" placeholder="Select">
                      <option value="Pending">Pending</option>
                      <option value="Clear" isDisabled={userRight === "SalesPerson" || userRight === "Manager"}>Clear</option>
                      <option value="PDC">PDC</option>
                      <option value="Provisional">Provisional</option>
                      <option value="Bounced">Bounced</option>
                      <option value="Return">Returned</option>

                      {/* Add more projects as needed */}
                    </Select>
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="flex-start"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                    flexDirection={"column"}
                  >
                    <FormLabel fontSize={"sm"} margin={0}>
                      Status Date
                    </FormLabel>
                    <Input
                      id="statusDate"
                      type="Date"
                      required
                      isDisabled={userRight === "SalesPerson" || userRight === "Manager"}
                    // w={"60%"}
                    />
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="flex-start"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                    flexDirection={"column"}
                  >
                    <FormLabel fontSize={"sm"} margin={0}>
                      Remarks
                    </FormLabel>
                    <Input id="remarks" type="text" w={"250%"} required />
                  </Flex>
                </FormControl>
              </HStack>
              {
                (totalPayable > totalAmount) ?
                  <Button
                    colorScheme="telegram"
                    alignSelf={"flex-end"}
                    size={"md"}
                    m={3}
                    mt={0}
                    onClick={
                      addPayment
                    }
                  >
                    Submit
                  </Button>
                  :
                  <Button
                    colorScheme="telegram"
                    alignSelf={"flex-end"}
                    size={"md"}
                    m={3}
                    mt={0}
                    disabled
                  >
                    Submit
                  </Button>

              }
            </VStack>
          </Box>
          <Divider w={"100%"} bg={"#121212"} />
          <Box display={""}>
            <TableContainer>
              <Table size={"sm"}>
                <Thead color={"white"}>
                  <Tr bg={"#121212"}>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      SrNo.
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      Date
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      Type
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      Amount
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      bank Mode
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      Chq/Ref No
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      bank Name
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      Trans Stat
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      Stat Date
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      Remarks
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      TR
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      Payment Time
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      User Name
                    </Th>
                    {showAction && (
                      <>
                        <Th
                          color={"white"}
                          border="1px solid black"
                          p={"8px"}
                          textAlign={"center"}
                          className="hide-on-print"
                        >
                          Action
                        </Th>
                      </>
                    )}
                  </Tr>
                </Thead>
                <Tbody>
                  {transactionData.map((res, index) => (
                    <tr key={res.date} id={`row-${index}`}>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color: res.action.length > 15 ? "#E53E3E" : "inherit",
                          textDecoration:
                            res.action.length > 15 ? "line-through" : "none",
                        }}
                      >
                        {index + 1}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color: res.action.length > 15 ? "#E53E3E" : "inherit",
                          textDecoration:
                            res.action.length > 15 ? "line-through" : "none",
                        }}
                        id="date"
                      >
                        {res.date
                          ? new Date(res.date)
                            .toLocaleDateString("en-GB")
                            .replace(/\//g, "/")
                          : ""}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color: res.action.length > 15 ? "#E53E3E" : "inherit",
                          textDecoration:
                            res.action.length > 15 ? "line-through" : "none",
                        }}
                        id="payType"
                      >
                        {res.paymentType}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color: res.action.length > 15 ? "#E53E3E" : "inherit",
                          textDecoration:
                            res.action.length > 15 ? "line-through" : "none",
                        }}
                        id="amount"
                      >
                        {res.amount}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color: res.action.length > 15 ? "#E53E3E" : "inherit",
                          textDecoration:
                            res.action.length > 15 ? "line-through" : "none",
                        }}
                        id="bankMode"
                      >
                        {res.bankMode}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color: res.action.length > 15 ? "#E53E3E" : "inherit",
                          textDecoration:
                            res.action.length > 15 ? "line-through" : "none",
                        }}
                        id="checkRef"
                      >
                        {res.cheqNo}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color: res.action.length > 15 ? "#E53E3E" : "inherit",
                          textDecoration:
                            res.action.length > 15 ? "line-through" : "none",
                        }}
                        id="bankName"
                      >
                        {res.bankName}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          Color:
                            res.Status === "Transferred" ? "white" : "inherit",
                          backgroundColor:
                            res.transactionStatus === "Clear"
                              ? "#22c35e"
                              : res.transactionStatus === "Provisional"
                                ? "#ECC94B"
                                : res.transactionStatus === "Pending" ||
                                  res.transactionStatus === "PDC"
                                  ? "#ECC94B"
                                  : "inherit",
                          textDecoration:
                            res.transactionStatus === "Bounced" ||
                              res.action.length > 15
                              ? "line-through"
                              : "none",
                        }}
                        id="transStat"
                      >
                        {res.transactionStatus}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color: res.action.length > 15 ? "#E53E3E" : "inherit",
                          textDecoration:
                            res.action.length > 15 ? "line-through" : "none",
                        }}
                        id="statDate"
                      >
                        {res.statusDate
                          ? new Date(res.statusDate)
                            .toLocaleDateString("en-GB")
                            .replace(/\//g, "/")
                          : ""}
                      </Td>

                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color: res.action.length > 15 ? "#E53E3E" : "inherit",
                          textDecoration:
                            res.action.length > 15 ? "line-through" : "none",
                        }}
                        id="remarks"
                      >
                        {res.remarks}
                      </Td>
                      {/* Action Cell */}

                      <Td border={"1px"}>
                        <Popover trigger="hover" placement="bottom">
                          {res.TR.length || res.action.length ? (
                            <PopoverTrigger>
                              <Button>TR</Button>
                            </PopoverTrigger>
                          ) : (
                            ""
                          )}
                          <PopoverContent
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            fontSize={"18px"}
                            width={"600px"}
                            height={"60px"}
                            bg={"black"}
                            textColor={"white"}
                          >
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverBody>
                              {res.action.length > 15 ? res.action : res.TR}
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Td>

                      <Td
                        border="1px solid black"
                        p={"8px"}
                        textAlign={"center"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color: res.action.length > 15 ? "#E53E3E" : "inherit",
                          textDecoration:
                            res.action.length > 15 ? "line-through" : "none",
                        }}
                        id="paymentTime"
                      >
                        {res.currentTime.slice(11, 19)}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        textAlign={"center"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color: res.action.length > 15 ? "#E53E3E" : "inherit",
                          textDecoration:
                            res.action.length > 15 ? "line-through" : "none",
                        }}
                        id="userName"
                      ></Td>

                      <Td
                        // display={"flex"}
                        gap={"10px"}
                        border="1px solid black"
                        p={"8px"}
                        className="hide-on-print"
                      >
                        <Button
                          marginRight={"15px"}
                          marginLeft={"10px"}
                          onClick={() => handleTransferButtonClick(res, index)}
                          size={"sm"}
                          isDisabled={userRight === "SalesPerson" || userRight === "Manager" || res.action.length > 15}
                        >
                          Transfer
                        </Button>
                        <Button
                          marginRight={"15px"}
                          colorScheme="green"
                          size={"sm"}
                          onClick={() => handleEditClick(res)}
                          isDisabled={res.action.length > 15}
                        >
                          Edit
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={() => handleDeletePayment(res.id)}
                          size={"sm"}
                          isDisabled={res.action.length > 15}
                        >
                          Delete
                        </Button>
                        <DeleteConfirmationDialog
                          isOpen={isDeleteDialogOpen}
                          onClose={() => setIsDeleteDialogOpen(false)}
                          onConfirm={deletePayment}
                        />
                      </Td>
                    </tr>
                  ))}

                  {/* edit modal */}
                  <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    size={"xl"}
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Edit Payment</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div
                            style={{ display: "flex", marginBottom: "16px" }}
                          >
                            <FormControl style={{ marginRight: "16px" }}>
                              <FormLabel>Date</FormLabel>
                              <Input
                                id="date"
                                name="date"
                                value={editFormData.date}
                                onChange={handleEditChange}
                                type="date"
                              />
                            </FormControl>
                            <FormControl style={{ marginRight: "16px" }}>
                              <FormLabel>Payment Type</FormLabel>
                              <Select
                                id="paymentType"
                                name="paymentType"
                                value={editFormData.paymentType}
                                onChange={handleEditChange}
                                required
                              >
                                <option value="Cash">Cash</option>
                                <option value="Bank">Bank</option>
                              </Select>
                            </FormControl>
                            <FormControl>
                              <FormLabel>Amount</FormLabel>
                              <Input
                                id="amount"
                                name="amount"
                                value={editFormData.amount}
                                onChange={handleEditChange}
                                type="text"
                                required
                              />
                            </FormControl>
                          </div>
                          <div
                            style={{ display: "flex", marginBottom: "16px" }}
                          >
                            <FormControl style={{ marginRight: "16px" }}>
                              <FormLabel>Bank Mode</FormLabel>
                              <Select
                                id="bankMode"
                                name="bankMode"
                                value={editFormData.bankMode}
                                onChange={handleEditChange}
                              >
                                <option value="none">None</option>
                                <option value="cheque">Cheque/DD</option>
                                <option value="rtgs">RTGS/NEFT</option>
                                <option value="loan">Loan</option>
                                <option value="upi">UPI</option>
                              </Select>
                            </FormControl>
                            <FormControl style={{ marginRight: "16px" }}>
                              <FormLabel>Chq/Ref No</FormLabel>
                              <Input
                                id="cheqNo"
                                name="cheqNo"
                                value={editFormData.cheqNo}
                                onChange={handleEditChange}
                                type="text"
                                required
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Bank Name</FormLabel>
                              <Input
                                id="bankName"
                                name="bankName"
                                value={editFormData.bankName}
                                onChange={handleEditChange}
                                required
                                type="text"
                              />
                            </FormControl>
                          </div>
                          <div
                            style={{ display: "flex", marginBottom: "16px" }}
                          >
                            <FormControl style={{ marginRight: "16px" }}>
                              <FormLabel>Transaction Status</FormLabel>
                              <Select
                                id="transactionStatus"
                                name="transactionStatus"
                                value={editFormData.transactionStatus}
                                onChange={handleEditChange}
                                required
                              >
                                <option value="Pending">Pending</option>
                                <option value="Clear">Clear</option>
                                <option value="PDC">PDC</option>
                                <option value="Provisional">Provisional</option>
                                <option value="Bounced">Bounced</option>
                                <option value="Return">Returned</option>
                              </Select>
                            </FormControl>
                            <FormControl style={{ marginRight: "16px" }}>
                              <FormLabel>Status Date</FormLabel>
                              <Input
                                id="statusDate"
                                name="statusDate"
                                value={editFormData.statusDate}
                                onChange={handleEditChange}
                                type="Date"
                                required
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Remarks</FormLabel>
                              <Input
                                id="remarks"
                                name="remarks"
                                value={editFormData.remarks}
                                onChange={handleEditChange}
                                type="text"
                                required
                              />
                            </FormControl>
                          </div>
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button colorScheme="blue" onClick={handleEditSubmit}>
                          Save Changes
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setIsModalOpen(false)}
                        >
                          Cancel
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                  {/* tranfer modal */}
                  <Modal
                    isOpen={isTransferModalOpen}
                    onClose={() => setIsTransferModalOpen(false)}
                    size="xl"
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>
                        Transfer Transactions: {transferData.index + 1}
                      </ModalHeader>
                      <ModalCloseButton />
                      <ModalBody display={"flex"}>
                        {/* Input for 'From' */}
                        <FormControl>
                          <Text>From</Text>
                          <Flex flexDirection={"column"} gap={"7px"}>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Project Name :-
                              </FormLabel>
                              <Text>{projectName}</Text>
                            </Box>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Block Name :-
                              </FormLabel>
                              <Text>{blockName}</Text>
                            </Box>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Plot No:-
                              </FormLabel>
                              <Text>{plotName}</Text>
                            </Box>
                          </Flex>
                        </FormControl>

                        <FormControl>
                          <Text>To</Text>
                          <Flex flexDirection={"column"} gap={"7px"}>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Project Name
                              </FormLabel>
                              <Select
                                id="projectName"
                                placeholder="Select Project"
                                onChange={(e) => {
                                  setTransferProjectName(e.target.value);
                                  loadTransferBlock(e.target.value);
                                }}
                                w={"60%"}
                              >
                                {transferProject.map((project) => {
                                  return (
                                    <option
                                      key={project.projectName}
                                      value={project.projectName}
                                    >
                                      {project.projectName}
                                    </option>
                                  );
                                })}
                              </Select>
                            </Box>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Block Name
                              </FormLabel>
                              <Select
                                id="blockName"
                                placeholder="Select Block"
                                onChange={(e) => {
                                  setTransferBlockName(e.target.value);
                                  loadTransferPlot(e.target.value);
                                }}
                                w={"60%"}
                              >
                                {transferBlock.map((block) => {
                                  return (
                                    <option
                                      key={block.blockName}
                                      value={block.blockName}
                                    >
                                      {block.blockName}
                                    </option>
                                  );
                                })}
                              </Select>
                            </Box>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Plot No
                              </FormLabel>
                              <Select
                                id="plotNo"
                                placeholder="Select Plot No"
                                onChange={(e) => {
                                  setTransferPlotName(e.target.value);
                                  dataTransfer(e.target.value);
                                }}
                                w={"60%"}
                              >
                                {/* {transferPlot.map((plot) => {
                                  return (
                                    <option
                                      key={plot.plotNo}
                                      value={plot.plotNo}
                                    >
                                      {plot.plotNo}
                                    </option>
                                  );
                                })} */}

                                {transferPlot
                                  .filter((plot) => plot.plotNo !== plotName) // Filter out the given plotNo
                                  .map((plot) => (
                                    <option key={plot.plotNo} value={plot.plotNo}>
                                      {plot.plotNo}
                                    </option>
                                  ))}

                              </Select>
                            </Box>
                          </Flex>
                        </FormControl>
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          colorScheme="red"
                          mr={3}
                          onClick={() =>
                            handleTransfer(
                              transferData.id,
                              transferData.remarks
                            )
                          }
                        >
                          Transfer Transaction
                        </Button>
                        <Button onClick={() => setIsTransferModalOpen(false)}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>

                  {/* tranfer all modal */}
                  <Modal
                    isOpen={isTransferAllModalOpen}
                    onClose={() => setIsTransferAllModalOpen(false)}
                    size="xl"
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Transfer All Transactions</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody display={"flex"}>
                        {/* Input for 'From' */}
                        <FormControl>
                          <Text>From</Text>
                          <Flex flexDirection={"column"} gap={"7px"}>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Project Name :-
                              </FormLabel>
                              <Text>{projectName}</Text>
                            </Box>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Block Name :-
                              </FormLabel>
                              <Text>{blockName}</Text>
                            </Box>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Plot No:-
                              </FormLabel>
                              <Text>{plotName}</Text>
                            </Box>
                          </Flex>
                        </FormControl>

                        <FormControl>
                          <Text>To</Text>
                          <Flex flexDirection={"column"} gap={"7px"}>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Project Name
                              </FormLabel>
                              <Select
                                id="projectName"
                                placeholder="Select Project"
                                onChange={(e) => {
                                  setTransferAllProjectName(e.target.value);
                                  loadTransferAllBlock(e.target.value);
                                  setnewProjectName(e.target.value);
                                }}
                                w={"60%"}
                              >
                                {transferAllProject.map((project) => {
                                  return (
                                    <option
                                      key={project.projectName}
                                      value={project.projectName}
                                    >
                                      {project.projectName}
                                    </option>
                                  );
                                })}
                              </Select>
                            </Box>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Block Name
                              </FormLabel>
                              <Select
                                id="blockName"
                                placeholder="Select Block"
                                onChange={(e) => {
                                  setTransferAllBlockName(e.target.value);
                                  loadTransferAllPlot(e.target.value);
                                  setnewBlockName(e.target.value);
                                }}
                                w={"60%"}
                              >
                                {transferAllBlock.map((block) => {
                                  return (
                                    <option
                                      key={block.blockName}
                                      value={block.blockName}
                                    >
                                      {block.blockName}
                                    </option>
                                  );
                                })}
                              </Select>
                            </Box>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Plot No
                              </FormLabel>
                              <Select
                                id="plotNo"
                                placeholder="Select Plot No"
                                onChange={(e) => {
                                  setTransferAllPlotName(e.target.value);
                                  dataTransferAll(e.target.value);
                                  setnewPlotNo(e.target.value);
                                }}
                                w={"60%"}
                              >
                                {transferAllPlot.map((plot) => {
                                  return (
                                    <option
                                      key={plot.plotNo}
                                      value={plot.plotNo}
                                    >
                                      {plot.plotNo}
                                    </option>
                                  );
                                })}
                              </Select>
                            </Box>
                          </Flex>
                        </FormControl>
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          colorScheme="blue"
                          mr={3}
                          onClick={confirmTransferAll}
                        >
                          Transfer All Transaction
                        </Button>
                        <Button onClick={() => setIsTransferModalOpen(false)}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </Tbody>
              </Table>
            </TableContainer>
          </Box>

          {showAction && (
            <>
              {/* className="hide-on-print" */}
              <Button onClick={handlePrintButton}  >
                Print
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentTransaction;
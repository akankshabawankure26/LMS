import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Admin from "./components/Admin";
import Nav from "./Nav";
import Home from "./Home";
import AddProject from "./components/AddProject";
import NewBooking from "./components/NewBooking";
import MasterInputs from "./components/MasterInputs";
import AddBlock from "./components/AddBlock";
import AddPlot from "./components/AddPlot";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import AddContractor from "./components/AddContractor";
import ContractorList from "./components/ContractorList";
import BrokerList from "./components/BrokerList";
import AddBroker from "./components/AddBroker";
import BookingStatus from "./components/BookingStatus";
import PaymentTransaction from "./components/PaymentTransaction";
import BookingList from "./components/BookingList";
import TransactionReport from "./components/TransactionReport";
import Footer from "./Footer";
import BalanceReport from "./components/BalanceReport";
import HistoricalReport from "./components/HistoricalReport";
import ContractorLedger from "./components/ContractorLedger";
import BrokerLedger from "./components/BrokerLedger";
import ContractorTransaction from "./components/ContractorTransaction";
import BrokerTransaction from "./components/BrokerTransaction";
import Profile from "./components/Profile";
import HoldedPlots from "./components/HoldedPlots";
import Plothistory from "./components/Plothistory";
import RoleManager from "./components/RoleManager";
import RolePermissionManager from "./components/RolePermissionManager";
import AddMacAddress from "./components/AddMacAddress";
import PrintTransactionList from "./components/PrintTransactionList";
import RolePer from "./components/RolePer";



const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    // const adminData = {
    //   email: email,
    // };

    // localStorage.setItem("adminData", email);

    const expirationTime = new Date();
    expirationTime.setDate(expirationTime.getDate() + 1); // Next day
    localStorage.setItem("isAuthExpires", expirationTime.getTime());

    localStorage.setItem("isAuth", true);

    setLoggedIn(true);
  };

  const isAuthExpired = () => {
    const expirationTime = localStorage.getItem("isAuthExpires");
    if (!expirationTime) {
      return true;
    }

    return Date.now() > parseInt(expirationTime);
  };

  // let userData = JSON.parse(localStorage.getItem("adminData"));
  let userData = localStorage.getItem("adminData");

  useEffect(() => {
    if (userData && userData.email) {
      // setEmail(userData.email);
      // console.log("setEmail",setEmail);

    }
  }, [userData]);

  const handleLogout = async () => {
    let email = localStorage.getItem("email");
    console.log(email, "this is the req email");
    let query = `UPDATE user SET IsActive = '0' WHERE userEmail = '${email}'`;
    const url = "http://localhost/backend_lms/getQuery.php";
    // const url = "http://localhost/backend_lms/getQuery.php";

    let fData = new FormData();
    fData.append("query", query);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: fData,
      });

      if (response.ok) {
        localStorage.removeItem("adminData");
        localStorage.removeItem("isAuth");
        setLoggedIn(false);
      } else {
        console.error("Failed to update user status.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  let isAuth = localStorage.getItem("isAuth");
  useEffect(() => {
    // const adminData = JSON.parse(localStorage.getItem("adminData"));
    const adminData = localStorage.getItem("adminData");
    if (adminData) {
      setLoggedIn(true);
    }
  }, []);


  useEffect(() => {

    if (isAuthExpired()) {
      handleLogout();
    }
  }, []);

  return (

    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn || isAuth ? (
              <>
                <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                <Home />
              </>
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin"
          element={<Admin isLoggedIn={isLoggedIn} onLogin={handleLogin} />}
        />
        {isLoggedIn && (
          <>
            <Route
              path="/addproject"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <AddProject />

                </>
              }
            />
            <Route
              path="/newbooking"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <NewBooking />
                </>
              }
            />
            <Route
              path="/masterinputs"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <MasterInputs />
                </>
              }
            />

            <Route
              path="/addblock"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <AddBlock />
                </>
              }
            />
            <Route
              path="/addplot"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <AddPlot />
                </>
              }
            />
            <Route
              path="/adduser"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <AddUser />
                </>
              }
            />
            <Route
              path="/userlist"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <UserList />
                </>
              }
            />
            <Route
              path="/addmacaddress"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <AddMacAddress />
                </>
              }
            />
            <Route
              path="/rolemanager"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <RoleManager />
                </>
              }
            />
            <Route
              path="/rolepermission"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <RolePermissionManager />
                </>
              }
            />
            <Route
              path="/addcontractor"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <AddContractor />
                </>
              }
            />
            <Route
              path="/contractorlist"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <ContractorList />
                </>
              }
            />
            <Route
              path="/brokerlist"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <BrokerList />
                </>
              }
            />
            <Route
              path="/addbroker"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <AddBroker />
                </>
              }
            />
            <Route
              path="/bookingstatus"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <BookingStatus />
                </>
              }
            />
            <Route
              path="/PaymentTransaction"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <PaymentTransaction />
                </>
              }
            />
            <Route
              path="/bookinglist"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <BookingList />
                </>
              }
            />
            <Route
              path="/transactionreport"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <TransactionReport />
                </>
              }
            />
            <Route
              path="/balancereport"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <BalanceReport />
                </>
              }
            />
            <Route
              path="/historicalreport"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <HistoricalReport />
                </>
              }
            />
            <Route
              path="/contractorledger"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <ContractorLedger />
                </>
              }
            />
            <Route
              path="/brokerledger"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <BrokerLedger />
                </>
              }
            />
            <Route
              path="/contractortransaction"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <ContractorTransaction />
                </>
              }
            />
            <Route
              path="/brokertransaction"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <BrokerTransaction />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <Profile />
                </>
              }
            />
            <Route path="/printTranList" element={<PrintTransactionList />} />
            <Route path="/holdedplots" element={<HoldedPlots />} />
            <Route path="/plothistory" element={<Plothistory />} />
          </>
        )}
      </Routes>
      {/* <Footer /> */}
    </Router>

  );
};

export default App;

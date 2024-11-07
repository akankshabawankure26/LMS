import React, { createContext, useContext, useState } from "react";

 export const DataContext = createContext();

export const DataProvider = ({ children }) => {

  const [toggle, setToggle] = useState(false)
  const [constructionData, setConstructionData] = useState({
    contractor: "",
    amount: 0,
  });
const [goData, setGoData] = useState({})
  const [projectData, setProjectData] = useState({
    plotNo: "",
    projectName: "",
    blockName: "",
  });

  const [brokerName, setBrokerName] = useState("");


const storeData = (props) => {
  console.log("prps", props);
setGoData(props)
}

const handleToggle = () =>{
setToggle((prev) => !prev)
}

  return (
    <DataContext.Provider
      value={{
        constructionData,
        setConstructionData,
        projectData,
        setProjectData,
        brokerName,
        setBrokerName,
        storeData,
        goData,
        toggle,handleToggle
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

import React, { useEffect, useState } from "react";
import { showDegree } from "../../Utils/Api/ShowDegree";
import { showQulification } from "../../Utils/Api/ShowQulification";
import Cookies from'js-cookie'
import axios from "axios";


function Index() {
  
  const [inputData, setInputData]=useState({
    qualificationName: "",
    degreeName : "",
  })
  const [degreeNameData, setDegreeName]=useState([]);
  const [showQualificationName, setShowQualificationName]=useState([])
  const [selecteQualificationId, setSelecteQualificationId]=useState(null);
  const [selectedDegreeId, setSelectedDegreeId] = useState( null);
  
  //add qualification 
  const [isQualificationModalOpen, setIsQulaificationModalOpen] = useState(false); // State for "Add New qulaification" modal
  const openQualificationModal = () => setIsQulaificationModalOpen(true);
  const closeQualificationModal = () => setIsQulaificationModalOpen(false);

  //add Degree 
  const [isDegreeModalOpen, setIsDegreeModalOpen] = useState(false); // State for "Add New Degree modal
  const openDegreeModal = () => setIsDegreeModalOpen(true);
  const closeDegreeModal = () => setIsDegreeModalOpen(false);

  //update Qualification
  const [isUpdateQualificationModalOpen, setIsUpdateQualificationModalOpen] = useState(false);
  const handleQualificationSelect = (id) => {
    setSelecteQualificationId((prev) => (prev === id ? null : id)); // Toggle Qualification selection
    Cookies.set("selectedQualificationID", id, { expires: 7 });
  };
  const closeUpdateQualificationModal = () => setIsUpdateQualificationModalOpen(false);
  const openUpdateQualificationModal = () => {
    if (!selecteQualificationId) {
      alert("Please select a Qualification to update");
      return;
    }

    const selectedQualification = showQualificationName.find(({ id }) => id === selecteQualificationId);
    if (selectedQualification) {
      setInputData({ qualificationName: selectedQualification.name });
      setIsUpdateQualificationModalOpen(true);
    }

  };

  //update Degree 
  const [isUpdateDegreeModalOpen, setIsUpdateDegreeModalOpen] = useState(false);
  const handleDegreeSelect = (id) => {
    setSelectedDegreeId((prev) => (prev === id ? null : id)); // Toggle degree selection
    Cookies.set("setSelectedDegreeId", id, { expires: 7 });
  };
  const closeUpdateDegreeModal = () => setIsUpdateDegreeModalOpen(false);
  const openUpdateDegreeModal = () => {
    if (!selectedDegreeId) {
      alert("Please select a degree to update");
      return;
    }
  
    // Find the degree data based on the selecteddegreeID
    const selectedDegree = degreeNameData.find(({ id }) => id === selectedDegreeId);
    if (selectedDegree) {
      // Set the input data with the selected degree 
      setInputData({
        ...inputData,
        degreeName: selectedDegree?.name,
       
      });
      setIsUpdateDegreeModalOpen(true); // Open the update degree modal
    }
  };
  
  const handleFormData = (e) => {
    const { value, name } = e.target;
    setInputData({
      ...inputData,
      [name]: value,
    });
  };

  useEffect(()=>{
    showQulification(setShowQualificationName)
  }, [])

  useEffect(() => {
     if(selecteQualificationId){
      showDegree(selecteQualificationId,setDegreeName )
     }
  }, [selecteQualificationId]);

  //add Qualification 
  const saveNewQualificationName = async (e) => {
    e.preventDefault();
    if (!inputData?.qualificationName) {
      alert("Qualification name is required");
      return;
    }


    try {
      await axios.post(`${process.env.REACT_APP_SERVER_ADDRESS}/common/add-qualification`, {
        qualificationName: inputData?.qualificationName,
      });
      alert("Qualification added successfully");
      closeQualificationModal();
      showQulification(setShowQualificationName);  // Refresh the qualification list

    } catch (error) {
      console.error(error);
      alert("Error: Unable to add Qualification");
    }
  };

  //update Qualification  
  const updateQualificationName = async (e) => {
    e.preventDefault();
    if (!inputData?.qualificationName || !selecteQualificationId) {
      alert("Please select a Qualification and enter a new name");
      return;
    }

    const requestData = {
      qualificationId: selecteQualificationId, 
      qualificationName: inputData?.qualificationName,       
    };

    try {
      await axios.put(`${process.env.REACT_APP_SERVER_ADDRESS}/common/update-qualification`, requestData)
      alert("qualification updated successfully");
      closeUpdateQualificationModal(); 
       // Ensure the state updates properly
       showQulification((data) => {
        setShowQualificationName([...data]); // Force state update
      });
    } catch (error) {
      console.error(error);
      alert("Error: Unable to update qualification");
    }
  };

   // Save a new degree
   const saveNewDegree = async (e) => {
    e.preventDefault();
    if (!inputData.degreeName) {
      alert("All fields are required");
      return;
    }
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_ADDRESS}/common/add-degree`, {
        qualificationID: selecteQualificationId,
        degreeName: inputData?.degreeName,
      });

      alert("Degree added successfully");
      closeDegreeModal();
      // Refresh the degree list
      showDegree(selecteQualificationId, setDegreeName);

    } catch (error) {
      console.log(error);
      alert("Error: Unable to add Degree");
    }
  };

  //update degee
  const updateDegreeName = async (e) => {
    e.preventDefault();
    if (!inputData.degreeName || !selectedDegreeId) {
      alert("Please select a degree and enter the new details");
     return;
    }

    const finalData= {
      degreeId : selectedDegreeId,
      newName: inputData.degreeName,
    }

    try {
      await axios.put(`${process.env.REACT_APP_SERVER_ADDRESS}/common/update-degree`, finalData);
      alert("degree updated successfully");
      closeUpdateDegreeModal();
      // Refresh the degree list
      showDegree(selecteQualificationId, setDegreeName);
    } catch (error) {
      console.error(error);
      alert("Error: Unable to update branch");
    }
  };


  return (
    <div className="pl-2 w-full pr-2 pt-4 ">
      {/* Qualification Header Section */}
      <div className="bgMainColor flex py-2 pl-1 pb-1 justify-between rounded-md">
        <div className="flex justify-start">
          <h4 className="text-white ml-2 mt-1">List of Qualification</h4>
        </div>
        <div className="flex justify-end">
        <button onClick={openQualificationModal} className="font-semibold mr-2 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800  rounded-lg text-sm px-5 py-2 text-center me-2 mb-1">Add Qualification</button>
        <button onClick={openUpdateQualificationModal}  className="font-semibold mr-2 text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800  rounded-lg text-sm px-5 py-2 text-center me-2 mb-1">Update Qualification</button>
        </div>
      </div>

      <div className="w-full md:w-[calc(100%-65%)] h-[30vh] overflow-auto">
          <table className="table-auto w-full border border-gray-500">
            <thead className="border border-gray-500">
              <tr>
              <th className="text-blue-600/100 border border-gray-500 w-20">Select</th>
                <th className="text-blue-600/100 border border-gray-500 ">Qulaification</th>
              </tr>
            </thead>
            <tbody>
              {showQualificationName?.map(({ id, name}) => (
                <tr key={id}>
                  <td className="border-t border-gray-500 flex justify-center items-center align-middle h-8">
                    <input 
                      type="checkbox"
                      checked={selecteQualificationId === id}
                      onChange={() => handleQualificationSelect(id)}
                    />
                  </td>
                  <td className="border border-gray-500">{name}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>

      
      
    
      {/*Degree  Header Section */}
      <div className="bgMainColor flex py-2 pl-1 pb-1 justify-between mt-4 rounded-md">
        <div className="flex justify-start ">
          <h4 className="text-white ml-2 mt-1">List of Degree</h4>
        </div>
        <div className="flex justify-end">
          <button onClick={openDegreeModal}  className="font-semibold mr-2 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800  rounded-lg text-sm px-5 py-2 text-center me-2 mb-1">Add Degree</button>
          <button onClick={openUpdateDegreeModal}  className="font-semibold mr-2 text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800  rounded-lg text-sm px-5 py-2 text-center me-2 mb-1">Update Degree</button>
        </div>
      </div>

      <div className="w-full md:w-[calc(100%-65%)] h-[30vh] overflow-auto">
          <table className="table-auto w-full border border-gray-500">
            <thead className="border border-gray-500">
              <tr>
              <th className="text-blue-600/100 border border-gray-500 w-20">Select</th>
                <th className="text-blue-600/100 border border-gray-500 ">Degree</th>
              </tr>
            </thead>
            <tbody>
              {degreeNameData?.map(({ id, name }) => (
                <tr key={id}>
                  <td className="border-t border-gray-500 flex justify-center items-center align-middle h-8">
                    <input 
                      type="checkbox"
                      checked={selectedDegreeId === id}
                      onChange={() => handleDegreeSelect(id)}
                    />
                  </td>
                  <td className="border border-gray-500">{name}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>


      {/* Add New Qualification  Modal */}
      {isQualificationModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-1/3">
              <h3 className="text-lg font-bold mb-4">Add New Qualification</h3>
              <form onSubmit={saveNewQualificationName}>
                <div className="mb-4">
                  <label htmlFor="saveNewQualificationName" className="block font-medium text-gray-700">Qualification Name</label>
                  <input
                    type="text"
                    value={inputData?.qualificationName}
                    name="qualificationName"
                    onChange={handleFormData}
                    id="saveNewQualificationName"
                    placeholder="Enter Qualification name"
                    className="mt-1 py-2 block w-full border border-gray-500 rounded-md shadow-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-red-600 text-white py-2 px-4 rounded-md mr-2"
                    onClick={closeQualificationModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md">Save</button>
                </div>
              </form>
            </div>
          </div>
      )}

      {/* Update qualification  Modal */}
      {isUpdateQualificationModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 w-1/3">
          <h3 className="text-lg font-bold mb-4">Update Qualification</h3>
          <form onSubmit={updateQualificationName}>
            <div className="mb-4">
              <label htmlFor="updateQualificationName" className="block font-medium text-gray-700">Qualification Name</label>
              <input
                type="text"
                defaultValue={inputData?.qualificationName}
                name="qualificationName"
                onChange={handleFormData}
                id="updateQualificationName"
                placeholder="Enter new company name"
                className="mt-1 py-2 block w-full border border-gray-500 rounded-md shadow-sm"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-red-600 text-white py-2 px-4 rounded-md mr-2"
                onClick={closeUpdateQualificationModal}
              >
                Cancel
              </button>
              <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md">Save</button>
            </div>
          </form>
        </div>
        </div>
      )}

      {/* Add New degree Modal */}
      {isDegreeModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-1/3">
            <h3 className="text-lg font-bold mb-4">Add New Degree</h3>
            <form onSubmit={saveNewDegree}>
              <div className="mb-4">
                <label htmlFor="saveNewDegree" className="block font-medium text-gray-700">Degree Name</label>
                <input
                  type="text"
                  defaultValue={inputData?.degreeName}
                  name="degreeName"
                  onChange={handleFormData}
                  id="degreeName"
                  placeholder="Enter Degree name"
                  className="mt-1 py-2 block w-full border border-gray-500 rounded-md shadow-sm "
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-red-600 text-white py-2 px-4 rounded-md mr-2"
                  onClick={closeDegreeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* open update Degree model  */}
      {isUpdateDegreeModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-1/3">
              <h3 className="text-lg font-bold mb-4">Update Degree</h3>
              <form onSubmit={updateDegreeName}>
                <div className="mb-4">
                  <label htmlFor="updateDegreeName" className="block font-medium text-gray-700">Degree Name</label>
                  <input
                    type="text"
                    defaultValue={inputData?.degreeName}
                    name="degreeName"
                    onChange={handleFormData}
                    id="updateDegreeName"
                    placeholder="Enter new Degree name"
                    className="mt-1 py-2 block w-full border border-gray-500 rounded-md shadow-sm "
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-red-600 text-white py-2 px-4 rounded-md mr-2"
                    onClick={closeUpdateDegreeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md">Save</button>
                </div>
              </form>
            </div>
          </div>
      )}
      
    
    </div>
  );
}

export default Index;









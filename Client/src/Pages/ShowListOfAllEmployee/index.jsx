import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import { GoSearch } from "react-icons/go";
import { FaListUl } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

export default function TotalEmployeeTable() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [allEmployeeData, setAllEmployeeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [itemsPerPage] = useState(10); // Items per page (fixed)
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedFile, setSelectedFile] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]); // New state for selected employees

      const filteredEmployees = allEmployeeData.filter(employee => {
        const searchString = searchTerm.toLowerCase();
        return (
          employee.name.toLowerCase().includes(searchString) ||
          employee.employeeCode.toLowerCase().includes(searchString)
        );
      });

      const fetchAllEmployeeData = async () => {
        setLoading(true); // Start loader
        try {
          const response = await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/auth/show-employee`);
          let employeeData = response.data.data || [];
    
          if (isActiveFilter !== null) {
            employeeData = employeeData.filter(employee => employee.isActive === isActiveFilter);
          }
    
          setAllEmployeeData(employeeData);
        } catch (error) {
          console.log("Error fetching employee data:", error);
          alert("Error: Unable to fetch employee data.");
        }
        finally {
          setLoading(false); // Stop loader
        }
      };
    
      useEffect(() => {
        fetchAllEmployeeData();
      }, [isActiveFilter]);

      

    // Pagination calculations
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Handle checkbox selection
  const handleCheckboxChange = (employee) => {
   
    setSelectedEmployees((prevSelected) => {
      // Check if the employee is already selected
      if (prevSelected.some(emp => emp.id === employee.id)) {
        return []; // Uncheck if already selected
      } else {
        return [employee]; // Select only the new employee
      }
    });
  };

  // Handle Update Button Click - Save selected employees to cookies
  const handleUpdate = () => {
    if (selectedEmployees.length === 0) { // Check if no employee is selected
      alert("Please select at least one employee to update.");
      return;
    }

    navigate('/layout/employeeupdateform', {
      state: { selectedEmployees }
    });
  };

  const handleClose = ()=>{
    navigate('/layout/dashboard');
  }

   //  import form excel 
   const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", selectedFile);
  
    console.log("my form data", formData);
  
    console.log("Sending file upload request");
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_ADDRESS}/auth/add-byExcel`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Response status:", response.status); 

      console.log("Response data:", response.data);
  
      const { success, message, invalid_data, duplicate_data } = response.data;
  
      console.log("Success:", success); 
      
      console.log("Message:", message); 
  
      if (!success || message === "The uploaded excel does not have any valid insertable entry.") {
        navigate('/layout/invalid-duplicate-data', {
          state: {
            duplicateData: duplicate_data || [],  // Ensure default empty array
            invalidData: invalid_data || [],      // Ensure default empty array
          },
        });
      } else {
        alert(message || "File imported successfully!");
      }
  
      fetchAllEmployeeData(); // Refresh employee data
    } catch (error) {
      // Default empty array if the variables are not available in the error case
      const { duplicate_data = [], invalid_data = [] } = error.response?.data || {};
  
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        console.error("Error uploading file:", error);
        alert("Error: Unable to import the file.");
      }
  
      // Navigate to the error page with fallback empty arrays
      navigate('/layout/invalid-duplicate-data', {
        state: {
          duplicateData: duplicate_data,
          invalidData: invalid_data,
        },
      });
    }
  };

       
 
  return (    
    <>
        <button 
            disabled={currentPage === 1} 
            onClick={handlePreviousPage} 
            className={`p-1 pl-5 pr-5 rounded-md absolute bottom-4 left-64 text-white ${currentPage === 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`}>
            Back
        </button>
        
        {/* all action button  */}
        <div className=" absolute bottom-4 left-96 pt-4 gap-2 flex">
            <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all">Add</button>
            <button
               onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all"
            >
            Import From Excel
            </button>
            <button   className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all">Export To Excel</button>
            <button  onClick={handleUpdate}  className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all">Update</button>
            <button onClick={handleClose} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all">Close</button>
        </div>

        <button   
            disabled={currentPage === totalPages}  
            onClick={handleNextPage} 
            className={`p-1 pl-5 pr-5 rounded-md absolute bottom-4 right-16 text-white ${currentPage === totalPages ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`} >
            Forward
        </button>

        
    
        <div className="mt-4 bgMainColor flex py-4 pl-1 gap-3 justify-between z-6 rounded-md ml-1 mr-1">
            <div className="flex flex-row pl-2 gap-4">
                <FaListUl size={24} />
                <h4 className="text-white">List of Employee (Total Employee)</h4>
            </div>
            <div className="flex gap-3 items-center">
                <button
                onClick={() => setIsActiveFilter(true)}
                className={`px-6 py-2 ${isActiveFilter === true ? 'bg-green-700' : 'bg-green-600'} text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all`}
                >
                Active
                </button>
                <button
                onClick={() => setIsActiveFilter(false)}
                className={`px-4 py-2 ${isActiveFilter === false ? 'bg-red-700' : 'bg-red-600'} text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all`}
                >
                Resigned Staff
                </button>

                {/* search bar section */}
                <div className="relative  max-w-md mx-auto">
                <input
                    type="text"
                    placeholder="Search by Name or Code"
                    className=" pl-10 mr-2 pr-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-0 focus:border-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
                    <GoSearch size={20} />
                </span>
                </div>

            </div>
        </div>

        {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 108 8h-4l3 3 3-3h-4a8 8 0 01-8 8z"
                  ></path>
                </svg>
                <span className="text-white font-semibold">Loading employees...</span>
              </div>
            </div>
          ) : (
          <div className='overflow-auto h-[calc(100vh-14rem)]'>
              <div className="relative">
                  <table className=" text-gray-500 dark:text-gray-400" style={{ position: 'relative'}}>
                      <thead className="text-xs border border-gray-150 bg-gray-800 text-gray-100 uppercase dark:bg-gray-800 dark:text-gray-400 ">
                      <tr>
                          <th className="px-6 py-3 text-center font-semibold text-nowrap">Select</th>
                          <th className="px-6 py-3 text-center font-semibold text-nowrap">Employee Name</th>
                          <th className="px-6 py-3 text-center font-semibold text-nowrap">Emp. Code</th>
                          <th className="px-6 py-3 text-center font-semibold text-nowrap">Biometric PunchId</th>
                          <th className="px-6 py-3 text-center font-semibold text-nowrap">Reporting Manager Name</th>
                          <th className="px-6 py-3 text-center font-semibold text-nowrap">Company Name</th>
                          <th className="px-6 py-3 text-center font-semibold text-nowrap">Company Branch Name</th>
                          <th className="px-6 py-3 text-center font-semibold text-nowrap">Department</th>
                          <th className="px-6 py-3 text-center font-semibold text-nowrap">Designation</th>
                      </tr>

                      </thead>
                      <tbody>
                      {
                        currentEmployees.map((employee) =>(
                            <>
                                <tr className="bg-white border-b hover:bg-gray-400 hover:text-gray-900" key={employee.id}
                                  onClick={() => {
                                    const data = JSON.stringify(employee);
                                    Cookies.set('EmployeeDetails', data);
                                    navigate('/layout/employeeDetails');
                                  }}
                                 >
                                    <td className="px-2 py-2 text-center"  onClick={(e) => e.stopPropagation()}><input 
                                    type='checkbox'
                                    checked={selectedEmployees.some(emp => emp.id === employee.id)}
                                    onChange={() => handleCheckboxChange(employee)}
                              
                                    /></td>
                                    <td className="px-2 py-2 text-center">{employee?.name || 'N/A'}</td>
                                    <th scope="row" className="px-2 font-medium text-center text-gray-900 whitespace-nowrap ">{employee?.employeeCode}</th>
                                    <td className="px-2 py-2 text-center">{employee?.biometricPunchId || 'N/A'}</td>
                                    <td className="px-2 py-2 text-center">{employee?.employeeWorkDetail?.reportingManager?.name || 'N/A'}</td>
                                    <td className="px-2 py-2 text-center">{employee?.employeeWorkDetail?.company?.name || 'N/A'}</td>
                                    <td className="px-2 py-2 text-center">{employee?.employeeWorkDetail?.department?.department || 'N/A'}</td>
                                    <td className="px-2 py-2 text-center">{employee?.employeeWorkDetail?.designation?.name || 'N/A'}</td>
                                    <td className="px-2 py-2 text-center">{employee.officeTimePolicy?.policyName || 'N/A'}</td>
                                </tr>
                            </>
                        ))
                      }
                      </tbody>
                      
                  </table>
              </div>
          </div>

          
        )}

         {/* excel pop model open  */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h3 className="text-xl font-semibold mb-4">Import From Excel</h3>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="block w-full mb-4 border border-gray-300 rounded-lg"
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFileUpload}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          )}

   </>
  )
}



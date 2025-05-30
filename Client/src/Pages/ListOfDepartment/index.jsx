import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TableListofCompany2() {
  const [departmentNameData, setDepartmentName] = useState([]);
  const [designationNameData, setDesignationName] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);  // Start with null
  const [selectedDesignationId, setSelectedDesignationId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dept, setDept] = useState('');
  const [designation, setDesignation] = useState('');
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isDesignationModalOpen, setIsDesignationModalOpen] = useState(false);
  const [isDesignationUpdateMode, setIsDesignationUpdateMode] = useState(false);

  // Fetch department data
  const fetchDepartmentNameData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/common/show-department`);
      setDepartmentName(response?.data?.data);
    } catch (error) {
      alert('Error: Unable to fetch department data');
    }
  };

  // Fetch designation data for the selected department
  const fetchDesignationData = async (departmentId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/common/show-designation?departmentId=${departmentId}`);
      setDesignationName(response?.data?.data);
    } catch (error) {
      alert('Error: Unable to fetch designation data');
    }
  };

  useEffect(() => {
    fetchDepartmentNameData();
  }, []);

  useEffect(() => {
    if (selectedDepartmentId) {
      fetchDesignationData(selectedDepartmentId); // Fetch designations based on the selected department
      setSelectedDesignationId(null); // Reset selected designation when department changes
    } else {
      setDesignationName([]);  // Clear designations if no department is selected
      setSelectedDesignationId(null); // Reset selected designation when department is deselected
    }
  }, [selectedDepartmentId]);



  const handleDepartmentSelect = (id) => {
    setSelectedDepartmentId((prev) => (prev === id ? null : id)); // Toggle department selection
  };
  
  const handleDesignationSelect = (id) => {
    setSelectedDesignationId((prev) => (prev === id ? null : id)); // Toggle designation selection
  };

  const handleAddDepartment = () => {
    setDept('');
    setIsUpdateMode(false);
    setIsModalOpen(true);
  };

  const handleUpdateDepartment = () => {
    if (!selectedDepartmentId) {
      alert('Please select a department to update.');
      return;
    }

    const selectedDept = departmentNameData.find((d) => d?.id === selectedDepartmentId);
    if (selectedDept) {
      setDept(selectedDept.deptName);
      setIsUpdateMode(true);
      setIsModalOpen(true);
    }
  };

  const handleSaveDepartment = async () => {
    if (!dept.trim()) {
      alert('Please enter a valid department name.');
      return;
    }

    try {
      if (isUpdateMode) {
        const response = await axios.put(`${process.env.REACT_APP_SERVER_ADDRESS}/common/update-department`, {
          deptId: selectedDepartmentId,
          deptName: dept,
        });

        if (response.data) {
          alert('Department updated successfully!');
          setDepartmentName(
            departmentNameData.map((d) =>
              d.id === selectedDepartmentId ? { ...d, empdept: dept } : d
            )
          );
        } else {
          alert('Error: Department not updated.');
        }
      } else {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_ADDRESS}/common/add-department`, { dept });
        if (response?.data) {
          alert('Department added successfully!');
          setDepartmentName([
            ...departmentNameData,
            { empdept: dept, id: response?.data?.id },
          ]);
        } else {
          alert('Error: Department not added.');
        }
      }

      setIsModalOpen(false);
      setDept('');
      await fetchDepartmentNameData();  // Refresh department list
    } catch (error) {
      alert('Error: Unable to save department.');
    }
  };

  const handleAddDesignation = () => {
    if (!selectedDepartmentId) {
      alert('Please select a department before adding a designation.');
      return;
    }

    setDesignation('');
    setIsDesignationUpdateMode(false);
    setIsDesignationModalOpen(true);
  };

  const handleUpdateDesignation = () => {
    if (!selectedDepartmentId || !selectedDesignationId) {
      alert('Please select both a department and a designation to update.');
      return;
    }

    const selectedDesig = designationNameData.find((d) => d?.id === selectedDesignationId);
    if (selectedDesig) {
      setDesignation(selectedDesig.name);  //name
      setIsDesignationUpdateMode(true);
      setIsDesignationModalOpen(true);
    }
  };

  const handleSaveDesignation = async () => {
    if (!designation.trim()) {
      alert('Please enter a valid designation name.');
      return;
    }
 
    console.log("my update designation api ")
    try {
      console.log("my update designation api inside try ")
      if (isDesignationUpdateMode) {
        const selectedDesig = designationNameData.find((d) => d?.id === selectedDesignationId);
        console.log("my designationId", selectedDesig)
        const response = await axios.put(`${process.env.REACT_APP_SERVER_ADDRESS}/common/update-designation`, {
          designationId:selectedDesig.id,
          newName: designation, // Send new designation value
          
        });
        
        console.log("my response data is when update designation", response?.data?.data);

        if (response?.data) {
          alert('Designation updated successfully!');
          setDesignationName(
            designationNameData?.map((d) =>
              d.id === selectedDesignationId ? { ...d, designation: designation } : d
            )
          );
        } else {
          alert('Error: Designation not updated.');
        }
      } else {

        // console.log("response 3 ", response.data);
        const response = await axios.post(`${process.env.REACT_APP_SERVER_ADDRESS}/common/add-designation`, {
          departmentId: selectedDepartmentId,
          designation: designation,
        });

        console.log("response 2 ", response?.data);
    
        if (response?.data) {
          alert('Designation added successfully!');
          setDesignationName([
            ...designationNameData,
            { designation, id: response?.data?.id },
          ]);
        } else {
          alert('Error: Designation not added.');
        }
      }

      setIsDesignationModalOpen(false);
      setDesignation('');
      await fetchDesignationData(selectedDepartmentId);  // Refresh designation list
    } catch (error) {
      alert('Error: Unable to save designation.');
      console.error(error.response)
      console.log("my designation failed", error?.response?.data?.message);
    }
  };

  return (
    <div className="p-2 md:p-4 w-screen">
      <div className="bgMainColor flex py-2 pl-2 w-full">
        <h4 className="text-white">List of Department</h4>
      </div>

      <div className="md:flex justify-between gap-20 pt-2  w-full">
        {/* Department Table */}
        <div className='w-full max-h-[360px] overflow-y-auto'>
          <table className="table-auto  border border-gray-500 w-full">
            <thead className="border border-gray-500 sticky top-0 z-3 shadow">
              <tr>
                <th className="text-blue-600/100 border border-gray-500 w-20">Select</th>
                <th className="text-blue-600/100 border border-gray-500">Department</th>
              </tr>
            </thead>
            <tbody>
              {departmentNameData?.map(({ deptName, id }) => (
                <tr key={id}>
                  <td className="border-t border-gray-500 flex justify-center items-center align-middle h-8">
                    <input
                      type="checkbox"
                      checked={selectedDepartmentId === id}
                      onChange={() => handleDepartmentSelect(id)} // Select or deselect the department
                    />
                  </td>
                  <td className="border border-gray-500 text-center">{deptName}</td>
                </tr>
              ))}
            </tbody>        
          </table>
        </div>
        
        

        {/* Designation Table */}
        <div className='w-full pr-2 max-h-[360px] overflow-y-auto'>
          <table className="table-auto  border border-gray-500 w-full">
            <thead className="border border-gray-300 sticky top-0 z-10 shadow">
              <tr>
                <th className="text-blue-600/100 border border-gray-500 w-20">Select</th>
                <th className="text-blue-600/100 border border-gray-500">Designation</th>
              </tr>
            </thead>
            <tbody>
              {selectedDepartmentId && designationNameData.length > 0 ? (
                designationNameData?.map(({ name, id }) => (
                  <tr key={id}>
                    <td className="border-t border-gray-500 flex justify-center items-center align-middle">
                      <input
                        type="radio"
                        name="designation"
                        onChange={() => handleDesignationSelect(id)} // Select or deselect a specific designation
                        className='mt-1'
                      />
                    </td>
                    <td className="border border-gray-500 text-center">{name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center text-gray-500">
                    No designations available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      {/* all action button  */}
      <div className="md:flex md:justify-between  mb-4 mt-12">
        <div className="md:flex justify-between gap-4">
          <button
            onClick={handleAddDepartment}
            className=" md:px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all"
          >
            Add Department
          </button>
          <button
            onClick={handleUpdateDepartment}
            className="md:px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all"
          >
            Update Department
          </button>
        </div>

        {/* Designation Buttons (Right Aligned) */}
        <div className="md:flex gap-4">
          <button
            onClick={handleAddDesignation}
            className="md:px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            Add Designation
          </button>
          <button
            onClick={handleUpdateDesignation}
            className="md:px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition-all"
          >
            Update Designation
          </button>
        </div>
      </div>


      {/* Modal for Add/Update Department */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              {isUpdateMode ? 'Update Department' : 'Add Department'}
            </h2>
            <input
              type="text"
              defaultValue={dept}
              onChange={(e) => setDept(e.target.value)}
              placeholder="Enter Department Name"
              className="w-full p-2 border border-gray-500 rounded-md mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDepartment}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Add/Update Designation */}
      {isDesignationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              {isDesignationUpdateMode ? 'Update Designation' : 'Add Designation'}
            </h2>
            <input
              type="text"
              defaultValue={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Enter Designation Name"
              className="w-full p-2 border border-gray-500 rounded-md mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDesignationModalOpen(false)}
                className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDesignation}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableListofCompany2;




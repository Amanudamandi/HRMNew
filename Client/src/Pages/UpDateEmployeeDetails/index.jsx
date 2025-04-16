import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import Accordion from '../../Component/Accordion/index'

function Registration() {

  const navigate = useNavigate();
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imageSize, setImageSize] = useState(20); // Initial image size in percentage

  const [errors, setErrors] = useState({});

  const [singleEmployeeData, setSingleEmployeeData]=useState({});

  const [openIndex, setOpenIndex] = useState(null);

 // Refs for scrolling
 const personalDetailsRef = useRef(null);
 const bankDetailsRef = useRef(null);
 const attachmentDetailsRef = useRef(null);
 const ctcDetailsRef = useRef(null);
 const otherDetailsRef = useRef(null);

 const scrollToSection = (sectionName) => {
   const sectionMap = {
     personalDetailsRef,
     bankDetailsRef,
     attachmentDetailsRef,
     ctcDetailsRef,
     otherDetailsRef,
   };
   const sectionRef = sectionMap[sectionName];
   sectionRef?.current?.scrollIntoView({ behavior: 'smooth' });
 };

  const [formData, setFormData] = useState({
    employeeCode: "",
    name: "",
    father_husbandName: "",
    dateOfBirth: "",
    personalPhoneNum: "",
    personalEmail: "",
    panCard: "",
    aadharCard: "",
    qualification: "",
    degree: "",
    permanentAddress: "",
    permanentPinCode: "",
    currentAddress: "",
    currentPinCode: "",
    bankName: "",
    branchName: "",
    bankAccount: "",
    bankIFSC: "",
    bankAccountHolderName: "",
    bankAddress: "",
    reportingManager: "",
    companyPhoneNum: "",
    companyEmail: "",
    joiningDate: "",
    lastAppraisalDate: "",
    regisnationDate: "",
    company: "",
    branch: "",
    department: "",
    designation: "",
    aadharCardAttachment: "",
    panCardAttachment: "",
    bankAttachment: "",
    joiningFormAttachment: "",
    otherAttachment: "",
    confirmAccountNumber: "",
    officeTimePolicy: "",
    shift: "",
    workType : "",
    joiningHR : ''
  });

  const fetchAllEmployeeData = async (employeeId) => {
  
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_ADDRESS}/auth/show-employee`,
        {
          params: { id: employeeId }, // Pass ID as query parameter
        }
      );
  
      let employeeData = response?.data?.data;
      console.log("my response update data is ", employeeData)
      setSingleEmployeeData(employeeData);
      
    } catch (error) {
      console.error("Error fetching employee data:", error);
      alert("Error: Unable to fetch employee data.");
    } finally {
      
    }
  };
  

  useEffect(() => {
    const employeeData = Cookies.get("selectedEmployees");
    const parsedData = JSON.parse(employeeData);
    const employeeId = parsedData[0].id; // Replace this with actual ID
    fetchAllEmployeeData(employeeId);
  }, []);

  // Fetch data from cookies and set to formData state
  useEffect(() => {
    
    
    if (singleEmployeeData) {
      try {
        
        // Fetch attachments from cookies (assuming they're stored in Base64 format)
        const attachments = {
          aadharCardAttachment: singleEmployeeData?.employeeAttachmentDetail?.aadharCardAttachment || "",
          panCardAttachment:singleEmployeeData?.employeeAttachmentDetail?.panCardAttachment|| "",
          bankAttachment: singleEmployeeData?.employeeAttachmentDetail?.bankAttachment || "",
          joiningFormAttachment: singleEmployeeData?.employeeAttachmentDetail?.joiningFormAttachment || "",
        };

      //  setSelectedQualificationId(parsedData[0]?.qualification?._id)
      //  setSelectedCompanyNameId(parsedData[0]?.company?._id);
      //  setSelectedDepartmentId(parsedData[0]?.department?._id);

       console.log('employee Code', singleEmployeeData?.employeeCode);
       setFormData((prev) => ({
        ...prev,
        employeeCode:singleEmployeeData?.employeeCode,
        name: singleEmployeeData?.employeePersonalDetail?.name,
        father_husbandName:singleEmployeeData?.employeePersonalDetail?.father_husbandName,
        personalPhoneNum: singleEmployeeData?.employeePersonalDetail?.personalPhoneNum,
        personalEmail: singleEmployeeData?.employeePersonalDetail?.personalEmail,
        panCard: singleEmployeeData?.employeePersonalDetail?.panCard,
        aadharCard:singleEmployeeData?.employeePersonalDetail?.aadharCard,
        permanentAddress:singleEmployeeData?.employeePersonalDetail?.permanentAddress?.address,
        permanentPinCode: singleEmployeeData?.employeePersonalDetail?.permanentAddress?.pincode,
        currentAddress:singleEmployeeData?.employeePersonalDetail?.currentAddress?.address,
        currentPinCode: singleEmployeeData?.employeePersonalDetail?.currentAddress?.pincode,
         bankName: singleEmployeeData?.employeeBankDetail?.bankName,
         branchName: singleEmployeeData?.employeeBankDetail?.branchName,
         bankAccount: singleEmployeeData?.employeeBankDetail?.bankAccount,
         bankIFSC: singleEmployeeData?.employeeBankDetail?.bankIFSC,
         bankAccountHolderName: singleEmployeeData?.employeeBankDetail?.bankAccountHolderName,
         bankAddress:singleEmployeeData?.employeeBankDetail?.bankAddress,
          companyPhoneNum: singleEmployeeData?.employeeWorkDetail?.companyPhoneNum ,
          companyEmail:singleEmployeeData?.employeeWorkDetail?.companyEmail ,
        //   designation:parsedData[0]?.designation?.designation,
        //   degree: parsedData[0]?.degree?.name,
        //   qualification: parsedData[0]?.qualification?._id,
        //   company:parsedData[0]?.company?._id,
        //   department:parsedData[0]?.department?._id,
        //   officeTimePolicy:parsedData[0]?.officeTimePolicy?._id,
        //   shift:parsedData[0]?.shift?._id,
        //   workType:parsedData[0]?.workType?._id,
        //   reportingManager:parsedData[0]?.reportingManager?._id,
        //   joiningHR:parsedData[0]?.joiningHR?._id,
        //   dateOfBirth: parsedData[0]?.dateOfBirth?parsedData[0]?.dateOfBirth.split('T')[0]: "",
        //   joiningDate:parsedData[0]?.joiningDate?parsedData[0]?.joiningDate.split('T')[0]: "",
          // lastAppraisalDate:parsedData[0]?.lastAppraisalDate[0]?parsedData.lastAppraisalDate.split('T')[0] : '',
          // regisnationDate:parsedData[0]?.regisnationDate?parsedData[0].regisnationDate.split('T')[0] : '',
          ...attachments,
        }));

      } catch (error) {
        console.error("Error parsing employee data from cookies:", error);
      }
    }
  }, [singleEmployeeData]);
  
  // image are expend logic 
    const handleImageClick = () => {
      setIsImageOpen(true);  // Open the image and increase its size
      setImageSize(100);     // Increase size to 300% when clicked
    };
  
    const handleClose = () => {
      setIsImageOpen(false); // Close the image and revert to normal size
      setImageSize(20);     // Revert size to 100%
    };
 
  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.father_husbandName) newErrors.father_husbandName = 'Father Name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
    return newErrors;
  };
 
  const [changedFields, setChangedFields] = useState([]); // Tracks changed fields
  // Handling form data input
  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Track changed fields
  setChangedFields((prev) => {
    if (!prev.includes(name)) {
      return [...prev, name];
    }
    return prev;
  });

  };


  // file related change 
  const convertToBase64 = (file) => {
    console.log(convertToBase64)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf']; // Customize allowed types
    const maxSize = 5 * 1024 * 1024; // 5MB
  
    if (!validTypes.includes(file.type)) {
      alert('Invalid file type!');
      return false;
    }
  
    if (file.size > maxSize) {
      alert('File size exceeds 5MB!');
      return false;
    }
  
    return true;
  };
  
  const handleFileChange = async (e, fieldName) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      const base64 = await convertToBase64(file);
      setFormData({ ...formData, [fieldName]: base64 });


      // Track updated attachments
      setUpdatedAttachments((prev) => {
        if (!prev.includes(fieldName)) {
          return [...prev, fieldName];
        }
        return prev;
      });

    }
  };
 
  const prepareAttachments = () => {
    return updatedAttachments.map((field) => ({
      fieldName: field,
      fileData: formData[field],
    }));
  };
  
  
  // Handle form submit for updating employee data
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);
     
    // If there are errors, stop the form submission
    if (Object.keys(formErrors).length > 0) {
      alert("Please correct the highlighted fields.");
      return;
    }

    // Prepare payload with only changed fields + updated attachments
    const updatedData = { employeeCode: formData.employeeCode };  // Ensure employeeCode is always included
    changedFields.forEach((field) => {
      updatedData[field] = formData[field];
    });
    const attachments = prepareAttachments();

    try {
      const payload = {
        ...updatedData,  // Only changed form data
        attachments, // Include only updated attachments
      };

      const response = await axios.patch(`${process.env.REACT_APP_SERVER_ADDRESS}/auth/empUpdate`,payload,{
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Employee updated successfully!");
        navigate('/layout/listofallemployee')
      } else {
        alert("Something went wrong during the update.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error: Unable to update employee.");
    }
  };

  const sections = [
    {
      label: "Update personal details",
      content: (
        <>
          <fieldset   className='border-2  rounded-md mb-4' style={{ borderColor: '#740FD6'}}>
            <legend className='font-semibold text-lg ml-8 ' style={{color : '#740FD6'}}> &nbsp;&nbsp; Employee Details &nbsp;&nbsp;</legend>
            <div className='grid gap-1 md:gap-3 m-3 md:m-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>

              {/* name input field   */}
              <div>
                <label>
                  <span>Name</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='text' 
                  defaultValue={formData?.name}
                  name='name'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors?.name && <span className="text-red-600">{errors?.name}</span>}
              </div>
              
              {/* father husband input field  */}
              <div>
                <label>
                  <span>Father Name</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='text' 
                  defaultValue={formData?.father_husbandName}
                  name='father_husbandName'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors?.father_husbandName && <span className="text-red-600">{errors?.father_husbandName}</span>}
              </div>
              
              {/* date of birth input field  */}
              <div>
                <label>
                  <span>Date Of Birth</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='date' 
                  defaultValue={formData?.dateOfBirth}
                  name='dateOfBirth'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors?.dateOfBirth && <span className="text-red-600">{errors?.dateOfBirth}</span>}
              </div>
              
              {/* personal phone number field  */}
              <div>
                <label>
                  <span>Contact Number</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='text' 
                  defaultValue={formData?.personalPhoneNum}
                  name='personalPhoneNum'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors?.personalPhoneNum && <span className="text-red-600">{errors?.personalPhoneNum}</span>}
              </div>
              
              {/* personal email if input field  */}
              <div>
                <label>
                  <span>Email</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input 
                  type='email' 
                  defaultValue={formData?.personalEmail}
                  name='personalEmail'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors?.personalEmail && <span className="text-red-600">{errors?.personalEmail}</span>}
              </div>
              
              {/* aadhar number field  */}
              <div>
                <label>
                  <span>Aadhar Number</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='text' 
                  defaultValue={formData?.aadharCard}
                  name='aadharCard'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors?.aadharCard && <span className="text-red-600">{errors?.aadharCard}</span>}
              </div>
              
              {/* permanent Address field  */}
              <div>
                <label>
                  <span>Permanent Address</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input 
                  type='text' 
                  defaultValue={formData?.permanentAddress}
                  name='permanentAddress'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors?.permanentAddress && <span className="text-red-600">{errors?.permanentAddress}</span>}
              </div>
             
             {/* permanent pin code field  */}
              <div>
                <label>
                  <span>Permanent Pin Code</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input 
                  type='text' 
                  defaultValue={formData?.permanentPinCode}
                  name='permanentPinCode'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors?.permanentPinCode && <span className="text-red-600">{errors?.permanentPinCode}</span>}
              </div>
              
              {/* current address field */}
              <div>
                <label>
                  <span>Current Address</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input 
                  type='text' 
                  defaultValue={formData?.currentAddress}
                  name='currentAddress'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors?.currentAddress && <span className="text-red-600">{errors?.currentAddress}</span>}
              </div>
              
              {/* current pin code field  */}
              <div>
                <label>
                  <span>Current Pin Code</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input 
                  type='text' 
                  defaultValue={formData?.currentPinCode}
                  name='currentPinCode'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors?.currentPinCode && <span className="text-red-600">{errors?.currentPinCode}</span>}
              </div>
              
              
              
              {/* pan card number field  */}
              <div>
                <label>
                  <span>Pancard Number</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input 
                  type='text' 
                  defaultValue={formData?.panCard}
                  name='panCard'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors?.panCard && <span className="text-red-600">{errors?.panCard}</span>}
              </div>

            </div>
          </fieldset>
          <button type="submit" className="bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-800">
            Update
          </button>
        </>
      )
    },
    {
      label: "Update Bank details",
      content: (
        <>
          <fieldset   className='border-2  rounded-md mb-4' style={{ borderColor: '#740FD6'}}>
            <legend className='font-semibold text-lg ml-8' style={{color : '#740FD6'}}>&nbsp;&nbsp; Bank Details &nbsp;&nbsp;</legend>
            <div className='grid gap-3 m-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              
              {/* bank name field  */}
              <div>
                <label>Bank Name</label>
                <input 
                  type='text' 
                  defaultValue={formData?.bankName || " "}
                  name='bankName'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              {/* branch name field  */}
              <div>
                <label>Branch Name</label>
                <input 
                  type='text' 
                  value={formData?.branchName || " "}
                  name='branchName'
                  onChange={(event) => setFormData((prev) => ({ ...prev, branchName: event.target.value}))}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              {/* account number field  */}
              <div>
                <label>Account Number</label>
                <input 
                  type='text' 
                  defaultValue={formData?.bankAccount || " "}
                  name='bankAccount'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              {/* confirm account number field  */}
              <div>
                <label>Confirm Account Number</label>
                <input 
                  type='text' 
                  defaultValue={formData?.confirmAccountNumber || " "}
                  name='confirmAccountNumber'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              {/* ifsc code field  */}
              <div>
                <label>IFSC Code</label>
                <input 
                  type='text' 
                  defaultValue={formData?.bankIFSC || " "}
                  name='bankIFSC'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              {/* account holder name  */}
              <div>
                <label>Account Holder Name</label>
                <input 
                  type='text' 
                  defaultValue={formData?.bankAccountHolderName || " "}
                  name='bankAccountHolderName'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              {/* bank address field  */}
              <div>
                <label>Bank Address</label>
                <input 
                  type='text' 
                  defaultValue={formData?.bankAddress || " "}
                  name='bankAddress'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

            </div>
          </fieldset>
          <button type="submit" className="bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-800">
            Update
          </button>
        </>
      )
    },
    {
      label: "Update Ctc details",
      content: (
        <>
          <fieldset  className='border-2  rounded-md' style={{ borderColor: '#740FD6'}}>
            <legend className='font-semibold text-lg ml-8' style={{color : '#740FD6'}}> &nbsp;&nbsp; CTC Break Down &nbsp;&nbsp;</legend>
            <div className='grid gap-3 m-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              
              
            <div className='flex flex-col'>
                        <label>CTC<span className='text-red-600'>*</span> </label>
                        <input 
                            type='text' 
                            name='ctc' 
                            value={formData?.ctc}
                            onChange={handleFormData}
                            className='border border-gray-500 px-4 py-2 rounded-md' />
                    </div>
                    <div className='flex flex-col'>
                        <label>Inhand Salary<span className='text-red-600'>*</span></label>
                        <input 
                            type='text' 
                            name='inHand' 
                            value={formData?.inHand}
                            onChange={handleFormData}
                            className='border border-gray-500 px-4 py-2 rounded-md' />
                    </div>
                    <div className='flex flex-col'>
                        <label>Employee PF </label>
                        <input 
                            type='text' 
                            name='employeePF' 
                            value={formData?.employeePF}
                            onChange={handleFormData}
                            className='border border-gray-500 px-4 py-2 rounded-md' />
                    </div>
                    <div className='flex flex-col'>
                        <label>Employee ESI</label>
                        <input type='text'
                         name='employeeESI'
                         value={formData?.employeeESI}
                         onChange={handleFormData}
                         className='border border-gray-500 px-4 py-2 rounded-md' />
                    </div>
                    <div className='flex flex-col'>
                        <label>Employer PF </label>
                        <input 
                           type='text' 
                           name='employerPF' 
                           value={formData?.employerPF}
                           onChange={handleFormData}
                           className='border border-gray-500 px-4 py-2 rounded-md' />
                    </div>
                    <div className='flex flex-col'>
                        <label>Employer ESI</label>
                        <input 
                            type='text' 
                            name='employerESI' 
                            value={formData?.employerESI}
                            onChange={handleFormData}
                            className='border border-gray-500 px-4 py-2 rounded-md' />
                    </div>
              
              
            </div>
          </fieldset>
          <button type="submit" className="bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-800">
            Update
          </button>
        </>
      )
    },
    {
      label: "Update attachment details",
      content: (
        <>
           <fieldset ref={attachmentDetailsRef} className='border-2  rounded-md' style={{ borderColor: '#740FD6'}}>
            <legend className='font-semibold text-lg ml-8' style={{color : '#740FD6'}}> &nbsp;&nbsp; Attachments &nbsp;&nbsp;</legend>
            <div className='grid gap-3 m-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              
              {/* aadhar card attachments field  */}
              <div>
                <label>
                  <span>Aadhar Card</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input 
                  type='file' 
                  name='aadharCardAttachment'
                  onChange={(e) => handleFileChange(e, 'aadharCardAttachment')}
                  className="w-full rounded-md border border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors?.aadharCardAttachment && <span className="text-red-600">{errors?.aadharCardAttachment}</span>}
                {formData?.aadharCardAttachment && (
                  <div>
                    <img
                      src={formData?.aadharCardAttachment} // Replace with your image URL
                      alt="Image"
                      onClick={handleImageClick}
                      className={`cursor-pointer transition-all duration-300 ease-in-out w-[${imageSize}%]`} 
                    />
                  </div>
                )}
                 {isImageOpen && (
                  <div className="mt-4">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
              
              {/* pan card attachments field  */}
              <div>
                <label>
                  <span>Pan Card</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input 
                  type='file' 
                  name='panCardAttachment'
                  onChange={(e) => handleFileChange(e, 'panCardAttachment')}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors?.panCardAttachment && <span className="text-red-600">{errors?.panCardAttachment}</span>}
               
                {formData?.panCardAttachment && (
                  <div>
                    <img
                      src={formData?.panCardAttachment} // Replace with your image URL
                      alt="Image"
                      onClick={handleImageClick}
                      className={`cursor-pointer transition-all duration-300 ease-in-out w-[${imageSize}%]`} 
                    />
                  </div>
                )}
                 {isImageOpen && (
                  <div className="mt-4">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Close
                    </button>
                  </div>
                )}

              </div>
              
              {/* bank passbook attachments field  */}
              <div>
                <label>
                  <span>Bank Passbook</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='file' 
                  name='bankAttachment'
                  onChange={(e) => handleFileChange(e, 'bankAttachment')}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors?.bankAttachment && <span className="text-red-600">{errors?.bankAttachment}</span>}
                
                {formData?.bankAttachment && (
                  <div>
                    <img
                      src={formData?.bankAttachment} // Replace with your image URL
                      alt="Image"
                      onClick={handleImageClick}
                      className={`cursor-pointer transition-all duration-300 ease-in-out w-[${imageSize}%]`} 
                    />
                  </div>
                )}
                 {isImageOpen && (
                  <div className="mt-4">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>

              {/* joining form attachments field   */}
              <div>
                <label>
                  <span>Joining Form</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input 
                  type='file' 
                  name='joiningFormAttachment'
                  onChange={(e) => handleFileChange(e, 'joiningFormAttachment')}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors?.joiningFormAttachment && <span className="text-red-600">{errors?.joiningFormAttachment}</span>}
               
                {formData?.joiningFormAttachment && (
                  <div>
                    <img
                      src={formData?.joiningFormAttachment} // Replace with your image URL
                      alt="Image"
                      onClick={handleImageClick}
                      className={`cursor-pointer transition-all duration-300 ease-in-out w-[${imageSize}%]`} 
                    />
                  </div>
                )}
                 {isImageOpen && (
                  <div className="mt-4">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Close
                    </button>
                  </div>
                )}

              </div>
              
              {/* other document field  */}
              <div>
                <label>
                  <span>Other Document</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input 
                  type='file' 
                  onChange={(e) => handleFileChange(e, 'otherAttachment')}
                  name='otherAttachment'
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors?.otherAttachment && <span className="text-red-600">{errors.otherAttachment}</span>}
                
                {formData?.otherAttachment && (
                  <div>
                    <img
                      src={formData?.otherAttachment} // Replace with your image URL
                      alt="Image"
                      onClick={handleImageClick}
                      className={`cursor-pointer transition-all duration-300 ease-in-out w-[${imageSize}%]`} 
                    />
                  </div>
                )}
                 {isImageOpen && (
                  <div className="mt-4">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>

            </div>
          </fieldset> 
          
          <button type="submit" className="bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-800">
            Update
          </button>
        </>
      )
    },
    {
      label: "Update work details",
      content: (
        <>
         <fieldset  className='border-2  rounded-md mb-4' style={{ borderColor: '#740FD6'}}>
            <legend className='font-semibold text-lg ml-8' style={{color : '#740FD6'}}> &nbsp;&nbsp; Other Details &nbsp;&nbsp;</legend>
            <div className='grid gap-3 m-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            
              {/* employee code field  */}
              <div>
                <label>
                  <span>Employee Code</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input 
                  type='text' 
                  defaultValue={formData?.employeeCode || " "}
                  name='employeeCode'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors?.employeeCode && <span className="text-red-600">{errors?.employeeCode}</span>}
              </div>
              
              {/* company employee mail id field  */}
              <div>
                <label>Company Mail Id</label>
                <input 
                  type='email' 
                  defaultValue={formData?.companyEmail || " "}
                  name='companyEmail'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              {/* company phone number field  */}
              <div>
                <label>Company Phone Number</label>
                <input 
                  type='text' 
                  defaultValue={formData?.companyPhoneNum || " "}
                  name='companyPhoneNum'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              {/* joining data field  */}
              <div>
                <label>
                  <span>Joining Date</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='date' 
                  defaultValue={formData?.joiningDate || " "}
                  name='joiningDate'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors?.joiningDate && <span className="text-red-600">{errors?.joiningDate}</span>}
              </div>

              {/* last Appraisal date field      */}
              <div>
                <label>Last Appraisal Date</label>
                <input 
                  type='date' 
                  defaultValue={formData?.lastAppraisalDate}
                  name='lastAppraisalDate'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              {/* resign date field  */}
              <div>
                <label>Resign Date</label>
                <input 
                  type='date' 
                  value={formData?.regisnationDate}
                  name='regisnationDate'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 border-gray-500 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
            </div>
          </fieldset>
          <button type="submit" className="bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-800 mt-1">
            Update
          </button>
        </>
      )
    }
  ];

  return (
    <div>
      
      
      <div className=' py-1 text-center font-semibold text-xl mt-4 ml-8 mr-8 rounded-md' style={{backgroundColor : '#740FD6'}}>
        <h2 className='text-white'>Update Employee Registration</h2>
      </div>
     
     
      <div className='mx-10 pt-4'>
        
      <Accordion
          sections={sections}
          openIndex={openIndex}
          setOpenIndex={setOpenIndex}
        />
    
      </div>
    </div>
  )
}

export default Registration
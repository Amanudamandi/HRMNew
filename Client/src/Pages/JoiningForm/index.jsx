import React, { useCallback, useState} from 'react';
import axios from 'axios';
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";


function Registration() {
  const [page, setPage] = useState(1);
  const [errors, setErrors] = useState({});
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const [formData, setFormData] = useState({
    name: "",
    father_husbandName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    bloodGroup: "",
    personalPhoneNum: "",
    personalEmail: "",
    currentAddress: "",
    currentState: "",
    currentCity: "",
    currentPinCode: "",
    permanentAddress: "",
    permanentState: "",
    permanentCity: "",
    permanentPinCode: "",
    bankName: "",
    branchName: "",
    bankAccount: "",
    bankIFSC: "",
    bankAccountHolderName: "",
    bankAddress: "",
    panCard: "",
    aadharCard: "",
    emergencyContact: [
        { name: "", relation: "", address: "", phoneNumber: "" }
    ],
    photoAttachment: "",
    aadharCardAttachment: "",
    panCardAttachment: "",
    bankAttachment: "",
    class10Attachment: "",
    class12Attachment: "",
    graduationAttachment: "",
    postGraduationAttachment: "",
    signatureAttachment: "",
});

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.father_husbandName) newErrors.father_husbandName = 'Father/Husband Name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
    if (!formData.personalPhoneNum) newErrors.personalPhoneNum = 'Contact number is required';
    if (!formData.personalEmail) newErrors.personalEmail = 'Email is required';

    // PAN Card Validation: 5 letters + 4 digits + 1 letter (length 10)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!formData.panCard) {
      newErrors.panCard = "PAN Card number is required";
    } else if (!panRegex.test(formData.panCard)) {
      newErrors.panCard = "Invalid PAN Card format (e.g., ABCDE1234F)";
    }

    // Aadhar Card Validation: Exactly 12 digits
    const aadharRegex = /^[0-9]{12}$/;
    if (!formData.aadharCard) {
      newErrors.aadharCard = "Aadhar Card number is required";
    } else if (!aadharRegex.test(formData.aadharCard)) {
      newErrors.aadharCard = "Aadhar Card must be 12 digits";
    }

    // Photo & Signature Attachment Validation
    if (!formData.photoAttachment) {
      newErrors.photoAttachment = "Photo is required";
    }
    if (!formData.signatureAttachment) {
      newErrors.signatureAttachment = "Signature is required";
    }

    return newErrors;
  };

  // Handling form data input
  const handleFormData = useCallback((e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }, []);
  
  // file related change 
  const convertToBase64 = (file) => {
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
    }
  };

  const handleEmergencyContactChange = (e, index) => {
    const { name, value } = e.target;
    const updatedContacts = [...formData.emergencyContact];
    updatedContacts[index] = { ...updatedContacts[index], [name]: value };
    setFormData({ ...formData, emergencyContact: updatedContacts });
  };

  
  // Handling form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
     const formErrors = validateForm();
     setErrors(formErrors);
    
    if (Object.keys(formErrors).length > 0) {
      alert('Please correct the highlighted fields.');
      return;
    }

    try {
      console.log(" joining formData is ", formData);
      const response = await axios.post(`${process.env.REACT_APP_SERVER_ADDRESS}/auth/add-joiningForm`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200 || response.status === 201) {
        alert('Joining Form Submit Successfully!');

          // Reset Form After Successful Submission
          setFormData({
            name: "",
            father_husbandName: "",
            dateOfBirth: "",
            gender: "",
            maritalStatus: "",
            bloodGroup: "",
            personalPhoneNum: "",
            personalEmail: "",
            currentAddress: "",
            currentState: "",
            currentCity: "",
            currentPinCode: "",
            permanentAddress: "",
            permanentState: "",
            permanentCity: "",
            permanentPinCode: "",
            bankName: "",
            branchName: "",
            bankAccount: "",
            bankIFSC: "",
            bankAccountHolderName: "",
            bankAddress: "",
            panCard: "",
            aadharCard: "",
            emergencyContact: [{ name: "", relation: "", address: "", phoneNumber: "" }],
            photoAttachment: "",
            aadharCardAttachment: "",
            panCardAttachment: "",
            bankAttachment: "",
            class10Attachment: "",
            class12Attachment: "",
            graduationAttachment: "",
            postGraduationAttachment: "",
            signatureAttachment: "",
          });
          setErrors({});
      } else {
        alert('Something went wrong in Joining Form.');
      }
    } catch (error) {
      console.error('Joining error:', error);
      // alert('Error: Employee registration failed.');
    }
  };

  const nextPage = () => setPage(prev => prev + 1);
  const prevPage = () => setPage(prev => prev - 1);

  const addEmergencyContact = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      emergencyContact: [...prevFormData.emergencyContact, { name: "", relation: "", address: "", phoneNumber: "" }]
    }));
  };
  
  const removeEmergencyContact = (index) => {
    const updatedContacts = formData.emergencyContact.filter((_, i) => i !== index);
    setFormData({ ...formData, emergencyContact: updatedContacts });
  };
  

  return (
    <div>
      <div className=' py-2 text-center font-semibold text-xl mt-4 ml-10 mr-10 rounded-md' style={{backgroundColor : '#740FD6'}}>
        <h2 className='text-white'>Joining Form</h2>
      </div>
      <div className='mx-10 pt-4'>
        <form method='post' onSubmit={handleFormSubmit}>
        {page === 1 && (
          <fieldset className='border-2  rounded-md mb-3' style={{ borderColor: '#740FD6'}}>
            <legend className='font-semibold text-lg ml-8 ' style={{color : '#740FD6'}}> &nbsp;&nbsp; Personal Details &nbsp;&nbsp;</legend>
            <div className='grid gap-3 m-4 md:grid-cols-4'>


              {/* name input field   */}
              <div>
                <label>
                  <span>Name</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='text' 
                  value={formData?.name}
                  name='name'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4 border-gray-400"
                />
                {errors.name && <span className="text-red-600">{errors.name}</span>}
              </div>
              
              {/* father husband input field  */}
              <div>
                <label>
                  <span>Father Name</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='text' 
                  value={formData?.father_husbandName}
                  name='father_husbandName'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
                {errors.father_husbandName && <span className="text-red-600">{errors.father_husbandName}</span>}
              </div>

               {/* gender input field  */}
               <div>
                <label>
                  <span>Gender</span>
                  <span className='text-red-600'>*</span>
                </label>
                <select
                value={formData?.gender} 
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                 className="w-full rounded-md border-2 py-1 px-4  border-gray-400">
                <option>--select Gender--</option>
                <option>Male</option>
                <option>Female</option>
               </select>
              </div>

               {/* Marital Status input field  */}
               <div>
                <label>
                  <span>Marital Status</span>
                  <span className='text-red-600'>*</span>
                </label>
                <select 
                value={formData?.maritalStatus} 
                onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                className="w-full rounded-md border-2 py-1 px-4  border-gray-400">
                <option>--select Marital Status--</option>
                <option>Married</option>
                <option>Unmarried</option>
               </select>
              </div>

              {/* Blood Group field    */}
              <div>
                <label>
                  <span>Blood Group</span>
                  <span className='text-red-600'>*</span>
                </label>
                <select 
                className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                  value={formData?.bloodGroup} 
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups?.map((group, index) => (
                    <option key={index} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              
              {/* date of birth input field  */}
              <div>
                <label>
                  <span>Date Of Birth</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='date' 
                  value={formData?.dateOfBirth}
                  name='dateOfBirth'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>
              
              {/* personal phone number field  */}
              <div>
                <label>
                  <span>Personal Number</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='text' 
                  value={formData?.personalPhoneNum}
                  name='personalPhoneNum'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>

              {/* personal email if input field  */}
              <div>
                <label>
                  <span>Email</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='email' 
                  value={formData?.personalEmail}
                  name='personalEmail'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>
              
              {/* permanent Address field  */}
              <div>
                <label>
                  <span>Permanent Address</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='text' 
                  value={formData?.permanentAddress}
                  name='permanentAddress'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>
             
             {/* permanent pin code field  */}
              <div>
                <label>
                  <span>Permanent Pin Code</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='text' 
                  value={formData?.permanentPinCode}
                  name='permanentPinCode'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>

              {/* permanent state   */}
              <div>
                <label>
                  <span>Permanent state </span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='text' 
                  value={formData?.permanentState}
                  name='permanentState'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>

              {/* permanent city  */}
              <div>
                <label>
                  <span>Permanent City</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='text' 
                  value={formData?.permanentCity}
                  name='permanentCity'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>
              
              {/* current address field */}
              <div>
                <label>
                  <span>Current Address</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='text' 
                  value={formData?.currentAddress}
                  name='currentAddress'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>
              
              {/* current pin code field  */}
              <div>
                <label>
                  <span>Current Pin Code</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='text' 
                  value={formData?.currentPinCode}
                  name='currentPinCode'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>

              {/* current state   */}
              <div>
                <label>
                  <span>current State</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='text' 
                  value={formData?.currentState}
                  name='currentState'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>

              {/* current city  */}
              <div>
                <label>
                  <span>current city</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='text' 
                  value={formData?.currentCity}
                  name='currentCity'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>
              
            
                     
              
              {/* pan card number field  */}
              <div>
                <label>
                  <span>Pancard Number</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='text' 
                  value={formData?.panCard}
                  name='panCard'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
                {errors.panCard && <span className="text-red-600">{errors.panCard}</span>}
              </div>

              {/* aadhar number field  */}
              <div>
                <label>
                  <span>Aadhar Number</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='text' 
                  value={formData?.aadharCard}
                  name='aadharCard'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
                {errors?.aadharCard && <span className="text-red-600">{errors?.aadharCard}</span>}
              </div>

            </div>
          </fieldset>
        )}
          
          {/* bank details */}
          {page === 2 && (
          <fieldset className='border-2  rounded-md mb-4' style={{ borderColor: '#740FD6'}}>
            <legend className='font-semibold text-lg ml-8' style={{color : '#740FD6'}}>&nbsp;&nbsp; Bank Details &nbsp;&nbsp;</legend>
            <div className='grid gap-3 m-6 md:grid-cols-4'>
              
              {/* bank name field  */}
              <div>
                <label><span>Bank Name</span></label>
                <input type='text' 
                  value={formData?.bankName || " "}
                  name='bankName'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>
              
              {/* branch name field  */}
              <div>
                <label><span>Branch Name</span></label>  
                <input type='text' 
                  value={formData?.branchName || " "}
                  name='branchName'
                  onChange={(event) => setFormData((prev) => ({ ...prev, branchName: event.target.value}))}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>
              
              {/* account number field  */}
              <div>
                <label><span>Account Number</span></label>
                <input type='text' 
                  value={formData?.bankAccount || " "}
                  name='bankAccount'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>
              
              {/* ifsc code field  */}
              <div>
                <label><span>IFSC Code</span></label>
                <input type='text' 
                  value={formData?.bankIFSC || " "}
                  name='bankIFSC'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>
              
              {/* account holder name  */}
              <div>
                <label><span>Account Holder Name</span></label>
                <input type='text' 
                  value={formData?.bankAccountHolderName || " "}
                  name='bankAccountHolderName'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>
              
              {/* bank address field  */}
              <div>
                <label><span>Bank Address</span></label>
                <input type='text' 
                  value={formData?.bankAddress || " "}
                  name='bankAddress'
                  onChange={handleFormData}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>

            </div>
          </fieldset>
          )}
          
    
    
          {/* Emergency Details */}
          {page === 3 && (
          <fieldset className='border-2 rounded-md mb-4' style={{ borderColor: '#740FD6' }}>
            <legend className='font-semibold text-lg ml-8' style={{ color: '#740FD6' }}>
              &nbsp;&nbsp; Emergency Contact  Details &nbsp;&nbsp;
            </legend>

            <div className='grid gap-3 m-6 md:grid-cols-4'>
              {formData?.emergencyContact?.map((contact, index) => (
                <div key={index} className="col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Name Field */}
                  <div>
                    <label><span>Name</span></label>
                    <input
                      type="text"
                      value={contact?.name}
                      name="name"
                      onChange={(e) => handleEmergencyContactChange(e, index)}
                      className="w-full rounded-md border-2 py-1 px-4 border-gray-400"
                    />
                  </div>

                  {/* Relation Field */}
                  <div>
                    <label><span>Relation</span></label>
                    <input
                      type="text"
                      value={contact?.relation}
                      name="relation"
                      onChange={(e) => handleEmergencyContactChange(e, index)}
                      className="w-full rounded-md border-2 py-1 px-4 border-gray-400"
                    />
                  </div>

                  {/* Address Field */}
                  <div>
                    <label><span>Address</span></label>
                    <input
                      type="text"
                      value={contact?.address}
                      name="address"
                      onChange={(e) => handleEmergencyContactChange(e, index)}
                      className="w-full rounded-md border-2 py-1 px-4 border-gray-400"
                    />
                  </div>

                  {/* Phone Number Field */}
                  <div>
                    <label><span>Phone Number</span></label>
                    <input
                      type="text"
                      value={contact?.phoneNumber}
                      name="phoneNumber"
                      onChange={(e) => handleEmergencyContactChange(e, index)}
                      className="w-full rounded-md border-2 py-1 px-4 border-gray-400"
                    />
                  </div>


                  <div className="flex items-center gap-2">
                    {index === formData.emergencyContact.length - 1 && formData.emergencyContact.length < 3 && (
                      <button type="button" onClick={addEmergencyContact} title="Add more">
                        <FaPlusCircle size={22} className="text-green-600 hover:scale-110 transition-transform" />
                      </button>
                    )}
                    {formData.emergencyContact.length > 1 && (
                      <button type="button" onClick={() => removeEmergencyContact(index)} title="Remove">
                        <FaMinusCircle size={22} className="text-red-600 hover:scale-110 transition-transform" />
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </fieldset>
          )}


          {/* attachementdetails */}
          {page === 4 && (
          <fieldset className='border-2  rounded-md' style={{ borderColor: '#740FD6'}}>
            <legend className='font-semibold text-lg ml-8' style={{color : '#740FD6'}}> &nbsp;&nbsp; Attachments &nbsp;&nbsp;</legend>
            <div className='grid gap-3 m-6 md:grid-cols-4'>
              
              {/* aadhar card attachments field  */}
              <div>
                <label>
                  <span>Aadhar Card</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='file' 
                  name='aadharCardAttachment'
                  onChange={(e) => handleFileChange(e, 'aadharCardAttachment')}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
               
               
              </div>
              
              {/* pan card attachments field  */}
              <div>
                <label>
                  <span>Pan Card</span>
                  <span className='text-red-600'>*</span>
                </label>
                <input type='file' 
                  name='panCardAttachment'
                  onChange={(e) => handleFileChange(e, 'panCardAttachment')}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
               
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
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
                
                
              </div>

              {/* signature form attachments field   */}
              <div>
                <label>
                  <span>Signature</span>
                </label>
                <input type='file' 
                  name='signatureAttachment'
                  onChange={(e) => handleFileChange(e, 'signatureAttachment')}
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
                {errors.signatureAttachment && <p className="text-red-600">{errors.signatureAttachment}</p>}

              </div>
              
              {/*passport size photo  document field  */}
              <div>
                <label>
                  <span>Photo</span>
                </label>
                <input type='file' 
                  onChange={(e) => handleFileChange(e, 'photoAttachment')}
                  name='photoAttachment'
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
                {errors.photoAttachment && <p className="text-red-600">{errors.photoAttachment}</p>}
              </div>

                {/*10th marksheet  document field  */}
                <div>
                <label>
                  <span>class10Attachment</span>
                </label>
                <input type='file' 
                  onChange={(e) => handleFileChange(e, 'class10Attachment')}
                  name='class10Attachment'
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>

                {/*12th marksheet  document field  */}
                <div>
                <label>
                  <span>class12Attachment</span>
                </label>
                <input type='file' 
                  onChange={(e) => handleFileChange(e, 'class12Attachment')}
                  name='class12Attachment'
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>
              
                {/*graduate marksheet  document field  */}
                <div>
                <label>
                  <span>graduationAttachment</span>
                </label>
                <input type='file' 
                  onChange={(e) => handleFileChange(e, 'graduationAttachment')}
                  name='graduationAttachment'
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>

              
                {/*post graduate marksheet  document field  */}
                <div>
                <label>
                  <span>postGraduationAttachment</span>
                </label>
                <input type='file' 
                  onChange={(e) => handleFileChange(e, 'postGraduationAttachment')}
                  name='postGraduationAttachment'
                  className="w-full rounded-md border-2 py-1 px-4  border-gray-400"
                />
              </div>


            </div>
          </fieldset>
          )}

          <div className='flex justify-between mt-4 pb-4'>
          {page > 1 && (
              <button
                type="button"
                onClick={prevPage}
                className="px-6 py-2 text-white font-semibold rounded-md shadow-md bg-gray-500 hover:bg-gray-700"
              >
                Back
              </button>
            )}
            {page < 4 ? (
              <button
                type="button"
                onClick={nextPage}
                className="ml-auto px-6 py-2 text-white font-semibold rounded-md shadow-md hover:bg-blue-800"
                style={{ backgroundColor: '#740FD6' }}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto px-6 py-2 text-white font-semibold rounded-md shadow-md hover:bg-green-700"
                style={{ backgroundColor: '#740FD6' }}
              >
                Register
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  )
}

export default Registration
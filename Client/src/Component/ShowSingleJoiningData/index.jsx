// import axios from 'axios';
// import React, { useState , useEffect} from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { showReportingManager } from '../../Utils/Api/showReportingManager';
// import { showOfficyTimePolicy } from '../../Utils/Api/showOfficeTimePolicy';
// import { showWorkType } from '../../Utils/Api/showWorkType';
// import { showShiftName } from '../../Utils/Api/showShiftName';
// import { showBranch } from '../../Utils/Api/showBranch';
// import { showCompany } from '../../Utils/Api/ShowCompany';

// function EmployeeDetails() {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { employee } = location.state || {};
//     const [loading, setLoading] = useState(false); // Loader state
//     const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

//     const [shiftName, setShiftName] = useState([]);
//     const [workTypeData, setWorkTypeData]=useState([]);
//     const [officeTimePolicy, setOfficeTimePolicy] = useState([]);
//     const [reportingManagers, setReportingManagers] = useState([]);
//      const [companynamedata, setCompanyName] = useState([]);
//       const [branchnamedata, setBranchNameData] = useState([]);
//       const [selectedCompanyNameId, setSelectedCompanyNameId] = useState('');

//     const [isModalOpen, setIsModalOpen] = useState(false);
//       const [modalImageSrc, setModalImageSrc] = useState("");

//       const [formData, setFormData] = useState({
//         joiningFormId: '',
//         name : '',
//         employeeCode: '',
//         biometricPunchId: '',
//         reportingManagerId: '',
//         shiftId: '',
//         officeTimePolicyId : '',
//         branchId : '',
//         workTypeId: '',

//     });

//     useEffect(() => {
//         showShiftName(setShiftName);
//         showOfficyTimePolicy(setOfficeTimePolicy);
//         showWorkType(setWorkTypeData)
//         showReportingManager(setReportingManagers)
//         showCompany(setCompanyName);
//       }, []);

//       useEffect(() => {
//           if (selectedCompanyNameId) showBranch(setBranchNameData, selectedCompanyNameId);
//       }, [ selectedCompanyNameId]);

//     if (!employee) {
//         return <div className="text-center text-red-500">No Employee Data Found</div>;
//     }

//     const handleApproveClicked = ()=>{
//         navigate('/layout/approveForm', { state: { formId : employee?.id } })
//     }

//     const openImageModal = (imageSrc) => {
//         setModalImageSrc(imageSrc);
//         setIsModalOpen(true);
//       };
    
//       const closeImageModal = () => {
//         setIsModalOpen(false);
//         setModalImageSrc("");
//       };

//     const handleRejectClick = async () => {
//         setLoading(true); // Start loading
//         console.log("My form ID when rejecting the joining form", employee.id);
        
//         try {
//             const response = await axios.put(
//                 `${process.env.REACT_APP_SERVER_ADDRESS}/auth/reject-joiningForm`, 
//                 {},
//                 {  
//                     params: { formId: employee.id }, // Send formId in query
//                     withCredentials: true
//                 }
//             );

//             if (response.status === 200 || response.status === 201) {
//                 // Show success toast
//                 toast.success("Rejected successfully!", {
//                     position: "top-right",
//                     autoClose: 3000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                 });
//             } else {
//                 alert('Something went wrong during rejection.');
//             }

//         } catch (error) {
//             console.error("Error rejecting form", error);
//             toast.error("Reject failed!", {
//                 position: "top-right",
//                 autoClose: 3000,
//             });
//         }
        
//         setLoading(false); // Stop loading
//     };

//    // Open Register Modal
//     const openRegisterModal = () => {
//         setIsRegisterModalOpen(true);
//     };

//     // Close Register Modal
//     const closeRegisterModal = () => {
//         setIsRegisterModalOpen(false);
//         setFormData({
//             joiningFormId: '',
//             name : '',
//             employeeCode: '',
//             biometricPunchId: '',
//             reportingManagerId: '',
//             shiftId: '',
//             officeTimePolicyId : '',
//             branchId : '',
//             workTypeId: '',
    
//         });
//     };


//     // Handle Form Input Change
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
    
//         setFormData((prevState) => ({
//             ...prevState,
//             [name]: name === "biometricPunchId" ? value.trim() : value, // Trim only for biometricPunchId
//         }));
//     };
    

//     // Submit Registration Form
//     const handleRegisterEmployee = async () => {
//         setLoading(true);
//         const trimmedBiometricPunchId = formData.biometricPunchId?.trim();
//         try {
//             const response = await axios.post(
//                 `${process.env.REACT_APP_SERVER_ADDRESS}/auth/register-employee`,
//                 {
//                     joiningFormId: employee.id,
//                     name: employee?.candidatePersonalDetail?.name,
//                     employeeCode: formData.employeeCode,
//                     biometricPunchId: trimmedBiometricPunchId,
//                     reportingManagerId: formData.reportingManagerId,
//                     shiftId: formData.shiftId,
//                     officeTimePolicyId: formData.officeTimePolicyId,
//                     branchId: formData.branchId,
//                     workTypeId: formData.workTypeId,
//                 },
//                 { withCredentials: true }
//             );

//             if (response.status === 200 || response.status === 201) {
//                 toast.success("Employee registered successfully!");
//                 setIsModalOpen(false);
//                 setFormData({
//                     joiningFormId: '',
//                     name : '',
//                     employeeCode: '',
//                     biometricPunchId: '',
//                     reportingManagerId: '',
//                     shiftId: '',
//                     officeTimePolicyId : '',
//                     branchId : '',
//                     workTypeId: '',
//                 });
//             } else {
//                 toast.error("Failed to register employee!");
//             }
//         } catch (error) {
//             toast.error("Error registering employee!");
//             console.error(error);
//         }
//         setLoading(false);
//     };
    


//     return (
//         <div className="p-4 h-screen w-full ">
            
//             <h2 className="text-center text-[#8B5DFF] text-xl font-semibold mb-2">Employee Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-4 border rounded-md shadow-lg p-2 gap-1 w-full">
//                 <div><strong>Company Name:</strong> {employee?.companyId?.name}</div>
//                 <div><strong>Employee Name:</strong> {employee?.candidatePersonalDetail?.name}</div>
//                 <div><strong>Father Name:</strong> {employee?.candidatePersonalDetail?.father_husbandName}</div>
//                 <div><strong>Date of Birth:</strong> {new Date(employee?.candidatePersonalDetail?.dateOfBirth).toLocaleDateString('en-GB')}</div>
//                 <div><strong>Gender:</strong> {employee?.candidatePersonalDetail?.gender}</div>
//                 <div><strong>Marital Status:</strong> {employee?.candidatePersonalDetail?.maritalStatus}</div>
//                 <div><strong>Blood Group:</strong> {employee?.candidatePersonalDetail?.bloodGroup}</div>
//                 <div><strong>Personal Phone Number:</strong> {employee?.candidatePersonalDetail?.personalPhoneNum}</div>
//                 <div><strong>Personal Email:</strong> {employee?.candidatePersonalDetail?.personalEmail}</div>
//                 <div><strong>currentAddress:</strong> {employee?.candidatePersonalDetail?.currentAddress?.address}</div>
//                 <div><strong>Current State:</strong> {employee?.candidatePersonalDetail?.currentAddress?.state}</div>
//                 <div><strong>Current City:</strong> {employee?.candidatePersonalDetail?.currentAddress?.city}</div>
//                 <div><strong>Current PinCode:</strong> {employee?.candidatePersonalDetail?.currentAddress?.pincode}</div>
//                 <div><strong>Permanent Address:</strong> {employee?.candidatePersonalDetail?.permanentAddress?.address}</div>
//                 <div><strong>Permanent State:</strong> {employee?.candidatePersonalDetail?.permanentAddress?.state}</div>
//                 <div><strong>Permanent City:</strong> {employee?.candidatePersonalDetail?.permanentAddress?.city}</div>
//                 <div><strong>Permanent PinCode:</strong> {employee?.candidatePersonalDetail?.permanentAddress?.pincode}</div>
//                 <div><strong>Bank Name:</strong> {employee?.candidateBankDetail?.bankName}</div>
//                 <div><strong>Branch Name:</strong> {employee?.candidateBankDetail?.branchName}</div>
//                 <div><strong>Bank Account:</strong> {employee?.bankAccount}</div>
//                 <div><strong>Bank IFSC:</strong> {employee?.candidateBankDetail?.bankIFSC}</div>
//                 <div><strong>Bank Account Holder Name:</strong> {employee?.candidateBankDetail?.bankAccountHolderName}</div>
//                 <div><strong>Bank Address:</strong> {employee?.candidateBankDetail?.bankAddress}</div>
//                 <div><strong>PanCard:</strong> {employee?.candidatePersonalDetail?.panCard}</div>
//                 <div><strong>AadharCard:</strong> {employee?.candidatePersonalDetail?.aadharCard}</div>
//                 <div><strong>UanNumber:</strong> {employee?.uanNumber}</div>
//                 <div><strong>Department:</strong> {employee?.department?.department}</div>
//                 <div><strong>Designation:</strong> {employee?.designationdesignation}</div>
//                 <div><strong>Employee Type:</strong> {employee.employeeType}</div>
//                 <div><strong>Interview Date:</strong>{new Date(employee?.interviewDate).toLocaleDateString('en-GB')}</div>
//                 <div><strong>Joining Date:</strong>  {new Date(employee?.joiningDate).toLocaleDateString('en-GB')}</div>
//                 <div><strong>Mode Of Recruitment:</strong> {employee?.modeOfRecruitment}</div>
//                 <div><strong>Reference:</strong> {employee?.reference}</div>
//                 <div><strong>CTC:</strong> {employee?.salary?.ctc}</div>
//                 <div><strong>Employee ESI:</strong> {employee?.salary?.employeeESI}</div>
//                 <div><strong>Employee PF:</strong> {employee?.salary?.employeePF}</div>
//                 <div><strong>Employer ESI:</strong> {employee?.salary?.employerESI}</div>
//                 <div><strong>Employer PF:</strong> {employee?.salary?.employerPF}</div>
//                 <div><strong>Email:</strong> {employee?.personalEmail}</div>

                
                
        
//             </div>
            
//             <div className='grid grid-cols-1 md:grid-cols-5 '>
//             <div><strong>AadharCard Attachment:</strong> 
//                 {employee?.candidateAttachmentDetail?.aadharCardAttachment && (
//                     <img
//                     src={employee?.candidateAttachmentDetail?.aadharCardAttachment}
//                     alt="Aadhar Card"
//                     className="w-28 h-16 object-cover cursor-pointer"
//                     onClick={() => openImageModal(employee?.candidateAttachmentDetail?.aadharCardAttachment)}
//                     />
//                 )}
//                 </div>

//                 <div><strong>panCardAttachment:</strong> 
//                 {employee?.candidateAttachmentDetail?.panCardAttachment && (
//                     <img
//                     src={employee?.candidateAttachmentDetail?.panCardAttachment}
//                     alt="Aadhar Card"
//                     className="w-28 h-16 object-cover cursor-pointer"
//                     onClick={() => openImageModal(employee?.candidateAttachmentDetail?.panCardAttachment)}
//                     />
//                 )}
//                 </div>

//                 <div><strong>bankAttachment:</strong>
//                 {employee?.candidateAttachmentDetail?.bankAttachment && (
//                     <img
//                     src={employee?.candidateAttachmentDetail?.bankAttachment}
//                     alt="Aadhar Card"
//                     className="w-28 h-16 object-cover cursor-pointer"
//                     onClick={() => openImageModal(employee?.candidateAttachmentDetail?.bankAttachment)}
//                     />
//                 )}
//                 </div>

//                 <div><strong>photoAttachment:</strong> 
//                 {employee?.candidateAttachmentDetail?.photoAttachment && (
//                     <img
//                     src={employee?.candidateAttachmentDetail?.photoAttachment}
//                     alt="Aadhar Card"
//                     className="w-28 h-16 object-cover cursor-pointer"
//                     onClick={() => openImageModal(employee?.candidateAttachmentDetail?.photoAttachment)}
//                     />
//                 )}
//                 </div>

//                 <div><strong>signatureAttachment:</strong>
//                 {employee?.candidateAttachmentDetail?.signatureAttachment && (
//                     <img
//                     src={employee?.candidateAttachmentDetail?.signatureAttachment}
//                     alt="Aadhar Card"
//                     className="w-28 h-16 object-cover cursor-pointer"
//                     onClick={() => openImageModal(employee?.candidateAttachmentDetail?.signatureAttachment)}
//                     />
//                 )} 
//                 </div>

//                 <div><strong>class10Attachment:</strong>
//                 {employee?.candidateAttachmentDetail?.class10Attachment && (
//                     <img
//                     src={employee?.candidateAttachmentDetail?.class10Attachment}
//                     alt="Aadhar Card"
//                     className="w-28 h-16 object-cover cursor-pointer"
//                     onClick={() => openImageModal(employee?.candidateAttachmentDetail?.class10Attachment)}
//                     />
//                 )} 
//                 </div>

//                 <div><strong>class12Attachment:</strong> 
//                 {employee?.candidateAttachmentDetail?.class12Attachment && (
//                     <img
//                     src={employee?.candidateAttachmentDetail?.class12Attachment}
//                     alt="Aadhar Card"
//                     className="w-28 h-16 object-cover cursor-pointer"
//                     onClick={() => openImageModal(employee?.candidateAttachmentDetail?.class12Attachment)}
//                     />
//                 )} 
//                 </div>

//                 <div><strong>graduationAttachment:</strong>
//                 {employee?.candidateAttachmentDetail?.graduationAttachment && (
//                     <img
//                     src={employee?.candidateAttachmentDetail?.graduationAttachment}
//                     alt="Aadhar Card"
//                     className="w-28 h-16 object-cover cursor-pointer"
//                     onClick={() => openImageModal(employee?.candidateAttachmentDetail?.graduationAttachment)}
//                     />
//                 )} 
//                 </div>

//                 <div><strong>postGraduationAttachment:</strong>
//                 {employee?.candidateAttachmentDetail?.postGraduationAttachment && (
//                     <img
//                     src={employee?.candidateAttachmentDetail?.postGraduationAttachment}
//                     alt="Aadhar Card"
//                     className="w-28 h-16 object-cover cursor-pointer"
//                     onClick={() => openImageModal(employee?.candidateAttachmentDetail?.postGraduationAttachment)}
//                     />
//                 )} 
//                 </div>
//             </div>
            

//             {/* Image Modal */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
//                 <div className="relative w-full h-full flex items-center justify-center">
//                     {/* Image Wrapper */}
//                     <img
//                     src={modalImageSrc}
//                     alt="Full Screen"
//                     className="h-screen w-full object-contain"
//                     />
                    
//                     {/* Close Button */}
//                     <div className="">
//                     <button
//                     onClick={closeImageModal}
//                     className="absolute top-4 right-4 bg-white text-black font-bold text-3xl rounded-full w-9 h-9  items-center"
//                     style={{ zIndex: 100 }}
//                     >
//                     &times;
//                     </button>
//                     </div>
//                 </div>
//                 </div>
//             )}

//             <div className='mt-4 flex gap-2 pb-4'>
//                 {employee?.status=='Pending' && (
//                     <>
//                         <button onClick={handleApproveClicked} className='px-4 py-2 rounded-md bg-green-500 text-white font-semibold' >Approve</button>
//                         <button onClick={handleRejectClick} className='px-4 py-2 rounded-md bg-red-500 text-white font-semibold'>Rejected</button>
//                     </>
//                 )}
                
//             </div>
            
            
//             <div className='flex justify-start gap-3'>

//             {employee?.status !== 'Pending' && (
//                 <button onClick={openRegisterModal} className="mt-4 bgMainColor text-white p-2 rounded-md mb-4">
//                     Employee Register
//                 </button>
//             )}
//                 {/* <button onClick={openRegisterModal} className="mt-4 bgMainColor text-white p-2 rounded-md mb-4" >Employee Register</button> */}
//                 <button className="mt-4  bg-red-500 text-white p-2 rounded-md mb-4" onClick={() => navigate(-1)}>Go Back</button>
//             </div>

//             {/* Employee Register Modal */}
//             {isRegisterModalOpen && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="bg-white p-6 rounded-lg shadow-lg w-[calc(100%-40%)]">
//                         <h2 className="text-lg items-center font-semibold mb-4">Employee Register</h2>

//                         <div className='grid gap-3 m-6 md:grid-cols-2'>
//                         {/* Input Fields */}
//                         <div className="mb-1">
//                             <label className="block font-medium">Employee Code <span className='text-red-600' >*</span> </label>
//                             <input type="text" name="employeeCode" defaultValue={formData.employeeCode}  onChange={handleInputChange}
//                              placeholder='Enter Employee Code...'
//                              className="w-full border-2 border-gray-500 py-2 rounded-md" />
//                         </div>

//                         <div className="mb-1">
//                             <label className="block font-medium"> Biometric PunchId <span className='text-red-600' >*</span> </label>
//                             <input type="text" name="biometricPunchId" defaultValue={formData.biometricPunchId} onChange={handleInputChange} 
//                                placeholder='Enter Biometric PunchId...'
//                             className="w-full py-2 border-2 border-gray-500  rounded-md" />
//                         </div>

//                         {/* company name field  */}
//                         <div className='mb-1'>
//                             <label className="block font-medium">
//                             <span>Company Name</span>
//                             <span className='text-red-600'>*</span>
//                             </label>
//                             <select 
//                                 name="company"
//                                 onChange={(e) => {
//                                 const { name, value } = e.target;
//                                 console.log(e.target.value);
//                                 console.log("name", name, "value", value);
//                                 setFormData((prev) => ({ ...prev, [name] : value}));
//                                 setSelectedCompanyNameId(e.target.value);
//                             }}
//                             className="w-full rounded-md border-2 py-2 px-4  border-gray-500"
//                             >
//                             <option>---Select Company Name--- </option>
//                             {companynamedata?.map(({name, id})=>(
//                                 <option key={id} value={id}>{name}</option>
//                             ))}
//                             </select>
//                         </div>
              
//                         {/* company branch field  */}
//                         <div className='mb-1'>
//                             <label className="block font-medium">
//                             <span>Company Branch</span>
//                             <span className='text-red-600'>*</span>
//                             </label>
//                             <select 
//                                 name="branchId"
//                                 defaultValue={formData.branchId || ""}
//                                 onChange={(event) => {
//                                 const { name, value } = event.target;
//                                 console.log(event.target.value);
//                                 console.log("name", name, "value", value);
//                                 setFormData((prev) => ({ ...prev, [name] : value}));
//                             }}

//                             className="w-full rounded-md border-2 py-2 px-4  border-gray-500"
//                             >
//                             <option >--Select the Branch--</option>
//                             {branchnamedata?.map(({name, id})=>(
//                                 <option key={id} value={id}>{name}</option>
//                             ))}
//                             </select>
//                         </div>

//                         {/* shift input field      */}
//                         <div className="mb-1">
//                             <label className="block font-medium">Shift <span className='text-red-600'>*</span></label>
//                             <select 
//                                 name="shiftId"
//                                 value={formData.shiftId} 
//                                 onChange={handleInputChange}
//                                 className="w-full rounded-md border-2 py-2 px-4  border-gray-500">
//                                 <option>--Select Shift--</option>
//                                 {shiftName?.map(({name, id})=>(
//                                     <option key={id} value={id}>{name}</option>
//                                 ))}
//                             </select>
//                         </div>

//                          {/* office time policy input field  */}
//                         <div className="mb-1">
//                             <label className="block font-medium"> Office Time Policy <span className='text-red-600'>*</span></label>
//                             <select 
//                                 name="officeTimePolicyId"
//                                 onChange={(event) => {
//                                     const { name, value} = event.target;
//                                     // console.log("name", name, "value", value);
//                                     setFormData((prev) => ({ ...prev, [name] : value}))
//                                 }}
//                                 className="w-full rounded-md border-2 py-2 px-4  border-gray-500"
//                                 >
//                                 <option>--Select Office Time--</option>
//                                 {officeTimePolicy?.map(({policyName, id})=>(
//                                     <option key={id} value={id}>{policyName}</option>
//                                 ))}
//                             </select>
//                         </div>
                        
//                         {/* reporting Manager input field  */}
//                         <div className="mb-1">
//                             <label className="block font-medium">Reporting Manager <span className='text-red-600'>*</span></label>
//                             <select 
//                                 className="w-full rounded-md border-2 py-2 px-4  border-gray-500"
//                                 onChange={(e) => {
//                                     setFormData(prevState => ({
//                                     ...prevState,
//                                     [e.target.name]: e.target.value
//                                     }));
//                                 }}
//                                 name="reportingManagerId"
//                             >
//                             <option>--Select Reporting Manager--</option>
//                             {reportingManagers?.map(({name, id})=>(
//                                 <option key={id} value={id}>{name}</option>
//                             ))}
//                             </select>
                            
//                         </div>

//                         {/* Work Type Field   */}
//                         <div className='mb-1'>
//                             <label className="block font-medium"><span>Work Type <span className='text-red-600'>*</span></span></label>
//                             <select
//                                 name='workTypeId'
//                                 defaultValue={formData?.workTypeId} 
//                                 className="w-full rounded-md border-2 py-2 px-4  border-gray-500"
//                                 onChange={(e) => {
//                                     const { name, value} = e.target;
//                                     // console.log("work name", name, "work value", value);
//                                     setFormData((prev) => ({ ...prev, [name] : value}))
//                                 }}
//                                 >
//                                 <option>--Select Work Type--</option>
//                                 {workTypeData?.map(({id, name})=>(
//                                     <option key={id} value={id} name={name}>{name}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         </div>

//                         {/* Buttons */}
//                         <div className="flex justify-end gap-2">
//                             <button onClick={closeRegisterModal} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
//                             <button onClick={handleRegisterEmployee} className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
//                         </div>
//                     </div>
//                 </div>
//             )}

            

//         </div>
//     );
// }

// export default EmployeeDetails;

import axios from 'axios';
import React, { useState , useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showReportingManager } from '../../Utils/Api/showReportingManager';
import { showOfficyTimePolicy } from '../../Utils/Api/showOfficeTimePolicy';
import { showWorkType } from '../../Utils/Api/showWorkType';
import { showShiftName } from '../../Utils/Api/showShiftName';
import { showBranch } from '../../Utils/Api/showBranch';
import { showCompany } from '../../Utils/Api/ShowCompany';

function EmployeeDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { employee } = location.state || {};

    const [page, setPage] = useState(1); // 1 for details, 2 for attachments
    const [loading, setLoading] = useState(false); // Loader state
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const [shiftName, setShiftName] = useState([]);
    const [workTypeData, setWorkTypeData]=useState([]);
    const [officeTimePolicy, setOfficeTimePolicy] = useState([]);
    const [reportingManagers, setReportingManagers] = useState([]);
     const [companynamedata, setCompanyName] = useState([]);
      const [branchnamedata, setBranchNameData] = useState([]);
      const [selectedCompanyNameId, setSelectedCompanyNameId] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
      const [modalImageSrc, setModalImageSrc] = useState("");

      const [formData, setFormData] = useState({
        joiningFormId: '',
        name : '',
        employeeCode: '',
        biometricPunchId: '',
        reportingManagerId: '',
        shiftId: '',
        officeTimePolicyId : '',
        branchId : '',
        workTypeId: '',

    });

    useEffect(() => {
        showShiftName(setShiftName);
        showOfficyTimePolicy(setOfficeTimePolicy);
        showWorkType(setWorkTypeData)
        showReportingManager(setReportingManagers)
        showCompany(setCompanyName);
      }, []);

      useEffect(() => {
          if (selectedCompanyNameId) showBranch(setBranchNameData, selectedCompanyNameId);
      }, [ selectedCompanyNameId]);

    if (!employee) {
        return <div className="text-center text-red-500">No Employee Data Found</div>;
    }

    const handleApproveClicked = ()=>{
        navigate('/layout/approveForm', { state: { formId : employee?.id } })
    }

    const openImageModal = (imageSrc) => {
        setModalImageSrc(imageSrc);
        setIsModalOpen(true);
      };
    
      const closeImageModal = () => {
        setIsModalOpen(false);
        setModalImageSrc("");
      };

    const handleRejectClick = async () => {
        setLoading(true); // Start loading
        console.log("My form ID when rejecting the joining form", employee.id);
        
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_SERVER_ADDRESS}/auth/reject-joiningForm`, 
                {},
                {  
                    params: { formId: employee.id }, // Send formId in query
                    withCredentials: true
                }
            );

            if (response.status === 200 || response.status === 201) {
                // Show success toast
                toast.success("Rejected successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                alert('Something went wrong during rejection.');
            }

        } catch (error) {
            console.error("Error rejecting form", error);
            toast.error("Reject failed!", {
                position: "top-right",
                autoClose: 3000,
            });
        }
        
        setLoading(false); // Stop loading
    };

   // Open Register Modal
    const openRegisterModal = () => {
        setIsRegisterModalOpen(true);
    };

    // Close Register Modal
    const closeRegisterModal = () => {
        setIsRegisterModalOpen(false);
        setFormData({
            joiningFormId: '',
            name : '',
            employeeCode: '',
            biometricPunchId: '',
            reportingManagerId: '',
            shiftId: '',
            officeTimePolicyId : '',
            branchId : '',
            workTypeId: '',
    
        });
    };


    // Handle Form Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        setFormData((prevState) => ({
            ...prevState,
            [name]: name === "biometricPunchId" ? value.trim() : value, // Trim only for biometricPunchId
        }));
    };
    

    // Submit Registration Form
    // const handleRegisterEmployee = async () => {
    //     setLoading(true);
    //     const trimmedBiometricPunchId = formData.biometricPunchId?.trim();
    //     try {
    //         const response = await axios.post(
    //             `${process.env.REACT_APP_SERVER_ADDRESS}/auth/register-employee`,
    //             {
    //                 joiningFormId: employee.id,
    //                 name: employee?.candidatePersonalDetail?.name,
    //                 employeeCode: formData.employeeCode,
    //                 biometricPunchId: trimmedBiometricPunchId,
    //                 reportingManagerId: formData.reportingManagerId,
    //                 shiftId: formData.shiftId,
    //                 officeTimePolicyId: formData.officeTimePolicyId,
    //                 branchId: formData.branchId,
    //                 workTypeId: formData.workTypeId,
    //             },
    //             { withCredentials: true }
    //         );

    //         console.log("")
    //         if (response.status === 200 || response.status === 201) {
    //             toast.success("Employee registered successfully!");
    //             setIsModalOpen(false);
    //             setFormData({
    //                 joiningFormId: '',
    //                 name : '',
    //                 employeeCode: '',
    //                 biometricPunchId: '',
    //                 reportingManagerId: '',
    //                 shiftId: '',
    //                 officeTimePolicyId : '',
    //                 branchId : '',
    //                 workTypeId: '',
    //             });
    //         } else {
    //             toast.error("Failed to register employee!");
    //         }
    //     } catch (error) {
    //         toast.error("Error registering employee!");
    //         console.error(error);
    //     }
    //     setLoading(false);
    // };

    const handleRegisterEmployee = async (e) => {
        e.preventDefault();
        setLoading(true);

        const trimmedBiometricPunchId = formData.biometricPunchId?.trim();
    
        const payload = {
            joiningFormId: employee.id,
            name: employee?.candidatePersonalDetail?.name,
            employeeCode: formData.employeeCode,
            biometricPunchId: trimmedBiometricPunchId,
            reportingManagerId: formData.reportingManagerId,
            shiftId: formData.shiftId,
            officeTimePolicyId: formData.officeTimePolicyId,
            branchId: formData.branchId,
            workTypeId: formData.workTypeId,
        };
    
        console.log("Submitting employee registration payload:", payload); // 🔍 Log here
    
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_ADDRESS}/auth/register-employee`,
                payload,
                { withCredentials: true }
            );
    
            if (response.status === 200 || response.status === 201) {
                toast.success("Employee registered successfully!");
                setIsModalOpen(false);
                setFormData({
                    joiningFormId: '',
                    name : '',
                    employeeCode: '',
                    biometricPunchId: '',
                    reportingManagerId: '',
                    shiftId: '',
                    officeTimePolicyId : '',
                    branchId : '',
                    workTypeId: '',
                });
            } else {
                toast.error("Failed to register employee!");
            }
        } catch (error) {
            toast.error("Error registering employee!");
            console.error(error);
        }
    
        setLoading(false);
    };
    
    
    return (
        <div className="p-4 h-screen w-full ">
            <h2 className="text-center text-[#8B5DFF] text-xl font-semibold mb-2">Employee Details</h2>

            {page === 1 ? (
        <>
          {/* PAGE 1 - DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-4 border rounded-md shadow-lg p-2 gap-1 w-full">
                <div><strong>Company Name:</strong> {employee?.companyId?.name}</div>
                <div><strong>Employee Name:</strong> {employee?.candidatePersonalDetail?.name}</div>
                <div><strong>Father Name:</strong> {employee?.candidatePersonalDetail?.father_husbandName}</div>
                <div><strong>Date of Birth:</strong> {new Date(employee?.candidatePersonalDetail?.dateOfBirth).toLocaleDateString('en-GB')}</div>
                <div><strong>Gender:</strong> {employee?.candidatePersonalDetail?.gender}</div>
                <div><strong>Marital Status:</strong> {employee?.candidatePersonalDetail?.maritalStatus}</div>
                <div><strong>Blood Group:</strong> {employee?.candidatePersonalDetail?.bloodGroup}</div>
                <div><strong>Personal Phone Number:</strong> {employee?.candidatePersonalDetail?.personalPhoneNum}</div>
                <div><strong>Personal Email:</strong> {employee?.candidatePersonalDetail?.personalEmail}</div>
                <div><strong>currentAddress:</strong> {employee?.candidatePersonalDetail?.currentAddress?.address}</div>
                <div><strong>Current State:</strong> {employee?.candidatePersonalDetail?.currentAddress?.state}</div>
                <div><strong>Current City:</strong> {employee?.candidatePersonalDetail?.currentAddress?.city}</div>
                <div><strong>Current PinCode:</strong> {employee?.candidatePersonalDetail?.currentAddress?.pincode}</div>
                <div><strong>Permanent Address:</strong> {employee?.candidatePersonalDetail?.permanentAddress?.address}</div>
                <div><strong>Permanent State:</strong> {employee?.candidatePersonalDetail?.permanentAddress?.state}</div>
                <div><strong>Permanent City:</strong> {employee?.candidatePersonalDetail?.permanentAddress?.city}</div>
                <div><strong>Permanent PinCode:</strong> {employee?.candidatePersonalDetail?.permanentAddress?.pincode}</div>
                <div><strong>Bank Name:</strong> {employee?.candidateBankDetail?.bankName}</div>
                <div><strong>Branch Name:</strong> {employee?.candidateBankDetail?.branchName}</div>
                <div><strong>Bank Account:</strong> {employee?.bankAccount}</div>
                <div><strong>Bank IFSC:</strong> {employee?.candidateBankDetail?.bankIFSC}</div>
                <div><strong>Bank Account Holder Name:</strong> {employee?.candidateBankDetail?.bankAccountHolderName}</div>
                <div><strong>Bank Address:</strong> {employee?.candidateBankDetail?.bankAddress}</div>
                <div><strong>PanCard:</strong> {employee?.candidatePersonalDetail?.panCard}</div>
                <div><strong>AadharCard:</strong> {employee?.candidatePersonalDetail?.aadharCard}</div>
                <div><strong>UanNumber:</strong> {employee?.uanNumber}</div>
                <div><strong>Department:</strong> {employee?.department?.department}</div>
                <div><strong>Designation:</strong> {employee?.designationdesignation}</div>
                <div><strong>Employee Type:</strong> {employee.employeeType}</div>
                <div><strong>Interview Date:</strong>{new Date(employee?.interviewDate).toLocaleDateString('en-GB')}</div>
                <div><strong>Joining Date:</strong>  {new Date(employee?.joiningDate).toLocaleDateString('en-GB')}</div>
                <div><strong>Mode Of Recruitment:</strong> {employee?.modeOfRecruitment}</div>
                <div><strong>Reference:</strong> {employee?.reference}</div>
                <div><strong>CTC:</strong> {employee?.salary?.ctc}</div>
                <div><strong>Employee ESI:</strong> {employee?.salary?.employeeESI}</div>
                <div><strong>Employee PF:</strong> {employee?.salary?.employeePF}</div>
                <div><strong>Employer ESI:</strong> {employee?.salary?.employerESI}</div>
                <div><strong>Employer PF:</strong> {employee?.salary?.employerPF}</div>
                <div><strong>Email:</strong> {employee?.personalEmail}</div>
            </div>
            <div className="mt-4 flex justify-end">
            <button onClick={() => setPage(2)} className="bg-blue-600 text-white px-4 py-2 rounded-md">Next</button>
          </div>
        </>
      ) : (
        <>
          {/* PAGE 2 - ATTACHMENTS */}
            
            <div className='grid grid-cols-1 md:grid-cols-5 '>
            <div><strong>AadharCard Attachment:</strong> 
                {employee?.candidateAttachmentDetail?.aadharCardAttachment && (
                    <img
                    src={employee?.candidateAttachmentDetail?.aadharCardAttachment}
                    alt="Aadhar Card"
                    className="w-28 h-16 object-cover cursor-pointer"
                    onClick={() => openImageModal(employee?.candidateAttachmentDetail?.aadharCardAttachment)}
                    />
                )}
                </div>

                <div><strong>panCardAttachment:</strong> 
                {employee?.candidateAttachmentDetail?.panCardAttachment && (
                    <img
                    src={employee?.candidateAttachmentDetail?.panCardAttachment}
                    alt="Aadhar Card"
                    className="w-28 h-16 object-cover cursor-pointer"
                    onClick={() => openImageModal(employee?.candidateAttachmentDetail?.panCardAttachment)}
                    />
                )}
                </div>

                <div><strong>bankAttachment:</strong>
                {employee?.candidateAttachmentDetail?.bankAttachment && (
                    <img
                    src={employee?.candidateAttachmentDetail?.bankAttachment}
                    alt="Aadhar Card"
                    className="w-28 h-16 object-cover cursor-pointer"
                    onClick={() => openImageModal(employee?.candidateAttachmentDetail?.bankAttachment)}
                    />
                )}
                </div>

                <div><strong>photoAttachment:</strong> 
                {employee?.candidateAttachmentDetail?.photoAttachment && (
                    <img
                    src={employee?.candidateAttachmentDetail?.photoAttachment}
                    alt="Aadhar Card"
                    className="w-28 h-16 object-cover cursor-pointer"
                    onClick={() => openImageModal(employee?.candidateAttachmentDetail?.photoAttachment)}
                    />
                )}
                </div>

                <div><strong>signatureAttachment:</strong>
                {employee?.candidateAttachmentDetail?.signatureAttachment && (
                    <img
                    src={employee?.candidateAttachmentDetail?.signatureAttachment}
                    alt="Aadhar Card"
                    className="w-28 h-16 object-cover cursor-pointer"
                    onClick={() => openImageModal(employee?.candidateAttachmentDetail?.signatureAttachment)}
                    />
                )} 
                </div>

                <div><strong>class10Attachment:</strong>
                {employee?.candidateAttachmentDetail?.class10Attachment && (
                    <img
                    src={employee?.candidateAttachmentDetail?.class10Attachment}
                    alt="Aadhar Card"
                    className="w-28 h-16 object-cover cursor-pointer"
                    onClick={() => openImageModal(employee?.candidateAttachmentDetail?.class10Attachment)}
                    />
                )} 
                </div>

                <div><strong>class12Attachment:</strong> 
                {employee?.candidateAttachmentDetail?.class12Attachment && (
                    <img
                    src={employee?.candidateAttachmentDetail?.class12Attachment}
                    alt="Aadhar Card"
                    className="w-28 h-16 object-cover cursor-pointer"
                    onClick={() => openImageModal(employee?.candidateAttachmentDetail?.class12Attachment)}
                    />
                )} 
                </div>

                <div><strong>graduationAttachment:</strong>
                {employee?.candidateAttachmentDetail?.graduationAttachment && (
                    <img
                    src={employee?.candidateAttachmentDetail?.graduationAttachment}
                    alt="Aadhar Card"
                    className="w-28 h-16 object-cover cursor-pointer"
                    onClick={() => openImageModal(employee?.candidateAttachmentDetail?.graduationAttachment)}
                    />
                )} 
                </div>

                <div><strong>postGraduationAttachment:</strong>
                {employee?.candidateAttachmentDetail?.postGraduationAttachment && (
                    <img
                    src={employee?.candidateAttachmentDetail?.postGraduationAttachment}
                    alt="Aadhar Card"
                    className="w-28 h-16 object-cover cursor-pointer"
                    onClick={() => openImageModal(employee?.candidateAttachmentDetail?.postGraduationAttachment)}
                    />
                )} 
                </div>
            </div>

            <div className="mt-4 flex justify-between">
                <button onClick={() => setPage(1)} className="bg-gray-600 text-white px-4 py-2 rounded-md">Previous</button>
            </div>
       
       
    
            {/* Image Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* Image Wrapper */}
                    <img
                    src={modalImageSrc}
                    alt="Full Screen"
                    className="h-screen w-full object-contain"
                    />
                    
                    {/* Close Button */}
                    <div className="">
                    <button
                    onClick={closeImageModal}
                    className="absolute top-4 right-4 bg-white text-black font-bold text-3xl rounded-full w-9 h-9  items-center"
                    style={{ zIndex: 100 }}
                    >
                    &times;
                    </button>
                    </div>
                </div>
                </div>
            )}

            <div className='mt-4 flex justify-center gap-10 pb-4'>
                {employee?.status=='Pending' && (
                    <>
                       <button className="  bg-purple-500 text-white rounded-md px-4 py-2 hover:bg-purple-600" onClick={() => navigate(-1)}>Go Back</button>
                        <button onClick={handleApproveClicked} className='px-4 py-2 rounded-md bg-green-500 text-white font-semibold' >Approve</button>
                        <button onClick={handleRejectClick} className='px-4 py-2 rounded-md bg-red-500 text-white font-semibold'>Rejected</button>
                    </>
                )}
            </div>
            
            <div className='flex justify-center gap-5'>
                {employee?.status !== 'Pending' && (
                    <>
                        <button onClick={openRegisterModal} className="mt-4 bgMainColor text-white p-2 rounded-md mb-4">
                            Employee Register
                        </button>

                        <button className="mt-4  bg-red-500 text-white p-2 rounded-md mb-4" onClick={() => navigate(-1)}>Go Back</button>
                    </> 
                )}
            </div>

            {/* Employee Register Modal */}
            {isRegisterModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[calc(100%-40%)]">
                        <h2 className="text-lg items-center font-semibold mb-4">Employee Register</h2>

                        <form onSubmit={handleRegisterEmployee}>
                            <div className='grid gap-3 m-6 grid-cols-1 md:grid-cols-2'>
                                
                                

                            
                            
                                {/* Input Fields */}
                                <div className="mb-1">
                                    <label className="block font-medium">Employee Code <span className='text-red-600' >*</span> </label>
                                    <input type="text" name="employeeCode" value={formData?.employeeCode}  onChange={handleInputChange}
                                    placeholder='Enter Employee Code...'
                                    className="w-full border-2 border-gray-500 py-2 rounded-md" />
                                </div>
                                {/* punch id input field  */}
                                <div className="mb-1">
                                    <label className="block font-medium"> Biometric PunchId <span className='text-red-600' >*</span> </label>
                                    <input type="text" name="biometricPunchId" value={formData?.biometricPunchId} onChange={handleInputChange} 
                                    placeholder='Enter Biometric PunchId...'
                                    className="w-full py-2 border-2 border-gray-500  rounded-md" />
                                </div>

                                {/* company name field  */}
                                <div className='mb-1'>
                                    <label className="block font-medium"><span>Company Name</span><span className='text-red-600'>*</span></label>
                                    <select 
                                        name="company"
                                        onChange={(e) => {
                                        const { name, value } = e.target;
                                        console.log(e.target.value);
                                        console.log("name", name, "value", value);
                                        setFormData((prev) => ({ ...prev, [name] : value}));
                                        setSelectedCompanyNameId(e.target.value);
                                    }}
                                    className="w-full rounded-md border-2 py-2 px-4  border-gray-500"
                                    >
                                    <option>---Select Company Name--- </option>
                                    {companynamedata?.map(({name, id})=>(
                                        <option key={id} value={id}>{name}</option>
                                    ))}
                                    </select>
                                </div>
                    
                                {/* company branch field  */}
                                <div className='mb-1'>
                                    <label className="block font-medium"><span>Company Branch</span><span className='text-red-600'>*</span></label>
                                    <select 
                                        name="branchId"
                                        defaultValue={formData?.branchId || ""}
                                        onChange={(event) => {
                                        const { name, value } = event.target;
                                        console.log(event.target.value);
                                        console.log("name", name, "value", value);
                                        setFormData((prev) => ({ ...prev, [name] : value}));
                                    }}

                                    className="w-full rounded-md border-2 py-2 px-4  border-gray-500"
                                    >
                                    <option >--Select the Branch--</option>
                                    {branchnamedata?.map(({name, id})=>(
                                        <option key={id} value={id}>{name}</option>
                                    ))}
                                    </select>
                                </div>

                                {/* shift input field      */}
                                <div className="mb-1">
                                    <label className="block font-medium">Shift <span className='text-red-600'>*</span></label>
                                    <select 
                                        name="shiftId"
                                        value={formData?.shiftId} 
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border-2 py-2 px-4  border-gray-500">
                                        <option>--Select Shift--</option>
                                        {shiftName?.map(({name, id})=>(
                                            <option key={id} value={id}>{name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* office time policy input field  */}
                                <div className="mb-1">
                                    <label className="block font-medium"> Office Time Policy <span className='text-red-600'>*</span></label>
                                    <select 
                                        name="officeTimePolicyId"
                                        onChange={(event) => {
                                            const { name, value} = event.target;
                                            // console.log("name", name, "value", value);
                                            setFormData((prev) => ({ ...prev, [name] : value}))
                                        }}
                                        className="w-full rounded-md border-2 py-2 px-4  border-gray-500"
                                        >
                                        <option>--Select Office Time--</option>
                                        {officeTimePolicy?.map(({policyName, id})=>(
                                            <option key={id} value={id}>{policyName}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* reporting Manager input field  */}
                                <div className="mb-1">
                                    <label className="block font-medium">Reporting Manager <span className='text-red-600'>*</span></label>
                                    <select 
                                        className="w-full rounded-md border-2 py-2 px-4  border-gray-500"
                                        onChange={(e) => {
                                            setFormData(prevState => ({
                                            ...prevState,
                                            [e.target.name]: e.target.value
                                            }));
                                        }}
                                        name="reportingManagerId"
                                    >
                                    <option>--Select Reporting Manager--</option>
                                    {reportingManagers?.map(({name, id})=>(
                                        <option key={id} value={id}>{name}</option>
                                    ))}
                                    </select>
                                    
                                </div>

                                {/* Work Type Field   */}
                                <div className='mb-1'>
                                    <label className="block font-medium"><span>Work Type <span className='text-red-600'>*</span></span></label>
                                    <select
                                        name='workTypeId'
                                        defaultValue={formData?.workTypeId} 
                                        className="w-full rounded-md border-2 py-2 px-4  border-gray-500"
                                        onChange={(e) => {
                                            const { name, value} = e.target;
                                            // console.log("work name", name, "work value", value);
                                            setFormData((prev) => ({ ...prev, [name] : value}))
                                        }}
                                        >
                                        <option>--Select Work Type--</option>
                                        {workTypeData?.map(({id, name})=>(
                                            <option key={id} value={id} name={name}>{name}</option>
                                        ))}
                                    </select>
                                </div>

                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-2">
                                <button type='button' onClick={closeRegisterModal} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                                <button  type='submit' disabled={loading} className="py-2 px-4 bg-red-500 rounded-md text-white font-semibold flex items-center justify-center">
                                    {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
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
                                    Submitting...
                                </>
                                        ) : (
                                            "Submit"
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

             </>
      )}

        </div>
    );
}

export default EmployeeDetails;

/*

Invalid `prisma.employee.create()` invocation in
C:\Users\Admin\Desktop\HRM_SQL\server\controllers\emp\employee.controller.js:283:52

  280 //update the related ids in employee table.
  281 const hashedPassword = await bcrypt.hash(employeeCode,10);
  282 
→ 283 const createNewEmp = await prisma.employee.create(
Unique constraint failed on the constraint: `employee_joiningFormId_key` 



Invalid `prisma.employee.create()` invocation in
C:\Users\Admin\Desktop\HRM_SQL\server\controllers\emp\employee.controller.js:283:52

  280 //update the related ids in employee table.
  281 const hashedPassword = await bcrypt.hash(employeeCode,10);
  282 
→ 283 const createNewEmp = await prisma.employee.create(
Unique constraint failed on the constraint: `employee_joiningFormId_key`
*/
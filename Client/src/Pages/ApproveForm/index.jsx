import React from 'react'
import { useEffect } from 'react'
import { showDepartment } from '../../Utils/Api/ShowDepartment'
import { showDesignation } from '../../Utils/Api/ShowDesignation'
import { showCompany } from '../../Utils/Api/ShowCompany'
import { showJoiningHrName } from '../../Utils/Api/showJoiningHrName'
import { useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Index() {

    const navigate=useNavigate();
 
    const location = useLocation();
    const { formId } = location.state || {}; // Retrieve formId
    const [loading, setLoading] = useState(false); // Loader state
    const [joiningHrNameData, setJoiningHrNameData]=useState([]);

    console.log("my joining  form id is ", formId);
    

    const [showDepartmentList, setShowDepartmentList]=useState([]);
    const [showDesignationList, setShowDeginationList]=useState([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
    const [showCompanyList, setShowCompanyList]=useState([]);

    const [formData, setFormData]=useState({
        formId: formId || "",
        companyId : "",
        joiningHR: " ",
        officialEmail:"",
        officialContact: "",
        department: "",
        designation : "",
        joiningDate: "",
        employeeType : "",
        interviewDate: " ",
        modeOfRecruitment :"",
        reference : "",
        ctc : "",
        inHand :"",
        employeeESI: "",
        employeePF:"",
        employerESI:"",
        employerPF :"",
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        try {
            console.log('my approve form data is ', formData)

            // Remove commas from the CTC field
            const sanitizedFormData = {
                ...formData,
                ctc: formData.ctc.replace(/,/g, ''),  // Remove commas
                inHand: formData.inHand.replace(/,/g, ''), 
                employeeESI: formData.employeeESI.replace(/,/g, ''), 
                employeePF: formData.employeePF.replace(/,/g, ''), 
                employerESI: formData.employerESI.replace(/,/g, ''), 
                employerPF: formData.employerPF.replace(/,/g, '') 
            };

            console.log('my approve form data is ', sanitizedFormData);

            const response = await axios.put(
                `${process.env.REACT_APP_SERVER_ADDRESS}/auth/approve-joiningForm`,
                { ...sanitizedFormData, formId },
                { withCredentials: true }
            );

            if (response.status === 200 || response.status === 201) {
                // Show success toast
                 toast.success("Approve successfully!", {
                     position: "top-right",
                     autoClose: 3000, // Closes after 3 seconds
                     hideProgressBar: false,
                     closeOnClick: true,
                     pauseOnHover: true,
                     draggable: true,
                     progress: undefined,
                 });
               
                // Reset form data after submission
                 setFormData((prev) => ({
                     formId: prev.formId, // Keep formId unchanged
                     companyId: "",
                     officialEmail: "",
                     officialContact: "",
                     department: "",
                     designation: "",
                     joiningDate: "",
                     employeeType: "",
                     interviewDate: "",
                     modeOfRecruitment: "",
                     reference: "",
                     ctc: "",
                     inHand: "",
                     employeeESI: "",
                     employeePF: "",
                     employerESI: "",
                     employerPF: "",
                     joiningHR: "",
                 }));
           
               } else {
                alert('Something went wrong during approval.');
             }
        
        } catch (error) {
            console.error("Error submitting approval  form", error);
            toast.error("Approvel failed!", {
                position: "top-right",
                autoClose: 3000,
            });
        }
        setLoading(false); // Stop loading
    };


    const handleFormData = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
  
    
    useEffect(()=>{
        showDepartment(setShowDepartmentList);
        showJoiningHrName(setJoiningHrNameData);
        showCompany(setShowCompanyList)
    },[]);

    useEffect(()=>{
        if (selectedDepartmentId) showDesignation(setShowDeginationList, selectedDepartmentId);
    }, [selectedDepartmentId])

    const handleGoBackClick = ()=>{
        navigate(-1);
    }

  return (
    <>
    <div className='p-2'>
        <div  className='py-1 rounded-md bgMainColor mt-4 shadow-xl'>
            <h1 className='text-center text-white font-bold text-xl'>Joining Details</h1>
        </div>
        <div >
            <form onSubmit={handleSubmit}>
                <div className='grid md:grid-cols-4 gap-4'>
                    {/* company name field  */}
                    <div className="flex flex-col">
                        <label>Company Name<span className='text-red-600'>*</span></label>
                        <select 
                        name="companyId"
                        value={formData?.companyId || ""}
                        onChange={handleFormData}
                        className="border border-gray-500 rounded-md  py-2 px-4 "
                        >
                        <option>---Select Company Name--- </option>
                        {showCompanyList?.map(({name, id})=>(
                            <option key={id} value={id}>{name}</option>
                        ))}
                        </select>
                    </div>

                     {/* joining hr name  */}
                     <div className="flex flex-col">
                        <label>Joining Hr Name <span className='text-red-600'>*</span></label>
                        <select 
                        name="joiningHR"
                        value={formData?.joiningHR || ""}
                        onChange={handleFormData}
                        className="border border-gray-500 rounded-md  py-2 px-4 "
                        >
                        <option>---Select Joining Hr Name--- </option>
                        {joiningHrNameData?.map(({name, id})=>(
                            <option key={id} value={id}>{name}</option>
                        ))}
                        </select>
                    </div>

                    <div className='flex flex-col'>
                        <label>Interview Date<span className='text-red-600'>*</span></label>
                        <input type='date' 
                            name='interviewDate'
                            value={formData?.interviewDate}
                            onChange={handleFormData}
                            className='border border-gray-500 px-4 py-2 rounded-md' />
                    </div>

                    <div className='flex flex-col'>
                        <label>Joining Date<span className='text-red-600'>*</span></label>
                        <input 
                            type='date' 
                            name='joiningDate'
                            value={formData?.joiningDate}
                            onChange={handleFormData}
                            className='border border-gray-500 px-4 py-2 rounded-md' />
                    </div>

                    <div className='flex flex-col'>
                        <label>Official Contact</label>
                        <input 
                            type='text' 
                            name='officialContact'
                            value={formData?.officialContact}
                            onChange={handleFormData}
                            className='border border-gray-500 px-4 py-2 rounded-md' />
                    </div>
                    <div className='flex flex-col'>
                        <label>Official Email</label>
                        <input 
                            type='email' 
                            name='officialEmail' 
                            value={formData?.officialEmail}
                            onChange={handleFormData}
                            className='border border-gray-500 px-4 py-2 rounded-md' />
                    </div>

                    {/* department field    */}
                    <div className="flex flex-col">
                        <label>Department<span className='text-red-600'>*</span></label>
                        <select 
                        name="department"
                        onChange={(e) => {
                            handleFormData(e);
                            setSelectedDepartmentId(e.target.value);
                        }}
                         className='border border-gray-500 px-4 py-2 rounded-md'
                        >
                        <option value=''>--Select Department --</option>
                        {showDepartmentList?.map(({ deptName, id }) => (
                        <option key={id} value={id}>{deptName}</option>
                        ))}
                        </select>
                    </div>
                        
                    {/* designation field  */}
                    <div className="flex flex-col">
                        <label>Designation<span className='text-red-600'>*</span></label>
                        <select 
                        name="designation"
                        onChange={(event) => {
                            const { name, value} = event.target;
                            // console.log("name", name, "value", value);
                            setFormData((prev) => ({ ...prev, [name] : value}))
                        }}
                        value={formData?.designation}
                       
                        className='border border-gray-500 px-4 py-2 rounded-md'>
                        <option>---select Designation---</option>
                        {showDesignationList?.map(({name, id})=>(
                        <option key={id} value={id}>{name}</option>
                        ))}
                        </select>
                    </div>
                    
                    {/* employee type  */}
                    <div className='flex flex-col'>
                        <label>Employee Type</label>
                        <input 
                            type='text' 
                            name='employeeType' 
                            value={formData?.employeeType}
                            onChange={handleFormData}
                            className='border border-gray-500 px-4 py-2 rounded-md' />
                    </div>

                    {/* Recruitment mode  */}
                    <div className='flex flex-col'>
                        <label>Recruitment Mode </label>
                        <input 
                            type='text' 
                            name='modeOfRecruitment' 
                            value={formData?.modeOfRecruitment}
                            onChange={handleFormData}
                            className='border border-gray-500 px-4 py-2 rounded-md' />
                    </div>

                    {/* reference ny input field  */}
                    <div className='flex flex-col'>
                        <label>Reference By</label>
                        <input 
                            type='text' 
                            name='reference' 
                            value={formData?.reference}
                            onChange={handleFormData}
                            className='border border-gray-500 px-4 py-2 rounded-md' />
                    </div> 
                </div>
                
                <div className='py-1 rounded-md bgMainColor mt-4 shadow-xl'>
                   <h2 className='text-center  text-white text-xl font-bold'>Salary Break Down </h2>
                </div>

                <div className='grid md:grid-cols-4  gap-4'>
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

                <div className="mt-4 flex justify-between">
                <button 
                    type='button'
                    onClick={handleGoBackClick} 
                   className='border border-gray-400 rounded-md py-2 px-4 bg-purple-500 text-white hover:bg-purple-600'
                >Go Back</button>
                
                    <button
                        type="submit"
                        className="py-2 px-4 bg-red-500 rounded-md text-white font-semibold flex items-center justify-center"
                        disabled={loading}
                    >
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
    </>
  )
}

export default Index







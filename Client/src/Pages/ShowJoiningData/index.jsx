import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Heading from '../../Component/Common/header/heading';

function Index() {
    const navigate = useNavigate();
    const headingList = ['Employee Name', "father_husbandName", "DateOfBirth", "PersonalPhoneNum", "Aadhar Card ",]

    const [status, setStatus] = useState('Approved'); // Default status
    const [data, setData] = useState([]); // Holds fetched data
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Function to fetch data based on status
    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/auth/show-joiningForm?status=${status}`, {
                withCredentials: true
            });

            // console.log("my reponse joining data", response?.data);
            // console.log("my reponse joining data 224", response?.data?.data)
            setData(response?.data?.data); // Set data from API response
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch data. Please try again.');
        }
        setLoading(false);
    };

    console.log("mt joining data is ", data);

    // Fetch data when status changes
    useEffect(() => {
        fetchData();
    }, [status])

    // Function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'; // Handle empty dates
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // Formats as DD/MM/YYYY
    };

    const handleRowClick = (emp) => {
        navigate('/layout/showsinglejoiningData', { state: { employee: emp } });
    };

    return (
        <>
            <div>
                <div className='py-2 bgMainColor mt-4 shadow-xl flex justify-between'>
                    <div>
                        <h1 className=' text-white font-bold text-xl ml-2'>Joining Form data</h1>
                    </div>
                    <div className='flex gap-2 mr-2'>
                        {['Approved', 'Pending', "Reject"]?.map((item) => (
                            <button
                                key={item}
                                onClick={() => setStatus(item)}
                                className={`px-4 py-2 rounded-md text-white ${status === item ? 'bg-green-500' : 'bg-red-500'}`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='overflow-auto h-[calc(100vh-14rem)]'>
                    <div className="relative">
                  
                        <table className="w-full border-collapse border border-gray-200">
                            <Heading headingList={headingList} />

                            <tbody>
                                {data.length > 0 ? (
                                    data.map((emp, index) => (
                                        <tr
                                            key={index}
                                            className="border-b cursor-pointer hover:bg-gray-200"
                                            onClick={() => handleRowClick(emp)}
                                        >
                                            <td className="px-4 py-2 text-center">{emp?.candidatePersonalDetail?.name}</td>
                                            <td className="px-4 py-2 text-center">{emp?.candidatePersonalDetail?.father_husbandName}</td>
                                            <td className="px-4 py-2 text-center">{formatDate(emp?.candidatePersonalDetail?.dateOfBirth)}</td>
                                            <td className="px-4 py-2 text-center">{emp?.candidatePersonalDetail?.personalPhoneNum}</td>
                                            <td className="px-4 py-2 text-center">{emp?.candidatePersonalDetail?.aadharCard}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={headingList.length} className="text-center py-4">
                                            No data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>

            </div>
        </>
    )
}

export default Index
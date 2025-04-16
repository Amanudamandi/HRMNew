
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { removeCookie, setCookie, getCookie } from '../../Utils/cookies';

axios.defaults.withCredentials = true;

// Create context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [empData, setEmpData] = useState(null);
  const navigate = useNavigate();

  // Restore auth state on load (if cookies exist)
  useEffect(() => {
    const storedEmpData = getCookie('empData');
    if (storedEmpData) {
      setEmpData(JSON.parse(storedEmpData));
    }
  }, []);

  // Login API call
  const loginAPI = async (loginData, setError, setLoading) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_ADDRESS}/auth/login`,
        loginData
      );

      const { token, data } = response.data;

      // Set cookies and state
      setCookie('token', token, { expires: 0.5 }); // 12 hrs
      setCookie('empData', JSON.stringify(data));
      setCookie('startCnt', 0);
      setCookie('endCnt', 120);

      setEmpData(data);
      

      return true;
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.response?.data?.message || "Login failed. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout API call
  const logoutAPI = async (setError) => {
    try {
      await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/auth/logout`);

      // Clear cookies and state
      removeCookie('token');
      removeCookie('empData');
      removeCookie('startCnt');
      removeCookie('endCnt');

      setEmpData(null);
      navigate('/');

      return true;
    } catch (error) {
      console.error("Logout Error:", error);
      setError(error.response?.data?.message || "Logout failed. Please try again.");
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ loginAPI, logoutAPI, empData, setEmpData }}>
      {children}
    </AuthContext.Provider>
  );
};

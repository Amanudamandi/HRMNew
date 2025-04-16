// import React from 'react';
// import Layout from '../Layout/index';
// import LoginPage from '../../Pages/FrontPage/index'
// import Dashboard from '../../Pages/Dashboard/index'
// import DepartmentTable from '../../Pages/ListOfDepartment/index'
// import ListofAllEmployee from '../../Pages/ShowListOfAllEmployee/index'
// import OfficeTimePolicy from '../../Pages/OfficeTimePolicy/index'
// import ListOfPolicyTable from '../../Component/Common/ListOfPolicyTable/index'
// import ShiftDetails from '../../Pages/ShiftDetails/index'
// import ShiftDetailsTable from '../../Component/Common/ShiftDetailsTable/index'
// import EmployeeRegister from '../../Pages/EmployeeRegisterForm/index'
// import EmployeeUpDateForm from '../../Pages/UpDateEmployeeDetails/index'
// import EmployeeDetailsPage from '../../Component/ShowParticularEmployeeDetails/index'
// import UpdateShiftDetails from '../../Pages/UpDateShiftDetails';
// import UpdateOfficeTimePolicy from '../../Pages/UpDateOfficeTimePolicy/index'
// import CompanyBranchTable from '../../Pages/CompanyBranchtable/index'
// import ManualPunch from '../../Pages/ManualPunch/index'
// import DailyReportPage from '../../Pages/DailyReport/index'
// import TestPage from '../../Pages/TestPage/index'
// import ApproveForm from '../../Pages/ApproveForm/index'
// import ShowJoiningData from '../../Pages/ShowJoiningData/index'
// import ShowSingleJoiningData from '../../Component/ShowSingleJoiningData/index'
// import MonthlyJoiningReport from '../../Pages/MonthlyJoiningReport/index'
// import MonthlyResignationReport from '../../Pages/MonthlyResignationReport/index'
// import JoiningPdf from '../../Pages/JoiningPdf/index'
// import Degree from '../../Pages/Degree/index'
// import JoiningForm from '../../Pages/JoiningForm/index'

// import Errorpage from '../../Pages/404ErrorPage/index'

// import DuplicateAndInvalidempData from '../../Pages/DuplicateAndInvalidEmployee/index'
// import { Routes, Route } from 'react-router-dom';

// const Router = () => {
//     return(
//         <Routes>
//            <Route path="/" element={<LoginPage />} />

//           {/* Protected Layout */}
//           <Route path="/layout" element={<Layout />}>
//             <Route path="dashboard" element={<Dashboard />} />
//             <Route path="departmenttable" element={<DepartmentTable/>} />
//             <Route path='listofallemployee' element={<ListofAllEmployee/>} />
//             <Route path='officetimepolicytable' element={<OfficeTimePolicy/>} />
//             <Route path='listofpolicytable' element={<ListOfPolicyTable/>} />
//             <Route path='shiftdetails' element={<ShiftDetails/>} />
//             <Route path='shiftdetailstable' element={<ShiftDetailsTable/>} />
//             <Route path='Registrationform' element={<EmployeeRegister/>} />
//             <Route path='employeeupdateform' element={<EmployeeUpDateForm/>} />
//             <Route path='employeeDetails' element={<EmployeeDetailsPage />} />
//             <Route path='updateshiftdetails' element={<UpdateShiftDetails/>} />
//             <Route path='updateofficytimepolicy' element={<UpdateOfficeTimePolicy/>} />
//             <Route path='companybranchtable' element={<CompanyBranchTable/>} />
//             <Route path='invalid-duplicate-data' element={<DuplicateAndInvalidempData/>} />
//             <Route path='manualpunch' element={<ManualPunch />} />
//             <Route path='dailyreportcomponent' element={<DailyReportPage/>} />
//             <Route path='testpage' element={<TestPage/>} />
//             <Route path='approveForm' element={<ApproveForm/>} />
//             <Route path='showJoiningData' element={<ShowJoiningData/>} />
//             <Route path='showsinglejoiningData' element={<ShowSingleJoiningData/>} />
//             <Route path='monthlyJoiningReport' element={<MonthlyJoiningReport/>} />
//             <Route path='monthlyResignationReport' element={<MonthlyResignationReport/>} />
//             <Route path='JoiningPdf' element={<JoiningPdf/>} />
//             <Route path='degree' element={<Degree />} />
//             <Route path='joiningform' element={<JoiningForm/>} />

//             <Route path='*' element={<Errorpage/>} />
            
//           </Route>
//         </Routes>
//     )
// }

// export default Router;


import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from '../../Component/Loader/index';

const Layout =lazy(()=>import('../Layout/index'));
const LoginPage = lazy(()=>import('../../Pages/FrontPage/index'));
const Dashboard = lazy(()=>import('../../Pages/Dashboard/index'));
const DepartmentTable = lazy(()=>import('../../Pages/ListOfDepartment/index'));
const ListofAllEmployee = lazy(()=>import('../../Pages/ShowListOfAllEmployee/index'));
const OfficeTimePolicy = lazy(()=>import('../../Pages/OfficeTimePolicy/index'));
const ListOfPolicyTable =lazy(()=>import('../../Component/Common/ListOfPolicyTable/index'));
const ShiftDetails =lazy(()=>import('../../Pages/ShiftDetails/index'));
const ShiftDetailsTable = lazy(()=>import('../../Component/Common/ShiftDetailsTable/index'));
const EmployeeRegister = lazy(()=>import('../../Pages/EmployeeRegisterForm/index'));
const EmployeeUpDateForm = lazy(()=>import('../../Pages/UpDateEmployeeDetails/index'));
const EmployeeDetailsPage = lazy(()=>import('../../Component/ShowParticularEmployeeDetails/index'));
const UpdateShiftDetails = lazy(()=>import('../../Pages/UpDateShiftDetails'));
const UpdateOfficeTimePolicy = lazy(()=>import('../../Pages/UpDateOfficeTimePolicy/index'));
const CompanyBranchTable = lazy(()=>import('../../Pages/CompanyBranchtable/index'));
const ManualPunch = lazy(()=>import('../../Pages/ManualPunch/index'));
const DailyReportPage = lazy(()=>import('../../Pages/DailyReport/index'));
const TestPage = lazy(()=>import('../../Pages/TestPage/index'));
const ApproveForm = lazy(()=>import('../../Pages/ApproveForm/index'));
const ShowJoiningData = lazy(()=>import('../../Pages/ShowJoiningData/index'))
const ShowSingleJoiningData = lazy(()=>import('../../Component/ShowSingleJoiningData/index'));
const MonthlyJoiningReport = lazy(()=>import('../../Pages/MonthlyJoiningReport/index'));
const MonthlyResignationReport = lazy(()=>import('../../Pages/MonthlyResignationReport/index'));
const JoiningPdf = lazy(()=>import('../../Pages/JoiningPdf/index'));
const Degree = lazy(()=>import('../../Pages/Degree/index'));
const JoiningForm = lazy(()=>import('../../Pages/JoiningForm/index'));
const Errorpage = lazy(()=>import('../../Pages/404ErrorPage/index'));
const DuplicateAndInvalidempData = lazy(()=>import('../../Pages/DuplicateAndInvalidEmployee/index'));


const Router = () => {
    return(
      <Suspense fallback={
          <div className="flex justify-center items-center h-screen">
            <Loader />
          </div>
        }>
        
          <Routes>
            <Route path="/" element={<LoginPage />} />

            {/* Protected Layout */}
            <Route path="/layout" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="departmenttable" element={<DepartmentTable/>} />
              <Route path='listofallemployee' element={<ListofAllEmployee/>} />
              <Route path='officetimepolicytable' element={<OfficeTimePolicy/>} />
              <Route path='listofpolicytable' element={<ListOfPolicyTable/>} />
              <Route path='shiftdetails' element={<ShiftDetails/>} />
              <Route path='shiftdetailstable' element={<ShiftDetailsTable/>} />
              <Route path='Registrationform' element={<EmployeeRegister/>} />
              <Route path='employeeupdateform' element={<EmployeeUpDateForm/>} />
              <Route path='employeeDetails' element={<EmployeeDetailsPage />} />
              <Route path='updateshiftdetails' element={<UpdateShiftDetails/>} />
              <Route path='updateofficytimepolicy' element={<UpdateOfficeTimePolicy/>} />
              <Route path='companybranchtable' element={<CompanyBranchTable/>} />
              <Route path='invalid-duplicate-data' element={<DuplicateAndInvalidempData/>} />
              <Route path='manualpunch' element={<ManualPunch />} />
              <Route path='dailyreportcomponent' element={<DailyReportPage/>} />
              <Route path='testpage' element={<TestPage/>} />
              <Route path='approveForm' element={<ApproveForm/>} />
              <Route path='showJoiningData' element={<ShowJoiningData/>} />
              <Route path='showsinglejoiningData' element={<ShowSingleJoiningData/>} />
              <Route path='monthlyJoiningReport' element={<MonthlyJoiningReport/>} />
              <Route path='monthlyResignationReport' element={<MonthlyResignationReport/>} />
              <Route path='JoiningPdf' element={<JoiningPdf/>} />
              <Route path='degree' element={<Degree />} />
              <Route path='joiningform' element={<JoiningForm/>} />

              <Route path='*' element={<Errorpage/>} />
              
            </Route>
          </Routes>

        </Suspense>
    )
}

export default Router;


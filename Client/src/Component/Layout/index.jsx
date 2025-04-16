// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import TopNavBar from '../TopNavBar/index';

// const Index = () => {
//     return(
//         <div>
//             <header className='bg-red-500'>
//                 <TopNavBar />
//             </header>
//             <main>
//                 <Outlet />
//             </main>
//             <footer>

//             </footer>
//         </div>
//     )
// }

// export default Index;

import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavBar from '../TopNavBar';

const Index = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-red-500">
        <TopNavBar />
      </header>

      {/* Spacer for Navbar */}
      <div className="h-[64px]" /> {/* Height should match the navbar height */}

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Spacer for Footer */}
      <div className="h-[10px]" /> {/* Height should match the footer height */}

      {/* Fixed Footer */}
      {/* <footer className="fixed bottom-0 left-0 right-0 z-50 bg-gray-300 text-center py-3 shadow-md h-[56px] flex items-center justify-center">
    
        &copy; {new Date().getFullYear()} Uda-Mandi Service Private Limited
      </footer> */}
    </div>
  );
};

export default Index;

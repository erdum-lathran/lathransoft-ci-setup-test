import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../static';
import { useSelector } from 'react-redux';
import { PageNotFoundSVG } from '../../static/svgs';
import { backgroundImage } from '../../static/Constants';

const PageNotFound = () => {
  // Navigator
  const navigate = useNavigate();

  // Reducer States
  const { token } = useSelector(state => state.auth);

  const handleSubmit = () => {
    if (token) {
      navigate(AppRoutes.Home);
    } else {
      navigate(AppRoutes.Login);
    }
  };

  return (
    <div
      style={{
        backgroundImage: backgroundImage,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '100vh',
      }}
    >
      <div className='access-denied-container'>
        <PageNotFoundSVG />
        <button
          onClick={handleSubmit}
          className='btn bg-color primary text-white'
        >
          {token ? 'Dashboard' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Footer } from '../../components';
// import { backgroundImage } from '../../static/Constants';
// import { AppImages, AppRoutes } from '../../static';
// import { useSelector } from 'react-redux';
// import { LathranLogoSVG } from '../../static/svgs';

// export default function PageNotFound() {
//   // Navigator
//   const navigate = useNavigate();

//   // Reducer States
//   const { token } = useSelector(state => state.auth);

//   const handleSubmit = () => {
//     if (token) {
//       navigate(AppRoutes.Home);
//     } else {
//       navigate(AppRoutes.Login);
//     }
//   };

//   return (
//     <div
//       style={{
//         backgroundImage: backgroundImage,
//         backgroundRepeat: 'no-repeat',
//         backgroundSize: 'cover',
//         height: '100vh',
//       }}
//     >
//       <div className='container'>
//         <div className='row align-items-center pt-5'>
//           <div className='mx-5 col-md-5 px-3 d-flex justify-content-center d-none d-sm-block text-center align-self'>
//             {/* <LoginLogo className='login-logo' /> */}
//             <img className='w-75 login-logo' src={AppImages.loginLogo} alt='' />
//             <div className='py-3 w'>
//               <h3 className='fw-bold'>
//                 {'Empower Your '}
//                 <span className='red-text-color'>{'Documents '}</span>
//                 {'With My Docs'}
//               </h3>
//             </div>
//           </div>
//           <div className='col-md-5 text-center bg-white rounded-4 px-5'>
//             <div action=''>
//               <div className='d-flex py-3 justify-content-center'>
//                 <LathranLogoSVG />
//               </div>
//               <p className='m-2 fs-14'>Looks Like You Are Deserted</p>
//               <h3 className='m-4 primary-color'>404! Page Not Found</h3>
//               <div className='m-4 d-grid'>
//                 <button
//                   onClick={handleSubmit}
//                   className='btn bg-color primary text-white ps-2'
//                 >
//                   {token ? 'Dashboard' : 'Login'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

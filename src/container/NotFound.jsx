import React, { useContext, useEffect } from 'react';
import Context from '../context';

const NotFound = () => {
  const {setSeo,seo}=useContext(Context)
  useEffect(()=>{
    let soo = seo
    soo.title= "Plumbum (Not Found)"
     setSeo(soo)
  },[])
  return (
    <div className='text-emerald-800 text-opacity-70 lora-bold w-[100%] h-[100%] flex'>
        <div className='mx-auto my-24 text-center'>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      </div>
    </div>
  );
};

export default NotFound;
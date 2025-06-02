"use client"
import React from 'react'
 const Mybutton =({children})=>{
    return(
        <button className='bg-violet-500 text-white px-3 py-2 rounded-lg'>
            {children}
        </button>
    )
 }
 export default Mybutton;
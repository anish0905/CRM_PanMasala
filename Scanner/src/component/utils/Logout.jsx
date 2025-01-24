import React from 'react'
import { IoArrowBackCircleSharp } from "react-icons/io5";

const Logout = () => {
    const HandleClearLocalStorage=()=>{
        localStorage.clear()
    }
    return (
        <div>
            <div className='h-20 w-10 text-2xl'>
                <a onClick={HandleClearLocalStorage} href="/"> < IoArrowBackCircleSharp /></a>
            </div>
        </div>
    )
}

export default Logout

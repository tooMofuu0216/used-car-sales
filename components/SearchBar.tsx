"use client"
import React from 'react'
import { FaSearch,  } from 'react-icons/fa';
import { BsFilterLeft } from 'react-icons/bs';


export const SearchBar = () => {

    const handleClick = () => {

    }
    const handleKeyDown = () => {

    }

    return (
        <div className='border shadow-md flex '>
            <input
                className='outline-none text-md p-4 grow' placeholder='Enter Car Model...'
                onKeyDown={handleKeyDown}
            />
            <button
            className='p-5 text-white bg-amber-500 hover:text-amber-500 hover:bg-white duration-500'
                onClick={handleClick}>
                <FaSearch />
            </button>
            <button className='p-5  bg-white '>
                <BsFilterLeft />
            </button>
        </div>
    )
}

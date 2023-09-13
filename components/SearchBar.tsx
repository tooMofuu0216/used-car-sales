"use client"
import React, { useCallback, useEffect, useState, useTransition } from 'react'
import { FaSearch, } from 'react-icons/fa';
import { BsFilterLeft } from 'react-icons/bs';
import { usePathname, useRouter } from "next/navigation"
import { CAR_PATH_NAME, EDIT_LIST_PATH_NAME } from '@/constant/constant';

export const SearchBar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()
    const [inputValue, setInputValue] = useState<string>("")

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const searchQuery = params.get("search") ?? ""
        setInputValue(searchQuery)
    }, [])

    const searchWithParam = useCallback(
        (searchQuery: string) => {
            const params = new URLSearchParams(window.location.search)
            if (searchQuery.length > 0) {
                params.set("search", searchQuery)
            } else {
                params.delete("search")
            }
            startTransition(() => {
                if(pathname === CAR_PATH_NAME || pathname === EDIT_LIST_PATH_NAME){
                    router.replace(`${pathname}?${params.toString()}`)
                }else{ // HOME PAGE
                    router.push(`/cars?${params.toString()}`)
                }
            })
        },
        [pathname, router]
    )

    const handleClick = () => {
        searchWithParam(inputValue)
    }
    const handleKeyDown = (ev:React.KeyboardEvent) => {
        if(ev.key === 'Enter') searchWithParam(inputValue)
    }

    return (
        <div className='border shadow-md flex '>
            <input
                className='outline-none text-md p-4 grow' placeholder='Enter Car Name...'
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                    setInputValue(e.target.value)
                }}
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

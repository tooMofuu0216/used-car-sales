"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { CustomModal } from './CustomModal';
import { User } from '@supabase/auth-helpers-nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase';

interface NavBarProp {
    user: User | null
}


const CustomNavBar = (
    // { user }: NavBarProp
    ) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState<User | null>();
    const supabase = createClientComponentClient<Database>()

    useEffect(() => {
        const getCurrentUser = async() => {
          const res = await supabase.auth.getUser()
          setUser(res.data.user)
        }
        getCurrentUser()
      }, [])


    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleLogOut = async () => {
        // /auth/logout
        try {
            const res = await fetch(`/auth/logout`, { method: 'POST' })
            console.table(res)
            if(res.status === 200){
                setUser(null)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const navItems = (!user
        ? (<li>
            <button onClick={() => setShowModal(true)}>
                Login / Sign Up
            </button>
        </li>)
        : (
            <>
                <li>
                    <button onClick={() => setShowModal(true)}>
                        Edit Listing
                    </button>
                </li>
                <li><Link href="/sell">Sell Car</Link></li>
                <li><Link href="#" onClick={handleLogOut}>Log Out</Link></li>
            </>
        ))

    return (
        <nav className="shadow-ls p-4 border-y-2 fixed top-0 w-full bg-white z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold">
                    <Link href="/">Car Sales</Link>
                </div>
                {/* <div className={`md:flex space-x-4 ${showMenu ? 'block' : 'hidden'}`}> */}
                <ul className={`hidden md:flex space-x-4 ${showMenu ? 'block' : 'hidden'}`}>
                    {navItems}
                </ul>
                {/* </div> */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-3xl">
                        {showMenu ? '×' : '☰'}
                    </button>
                </div>

                <div className={`md:hidden absolute top-16 right-0 w-screen
                text-center z-50 ${showMenu ? 'block' : 'hidden'} bg-white`}>
                    <ul className="px-4 py-2 cursor-pointer space-y-4">
                        {navItems}
                    </ul>
                </div>
            </div>

            <CustomModal setShowModal={setShowModal} showModal={showModal} />
        </nav>
    )
}

export default CustomNavBar
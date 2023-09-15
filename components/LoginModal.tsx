"use client"
import React, { useState } from 'react'
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'


interface LoginModalProp {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    showModal: boolean
}

export const LoginModal = ({ setShowModal, showModal }: LoginModalProp) => {
    const supabase = createClientComponentClient<Database>()

    const login = "LOGIN"
    const loginAction = "/auth/login"
    const signup = "SIGN UP"
    const signupAction = "/auth/sign-up"
    const [formName, setFormName] = useState(login)
    const [formAction, setFormAction] = useState(loginAction)

    const githubLogin = 'github'
    const googleLogin = 'google'

    const setFormNameAndAction = (e: React.MouseEvent) => {
        e.preventDefault()
        if (formName === login) {
            setFormAction(signupAction)
            setFormName(signup)
        } else {
            setFormAction(loginAction)
            setFormName(login)
        }
    }

    const closeModal = () => {
        setShowModal(false);
    };

    const stopPropagation = (e: React.MouseEvent) => {
        // Prevent the click event from propagating to the modal content.
        e.stopPropagation();
    };

    const handleSocialLogin = async (e: React.MouseEvent) => {
        e.preventDefault()
        const provider = e.currentTarget.getAttribute('name') === githubLogin ? githubLogin : googleLogin
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })
    }

    return (
        <div className="relative">
            {showModal && (
                <div
                    onClick={closeModal}
                    className="fixed inset-0 flex w-full items-center justify-center z-50 backdrop-filter  backdrop-blur-md">
                    <div className="modal-container" onClick={stopPropagation}>
                        <div className="bg-white rounded-lg shadow-lg p-4">
                            <div className="flex justify-between mb-4">
                                <h2 className="text-xl font-semibold">{formName}</h2>
                                <button onClick={closeModal} className="text-xl font-semibold">
                                    &times;
                                </button>
                            </div>

                            <div className='px-20'>
                                <form
                                    action={formAction}
                                    method="post"
                                    className="flex flex-col space-y-2">
                                    <div className='mb-4'>

                                        <h3 className='text-center text-lg my-4'>Login With Provider:</h3>
                                        <div className='flex justify-between gap-8'>
                                            <div className='flex flex-col-reverse'>
                                                With Github
                                                <button className='hover:bg-slate-400 duration-500 border-2 p-2 rounded-lg '
                                                    name={githubLogin}
                                                    onClick={handleSocialLogin}>
                                                    <BsGithub  />
                                                </button>
                                            </div>
                                            <div className='flex flex-col-reverse'>
                                                With Google
                                                <button
                                                    name={googleLogin}
                                                    className='hover:bg-slate-400 duration-500 border-2 p-2 rounded-lg'
                                                    onClick={handleSocialLogin}
                                                >
                                                    <BsGoogle />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <h3 className='text-center text-sm'>Or with your email:</h3>
                                    <input name="email" placeholder='Email' className='outline-none p-2 border-b-2' />
                                    <input type="password" name="password" placeholder='Password' className='outline-none p-2 border-b-2' />
                                    {
                                        formName === login &&
                                        (<span>
                                            <button className='text-left text-xs'>Forgot Password?</button>
                                        </span>)
                                    }
                                    <button className='border-green-500 border-2'>{formName}</button> */}
                                    {/* <span>
                                        {formName === login
                                            ? `Don't have account? `
                                            : `Have account? `}
                                        <button
                                            onClick={setFormNameAndAction}
                                            className='text-blue-300'
                                        >{formName === login ? signup : login}</button>
                                    </span> */}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

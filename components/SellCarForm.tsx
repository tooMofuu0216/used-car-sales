"use client"
import { Button, Label, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import type { Tables } from '@/types/supabase'
import { MAX_IMG } from '@/constant/constant'

interface SellCarFormProp {
    brands: Tables<'carbrand'>[] | null,
}

export const SellCarForm = ({brands}:SellCarFormProp ) => {
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []).slice(0, MAX_IMG);
        if (files) setFiles(files);
    };

    const handleSubmit = (ev:React.FormEvent) => {
        ev.preventDefault()
        console.log('ihihi')
    }

    return (
        <div className="flex max-w-md flex-col gap-4">
            <form action="/" method='POST' onSubmit={handleSubmit} >
                {/* phone */}
                <div className="relative z-0 w-full mb-6 group">
                    <input type="tel" pattern="[0-9]{8}"
                        name="phone" id="phone"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                         placeholder=" " required />
                    <label htmlFor="phone"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Phone Number<span className='text-red-600'>*</span> (e.g. 1234 1234)
            </label>
                </div>

                {/* seller */}
                <div className="relative z-0 w-full mb-6 group">
                    <input type="text" name="seller" id="seller"
                     className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                     placeholder=" " required />
                    <label htmlFor="seller"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Seller Name<span className='text-red-600'>*</span></label>
                </div>

                <div className="relative z-0 w-full mb-6 group">
                    <label htmlFor="brand"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Brand<span className='text-red-600'>*</span></label>

                    <select name="brand" id="brand" required 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
                        {brands && brands.map((singleBrand, idx) =>
                            (<option key={idx} value={`${singleBrand.brandid}`}>{singleBrand.brandname}</option>)
                        )}
                    </select>
                </div>

                {/* model */}
                <div className="relative z-0 w-full mb-6 group">
                    <input type="tel"
                        name="model" id="model"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" " required />
                    <label htmlFor="model"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Model<span className='text-red-600'>*</span></label>
                </div>
                {/* price, year */}
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-6 group">
                        <input type="number"
                            name="price" id="price"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" " required />
                        <label htmlFor="price"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Price<span className='text-red-600'>*</span></label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                        <input type="number"
                            name="year"
                            id="year"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" " required />
                        <label htmlFor="year"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Year<span className='text-red-600'>*</span></label>
                    </div>
                </div>

                {/* cc and fuel */}
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-6 group">
                        <input type="number"
                            name="cc" id="cc"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" " required />
                        <label htmlFor="cc"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            CC<span className='text-red-600'>*</span></label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                        <input type="text"
                            name="fuel"
                            id="fuel"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" " required />
                        <label htmlFor="fuel"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Fuel<span className='text-red-600'>*</span></label>
                    </div>
                </div>
                {/* key feature */}
                <div className="relative z-0 w-full mb-6 group">
                    <label htmlFor="keyfeatures"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Key Feature</label>
                    <textarea id="keyfeatures"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Key Feature"></textarea>
                </div>
                {/* file */}
                <div className="relative z-0 w-full mb-6 group">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        htmlFor="imagefilename1">{`Upload Car Image (Max ${MAX_IMG})`}</label>
                    <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        id="imagefilename1" type="file"
                        accept='image/*' multiple onChange={handleFileChange} />
                    <div>
                        {files && files?.map((file) => (
                            <div key={file.name}>{file.name}</div>
                        ))}
                    </div>
                </div>

                <div className="relative z-0 w-full mb-6 group">
                    <Button type="submit">
                        Register Car Sales
                    </Button>
                </div>
            </form>
        </div>
    )
}

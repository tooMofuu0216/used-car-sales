"use client"
import { Button, Label, Modal, Spinner, TextInput, Toast } from 'flowbite-react'
import React, { useRef, useState } from 'react'
import type { Tables } from '@/types/supabase'
import { MAX_IMG } from '@/constant/constant'

interface SellCarFormProp {
    brands: Tables<'carbrand'>[] | null,
    editCarInfo: string | null,
}

const defaultFormData = {
    brandid: 1,
    carname: "",
    cc: null,
    create_dt: null,
    fuel: null,
    imagefilenames: null,
    keyfeatures: null,
    listingid: -1,
    mileageinfo: null,
    modelid: -1,
    price: null,
    seller_name: null,
    seller_phone: null,
    updated_at: null,
    userid: null,
    videofilenames: null,
    year: null,
}

export const SellCarForm = ({ brands, editCarInfo }: SellCarFormProp) => {
    // modal text for form submit
    const [showToast, setShowToast] = useState(false);
    const [isSubmitOK, setIsSubmitOK] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [msgText, setMsgText] = useState(``);

    const formRef = useRef<HTMLFormElement | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [formData, setFormData] = useState<
        // FormDataObj
        Tables<'carlisting'>
    >(defaultFormData);

    // set data on change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // set data on input
    const handleInput = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []).slice(0, MAX_IMG);
        if (files) setFiles(files);
        const fileNames = files.map(f => f.name)
        setFormData({
            ...formData,
            [event.target.name]: fileNames,
        });
    };

    const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault()

        // Convert formData object to FormData
        const formDataObject = new FormData();
        for (const idx in files) {
            formDataObject.append(`imagefileData${idx}`, files[idx] as File)
        }
        formDataObject.append("data", JSON.stringify(formData))

        try {
            setIsLoading(true)
            //Make a POST request using the Fetch API
            const response = await fetch('/api/cars', {
                method: 'POST',
                body: formDataObject,
            });
            setIsLoading(false)

            // Request was successful, handle the response
            const responseData = await response.json();
            if (response.ok) {
                console.log('Response Data:', responseData);
                setIsSubmitOK(true)
                setMsgText(`Insert Success!`)
                setShowToast(true)
                if (formRef.current) {
                    formRef.current.reset();
                    setFiles([])
                    setFormData(defaultFormData)
                }
            } else {
                setIsSubmitOK(false)
                setMsgText(`Messsage: ${responseData?.error || 'Insert Failed!'}`)
                setShowToast(true)
            }
        } catch (error) {
            setIsLoading(false)
            // Handle network or other errors
            console.error('Error:', error);
            setIsSubmitOK(false)
            setMsgText(`Insert Failed!`)
            setShowToast(true)
        }
    }

    return (
        <div className="flex max-w-md flex-col gap-4">
            <form action="/" method='POST' onSubmit={handleSubmit} ref={formRef}>
                {/* phone */}
                <div className="relative z-0 w-full mb-6 group">
                    <input type="tel" pattern="[0-9]{8}"
                        name="seller_phone" id="seller_phone"
                        onInput={handleInput}
                        onChange={handleInputChange}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" " required />
                    <label htmlFor="seller_phone"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Phone Number<span className='text-red-600'>*</span> (e.g. 1234 1234)
                    </label>
                </div>

                {/* seller */}
                <div className="relative z-0 w-full mb-6 group">
                    <input type="text" name="seller_name" id="seller_name"
                        onInput={handleInput}
                        onChange={handleInputChange}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" " required />
                    <label htmlFor="seller_name"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Seller Name<span className='text-red-600'>*</span></label>
                </div>

                <div className="relative z-0 w-full mb-6 group">
                    <label htmlFor="brand"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Brand<span className='text-red-600'>*</span></label>

                    <select name="brandid" id="brandid" required
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
                        {brands && brands.map((singleBrand, idx) =>
                            (<option key={idx} value={`${singleBrand.brandid}`}>{singleBrand.brandname}</option>)
                        )}
                    </select>
                </div>

                {/* model */}
                <div className="relative z-0 w-full mb-6 group">
                    <input type="text"
                        onInput={handleInput}
                        onChange={handleInputChange}
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
                        onInput={handleInput}
                            onChange={handleInputChange}
                            name="price" id="price"
                            min={0}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" " required />
                        <label htmlFor="price"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Price<span className='text-red-600'>*</span></label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                        <input type="number"
                        onInput={handleInput}
                            onChange={handleInputChange}
                            name="year"
                            id="year"
                            min={1970}
                            max={2025}
                            pattern='[0-9]{4}'
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
                        onInput={handleInput}
                            onChange={handleInputChange}
                            name="cc" id="cc"
                            min={0}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" " required />
                        <label htmlFor="cc"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            CC<span className='text-red-600'>*</span></label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                        <input type="text"
                        onInput={handleInput}
                            onChange={handleInputChange}
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
                        name='keyfeatures'
                        onChange={handleInputChange}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Key Feature"></textarea>
                </div>
                {/* file */}
                <div className="relative z-0 w-full mb-6 group">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        htmlFor="imagefilenames">{`Upload Car Image (Max ${MAX_IMG} images, each ~5MB)`}</label>
                    <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        id="imagefilenames" type="file"
                        name='imagefilenames'
                        accept='image/*' multiple onChange={handleFileChange} />
                    <div>
                        {files && files?.map((file) => (
                            <div key={file.name}>{file.name}</div>
                        ))}
                    </div>
                </div>

                <div className="relative z-0 w-full mb-6 group">
                    <Button type="submit" disabled={isLoading}>
                        Register Car Sales
                    </Button>
                    {showToast && (
                        <Modal dismissible={true} show={showToast} onClose={() => setShowToast(false)}>
                            <Modal.Header>Message</Modal.Header>
                            <Modal.Body>
                                {
                                    isSubmitOK
                                        ? (
                                            <div className="ml-3 text-md font-normal ">
                                                {msgText}
                                            </div>
                                        )
                                        : (
                                            <div className="ml-3 text-md font-normal text-red-600">
                                                {msgText}
                                            </div>
                                        )
                                }
                            </Modal.Body>
                        </Modal>)
                    }
                    {isLoading && (
                        <Modal show={isLoading} onClose={() => false}>
                            <Modal.Header>Inserting</Modal.Header>
                            <Modal.Body>
                                <div className="ml-3 ">
                                    <Spinner aria-label="Inserting" />
                                </div>
                            </Modal.Body>
                        </Modal>)
                    }

                </div>
            </form >
        </div >
    )
}


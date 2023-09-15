"use client"
import { Button, Modal, Spinner } from 'flowbite-react'
import React, { useRef, useState } from 'react'
import type { CarListingFormDT, Tables } from '@/types/supabase'
import { EDIT_FORM, MAX_IMG, SELL_FORM } from '@/constant/constant'
import { resultAndformModalControlProp } from '@/types/common'
import Image from 'next/image';

interface CarListingFormProp {
    brands: Tables<'carbrand'>[] | null,
    type: string,
    listingData?: CarListingFormDT
    resultAndformModalControl?: resultAndformModalControlProp
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

export const CarListingForm = ({ brands, type, listingData, resultAndformModalControl }: CarListingFormProp) => {
    const formRef = useRef<HTMLFormElement | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const modelname = listingData?.carmodel?.modelname
    const brandname = listingData?.carbrand?.brandname
    const [formData, setFormData] = useState<Tables<'carlisting'>>(type === SELL_FORM
        ? defaultFormData
        : (listingData! as Tables<'carlisting'>));


    // modal text for form submit
    let [showModal, setShowModal] = useState(false);
    let [isLoading, setIsLoading] = useState(false);
    let [msgText, setMsgText] = useState(``);
    let setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;

    if (type === EDIT_FORM && resultAndformModalControl) {
        isLoading = resultAndformModalControl.isLoading
        setIsLoading = resultAndformModalControl.setIsLoading
        showModal = resultAndformModalControl.showModal
        setShowModal = resultAndformModalControl.setShowModal
        msgText = resultAndformModalControl.msgText
        setMsgText = resultAndformModalControl.setMsgText
        setOpenModal = resultAndformModalControl.setOpenModal
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        if (type === SELL_FORM) {
            for (const idx in files) {
                formDataObject.append(`imagefileData${idx}`, files[idx] as File)
            }
        }
        formDataObject.append("data", JSON.stringify(formData))

        try {
            setShowModal(true)
            setIsLoading(true)
            //Make a POST request using the Fetch API
            const response = await fetch('/api/cars', {
                method: type === SELL_FORM ? 'POST' : 'PATCH',
                body: formDataObject,
            });
            setIsLoading(false)

            // Request was successful, handle the response
            const responseData = await response.json();
            if (response.ok) {

                setMsgText(`${type === SELL_FORM ? `Insert` : `Update`} Success!`)
                setFiles([])
                setFormData(defaultFormData)
                if (formRef.current) {
                    formRef.current.reset();
                }
            } else {
                throw responseData?.error || new Error()
            }
        } catch (error) {
            setIsLoading(false)
            // Handle network or other errors
            console.error('Error:', error);
            setMsgText(`${type === SELL_FORM ? `Insert` : `Update`} Failed!`)
        } finally {
            if (type === EDIT_FORM && setOpenModal) setOpenModal(false)
        }
    }

    return (
        <div className="flex max-w-md flex-col gap-4">
            <form action="/" onSubmit={handleSubmit} ref={formRef}>

                {/* brand */}
                <div className="relative z-0 w-full mb-6 group">
                    {type === SELL_FORM
                        ? (
                            <>
                                <label htmlFor="brand"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Select Brand
                                    <span className={`text-red-600`}>*</span>
                                </label>
                                <select name="brandid" id="brandid" required
                                    onChange={handleInputChange}
                                    value={formData.brandid || ``}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
                                    {brands && brands.map((singleBrand, idx) =>
                                        (<option key={idx} value={`${singleBrand.brandid}`}>{singleBrand.brandname}</option>)
                                    )}
                                </select>
                            </>)
                        : (
                            <label htmlFor="brand"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Brand (Unchangable): {brandname}
                            </label>
                        )}
                </div>

                {/* model */}
                <div className="relative z-0 w-full mb-6 group">
                    {type === EDIT_FORM ? (
                        <label htmlFor="model"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Model (Unchangable): {modelname}
                        </label>
                    ) :
                        (
                            <>
                                <input type="text"
                                    onInput={handleInput}
                                    onChange={handleInputChange}
                                    disabled={type === EDIT_FORM}
                                    name="model" id="model"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" " required />
                                <label htmlFor="model"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                    Model<span className='text-red-600'>*</span></label>
                            </>
                        )}
                </div>

                {/* phone */}
                <div className="relative z-0 w-full mb-6 group">
                    <input type="tel" pattern="[0-9]{8}"
                        name="seller_phone" id="seller_phone"
                        onInput={handleInput}
                        onChange={handleInputChange}
                        value={formData.seller_phone || ``}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" " required />
                    <label htmlFor="seller_phone"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Phone Number
                        {type === SELL_FORM && <span className='text-red-600'>*</span>}
                        (e.g. 1234 1234)
                    </label>
                </div>

                {/* seller */}
                <div className="relative z-0 w-full mb-6 group">
                    <input type="text" name="seller_name" id="seller_name"
                        onInput={handleInput}
                        onChange={handleInputChange}
                        value={formData.seller_name || ``}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" " required />
                    <label htmlFor="seller_name"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Seller Name
                        {type === SELL_FORM && <span className='text-red-600'>*</span>}
                    </label>
                </div>

                {/* price, year */}
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-6 group">
                        <input type="number"
                            onInput={handleInput}
                            onChange={handleInputChange}
                            value={formData.price || ``}
                            name="price" id="price"
                            min={0}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" " required />
                        <label htmlFor="price"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Price
                            {type === SELL_FORM && <span className='text-red-600'>*</span>}
                        </label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                        <input type="number"
                            onInput={handleInput}
                            onChange={handleInputChange}
                            value={formData.year || ``}
                            name="year"
                            id="year"
                            min={1970}
                            max={2022}
                            pattern='[0-9]{4}'
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" " required />
                        <label htmlFor="year"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Year
                            {type === SELL_FORM && <span className='text-red-600'>*</span>}
                        </label>
                    </div>
                </div>

                {/* cc and fuel */}
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-6 group">
                        <input type="number"
                            onInput={handleInput}
                            onChange={handleInputChange}
                            name="cc" id="cc"
                            value={formData.cc || ``}
                            min={0}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" " required />
                        <label htmlFor="cc"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            CC
                            {type === SELL_FORM && <span className='text-red-600'>*</span>}
                        </label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                        <input type="text"
                            onInput={handleInput}
                            onChange={handleInputChange}
                            name="fuel"
                            id="fuel"
                            value={formData.fuel || ``}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" " required />
                        <label htmlFor="fuel"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Fuel
                            {type === SELL_FORM && <span className='text-red-600'>*</span>}
                        </label>
                    </div>
                </div>

                {/* key feature */}
                <div className="relative z-0 w-full mb-6 group">
                    <label htmlFor="keyfeatures"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Key Feature</label>
                    <textarea id="keyfeatures"
                        name='keyfeatures'
                        onChange={handleInputChange}
                        value={formData.keyfeatures || ``}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Key Feature"></textarea>
                </div>

                {/* file */}
                <div className="relative z-0 w-full mb-6 group">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        htmlFor="imagefilenames">{`Upload Car Image (Max ${MAX_IMG} images, each ~5MB)`}</label>

                    {type === SELL_FORM
                        ? (<input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="imagefilenames" type="file"
                            name='imagefilenames'
                            accept='image/*' multiple onChange={handleFileChange} />)
                        : <></>}
                    <div>
                        {formData.imagefilenames && formData.imagefilenames.map((name, idx) => (
                            <div key={name} className='flex'>
                                {/* <Image width={15} height={15} alt={`Slide `} 
                                    src={files[idx].}
                                    className='aspect-video w-full' /> */}
                                {name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-0 w-full mb-6 group">
                    <Button type="submit" disabled={isLoading}>
                        {`${type === SELL_FORM ? `Register` : `Update`} Car Sales`}
                    </Button>
                </div>
            </form>

            {/*  show result and loading*/}
            {(type === SELL_FORM && showModal) && (
                <Modal
                    show={showModal}
                    onClose={() => {
                        if (isLoading) return false
                        setShowModal(false)
                    }}>
                    <Modal.Header>Message</Modal.Header>
                    <Modal.Body>
                        <div className={`ml-3 text-md font-normal `}>
                            {isLoading ? (<Spinner aria-label="Loading" />) : (msgText)}
                        </div>
                    </Modal.Body>
                </Modal>)
            }

        </div>
    )
}


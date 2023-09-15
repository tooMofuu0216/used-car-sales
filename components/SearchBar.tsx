"use client"
import React, { useCallback, useEffect, useState, useTransition } from 'react'
import { FaSearch, } from 'react-icons/fa';
import { BsFilterLeft } from 'react-icons/bs';
import { usePathname, useRouter } from "next/navigation"
import { CAR_PATH_NAME, EDIT_LIST_PATH_NAME, SORT_LIST } from '@/constant/constant';
import { Button, Modal } from 'flowbite-react';
import { Tables } from '@/types/supabase';
import { filterObj } from '@/types/common';


const min_priceVal = "0"
const max_priceVal = "9999999"
const max_yearVal = 2022
const min_yearVal = 1970
const defaultFirst = 1

export const SearchBar = (
    {
        brands,
        models
    }: {
        brands: Tables<'carbrand'>[] | null
        models: Tables<'carmodel'>[] | null
    }
) => {
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()
    const [inputValue, setInputValue] = useState<string>("")
    const [showModal, setShowModal] = useState(false);

    const filterArr = models?.filter(el => el.brandid === defaultFirst)
    const [filterModel, setfilterModel] = useState<Tables<'carmodel'>[] | null>(filterArr||models);

    const [formData, setFormData] = useState<filterObj>({
        brandid: defaultFirst,
        modelid: defaultFirst,
        min_price: min_priceVal,
        max_price: max_priceVal,
        min_year: min_yearVal,
        max_year: max_yearVal,
        sorter: SORT_LIST[0]
    })

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const searchQuery = params.get("search") ?? ""
        setInputValue(searchQuery)
    }, [])

    const searchWithParam = useCallback(
        (searchQuery: string, isFilter?: boolean) => {
            const params = new URLSearchParams(window.location.search)
            if (searchQuery.length > 0) {
                params.set("search", searchQuery)
            } else {
                params.delete("search")
            }


            if (isFilter) {
                params.set(`isFilter`, `${isFilter}`)
                for (const [key, val] of Object.entries(formData)) {
                    params.set(key, `${val}`)
                }

                // if(formData.brandid === selectAll){
                //     params.delete(`brandid`)
                //     params.delete(`modelid`)
                // }

                // if((Number(formData.max_price)||max_priceVal) < (Number(formData.min_price)||min_priceVal)){
                //     params.delete(`max_price`)
                //     params.delete(`min_price`)
                // }

                // if((formData.max_year||max_yearVal) < (formData.min_year||min_yearVal)){
                //     params.delete(`brandid`)
                //     params.delete(`modelid`)
                // }
            }else{
                for (const [key, val] of Object.entries(formData)) {
                    params.delete(key)
                }
                params.delete(`isFilter`)
            }

            startTransition(() => {
                if (pathname === CAR_PATH_NAME || pathname === EDIT_LIST_PATH_NAME) {
                    router.replace(`${pathname}?${params.toString()}`)
                } else { // HOME PAGE
                    router.push(`/cars?${params.toString()}`)
                }
            })
        },
        [formData, pathname, router]
    )

    const handleClick = () => {
        searchWithParam(inputValue)
    }
    const handleKeyDown = (ev: React.KeyboardEvent) => {
        if (ev.key === 'Enter') searchWithParam(inputValue)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === `brandid`) {
            const filterArr = models?.filter(el => el.brandid === Number(value))
            setfilterModel(filterArr || [])
            if (filterArr?.[0]) {
                formData.modelid = filterArr?.[0].modelid
            }
        }
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFilter = () => {
        setShowModal(false)
        // setInputValue(``)
        searchWithParam(inputValue, true)
    }

    return (
        <div className='border shadow-md flex '>
            <input
                className='outline-none text-md p-4 grow' placeholder='Enter Car Name...'
                onKeyDown={handleKeyDown}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value)
                }}
            />
            <button
                className='p-5 text-white bg-amber-500 hover:text-amber-500 hover:bg-white duration-500'
                onClick={handleClick}>
                <FaSearch />
            </button>
           {pathname !== EDIT_LIST_PATH_NAME &&
            <button className='p-5  bg-white hover:text-amber-500'
                onClick={() => setShowModal(true)}>
                <BsFilterLeft />
            </button>}

            {/*  result modal */}
            {showModal && (
                <Modal dismissible={true} show={showModal}
                    onClose={() => setShowModal(false)}>
                    <Modal.Header>Filter</Modal.Header>
                    <Modal.Body>
                        <div className='flex flex-col gap-4 '>

                            {/* brand */}
                            <div className="relative z-0 w-full mb-6 group">
                                <label htmlFor="brand"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Brand
                                </label>

                                <select name="brandid" id="brandid"
                                    onChange={handleInputChange}
                                    // value={formData.brandid!}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
                                    {brands && brands.map((singleBrand, idx) =>
                                        (<option key={idx} value={`${singleBrand.brandid}`}>{singleBrand.brandname}</option>)
                                    )}
                                </select>
                            </div>

                            {/* model */}
                            <div className="relative z-0 w-full mb-6 group">
                                <label htmlFor="brand"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Model
                                </label>

                                <select name="modelid" id="modelid"
                                    onChange={handleInputChange}
                                    // value={formData.modelid!}
                                    // disabled={formData.brandid! <= 0}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
                                    {filterModel && filterModel.map((model, idx) =>
                                        (<option key={idx} value={`${model.modelid}`}>{model.modelname}</option>)
                                    )}
                                </select>
                            </div>

                            {/* price */}
                            <div className="relative z-0 w-full mb-6 group">
                                <label htmlFor="brand"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Price
                                </label>
                                <div className=''>
                                    <input type="number"
                                        // onInput={handleInput}
                                        onChange={handleInputChange}
                                        // value={formData.price || ``}
                                        name="min_price" id="min_price"
                                        value={formData.min_price!}
                                        min={0}
                                        className=" py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder=" " />

                                    <span className='mx-8'>To</span>

                                    <input type="number"
                                        // onInput={handleInput}
                                        onChange={handleInputChange}
                                        // value={formData.price || ``}
                                        value={formData.max_price!}
                                        name="max_price" id="max_price"
                                        min={0}
                                        className=" py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder=" " />

                                </div>
                            </div>

                            {/* Year */}
                            <div className="relative z-0 w-full mb-6 group">
                                <label htmlFor="brand"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Year
                                </label>
                                <div className=''>

                                    <input type="number"
                                        // onInput={handleInput}
                                        onChange={handleInputChange}
                                        // value={formData.price || ``}
                                        value={formData.min_year!}
                                        name="min_year" id="min_year"
                                        max={2022}
                                        min={1970}
                                        className=" py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder=" " />

                                    <span className='mx-8'>To</span>

                                    <input type="number"
                                        // onInput={handleInput}
                                        onChange={handleInputChange}
                                        // value={formData.price || ``}
                                        value={formData.max_year!}
                                        name="max_year" id="max_year"
                                        max={2022}
                                        min={1970}
                                        className=" py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder=" " />

                                </div>
                            </div>

                            {/* sort */}
                            <div className="relative z-0 w-full mb-6 group">
                                <label htmlFor="brand"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Sort
                                </label>
                                <select name="sorter" id="sorter"
                                    onChange={handleInputChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
                                    {SORT_LIST && SORT_LIST.map((sort, idx) =>
                                        (<option selected={idx === 0} key={idx} value={`${sort}`}>{sort}</option>)
                                    )}
                                </select>

                            </div>

                            <div>
                                <Button
                                    onClick={handleFilter}
                                >Confirm</Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>)
            }
        </div>
    )
}

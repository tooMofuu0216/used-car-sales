'use client';
import { Button, Spinner } from 'flowbite-react';
import React, { Dispatch, SetStateAction, useState } from 'react'

export const DelCarForm = (
    {
        listingid,
        setOpenModal,
        isLoading,
        setIsLoading
    }: {
        listingid: number
        setOpenModal: Dispatch<SetStateAction<boolean>>
        isLoading:boolean
        setIsLoading: Dispatch<SetStateAction<boolean>>
    }
) => {
    const sendDelRequest = async () => {
        if (!listingid) return
        try {
            setIsLoading(true)
            //Make a POST request using the Fetch API
            const response = await fetch('/api/cars', {
                method: 'DELETE',
                body: JSON.stringify({ listingid: listingid }),
            });
            setIsLoading(false)

            // Request was successful, handle the response
            const responseData = await response.json();
            if (response.ok) {
                console.log('Response Data:', responseData);
            } else {
            }
        } catch (error) {
            setIsLoading(false)
            // Handle network or other errors
            console.error('Error:', error);
        }finally{
            setOpenModal(false)
        }
    }

    return (
        <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this?
            </h3>
            <div className="flex justify-center gap-4">
                {
                    isLoading
                        ? (
                            <Spinner aria-label="Deleting" />
                        )
                        : (
                            <>
                                <Button color="failure"
                                    onClick={sendDelRequest}
                                >
                                    Yes
                                </Button>
                                <Button color="gray"
                                    onClick={() => {
                                        if(isLoading) return false
                                        setOpenModal(false)
                                    }}
                                >
                                    No
                                </Button>
                            </>
                        )}
            </div>
        </div>
    )
}

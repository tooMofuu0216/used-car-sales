'use client';
import { Button } from 'flowbite-react';
import React from 'react'

export const DelCarForm = () => {
    return (
        <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this?
            </h3>
            <div className="flex justify-center gap-4">
                <Button color="failure" 
                // onClick={() => props.setOpenModal(undefined)}
                >
                    Yes
                </Button>
                <Button color="gray" 
                // onClick={() => props.setOpenModal(undefined)}
                >
                    No
                </Button>
            </div>
        </div>
    )
}

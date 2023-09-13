'use client';

import { Tables } from '@/types/supabase';
import { Button, Modal, Table } from 'flowbite-react';
import Link from 'next/link';
import { useState } from 'react';
import ModalContainer from './ModalContainer';
import { DelCarForm } from './DelCarForm';
import { SellCarForm } from './SellCarForm';

export default function CarListingTable({
    tableData
}: {
    tableData: Tables<'carlisting'>[]
}) {
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [selectedCarID, setSelectedCarID] = useState(``);


    const handleEdit = (ev:React.MouseEvent) => {
        setOpenModal(true)
        setIsEdit(true)
        setModalTitle(`Edit Car Listing Form`)
        const carID = ev.currentTarget.getAttribute('name') || ''
        setSelectedCarID(carID)
    }

    function handleDel(ev:React.MouseEvent): void {
        setOpenModal(true)
        setIsEdit(false)
        setModalTitle(`Delete Car Listing Form`)
        const carID = ev.currentTarget.getAttribute('name') || ''
        setSelectedCarID(carID)
    }

    return (
        <>
            <Table hoverable>

                <Table.Head className='min-[870px]:table-header-group hidden'>
                    <Table.HeadCell>
                        Car Name
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Price
                    </Table.HeadCell>
                    <Table.HeadCell>
                        <span className="sr-only">
                            Page Link
                        </span>
                    </Table.HeadCell>
                    <Table.HeadCell>
                        <span className="sr-only">
                            Edit
                        </span>
                    </Table.HeadCell>
                    <Table.HeadCell>
                        <span className="sr-only">
                            Delete
                        </span>
                    </Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                    {
                        tableData && tableData.map((row, idx) => (
                            <Table.Row key={idx} className="bg-white dark:border-gray-700 dark:bg-gray-800 min-[870px]:table-row flex flex-col">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {row.carname}
                                </Table.Cell>
                                <Table.Cell>
                                    {row.price}
                                </Table.Cell>
                                <Table.Cell className='text-right min-[820px]:text-left'>
                                    <Link
                                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                                        href={`/cars/${row.listingid}`}
                                    >
                                        <Button>
                                            <p>
                                                Page
                                            </p>
                                        </Button>
                                    </Link>
                                </Table.Cell>
                                <Table.Cell className='text-right min-[820px]:text-left'>
                                    <Button
                                        name={`${row.listingid}`} 
                                        className="font-medium "
                                        onClick={handleEdit}
                                    >
                                        <p>
                                            Edit
                                        </p>
                                    </Button>
                                </Table.Cell>
                                <Table.Cell className='text-right min-[820px]:text-left'>
                                    <Button
                                        name={`${row.listingid}`} 
                                        className="font-medium "
                                        onClick={handleDel}
                                    >
                                        <p>
                                            Delete
                                        </p>
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>
            </Table>

            <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>{modalTitle}</Modal.Header>
                <Modal.Body className='md:m-auto'>
                    {isEdit
                    ?<SellCarForm brands={null} editCarInfo={selectedCarID}/>
                    :<DelCarForm />}
                </Modal.Body>
            </Modal>
        </>
    )
}



'use client';

import { CarListingFormDT, Tables } from '@/types/supabase';
import { Button, Modal, Spinner, Table } from 'flowbite-react';
import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DelCarForm } from './DelCarForm';
import { CarListingForm } from './CarListingForm';
import { EDIT_FORM, SELECT_RECORD_SIZE } from '@/constant/constant';
import { resultAndformModalControlProp, searchParamsType } from '@/types/common';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useInView } from 'react-intersection-observer';
import { fetchListings } from '@/action/serverAction';

export default function CarListingTable({
    tableData,
    brands,
    searchParams
}: {
    tableData: CarListingFormDT[],
    brands: Tables<'carbrand'>[] | null,
    searchParams: searchParamsType
}) {
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [tableDataIdx, setTableDataIdx] = useState<number>(0);
    const [tableDataList, setTableDataList] = useState<CarListingFormDT[]>(tableData);
    const supabase = createClientComponentClient()


    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [msgText, setMsgText] = useState(``);
    const tableHeaderID = `ID`
    const tableHeaderCarName = `Car Name`
    const tableHeaderPrice = `Price`

    const { ref, inView } = useInView();
    const [page, setPage] = useState(1);
    const [isMore, setIsMore] = useState(true);

    const loadMore = async () => {
        const newCars = (await fetchListings(page, searchParams)) ?? [];
        setTableDataList((prev: CarListingFormDT[]) => [...prev, ...newCars]);
        setPage(prev => prev + 1);
        setIsMore(newCars.length > 0)
    };

    useEffect(() => {
        if (inView) {
            loadMore();
        }
    }, [inView]);

    const resultAndformModalControl: resultAndformModalControlProp =
        { isLoading, setIsLoading, showModal, setShowModal, msgText, setMsgText, setOpenModal }


    const handleEdit = (ev: React.MouseEvent<HTMLButtonElement>) => {
        setOpenModal(true)
        setIsEdit(true)
        setModalTitle(`Edit Car Listing Form - ${ev.currentTarget.getAttribute('name')}`)
        setTableDataIdx(Number(ev.currentTarget.dataset?.idx) || 0)
    }

    const handleDel = (ev: React.MouseEvent<HTMLButtonElement>) => {
        setOpenModal(true)
        setIsEdit(false)
        setModalTitle(`Delete Car Listing Form - ${ev.currentTarget.getAttribute('name')}`)
        setTableDataIdx(Number(ev.currentTarget.dataset?.idx) || 0)
    }

    useEffect(() => {
        setPage(1)
        const firstPage = 0
        const refresh = async () => {
            const newCars = (await fetchListings(firstPage, searchParams)) ?? [];
            setTableDataList(newCars)
        }
        refresh()
    }, [isLoading])

    useEffect(() => {
        setTableDataList(tableData)
    }, [tableData])


    return (

        tableData ? <>
            <Table hoverable>

                <Table.Head className='md:table-header-group hidden'>
                    <Table.HeadCell>
                        {tableHeaderID}
                    </Table.HeadCell>
                    <Table.HeadCell>
                        {tableHeaderCarName}
                    </Table.HeadCell>
                    <Table.HeadCell>
                        {tableHeaderPrice}
                    </Table.HeadCell>
                    <Table.HeadCell>
                        <span className="sr-only">
                            Button Group: link, edit, delete
                        </span>
                    </Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                    {
                        tableDataList && tableDataList.map((row, idx) => (
                            <Table.Row key={idx} className="bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white md:table-row flex flex-col">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    <span className='md:hidden inline font-semibold '>{tableHeaderID}: </span>
                                    {row.listingid}
                                </Table.Cell>
                                <Table.Cell>
                                    <span className='md:hidden inline font-semibold '>{tableHeaderCarName}: </span>
                                    {row.carname}
                                </Table.Cell>
                                <Table.Cell>
                                    <span className='md:hidden inline font-semibold '>{tableHeaderPrice}: </span>
                                    ${row.price}
                                </Table.Cell>
                                <Table.Cell className='flex justify-end space-x-4'>
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

                                    {/* edit */}
                                    <Button
                                        color="success"
                                        name={`${row.listingid}`}
                                        data-idx={idx}
                                        className="font-medium "
                                        onClick={handleEdit}
                                    >
                                        <p>
                                            Edit
                                        </p>
                                    </Button>

                                    {/* delete */}
                                    <Button
                                        color="failure"
                                        name={`${row.listingid}`}
                                        data-idx={idx}
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

            {isMore &&
                (<div
                    className="flex justify-center p-4"
                    ref={ref}
                >
                    <Spinner />
                </div>)}
            <Modal dismissible show={openModal}
                onClose={() => {
                    if (isLoading) return false
                    setOpenModal(false)
                }}>
                <Modal.Header>{modalTitle}</Modal.Header>
                <Modal.Body className='md:m-auto'>
                    {isEdit
                        ? <CarListingForm
                            brands={brands}
                            type={EDIT_FORM}
                            listingData={tableDataList[tableDataIdx]}
                            resultAndformModalControl={resultAndformModalControl}
                        />
                        : <DelCarForm
                            listingid={tableDataList[tableDataIdx]?.listingid}
                            setOpenModal={setOpenModal}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />}
                </Modal.Body>
            </Modal>


            {/*  show result and loading*/}
            {showModal && (
                <Modal
                    show={showModal}
                    onClose={async () => {
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
        </>
            : <>
                <div>No Listing Data</div>
            </>
    )
}



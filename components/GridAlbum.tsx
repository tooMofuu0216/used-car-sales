"use client"
import React, { useState } from 'react'
import Image from 'next/image';
import { IMG_URL_PREFIX } from '@/constant/constant';
import defaultImg from '@/public/heroImg.jpg'
import { Modal } from 'flowbite-react';

export const GridAlbum = ({
    imgList
}: {
    imgList: string[]
}
) => {
    const defaultBigImgSrc = `${IMG_URL_PREFIX}${imgList[0]}`
    const [bigImgSrc, setBigImgSrc] = useState(defaultBigImgSrc)
    const [openModal, setOpenModal] = useState(false)
    const [modalTitle, setModalTitle] = useState(`Image `)

    const handleClick = (ev: React.MouseEvent<HTMLImageElement>) => {
        const src = ev.currentTarget.getAttribute(`src`)
        setBigImgSrc(src || defaultBigImgSrc)
        setModalTitle(`Image ${ev.currentTarget.dataset.idx}`)
    }

    const showEnlargeImg = (ev: React.MouseEvent) => {
        setOpenModal(true)
    }
    return (
        <div className="grid gap-4 grid-flow-row max-w-5xl m-auto">
            <div className='grow'>
                <Image
                    onClick={showEnlargeImg}
                    src={bigImgSrc || defaultImg}
                    alt={`Slide `}
                    className="w-full cursor-pointer"
                    width={300}
                    height={300} />
            </div>

            {/* small image  */}
            <div className="grid grid-flow-col gap-4">
                {
                    imgList && imgList.map((singleImg, idx) => (
                        <div id={`Image${idx}`} className=" w-full" key={idx}>
                            <Image
                                src={`${IMG_URL_PREFIX}${singleImg}` || defaultImg}
                                alt={`Slide `}
                                data-idx={idx+1}
                                onClick={handleClick}
                                className="w-14 aspect-video cursor-pointer hover:border-emerald-600 border-2"
                                width={300}
                                height={300} />
                        </div>
                    ))
                }
            </div>

            <Modal
                dismissible={true}
                show={openModal}
                onClose={() => setOpenModal(false)}
                className='w-screen'
            >
                <Modal.Header>{modalTitle}</Modal.Header>
                <Modal.Body className=''>
                    <Image
                        src={bigImgSrc || defaultImg}
                        alt={`Slide `}
                        className="w-full"
                        width={700}
                        height={700} />
                </Modal.Body>
            </Modal>
        </div>
    )
}

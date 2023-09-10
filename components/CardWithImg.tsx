'use client';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import defaultImg from '@/public/heroImg.jpg'
import Link from 'next/link';
import type { Tables } from '@/types/supabase'
import { Card } from 'flowbite-react';
import { IMG_URL_PREFIX } from '@/constant/constant';

interface CardProp {
    carData: Tables<'carlisting'> | null,
    carThumb: string
}

export const CardWithImg = ({ carData, carThumb }: CardProp) => {

    return (
        <Link href={`/cars/${carData?.listingid}`}>
            <Card>
                <Image width={200} alt={`Slide `} height={200}
                    src={`${IMG_URL_PREFIX}${carThumb}.jpg` || defaultImg}
                    className='aspect-video' />
                <h5 className="text-sm font-bold truncate tracking-tight text-gray-900 dark:text-white">
                {carData?.carname}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                {carData?.price}
                </p>
            </Card>
        </Link>
    )
}

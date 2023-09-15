"use client"
import { Tables } from '@/types/supabase'
import React, { useEffect, useRef, useState } from 'react'
import { CardWithImg } from './CardWithImg'
import { Pagination, Spinner } from 'flowbite-react'
import { useInView } from "react-intersection-observer";
import { fetchCars } from '@/action/serverAction'
import { searchParamsType } from '@/types/common'

export const InfiniteScroll = (
    {
        carLists,
        searchParams,
    }: {
        carLists: Tables<'carlisting'>[]
        searchParams: searchParamsType
    }
) => {
    const [carListings, setCarListings] = useState<Tables<'carlisting'>[]>(carLists)
    const { ref, inView } = useInView();
    const [page, setPage] = useState(1);
    const [isMore, setIsMore] = useState(true);

    const loadMore = async () => {
        const newCars = (await fetchCars(page, searchParams)) ?? [];
        setCarListings((prev: Tables<'carlisting'>[]) => [...prev, ...newCars]);
        setPage(prev=>prev+1);
        setIsMore(newCars.length>0)
    };

    useEffect(() => {
        if (inView) {
            loadMore();
        }
    }, [inView]);

    useEffect(() => {
        setCarListings(carLists)
    }, [carLists]);

    return (
        <>
            {
                carListings && carListings.map((car, idx) => (
                    <CardWithImg carData={car} carThumb={car?.imagefilenames?.[0] || ""} key={idx} />
                ))
            }
            {isMore&&
            (<div
                className="m-auto"
                ref={ref}
            >
                <Spinner />
            </div>)}
        </>
    )
}

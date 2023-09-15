"use client"
import React, { useState } from 'react'
import { CardWithImg } from './CardWithImg';
import type { Tables } from '@/types/supabase'
import { Carousel, Flowbite } from 'flowbite-react';
import type { CustomFlowbiteTheme } from 'flowbite-react';

interface CustomCarouselProp {
    latestCars: Tables<'carlisting'>[] | null,
}

export const CustomCarousel = ({ latestCars }: CustomCarouselProp) => {
    const carouselItemWidth = `200px`

    const customTheme: CustomFlowbiteTheme = {
        carousel: {
            item: {
                wrapper: `w-[${carouselItemWidth}] mx-4 flex-shrink-0 transform cursor-grab snap-center`
            },
            control: {
                base: "inline-flex h-8 w-8 items-center justify-center rounded-full  group-focus:outline-none group-focus:ring-4 group-focus:ring-white bg-gray-800/30 group-hover:bg-gray-800/60 group-focus:ring-gray-800/70 sm:h-10 sm:w-10",
                icon: "h-5 w-5  text-white sm:h-6 sm:w-6"
            }
        }
    };

    return (
        <Flowbite theme={{ theme: customTheme }}>
            <Carousel
                className='h-64 items-center px-4 gap-4 bg-gray-400 dark:bg-gray-700 dark:text-white'
                slide={false}
                indicators={false} >
                {
                    latestCars && latestCars.map((car, idx) => (
                        <div key={idx} className={`w-[200px]`}>
                            <CardWithImg carData={car} carThumb={car?.imagefilenames?.[0] || ""} key={idx} />
                        </div>
                    ))
                }
            </Carousel>
        </Flowbite>
    );
};

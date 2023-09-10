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
                wrapper: `w-[${carouselItemWidth}] mx-4 flex-shrink-0 transform cursor-grab snap-center"`
            }
        }
    };

    return (
        <Flowbite  theme={{ theme: customTheme }}>
            <Carousel
             className='h-64 items-center px-4 gap-4 bg-gray-400 dark:bg-gray-700 dark:text-white'
                slide={false}
                indicators={false} >
                {/* <div className=""> */}
                {
                    latestCars && latestCars.map((car, idx) => (
                        <div key={idx} className={`${carouselItemWidth}`}>
                            <CardWithImg carData={car} carThumb={car?.imagefilenames?.[0] || ""} key={idx} />
                        </div>
                    ))
                }
                {/* </div> */}
            </Carousel>
        </Flowbite>
    );
};

import { Database } from '@/types/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image';
import { FaWhatsapp } from 'react-icons/fa'
import { CardWithImg } from '@/components/CardWithImg'
import { CustomCarousel } from '@/components/CustomCarousel'
import { DEFAULT_GRID_IMG, IMG_URL_PREFIX, MAX_IMG, SELECT_RECORD_SIZE } from '@/constant/constant'
import { GridAlbum } from '@/components/GridAlbum'

const page = async ({ params }: { params: { carID: string } }) => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const defaultPhone = `12341234`
  const getCarItem = async () => {
    const { data } = await supabase.from('carlisting')
      .select()
      .eq('listingid', params.carID)
    return data?.[0]
  }
  const car = await getCarItem()

  const imgList = new Array(MAX_IMG).fill(DEFAULT_GRID_IMG)
  if(car?.imagefilenames)
    imgList.splice(0,car?.imagefilenames?.length, ...car?.imagefilenames)

  // get cars where BrandID = 1 if no car?.brandid
  const defaultBrandID = 1
  const getRelatedCarItem = async () => {
    const brandID = car?.brandid || defaultBrandID
    const { data } = await supabase.from('carlisting')
      .select()
      .eq('brandid', brandID)
      .neq('listingid', params.carID)
      .order("create_dt", { ascending: false })
      .range(0, SELECT_RECORD_SIZE)
    return data
  }
  const relatedCarItem = await getRelatedCarItem()

  return (
    <div className='flex flex-col xl:px-64 px-16 py-12 gap-8 bg-[#ebfcfb]'>
      {car &&
        (
          <>
            <GridAlbum imgList={imgList} />

            <div className='bg-white p-4 rounded-sm shadow-md'>
              <div className='flex justify-between border-b-2 py-4 md:flex-row flex-col'>
                <h1 className='text-xl'>{car?.carname}</h1>
                <Link href={`https://wa.me/852${car.seller_phone || defaultPhone}`}
                  className="flex font-semibold">Contact:&nbsp;
                  <FaWhatsapp size={28} />
                </Link>
              </div>
              <h2 className=' border-b-2  py-4'>Price(HKD): ${car?.price}</h2>

              <div className='  py-4'>
                <div className='flex gap-8 flex-wrap justify-around'>
                  <div><p className='font-bold'>Year:</p>{car?.year}</div>
                  <div><p className='font-bold'>CC:</p>{car?.cc}</div>
                  <div><p className='font-bold'>Fuel:</p>{car?.fuel}</div>
                  <div><p className='font-bold'>Key feature:</p>{car?.keyfeatures}</div>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <Link href={`/cars`} className='hover:text-amber-500  text-2xl font-bold'>Cars From Same Brand</Link>
              <CustomCarousel latestCars={relatedCarItem} />
            </div>
          </>)}
    </div>
  )
}

export default page
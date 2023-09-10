import { Database } from '@/types/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image';
import defaultImg from '@/public/heroImg.jpg'
import { FaWhatsapp } from 'react-icons/fa'
import { CardWithImg } from '@/components/CardWithImg'
import { CustomCarousel } from '@/components/CustomCarousel'
import { IMG_URL_PREFIX, MAX_IMG } from '@/constant/constant'

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

  const imgList = car?.imagefilenames?.length === MAX_IMG ? car?.imagefilenames : new Array(MAX_IMG).fill(car?.imagefilenames?.[0])

  // get cars where BrandID = 1 if no car?.brandid
  const defaultBrandID = 1
  const getRelatedCarItem = async () => {
    const brandID = car?.brandid || defaultBrandID
    const { data } = await supabase.from('carlisting')
      .select()
      .eq('brandid', brandID)
      .order("create_dt")
      .limit(10)
    return data
  }
  const relatedCarItem = await getRelatedCarItem()

  return (
    <div className='flex flex-col xl:px-64 px-16 py-12 gap-8'>
      {car &&
        (
          <>
            <div className="grid gap-4 grid-flow-col">
              <div className='grow'>
                <Image
                  src={`${IMG_URL_PREFIX}${imgList[0]}.jpg` || defaultImg}
                  alt={`Slide `}
                  className="w-full"
                  width={300}
                  height={300} />
              </div>

              {/* small image  */}
              <div className="grid grid-rows-5 gap-4">
                {
                  imgList && imgList.map((singleImg, idx) => (
                    <div id={`Image${idx}`} className=" w-full" key={idx}>
                      <Image
                        src={`${IMG_URL_PREFIX}${singleImg}.jpg` || defaultImg}
                        alt={`Slide `}
                        className="w-14 aspect-video cursor-pointer hover:border-emerald-600 border-2"
                        width={300}
                        height={300} />
                    </div>
                  ))
                }
              </div>

            </div>

            <div className=''>
              <div className='flex justify-between border-b-2 py-4 md:flex-row flex-col'>
                <h1 className='text-xl'>{car?.carname}</h1>
                <Link href={`https://wa.me/852${car.seller_phone || defaultPhone}`}
                  className="flex font-semibold">Contact:&nbsp;
                  <FaWhatsapp size={28} />
                </Link>
              </div>
              <h2 className=' border-b-2  py-4'>{car?.price}</h2>

              <div className='border-b-2  py-4'>
                <div className='flex gap-8 flex-wrap justify-around'>
                  <div><p className='font-bold'>Year:</p>{car?.year}</div>
                  <div><p className='font-bold'>CC:</p>{car?.cc}</div>
                  <div><p className='font-bold'>Fuel:</p>{car?.fuel}</div>
                  <div><p className='font-bold'>Key feature:</p>{car?.keyfeatures}</div>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <Link href={`/cars`} className='hover:text-green-500  text-2xl font-bold'>Latest Cars</Link>
              <CustomCarousel latestCars={relatedCarItem} />
            </div>
          </>)}
    </div>
  )
}

export default page

import { HeroHeader } from '@/components/HeroHeader';
import { SearchBar } from '@/components/SearchBar';
import Link from 'next/link';
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'
import Image from 'next/image';
import heroImg from "@/public/heroImg.jpg";
import { CustomCarousel } from '@/components/CustomCarousel';
import { SELECT_RECORD_SIZE } from '@/constant/constant';
import { getBrandName, getCarListing, getModelName } from '@/action/action';

export const dynamic = 'force-dynamic'
export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data } = await getCarListing()
  const brands = await getBrandName()
  const models = await getModelName()

  return (
    <>
      <div>
        <div className='items-center justify-between'>
          {/* <HeroHeader /> */}
          <div className="relative w-full h-96">
            {/* Image */}
            <Image
              src={heroImg}
              alt="Your Image"
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center flex-col px-8 space-y-8">
              <HeroHeader />
              <div className='w-full md:w-2/3'>
                <SearchBar brands={brands} models={models} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className='p-16 space-y-4 bg-white grow'>
        <Link href={`/cars`} className='hover:text-amber-500 text-2xl font-bold'>Latest Cars</Link>
        <CustomCarousel latestCars={data} />
      </section>
    </>
  )
}

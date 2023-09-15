import { SearchBar } from '@/components/SearchBar'
import React from 'react'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database, Tables } from '@/types/supabase'
import { CardWithImg } from '@/components/CardWithImg'
import { SELECT_RECORD_SIZE, SORT_LIST } from "@/constant/constant";
import { InfiniteScroll } from '@/components/InfiniteScroll'
import { getBrandName, getCarListing, getModelName } from '@/action/action'
import { searchParamsType } from '@/types/common'

export const dynamic = 'force-dynamic'
const Cars = async ({
  searchParams,
}: {
  searchParams: searchParamsType
}) => {
  const searchQuery = searchParams.search ?? ""
  const supabase = createServerComponentClient<Database>({ cookies })
  let carLists: Tables<'carlisting'>[] = []


  if (searchParams.isFilter === 'true') {
    const {
      brandid,
      modelid,
      min_price,
      max_price,
      min_year,
      max_year,
      sorter } = searchParams

    const num_brandid = Number(brandid)
    const num_modelid = Number(modelid)


    if (searchQuery.length > 0) {
      const { data } = await supabase.from('carlisting')
        .select()
        .ilike('carname', `%${searchQuery}%`)
        // .eq('brandid', num_brandid)
        .eq('modelid', num_modelid)
        .gte('price', Number(min_price))
        .lte('price', Number(max_price))
        .gte('year', Number(min_year))
        .lte('year', Number(max_year))
        .order(sorter === SORT_LIST[0] ? "create_dt" : 'price', {
          ascending: (sorter === SORT_LIST[0] || sorter === SORT_LIST[1])
            ? false
            : true
        })
        .range(0, SELECT_RECORD_SIZE)
      carLists = data || []
    } else {
      const { data } = await supabase.from('carlisting')
        .select()
        // .eq('brandid', num_brandid)
        .eq('modelid', num_modelid)
        .gte('price', Number(min_price))
        .lte('price', Number(max_price))
        .gte('year', Number(min_year))
        .lte('year', Number(max_year))
        .order(sorter === SORT_LIST[0] ? "create_dt" : 'price', {
          ascending: (sorter === SORT_LIST[0] || sorter === SORT_LIST[1])
            ? false
            : true
        })
        .range(0, SELECT_RECORD_SIZE)
      carLists = data || []
    }
  } else {
    if (searchQuery.length > 0) {
      const { data } = await supabase.from('carlisting')
        .select()
        .ilike('carname', `%${searchQuery}%`)
        .order("create_dt", { ascending: false })
        .range(0, SELECT_RECORD_SIZE)
      carLists = data || []
    } else {
      const { data } = await getCarListing()
      carLists = data || []
    }
  }


  const brands = await getBrandName()
  const models = await getModelName()

  return (
    <>
      <div className=' md:px-32 px-16 py-12 flex flex-col grow bg-[#f4fafa]'>
        <SearchBar brands={brands} models={models} />
        <div className={`mt-12 grow grid gap-3
        bg-[#f4fafa]
         grid-cols-1
         sm:grid-cols-2
           lg:grid-cols-3
           xl:grid-cols-4`}>
          {/* {
              carLists && carLists.map((car, idx) => (
                <CardWithImg carData={car} carThumb={car?.imagefilenames?.[0] || ""} key={idx} />
              ))
            } */}
          <InfiniteScroll searchParams={searchParams} carLists={carLists} />

        </div>
      </div>
    </>
  )
}
export default Cars
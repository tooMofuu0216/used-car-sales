import { SearchBar } from '@/components/SearchBar'
import React from 'react'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database, Tables } from '@/types/supabase'
import { CardWithImg } from '@/components/CardWithImg'
import { SELECT_RECORD_SIZE } from "@/constant/constant";

const Cars = async ({
  searchParams,
}: {
  searchParams: { search?: string }
}) => {
  const searchQuery = searchParams.search ?? ""
  const supabase = createServerComponentClient<Database>({ cookies })
  let carLists:Tables<'carlisting'>[] = []

  // console.log(searchQuery)
  if (searchQuery.length > 0) {
    const { data } = await supabase.from('carlisting')
      .select()
      .textSearch('carname', `${searchQuery}`)
      .order("create_dt")
      .limit(SELECT_RECORD_SIZE)
      carLists = data || []
  }else{
    const { data } = await supabase.from('carlisting')
      .select()
      .order("create_dt")
      .limit(SELECT_RECORD_SIZE)
      carLists = data || []
  }


  return (
    <>
      <div className=' md:px-32 px-16 py-12 flex flex-col grow'>
        <SearchBar />
        <div className={`mt-12 grow grid gap-3
         grid-cols-1
         sm:grid-cols-2
           lg:grid-cols-3
           xl:grid-cols-4`}>
          {
            carLists && carLists.map((car, idx) => (
              <CardWithImg carData={car} carThumb={car?.imagefilenames?.[0] || ""} key={idx} />
            ))
          }
        </div>
      </div>
    </>
  )
}
export default Cars
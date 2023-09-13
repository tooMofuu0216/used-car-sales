import { SearchBar } from '@/components/SearchBar'
import CarListingTable from '@/components/CarListingTable'
import { SELECT_RECORD_SIZE } from '@/constant/constant'
import { Database, Tables } from '@/types/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import React from 'react'

const page = async ({
    searchParams,
}: {
    searchParams: { search?: string }
}) => {
    const searchQuery = searchParams.search ?? ""
    const supabase = createServerComponentClient<Database>({ cookies })
    let carLists: Tables<'carlisting'>[] = []

    // console.log(searchQuery)
    if (searchQuery.length > 0) {
        const { data } = await supabase.from('carlisting')
            .select()
            .textSearch('carname', `${searchQuery}`)
            .order("create_dt")
            .limit(SELECT_RECORD_SIZE)
        carLists = data || []
    } else {
        const { data } = await supabase.from('carlisting')
            .select()
            .order("create_dt")
            .limit(SELECT_RECORD_SIZE)
        carLists = data || []
    }

    return (
        <>
            <div className='md:p-16'>
                <SearchBar />
            </div>

            <div className='p-4'>
                <CarListingTable tableData={carLists} />
            </div>
        </>
    )
}

export default page
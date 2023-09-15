import { SearchBar } from '@/components/SearchBar'
import CarListingTable from '@/components/CarListingTable'
import { SELECT_RECORD_SIZE } from '@/constant/constant'
import { Database, Tables, CarListingFormDT } from '@/types/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import React from 'react'
import { getBrandName, getModelName } from '@/action/action'
import { searchParamsType } from '@/types/common'



const page = async ({
    searchParams,
}: {
    searchParams: searchParamsType
}) => {
    const searchQuery = searchParams.search ?? ""
    const supabase = createServerComponentClient<Database>({ cookies })
    // let carLists: Tables<'carlisting'>[] = []
    let carLists: CarListingFormDT[] = []
    const { data: { user } } = await supabase.auth.getUser()

    if(!user) return
    if (searchQuery.length > 0) {
        const { data } = await supabase.from('carlisting')
            .select(`
            *,
            carbrand:brandid (brandname),
            carmodel:modelid (modelname)
            `)
            .ilike('carname', `%${searchQuery}%`)
            .eq(`userid`, user?.id)
            .order("create_dt", { ascending: false })
            .range(0, SELECT_RECORD_SIZE)
            .returns<CarListingFormDT[]>();
        carLists = data || []
    } else {
        const { data } = await supabase.from('carlisting')
            .select(`
            *,
            carbrand:brandid (brandname),
            carmodel:modelid (modelname)
            `)
            .eq(`userid`, user?.id)
            .order("create_dt", { ascending: false })
            .range(0, SELECT_RECORD_SIZE)
            .returns<CarListingFormDT[]>();
        carLists = data || []
    }
    const brands = await getBrandName()
    const models = await getModelName()

    return (
        <>
            <div className='md:p-16 bg-[#ebfcfb]'>
                <SearchBar brands={brands} models={models} />
            </div>

            <div className='p-4 bg-[#ebfcfb]'>
                <CarListingTable searchParams={searchParams} brands={null} tableData={carLists} />
            </div>
        </>
    )
}

export default page
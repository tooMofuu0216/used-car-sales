"use server";

import { SELECT_RECORD_SIZE, SORT_LIST } from "@/constant/constant";
import { searchParamsType } from "@/types/common";
import { CarListingFormDT, Database, Tables } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getCarListing } from "./action";

export async function fetchCars(page: number, searchParams: searchParamsType) {
    let carLists: Tables<'carlisting'>[] = []
    const searchQuery = searchParams.search ?? ""
    try {
        const supabase = createServerComponentClient<Database>({ cookies })

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
                    .range(page * SELECT_RECORD_SIZE, page * SELECT_RECORD_SIZE + SELECT_RECORD_SIZE)
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
                    .range(page * SELECT_RECORD_SIZE, page * SELECT_RECORD_SIZE + SELECT_RECORD_SIZE)
                carLists = data || []
            }
        } else {
            if (searchQuery.length > 0) {
                const { data } = await supabase.from('carlisting')
                    .select()
                    .ilike('carname', `%${searchQuery}%`)
                    .order("create_dt", { ascending: false })
                    .range(page * SELECT_RECORD_SIZE, page * SELECT_RECORD_SIZE + SELECT_RECORD_SIZE)
                carLists = data || []
            } else {
                const { data } = await supabase.from('carlisting')
                    .select()
                    .order("create_dt", { ascending: false })
                    .range(page * SELECT_RECORD_SIZE, page * SELECT_RECORD_SIZE + SELECT_RECORD_SIZE)
                carLists = data || []
            }
        }
    } catch (err) {
        console.error(err)
    } finally {
        return carLists
    }
}

export async function fetchListings(page: number, searchParams: searchParamsType) {
    let carLists: CarListingFormDT[] = []
    const searchQuery = searchParams.search ?? ""
    const supabase = createServerComponentClient<Database>({ cookies })

    try {
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
                .range(page * SELECT_RECORD_SIZE, page * SELECT_RECORD_SIZE + SELECT_RECORD_SIZE)
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
                .range(page * SELECT_RECORD_SIZE, page * SELECT_RECORD_SIZE + SELECT_RECORD_SIZE)
                .returns<CarListingFormDT[]>();
            carLists = data || []
        }
    } catch (err) {
        console.error(err)
    }finally{
        return carLists
    }
}
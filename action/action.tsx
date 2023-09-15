import { SELECT_RECORD_SIZE } from "@/constant/constant";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic'
const supabase = createServerComponentClient<Database>({ cookies })

export const getBrandName = async () => {
    const { data } = await supabase.from('carbrand')
        .select()
        .order("brandname")
    return data
}

export const getModelName = async () => {
    const { data } = await supabase.from('carmodel')
        .select()
        .order("modelname")
    return data
}

export const getCarListing = async () => {
    const res = await supabase.from('carlisting')
    .select()
    .order("create_dt", { ascending: false })
    .range(0, SELECT_RECORD_SIZE)
    return res
}
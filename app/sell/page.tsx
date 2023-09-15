import { getBrandName } from '@/action/action'
import { CarListingForm } from '@/components/CarListingForm'
import { SELL_FORM } from '@/constant/constant'
import { Database } from '@/types/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import React from 'react'
import { BsCardChecklist, BsHandIndex, BsPencil } from 'react-icons/bs'
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic'
const Sell = async () => {
    const supabase = createServerComponentClient<Database>({ cookies })
    const brands = await getBrandName()
    const { data: { user } } = await supabase.auth.getUser()
    if(!user) return
    return (
        <div className='p-16 m-auto space-y-8 '>
            <div className='flex gap-8'>
                <div className='flex flex-col space-y-4'>
                    <div className="m-auto">
                        <BsPencil size={48} />
                    </div>
                    <p>1. Register Car Info</p>
                </div>
                <div className='flex flex-col space-y-4'>
                    <div className="m-auto">
                        <BsCardChecklist size={48} />
                    </div>
                    <p>2. Car Listed On Here</p>
                </div>
                <div className='flex flex-col space-y-4'>
                    <div className="m-auto">
                        <BsHandIndex size={48} />
                    </div>
                    <p>3. Wait For Buyer</p>
                </div>
            </div>
            <CarListingForm brands={brands} type={SELL_FORM} />
        </div>
    )
}

export default Sell
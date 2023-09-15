import CustomNavBar from './CustomNavBar'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'
export default async function Layout({ children }: {
    children: React.ReactNode
}) {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    return (
        <>
            <CustomNavBar  />
            <main>{children}</main>
            <div>footer</div>
        </>
    )
}
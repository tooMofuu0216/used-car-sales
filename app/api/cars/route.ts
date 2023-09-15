import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { CarListingFormDT, Database, Tables, UpdateTables } from '@/types/supabase'
import { IMG_BUCKET_NAME } from '@/constant/constant'

export const dynamic = 'force-dynamic'

type carListing = {
  brandid?: number | null
  carname: string
  cc?: string | null
  create_dt?: string | null
  fuel?: string | null
  imagefilenames?: string[] | null
  keyfeatures?: string | null
  listingid?: never
  mileageinfo?: string | null
  modelid?: number | null
  price?: number | null
  seller_name?: string | null
  seller_phone?: string | null
  updated_at?: string | null
  userid?: string | null
  videofilenames?: string[] | null
  year?: number | null
  model?: string
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies })
  const formData = await request.formData();

  try {
    const { data: { user } } = await supabase.auth.getUser()
    const dataBody = formData.get("data") as string;
    const carListing: carListing = JSON.parse(dataBody);

    if (!carListing.model) throw new Error(`no Model!`)


    //get existing model id from model name, else insert it
    const model = await supabase.from('carmodel')
      .select()
      .textSearch(`modelname`, carListing.model || `?`)

    if (model.data && model.data.length === 1) {
      carListing.modelid = model.data[0].modelid || -1
    } else {
      const { data, error } = await supabase.from('carmodel').insert({
        modelname: carListing.model,
        brandid: carListing.brandid
      }).select()
      if (error) throw error
      carListing.modelid = data?.[0]?.modelid || -1
    }


    carListing.carname = `${carListing.year} ${carListing.model}`
    carListing.userid = user?.id || null
    carListing.year = Number(carListing.year)
    carListing.brandid = Number(carListing.brandid)
    carListing.price = Number(carListing.price)
    carListing.imagefilenames = carListing.imagefilenames?.map(el => `${Date.now()}_${el}`)
    delete carListing.model
    delete carListing.listingid
    delete carListing.create_dt
    delete carListing.updated_at

    const { data, error } = await supabase.from('carlisting').insert(carListing).select()
    if (error) {
      await supabase.from('carmodel').delete().eq('modelid', carListing.modelid)
      throw error
    }
    const carlistingRow = data

    //insert img
    if (carListing.imagefilenames) {
      for (const idx in carListing.imagefilenames) {
        const { data, error } = await supabase
          .storage
          .from(IMG_BUCKET_NAME)
          .upload(`${carListing.imagefilenames[idx]}`, formData.get(`imagefileData${idx}`) as Blob, {
            cacheControl: '3600',
            upsert: false
          })
        if (error) {
          const res = await supabase.from('carmodel').delete().eq('modelid', carListing.modelid).select()
          const res2 = await supabase.from('carlisting').delete().eq('listingid', carlistingRow[0].listingid).select()
          throw error
        }
      }
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error(`error:`, error)
    return NextResponse.json(error, { status: 500 })
  }
}

// export async function GET(request: Request){
// //   const { count } = await request.json()
//   const supabase = createRouteHandlerClient<Database>({ cookies })
//   const { data } = await supabase.from('carlisting')
//     .select()
//     .order("create_dt")
//     .limit(10)
//   return NextResponse.json(data)
// }

export async function DELETE(request: Request) {
  const { listingid } = await request.json()
  const supabase = createRouteHandlerClient<Database>({ cookies })
  if (!listingid) throw new Error(`No listingID!`)

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const row = await supabase.from('carlisting')
        .select()
        .eq(`userid`, user?.id)
        .eq(`listingid`, listingid).single()

      if (row.data) {
        // remove image
        if (row.data.imagefilenames) {
          const { error ,data} = await supabase
            .storage
            .from(IMG_BUCKET_NAME).remove(row.data.imagefilenames)
          if (error) throw error
        }

        const { error, data, status } = await supabase.from('carlisting')
          .delete()
          .eq(`userid`, user?.id)
          .eq(`listingid`, listingid)
          .single()
        if (error) throw error;
        return new Response(data, { status: 204 })
      }

    }
    return NextResponse.json({}, { status: 500 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(err, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const formData = await request.formData();
  const supabase = createRouteHandlerClient<Database>({ cookies })

  try {
    const { data: { user } } = await supabase.auth.getUser()
    const dataBody = formData.get("data") as string;
    const carListing: UpdateTables<'carlisting'> = JSON.parse(dataBody);

    if (user && carListing.listingid) {
      const row = await supabase.from('carlisting')
        .select()
        .eq(`userid`, user?.id)
        .eq(`listingid`, carListing.listingid).single()

      const listingid = carListing.listingid
      const updateObj = {
        seller_phone: carListing.seller_phone,
        seller_name: carListing.seller_name,
        price: carListing.price,
        year: carListing.year,
        cc: carListing.cc,
        fuel: carListing.fuel,
        keyfeatures: carListing.keyfeatures,
      }


      if (row.data) {
        const { error } = await supabase.from('carlisting')
          .update(updateObj)
          .eq(`userid`, user?.id)
          .eq(`listingid`, listingid)
          .single()
        if (error) throw error;
        return NextResponse.json({msg:"Update Success!"}, { status: 200 })
      }
    }
    return NextResponse.json({msg:"Invalid!"}, { status: 500 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(err, { status: 500 })
  }
}
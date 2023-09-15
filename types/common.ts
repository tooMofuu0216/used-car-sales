import { Dispatch, SetStateAction } from "react"

export type resultAndformModalControlProp = {
    isLoading:boolean
    setIsLoading:Dispatch<SetStateAction<boolean>>
    showModal:boolean
    setShowModal:Dispatch<SetStateAction<boolean>>
    msgText:string
    setMsgText:Dispatch<SetStateAction<string>>
    setOpenModal:Dispatch<SetStateAction<boolean>>
}

export type filterObj = {
    brandid: number | null
    modelid: number | null
    min_price: string | null
    max_price: string | null
    min_year: number | null
    max_year: number | null
    sorter: string
}

export type searchParamsType = {
    search?: string
    brandid?: string
    modelid?: string
    min_price?: string
    max_price?: string
    min_year?: string
    max_year?: string
    sorter?: string
    isFilter?: string
  }
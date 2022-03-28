import { IArray } from "./interfaces"

export type IIsValidCheckout = IArray | undefined | never
export type TError = { message: string | null; isSeeOPtion: boolean }

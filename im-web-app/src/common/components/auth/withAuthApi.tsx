import { AxiosInstance } from "axios"
import React from "react"
import useAuthApi from "./useAuthApi"

export interface AuthAxiosInstance {
  authApi: AxiosInstance
}


export const withAuthApi = <T extends AuthAxiosInstance>(Component: React.ComponentType<T>) => ({ ...props }: Omit<T, "authApi">) => {
  const { authApi } = useAuthApi()

  if(!authApi) return <></>

  return <Component {...props as T } authApi={authApi} />
}
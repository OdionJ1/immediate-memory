import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { globalConstants } from '../../../global-constants'
import axios, { AxiosInstance } from 'axios'


const useAuthApi = () => {

  const [cookies] = useCookies()
  const [authApi, setAuthApi] = useState<AxiosInstance | null>(null)

  useEffect(() => {
    const sessionId = cookies['sessionId'] as string | null

    // if(!sessionId){
    //   endUserSession()
    // }

    const api = axios.create({
      baseURL: globalConstants.baseUrl,
      headers: {
        Authorization: `Bearer ${sessionId}`
      }
    })

    setAuthApi(Object.assign({}, api))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    authApi
  }
}

export default useAuthApi
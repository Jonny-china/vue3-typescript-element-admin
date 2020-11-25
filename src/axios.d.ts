/* eslint-disable @typescript-eslint/no-empty-interface */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from 'axios'

export interface Response<T> {
  code: string
  data: T
  message: string
}

declare module 'axios' {
  export interface AxiosResponse<T = any> extends Promise<Response<T>> {}
}

import axios, { AxiosInstance } from "axios";
import { SignUpFormType } from "../models/signupFormType";
import { globalConstants } from "../global-constants";
import { User } from "../models/user";


export const createUser = async (user: SignUpFormType) => {
  return await axios.post(`${globalConstants.baseUrl}/user/signup`, { user })
}

export const login = async (email: string, password: string) => {
  return await axios.post(`${globalConstants.baseUrl}/user/login`, { email, password })
}

export const getUserByToken = async (authApi: AxiosInstance) => {
  return await authApi.get(`${globalConstants.baseUrl}/user/getUserByToken`)
}

export const updateUser = async (authApi: AxiosInstance, userToUpdate: User) => {
  try {
    await authApi.post(`${globalConstants.baseUrl}/user/update`, { userToUpdate })
  } catch (err) {
    
  }
}

export const googleLogin = async (googleUser: User) => {
  return await axios.post(`${globalConstants.baseUrl}/user/googleLogin`, { googleUser })
}
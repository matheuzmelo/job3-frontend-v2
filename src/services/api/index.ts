import axios from "axios";
import { errorInterceptor, requestInterceptor, responseInterceptor } from "./interceptors";
import { Environment } from "../../environment";

const baseUrl = Environment.BASE_URL

if (!baseUrl) throw new Error('base url não definido')

const Api = axios.create({
  baseURL: baseUrl
})

Api.interceptors.request.use(
  (config) => requestInterceptor(config),
  (error) => errorInterceptor(error)
);

Api.interceptors.response.use(
  (response) => responseInterceptor(response),
  (error) => errorInterceptor(error)
);

export default Api;
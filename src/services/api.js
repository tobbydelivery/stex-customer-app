import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API = axios.create({
  baseURL: "https://tobby-delivery-backend.onrender.com/api",
  timeout: 30000,
});

// Request interceptor
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor with retry logic
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Retry up to 3 times on network errors or 500s
    if (!config._retryCount) config._retryCount = 0;

    if (
      config._retryCount < 3 &&
      (!error.response || error.response.status >= 500)
    ) {
      config._retryCount += 1;
      const delay = config._retryCount * 1500;
      console.log(`🔄 Retrying request... attempt ${config._retryCount}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return API(config);
    }

    // Handle 401 - token expired
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default API;
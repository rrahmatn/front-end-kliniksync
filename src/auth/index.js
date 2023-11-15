// authService.js

import axios from "axios";
import { useCookies } from "react-cookie";
import { useAccessToken } from "../state";

const refreshAccessToken = async () => {
  // Ambil refresh token dari cookies
  const [cookies] = useCookies(["refreshToken"]);
  const refreshToken = cookies.refreshToken;
  const [token, setToken] = useAccessToken();

  // Jika refresh token tidak ada, kembalikan null
  if (!refreshToken) {
    return null;
  }

  try {
    // Panggil endpoint refresh token di server menggunakan Axios
    const response = await axios.post(
      "http://localhost:3333/refresh-token",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    // Jika status tidak ok, lempar error
    if (response.status !== 200) {
      throw new Error("Failed to refresh token");
    }

    // Ambil access token dari response
    const newAccessToken = response.data.access_token;

    // Simpan access token baru di cookies (opsional)
    // const [_, setCookie] = useCookies(['accessToken']);
    // setCookie('accessToken', newAccessToken, { path: '/' });
    setToken(newAccessToken);
    // Kembalikan access token baru
    console.log(token)
    return newAccessToken;
  } catch (error) {
    // Handle kesalahan selama proses refresh token
    console.error("Error refreshing token:", error);
    throw error;
  }
};

export default refreshAccessToken;

import axios from "axios";
import React from "react";

export const axiosApi = async ( url, data, token ) => {
  console.log({url, data, token });
  try {
    const api = await axios({
      method: "PATCH",
      url: url,
      data: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(api); // Logging the response here

    return api;
  } catch (error) {
    console.error("Error in axiosApi:", error);
    throw error; // Re-throw the error to handle it in the calling code
  }
};


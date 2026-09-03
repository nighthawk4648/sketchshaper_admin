// hooks.js

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// export const useSliderDelete = (apiUrl) => {
const addContent = async (newData, endpoint, reset, setIsLoading, accessToken) => {

    try {
        setIsLoading(true);
        const response = await fetch(
            `${import.meta.env.VITE_LOCAL_API_URL}/${endpoint}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Assuming the API accepts JSON
                    Authorization: `${accessToken}`
                },
                body: JSON.stringify(newData),
            }
        );
        console.log("response", response);
        const data = await response.json();
        console.log("data", data);
        if (response.ok) {
            toast.success(data?.message);
            setIsLoading(false);
            // Reset the form after successful submission
            reset();
        } else {
            toast.error(data?.message || "Failed to add content");
            setIsLoading(false);
        }
    } catch (error) {
        console.error("Error deleting slider:", error);
    }
};

//   return { deleteSlider };
// };

export default addContent;

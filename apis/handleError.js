
const handleError = (error) => {
    console.log("API Error: ", error);
    return {
        error: true,
        message: error?.response?.data?.message || "Đã có lỗi xảy ra"
    };
};

export { handleError }
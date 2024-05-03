const callApi = async (URL, params) => {
    try {
        const res = await fetch(URL, {...params})
        return res.json()
    } catch (error) {
        throw new Error(error)
    }
}

export default callApi;
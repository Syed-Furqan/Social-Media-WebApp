const callApi = async (URL, token) => {
    try {
        console.log(URL)
        const res = await fetch(URL, {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${token}`
            }
        })
        const data = await res.json()
        console.log(data)
        return data
    } catch (error) {
        throw new Error(error)
    }
}

export default callApi;
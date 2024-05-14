export const callGetApi = async (path, token) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/${path}`, {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${token}`
            }
        })
        const data = await res.json()
        return data
    } catch (error) {
        throw new Error(error)
    }
}

export const callPostApi = async (path, token, body, method) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/${path}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })
        const data = await res.json()
        return data
    } catch (error) {
        throw new Error(error)
    }
}
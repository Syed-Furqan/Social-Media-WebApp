import { useEffect, useState } from "react";
import { useUserContext } from "../Context/UserContext";

const useApi = async (URL, init_value, method, body) => {

    const { user } = useUserContext()

    const [data, setData] = useState(init_value)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetch(URL, {
            method,
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${user.token}`
            },
            body,
        })
        .then(res => res.json())
        .then(data => {
            setLoading(false)
            setData(data)
        }).catch(err => {
            console.error(err)
            setLoading(false)
        })
    }, [URL])

    return { data, loading }
}

export default useApi;
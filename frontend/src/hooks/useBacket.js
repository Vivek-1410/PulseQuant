import { useEffect, useState } from "react";

import { fetchBacktest } from "../services/api";

function useBacktest(){

    const [summary,setSummary]=useState(null);

    const [loading,setLoading]=useState(true);

    useEffect(()=>{

        fetchBacktest()

        .then(data=>{

            setSummary(data);

            setLoading(false);

        });

    },[]);

    return {

        summary,

        loading

    };

}

export default useBacktest;
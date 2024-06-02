import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup=()=>{
    const [error,setError]=useState(null);
    const {dispatch}=useAuthContext();

    const signup=async(email,password)=>{
        setError(null);

        const response=await fetch("http://localhost:4000/api/admin/signup",{
            method:'POST',
            headers:{'content-type':'application/json'},
            body:JSON.stringify({email,password})
        })

        const json=await response.json();

        if(!response.ok){
            setError(json.error);
        }
        if(response.ok){
            localStorage.setItem('admin',JSON.stringify(json));

            dispatch({type:'LOGIN',payload:json})


        }
    }

    return {signup,error};
}
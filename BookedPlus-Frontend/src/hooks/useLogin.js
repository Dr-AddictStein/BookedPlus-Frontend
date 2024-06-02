import { useEffect, useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { Navigate, useNavigate } from 'react-router-dom';

export const useLogin=()=>{
    const [error,setError]=useState(null);
    const {dispatch}=useAuthContext();
    const navigate=useNavigate();

    const {user} = useAuthContext();

    
    useEffect(()=>{
        if(user){
            navigate("/665bc136ca6d454ec0f5eed5");
        }
        
    })


    const login=async(email,password)=>{
        setError(null);

        const response=await fetch("http://localhost:4000/api/admin/login",{
            method:'POST',
            headers:{'content-type':'application/json'},
            body:JSON.stringify({email,password})
        })

        const json=await response.json();

        if(!response.ok){
            setError(json.error);
        }
        if(response.ok){
            localStorage.setItem('user',JSON.stringify(json));

            dispatch({type:'LOGIN',payload:json})

            
            
        }
    }
    
    return {login,error};
}
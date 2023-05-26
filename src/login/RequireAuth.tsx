import { useContext } from "react"

import { LoginContext } from "./LoginContext";
import { Home } from "../pages/Home";

export function RequireAuth({children}: {children: JSX.Element}) {

    const auth = useContext(LoginContext);

    
    if(!auth.user){
        //console.log('a')
        return <Home/>
    } 

    return children
}
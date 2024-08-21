
import { useEffect, useState } from "react";
import useAuth from "./useAuth";


type Departement = {
    id : number
    name : string
}

type Role = {
    id : number
    name : string
    departement : Departement
}

type CurrentUser = {
    id : number
    email : string
    phone_number :number
    name : string
    username : string
    phone : string
    role : Role
}


export function useSession()  {
    const { fetchCurrentUser } : any = useAuth() 
    const [ currentUser, setCurrentUser ] = useState<CurrentUser>()
    
    useEffect(() => {
        fetchCurrentUser().then((data : CurrentUser) => setCurrentUser(data))
    }, [])
    
    return {
        session : currentUser,
        loading : !currentUser && !fetchCurrentUser
    }
}
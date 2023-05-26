import { createContext, useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";

interface AuthContextProps {
    user: UserProps | null;
    signin: (username: string, password: string) => Promise<boolean>
    signout: () => void  
}
  
interface UserProps {
    id:        String 
    name:      String
    password:  String
    created_at:String  
    completedTasks: number
}

export const LoginContext = createContext<AuthContextProps>(null!);

export const AuthProvider = ({children}: { children: JSX.Element }) => {
    const [user, setUser] = useState<UserProps | null>(null)

    const api = useApi();

    useEffect(() => {
        const validateToken = async ()=> {
            const storageData = localStorage.getItem('authToken')

            if(storageData){          
                const data = await api.validateToken(storageData);
                if(data.user){
                  setUser(data.user)
                }
            }
        }
        validateToken();
    }, [])

    const signin = async (email: string, password: string) => {
      
        const data = await api.signin(email, password);
        
        if(data?.user){
          setUser(data.user)
          setToken(data.token)
          return true
        }
        return false
    }

    const signout = async () => {
        await api.signout();
        setUser(null)
        setToken('')
      }

    const setToken = (token: string) => {
        localStorage.setItem('authToken', token)
    }

    return(
        
        <LoginContext.Provider value={{ user, signin, signout }}>
          {children}
        </LoginContext.Provider>
          
    );
}
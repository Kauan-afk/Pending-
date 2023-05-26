import '../styles/Home.scss'
import homeSvg from '../images/homeSvg.svg'
import createAccountSvg from '../images/createAccountSvg.svg'

import * as Toast from '@radix-ui/react-toast';

import {  useNavigate } from 'react-router-dom';

import { FormEvent, ChangeEvent, useState, useContext} from 'react';
import { LoginContext } from '../login/LoginContext';
import axios from 'axios';

export function Home() {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    const [openToast, setOpenToast] = useState(false);

    const auth = useContext(LoginContext)

    const navigate = useNavigate();

    function slideCreateAccont(e: FormEvent) {
        e.preventDefault();
        const createAccountPage = document.getElementById('mainCreateAccount')
        
        if(createAccountPage){
            createAccountPage.style.width = '100%';
        }
    }

    function closeCreateAccount(e: FormEvent) {
        e.preventDefault();

        const createAccountPage = document.getElementById('mainCreateAccount')
        
        if(createAccountPage){
            createAccountPage.style.width = '0';
        }
    }

    function handleNameInput(e: ChangeEvent<HTMLInputElement>){
        setName(e.target.value)
    }

    function handlePasswordInput(e: ChangeEvent<HTMLInputElement>){
        setPassword(e.target.value)
    }

    async function handleLogin(event: FormEvent) {
        event.preventDefault();

        if(name && password){
            const isLogged = await auth.signin(name, password)

            if(isLogged) {
                navigate('/')
            }
        }
    }

    async function handleCreateUser(e: FormEvent) {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement)
        const data = Object.fromEntries(formData)

        try {
            await axios.post(`http://localhost:3333/newUser`, {
                name: data.name,
                username: data.username,
                password: data.password
            })

            setOpenToast(true)
        } catch {
            alert('Informações invalidas!')
        }
    }

    return (
        <div>
            <div className="mainHome">

                <div className="leftContentHome">
                    <img src={homeSvg} alt="" />
                </div>
                <div className="rightContentHome">
                    <div className='login'>
                        <h3>Sign In</h3>
                        <form onSubmit={handleLogin} className='formLogin' autoComplete='off'>
                            <p>Username</p>
                            <input onChange={handleNameInput} type="text" />
                            <p>Password</p>
                            <input onChange={handlePasswordInput} type="password" />
                            <input type="submit" value="submit" />
                            <span>or</span>
                            <button onClick={slideCreateAccont} className='createAccountButton'>Create Account</button>
                        </form>
                    </div>
                </div>
            </div>

            <div id='mainCreateAccount' className='mainCreateAccount'>
                <div className='leftContentCreateAccount'>
                    <div className='createAccount'>
                        <h3>Sign Up</h3>
                        <form onSubmit={handleCreateUser} className='formCreateAccount' autoComplete='off'>
                            <p>Name</p>
                            <input name='name' type="text" />
                            <p>Username</p>
                            <input name='username' type="text" />
                            <p>Password</p>
                            <input name='password' type="password" />
                            <input type="submit" value="submit" />
                            <span>or</span>
                            <button onClick={closeCreateAccount} className='signInButton'>Sign In</button>
                        </form>
                    </div>
                </div>
                <div className='rightContentCreateAccount'>
                    <img src={createAccountSvg} alt="" />
                </div>
            </div>

            <Toast.Provider swipeDirection="right">
                <Toast.Root className="ToastRoot" open={openToast} onOpenChange={setOpenToast}>
                <Toast.Title className="ToastTitle">Account created successfully</Toast.Title>
                <Toast.Description asChild>
                    <p className='description'>Welcome ;)</p> 
                </Toast.Description>
                <Toast.Action className="ToastAction" asChild altText="Account created successfully ;)">
                    <button className='buttonToast' onClick={closeCreateAccount}>Sign In</button>
                </Toast.Action>
                </Toast.Root>
                <Toast.Viewport className="ToastViewport" />
            </Toast.Provider>
       </div>
    )
}
import { AuthProvider } from './login/LoginContext'
import { RequireAuth } from './login/RequireAuth'

import { Main } from './pages/Main' 

import './styles/Home.scss'

import { Route, BrowserRouter, Routes } from 'react-router-dom'


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<RequireAuth><Main /></RequireAuth>} />
        </Routes>
        </AuthProvider>
    </BrowserRouter>
  )
}

export default App

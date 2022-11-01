import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"
import useAuth from "../hooks/useAuth"

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [alerta, setAlerta] = useState({})

    const { auth, setAuth } = useAuth()

    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()

        setAlerta({error: false})

        if([email, password].includes('')) {
            setAlerta({
                error: true,
                msg: 'Todos los campos son obligatorios'
            })
            return
        }

        try {
            const { data } = await clienteAxios.post(`/usuarios/login`, { email, password })
            
            localStorage.setItem('token', data.token)
            setAuth(data)

            setAlerta({
                error: false,
                msg: data.msg
            })

            setEmail('')
            setPassword('')

            navigate('/proyectos')

        } catch (error) {
            console.log(error)
            setAlerta({
                error: true,
                msg: error.response.data.msg
            })
        }
    }

  return (
    <>
        <h1 className='text-sky-600 font-black text-6xl'>Inicia sesión y administra tus <span className='text-slate-700'>proyectos</span></h1>

        <form className='my-10 bg-white shadow rounded-lg p-10' onSubmit={handleSubmit}>
            <div className='my-5'>
                <label htmlFor='email' className='uppercase text-gray-600 block text-xl font-bold'>Email</label>
                <input id='email' type="email" name="email" placeholder='Email de registro' value={email} onChange={e => setEmail(e.target.value)} className='w-full mt-3 p-3 border rounded-lg bg-gray-50' />
            </div>
            <div className='my-5'>
                <label htmlFor='password' className='uppercase text-gray-600 block text-xl font-bold'>Contraseña</label>
                <input id='password' type="password" name="password" placeholder='Contraseña de registro' value={password} onChange={e => setPassword(e.target.value)} className='w-full mt-3 p-3 border rounded-lg bg-gray-50' />
            </div>

            {alerta.msg && <Alerta alerta={alerta} />}

            <input type="submit" value="Iniciar sesión" className='bg-sky-700 w-full py-3 text-white uppercase font-bold rounded cursor-pointer hover:bg-sky-800 transition-colors mb-5' />
        </form>

        <nav className='lg:flex lg:justify-between'>
            <Link to="registro" className="block my-5 text-slate-500 uppercase text-sm">¿No tienes una cuenta? Regístrate</Link>
            <Link to="olvide-password" className="block my-5 text-slate-500 uppercase text-sm">Olvidé mi contraseña</Link>
        </nav>
    </>
  )
}

export default Login
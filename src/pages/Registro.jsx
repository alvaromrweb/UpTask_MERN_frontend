import { Link } from "react-router-dom"
import { useState } from "react"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"

const Registro = () => {
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')
    const [alerta, setAlerta] = useState({})

    const handleSubmit = async e => {
        e.preventDefault()
        setAlerta({error: false})

        if([nombre, email, password, confPassword].includes('')) {
            setAlerta({
                error: true,
                msg: 'Todos los campos son obligatorios'
            })
            return
        }

        if (password !== confPassword) {
            setAlerta({
                error: true,
                msg: 'Las contraseñas no coinciden'
            })
            return
        }

        if (password.length < 6) {
            setAlerta({
                error: true,
                msg: 'La contraseña es muy corta, agrega mínimo 6 caracteres'
            })
            return
        }

        // Crear el usuario en la APi

        try {
            const { data } = await clienteAxios.post(`/usuarios`, { nombre, email, password })
            console.log(data)
            setAlerta({
                error: false,
                msg: data.msg
            })

            setNombre('')
            setEmail('')
            setPassword('')
            setConfPassword('')

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
        <h1 className='text-sky-600 font-black text-6xl'>Crea tu cuenta y administra tus <span className='text-slate-700'>proyectos</span></h1>

        <form className='my-10 bg-white shadow rounded-lg p-10' onSubmit={handleSubmit}>
            <div className='my-5'>
                <label htmlFor='nombre' className='uppercase text-gray-600 block text-xl font-bold'>Nombre</label>
                <input id='nombre' type="text" name="nombre" placeholder='Nombre de registro' className='w-full mt-3 p-3 border rounded-lg bg-gray-50' value={nombre} onChange={e => setNombre(e.target.value)} />
            </div>
            <div className='my-5'>
                <label htmlFor='email' className='uppercase text-gray-600 block text-xl font-bold'>Email</label>
                <input id='email' type="email" name="email" placeholder='Email de registro' className='w-full mt-3 p-3 border rounded-lg bg-gray-50' value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className='my-5'>
                <label htmlFor='password' className='uppercase text-gray-600 block text-xl font-bold'>Contraseña</label>
                <input id='password' type="password" name="password" placeholder='Contraseña de registro' className='w-full mt-3 p-3 border rounded-lg bg-gray-50' value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className='my-5'>
                <label htmlFor='confirmar-password' className='uppercase text-gray-600 block text-xl font-bold'>Repetir contraseña</label>
                <input id='confirmar-password' type="password" name="confirmar-password" placeholder='Contraseña de registro' className='w-full mt-3 p-3 border rounded-lg bg-gray-50' value={confPassword} onChange={e => setConfPassword(e.target.value)} />
            </div>

            {alerta.msg && <Alerta alerta={alerta} />}

            <input type="submit" value="Crear cuenta" className='bg-sky-700 w-full py-3 text-white uppercase font-bold rounded cursor-pointer hover:bg-sky-800 transition-colors mb-5' />
        </form>

        <nav className='lg:flex lg:justify-between'>
            <Link to="/" className="block my-5 text-slate-500 uppercase text-sm">¿Ya tienes una cuenta? Inicia sesión</Link>
            <Link to="/olvide-password" className="block my-5 text-slate-500 uppercase text-sm">Olvidé mi contraseña</Link>
        </nav>
    </>
  )
}

export default Registro
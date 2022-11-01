import { Link } from "react-router-dom"
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"
import { useState } from "react"

const OlvidePassword = () => {

  const [email, setEmail] = useState('')
  const [alerta, setAlerta] = useState({})

  const handleSubmit = async e => {
    e.preventDefault()
    setAlerta({error: false})

    if(email === '') {
      setAlerta({
          error: true,
          msg: 'Todos los campos son obligatorios'
      })
      return
    }

    try {
        const { data } = await clienteAxios.post(`/usuarios/olvide-password`, { email })
        console.log(data)
        setAlerta({
            error: false,
            msg: data.msg
        })

        setEmail('')
        
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
        <h1 className='text-sky-600 font-black text-6xl'>Recupera tu <span className='text-slate-700'>contraseña</span></h1>

        <form className='my-10 bg-white shadow rounded-lg p-10' onSubmit={handleSubmit}>
            <div className='my-5'>
                <label htmlFor='email' className='uppercase text-gray-600 block text-xl font-bold'>Email</label>
                <input id='email' type="email" name="email" placeholder='Email de registro' className='w-full mt-3 p-3 border rounded-lg bg-gray-50' value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            {alerta.msg && <Alerta alerta={alerta} />}

            <input type="submit" value="Enviar instrucciones" className='bg-sky-700 w-full py-3 text-white uppercase font-bold rounded cursor-pointer hover:bg-sky-800 transition-colors mb-5' />
        </form>

        <nav className='lg:flex lg:justify-between'>
            <Link to="/" className="block my-5 text-slate-500 uppercase text-sm">¿Ya tienes una cuenta? Inicia sesión</Link>
            <Link to="/registro" className="block my-5 text-slate-500 uppercase text-sm">¿No tienes una cuenta? Regístrate</Link>
        </nav>
    </>
  )
}

export default OlvidePassword
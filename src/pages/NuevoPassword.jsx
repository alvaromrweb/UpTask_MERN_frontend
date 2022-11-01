import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import clienteAxios from "../config/clienteAxios";
import Alerta from "../components/Alerta";

const NuevoPassword = () => {

    const { token } = useParams();

    const [tokenValid, setTokenValid] = useState(false)
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')
    const [alerta, setAlerta] = useState({})

    useEffect(() => {
      const checkToken = async () => {
        try {
            const { data } = await clienteAxios(`/usuarios/olvide-password/${token}`)
            console.log(data)
            setTokenValid(true)
            
        } catch (error) {
            console.log(error)
            setAlerta({
                error: true,
                msg: error.response.data.msg
            })
        }
      }
      checkToken()
    }, [])

    const handleSubmit = async e => {
        e.preventDefault()

        if([password, confPassword].includes('')) {
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

        try {
            const { data } = await clienteAxios.post(`/usuarios/olvide-password/${token}`, { password })
            console.log(data)
            setAlerta({
                error: false,
                msg: data.msg
            })

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
        
        {!tokenValid ? (
            <Alerta alerta={alerta} />
        ) : (
            <div>
                <h1 className='text-sky-600 font-black text-6xl'>Reestablece tu <span className='text-slate-700'>contraseña</span></h1>
                <form className='my-10 bg-white shadow rounded-lg p-10' onSubmit={handleSubmit}>
                    <div className='my-5'>
                        <label htmlFor='password' className='uppercase text-gray-600 block text-xl font-bold'>Nueva contraseña</label>
                        <input id='password' type="password" name="password" placeholder='Nueva contraseña' value={password} onChange={e => setPassword(e.target.value)} className='w-full mt-3 p-3 border rounded-lg bg-gray-50' />
                    </div>
                    <div className='my-5'>
                        <label htmlFor='confirmar-password' className='uppercase text-gray-600 block text-xl font-bold'>Repetir contraseña</label>
                        <input id='confirmar-password' type="password" name="confirmar-password" placeholder='Repetir contraseña' value={confPassword} onChange={e => setConfPassword(e.target.value)} className='w-full mt-3 p-3 border rounded-lg bg-gray-50' />
                    </div>
                    {alerta.msg && <Alerta alerta={alerta} />}
                    <input type="submit" value="Guardar contraseña" className='bg-sky-700 w-full py-3 text-white uppercase font-bold rounded cursor-pointer hover:bg-sky-800 transition-colors mb-5' />
                </form>
                <nav className='lg:flex lg:justify-between'>
                    <Link to="/" className="block my-5 text-slate-500 uppercase text-sm">¿Ya tienes una cuenta? Inicia sesión</Link>
                    <Link to="/registro" className="block my-5 text-slate-500 uppercase text-sm">¿No tienes una cuenta? Regístrate</Link>
                </nav>
            </div>
        )}

    </>
  )
}

export default NuevoPassword
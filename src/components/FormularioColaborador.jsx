import { useState } from "react"
import useProyectos from "../hooks/useProyectos"
import Alerta from "./Alerta"

const FormularioColaborador = () => {

    const [email, setEmail] = useState('')
    const {mostrarAlerta, alerta, buscarColaborador} = useProyectos()
 
    const handleSubmit = e => {
        e.preventDefault()

        if (email === '') {
            mostrarAlerta({
                error: true,
                msg: 'El email es obligatorio'
            })
            return
        }

        buscarColaborador(email)
    }

  return (
    <form className='bg-white py-10 px-5 w-full md:w-1/2 rounded-md shadow' onSubmit={handleSubmit}>
        <div className='mb-5'>
            <label htmlFor='email' className='text-gray-700 uppercase font-bold text-sm'>
                Email colaborador
            </label>
            <input type="text" id='email' placeholder='Email del usuario' className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md' value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        {alerta.msg && <Alerta alerta={alerta} />}

        <input type="submit" value='Buscar colaborador' className="bg-sky-600 hover:bg-sky-700 text-white w-full p-3 uppercase font-bold cursor-pointer transition-colors rounded text-sm" />
    </form>
  )
}

export default FormularioColaborador
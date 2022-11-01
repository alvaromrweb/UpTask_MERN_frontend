import { useState, useEffect } from "react"
import Alerta from "./Alerta"
import useProyectos from "../hooks/useProyectos.jsx"
import { useParams } from "react-router-dom"

const FormularioProyecto = () => {

    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [fechaEntrega, setFechaEntrega] = useState('')
    const [cliente, setCliente] = useState('')

    const params = useParams()
    const {alerta, mostrarAlerta, crearProyecto, proyecto, setProyecto, editarProyecto} = useProyectos()

    useEffect(() => {
      if(params.id) {
        setNombre(proyecto.nombre)
        setDescripcion(proyecto.descripcion)
        setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
        setCliente(proyecto.cliente)
      } else {
        setProyecto({})
      }
    }, [params])
    
    

    const handleSubmit = async e => {
        e.preventDefault()
        mostrarAlerta({error: false})

        if([nombre, descripcion, fechaEntrega, cliente].includes('')) {
            mostrarAlerta({
                error: true,
                msg: 'Todos los campos son obligatorios'
            })
            return
        }

        if(params.id) {
          const id = params.id
          await editarProyecto({id, nombre, descripcion, fechaEntrega, cliente})

        } else {
          await crearProyecto({nombre, descripcion, fechaEntrega, cliente})
        }
        setNombre('')
        setDescripcion('')
        setFechaEntrega('')
        setCliente('')
    }

  return (
    <form className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow' onSubmit={handleSubmit}>
        <div className="mb-5">
            <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='nombre'>Nombre proyecto</label>
            <input id='nombre' type='text' className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' placeholder="Nombre del proyecto" value={nombre} onChange={e => setNombre(e.target.value)} />
        </div>
        <div className="mb-5">
            <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='descripcion'>Descripcion proyecto</label>
            <textarea id='descripcion'  className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' placeholder="Descripcion del proyecto" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
        </div>
        <div className="mb-5">
            <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='fecha-entrega'>Fecha de entrega del proyecto</label>
            <input id='fecha-entrega' type='date' className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' placeholder="Fecha de entrega del proyecto" value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} />
        </div>
        <div className="mb-5">
            <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='cliente'>Cliente proyecto</label>
            <input id='cliente' type='text' className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' placeholder="Cliente del proyecto" value={cliente} onChange={e => setCliente(e.target.value)} />
        </div>

        {alerta.msg && <Alerta alerta={alerta} />}

        <input type='submit' value={proyecto._id ? 'Actualizar proyecto' : 'Crear proyecto'} className='bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors' />
    </form>
  )
}

export default FormularioProyecto
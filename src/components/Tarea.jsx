import { formatearFecha } from "../helpers/formatearFecha"
import useProyectos from "../hooks/useProyectos.jsx"
import useAdmin from "../hooks/useAdmin"

const Tarea = ({tarea}) => {

    const {alerta, mostrarAlerta, handleModalEditarTarea, handleModalEliminarTarea, completarTarea} = useProyectos()
    const admin = useAdmin()

  return (
    <div className='border-b p-5 flex justify-between items-center'>
        <div className="flex flex-col items-start">
            <p className='text-xl mb-1'>{tarea.nombre}</p>
            <p className='text-sm text-gray-500 uppercase mb-1'>{tarea.descripcion}</p>
            <p className='text-sm mb-1'>{formatearFecha(tarea.fechaEntrega)}</p>
            <p className='text-gray-600 mb-1'>Prioridad: {tarea.prioridad}</p>
            {tarea.estado && <p className="text-xs bg-green-600 text-white uppercase p-1 rounded-lg ">Completada por: {tarea.completado.nombre}</p>}
        </div>
        <div className='flex flex-col lg:flex-row gap-2'>
            {admin && (
                <button onClick={() => handleModalEditarTarea(tarea)} className='bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'>Editar</button>
            )}

            <button onClick={() => completarTarea(tarea._id)} className={`${tarea.estado ? 'bg-sky-600' : 'bg-gray-600'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}>{tarea.estado ? 'Completa' : 'Incompleta'}</button>

            {admin && (
                <button onClick={() => handleModalEliminarTarea(tarea)} className='bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'>Eliminar</button>
            )}
        </div>
    </div>
  )
}

export default Tarea
import { useParams, Link } from "react-router-dom"
import { useEffect } from "react";
import useProyectos from "../hooks/useProyectos.jsx";
import ModalTarea from "../components/ModalTarea.jsx";
import Tarea from "../components/Tarea.jsx";
import ModalEliminarTarea from "../components/ModalEliminarTarea.jsx";
import Alerta from "../components/Alerta.jsx";
import Colaborador from "../components/Colaborador.jsx";
import ModalEliminarColaborador from "../components/ModalEliminarColaborador.jsx";
import useAdmin from "../hooks/useAdmin.jsx";
import io from "socket.io-client"

let socket

const Proyecto = () => {

    const { id } = useParams();
    const { getProyecto, proyecto, cargando, toggleModalTarea, alerta, submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, cambioEstadoTarea } = useProyectos()
    const admin  = useAdmin()

    useEffect(() => {
        getProyecto(id)
    }, [])

    useEffect(() => {
      socket = io(import.meta.env.VITE_BACK_URL)
      socket.emit('abrir proyecto', id)
    })

    useEffect(() => {
        socket.on('tarea agregada', tareaNueva => {
            if(tareaNueva.proyecto === proyecto._id) {
                submitTareasProyecto(tareaNueva)
            }
        })
        socket.on('eliminar tarea', tarea => {
            if(tarea.proyecto === proyecto._id) {
                eliminarTareaProyecto(tarea)
            }
        })
        socket.on('actualizar tarea', tarea => {
            if(tarea.proyecto._id === proyecto._id) {
                actualizarTareaProyecto(tarea)
            }
        })
        socket.on('completar tarea', tarea => {
            if(tarea.proyecto._id === proyecto._id) {
                cambioEstadoTarea(tarea)
            }
        })
    })
    

      console.log(admin)

      if(cargando) return 'Cargando...'
  return (
        <>
            <div className="flex justify-between">
                <h1 className="font-black text-4xl ">{proyecto.nombre}</h1>

                {admin && (
                    <div className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                        <Link to={`/proyectos/editar/${id}`} className='uppercase font-bold flex items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                            Editar
                        </Link>
                    </div>

                )}
            </div>
            {admin && (
                <button onClick={() => toggleModalTarea()} type="button" className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Nueva tarea
                </button>
            )}

            <p className="font-bold text-xl mt-10">Tareas del proyecto</p>


            <div className="bg-white shadow mt-10 rounded-lg">
                {proyecto.tareas?.length ? 
                    proyecto.tareas.map(tarea => (
                        <Tarea key={tarea._id} tarea={tarea} />
                    ))
                : 
                <p className="text-center my-5 p-10">No hay tareas en este proyecto</p>
                }
            </div>

            {admin && (
                <>
                    <div className="flex items-center justify-between mt-10">
                        <p className="font-bold text-xl ">Colaboradores</p>
                        <Link to={`/proyectos/nuevo-colaborador/${id}`} className='text-gray-400 hover:text-black uppercase font-bold'>Añadir</Link>
                    </div>

                    <div className="bg-white shadow mt-10 rounded-lg">
                        {proyecto.colaboradores?.length ? 
                            proyecto.colaboradores.map(colaborador => (
                                <Colaborador key={colaborador._id} colaborador={colaborador} />
                            ))
                        : 
                        <p className="text-center my-5 p-10">No hay colaboradores en este proyecto</p>
                        }
                    </div>
                </>
            )}

            <ModalTarea />

            <ModalEliminarTarea />
            <ModalEliminarColaborador />
        </>
    
  )
}

export default Proyecto
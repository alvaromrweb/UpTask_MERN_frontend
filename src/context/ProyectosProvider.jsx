import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom"
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth.jsx"

let socket

const ProyectosContext = createContext()

const ProyectosProvider = ({children}) => {

    const [proyectos, setProyectos] = useState([])
    const [proyecto, setProyecto] = useState({})
    const [alerta, setAlerta] = useState({})
    const [cargando, setCargando] = useState(false)
    const [modalTarea, setModalTarea] = useState(false)
    const [tarea, setTarea] = useState({})
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)

    const navigate = useNavigate()
    const {auth} = useAuth()


    useEffect(() => {
        const getProyectos = async () => {
            try {
                const token = localStorage.getItem('token')
                if(!token) {
                    return
                }
    
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const {data} = await clienteAxios('/proyectos', config)
                console.log(data)
                setProyectos(data)
                
            } catch (error) {
                console.log(error)
            }
        }
        getProyectos()
        
    }, [auth])

    useEffect(() => {
      socket = io(import.meta.env.VITE_BACK_URL)
    }, [])

    
    

    const mostrarAlerta = alerta => {
        setAlerta(alerta)
    }

    const toggleModalTarea = () => {
        setModalTarea(!modalTarea)
        setTarea({})
    }

    const handleModalEditarTarea = tarea => {
        toggleModalTarea()
        setTarea(tarea)
    }

    const handleModalEliminarTarea = tarea => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const handleModalEliminarColaborador = colaborador => {
        setColaborador(colaborador)
        setModalEliminarColaborador(!modalEliminarColaborador)
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    const crearProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post('/proyectos', proyecto, config)
            
            setProyectos([...proyectos, data])
            setAlerta({
                error: false,
                msg: 'Proyecto creado correctamente'
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 2000);
            
        } catch (error) {
            console.log(error)
        }
    }

    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)

            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === proyecto.id ? proyecto : proyectoState)
            
            setProyectos(proyectosActualizados)
            setAlerta({
                error: false,
                msg: 'Proyecto actualizado correctamente'
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 2000);
            
        } catch (error) {
            console.log(error)
        }
    }

    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.delete(`/proyectos/${id}`, config)

            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id != id)
            
            setProyectos(proyectosActualizados)
            setAlerta({
                error: false,
                msg: 'Proyecto eliminado correctamente'
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 2000);
            
        } catch (error) {
            console.log(error)
        }
    }

    const getProyecto = async id => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.get(`/proyectos/${id}`, config)

            setProyecto(data)
            

            setAlerta({
                error: false,
                msg: data.msg
            })
            
        } catch (error) {
            setAlerta({
                error: true,
                msg: error.response.data.msg
            })
            navigate('/proyectos')

            setTimeout(() => {
                setAlerta({})
            }, 2000);
        }

        setCargando(false)

    }


    const crearTarea = async tarea => {
        setAlerta({})
        try {
            const token = localStorage.getItem('token')
            if(!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post('/tareas', tarea, config)
            
            
            setModalTarea(false)
            
            setAlerta({
                error: false,
                msg: 'Tarea creada correctamente'
            })

            setTimeout(() => {
                setAlerta({})
                // navigate('/proyectos')
            }, 2000);

            // SOCKET IO
            socket.emit('nueva tarea', data)
            
        } catch (error) {
            console.log(error)
        }
    }


    const editarTarea = async tarea => {
        setAlerta({})
        try {
            const token = localStorage.getItem('token')
            if(!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
            
            
            setAlerta({
                error: false,
                msg: 'Tarea actualizada correctamente'
            })
            toggleModalTarea()
            
            setTimeout(() => {
                setAlerta({})
                // navigate('/proyectos')
            }, 2000);

            // SOCKET IO
            socket.emit('tarea actualizada', data)
            
        } catch (error) {
            console.log(error)
        }
    }

    const eliminarTarea = async () => {
        setAlerta({})
        try {
            const token = localStorage.getItem('token')
            if(!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            
            setAlerta({
                error: false,
                msg: 'Tarea eliminada correctamente'
            })
            
            
            handleModalEliminarTarea()
            
            setTimeout(() => {
                setAlerta({})
                // navigate('/proyectos')
            }, 3000);

            // SOCKET IO
            socket.emit('tarea eliminada', tarea)
            
            
        } catch (error) {
            console.log(error)
        }
    }


    const buscarColaborador = async email => {
        setAlerta({})
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post(`/proyectos/colaboradores`, {email}, config)
            setColaborador(data)
            
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
        setCargando(false)
    }

    const addColaborador = async email => {
        setAlerta({})
        try {
            const token = localStorage.getItem('token')
            if(!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)

            setAlerta({
                error: false,
                msg: data.msg
            })
            setColaborador({})

            setTimeout(() => {
                setAlerta({})
            }, 3000);
            
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }
    
    const eliminarColaborador = async () => {
        setAlerta({})
        try {
            const token = localStorage.getItem('token')
            if(!token) {
                return
            }

            const config = {
                data: {
                    id: colaborador._id
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.delete(`/proyectos/colaboradores/${proyecto._id}`, config)
            console.log(data)
            setAlerta({
                error: false,
                msg: data.msg
            })
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)
            setProyecto(proyectoActualizado)
            
            handleModalEliminarColaborador()
            setColaborador({})
            
            setTimeout(() => {
                setAlerta({})
            }, 3000);
            
        } catch (error) {
            console.log(error)
        }
    
    }
    
    const completarTarea = async id => {
        
        try {
            const token = localStorage.getItem('token')
            if(!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)
            
            // SOCKET IO
            socket.emit('tarea completada', data)
            setTarea({})

            
        } catch (error) {
            console.log(error)
        }
    
    }

    // Socket io
    const submitTareasProyecto = tareaNueva => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tareaNueva]
        setProyecto(proyectoActualizado)
    }

    const eliminarTareaProyecto = tareaEliminada => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tareaEliminada._id)
        setProyecto(proyectoActualizado)
    }

    const actualizarTareaProyecto = tareaActualizada => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tareaActualizada._id ? tareaActualizada : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cambioEstadoTarea = tareaCambio => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tareaCambio._id ? tareaCambio : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})
    }

    return (
        <ProyectosContext.Provider
        value={{
            proyectos,
            setProyectos,
            alerta,
            mostrarAlerta,
            crearProyecto,
            getProyecto,
            proyecto,
            setProyecto,
            cargando,
            editarProyecto,
            eliminarProyecto,
            modalTarea,
            toggleModalTarea,
            crearTarea,
            tarea,
            handleModalEditarTarea,
            editarTarea,
            modalEliminarTarea,
            handleModalEliminarTarea,
            eliminarTarea,
            buscarColaborador,
            colaborador,
            addColaborador,
            modalEliminarColaborador,
            handleModalEliminarColaborador,
            eliminarColaborador,
            completarTarea,
            buscador,
            handleBuscador,
            submitTareasProyecto,
            eliminarTareaProyecto,
            actualizarTareaProyecto,
            cambioEstadoTarea,
            cerrarSesionProyectos
        }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectosContext
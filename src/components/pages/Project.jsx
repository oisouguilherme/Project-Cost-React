import styles from './Project.css'

import { parse, v4 as uuidv4 } from 'uuid'

import { json, useParams } from 'react-router-dom'
import { useState, useEffect} from 'react'
import Loading from '../layout/Loading'
import ProjectForm from '../Project/ProjectForm'
import ServiceForm from '../Project/ServiceForm'
import ServiceCard from '../Project/ServiceCard'

import Message from '../layout/Message'

function Project(){
    const {id} = useParams()
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState (false)
    const [showServiceForm, setShowServiceForm] = useState (false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(()=> {
        setTimeout(()=> {
            fetch(`http://localhost:5000/projects/${id}`, {
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                },
            })
            .then((resp)=> resp.json())
            .then((data)=>{
                setProject(data)
                setServices(data.services)
            })
            .catch(err => console.log(err))
        }, 1000)
    }, [id])


    function editPost (project){
        setMessage('')

        if(project.budget < project.cost){
            setMessage('O orçamento não pode ser menor que o custo do projeto!')
            setType('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`,{
            method:'PATCH',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
        .then(resp => resp.json())
        .then((data)=>{
            setProject(data)
            setShowProjectForm(false)
            setMessage('Projeto atualizado!')
            setType('sucess')
        })
        .catch(err=> console.log(err))
    }

    function removeService (id, cost){
        const servicesUpdate = project.services.filter(
            (service) => service.id !== id
        )

        const projectUpdated = project

        projectUpdated.services = servicesUpdate
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`,{
            method:'PATCH',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectUpdated),
        }).then(resp => resp.json())
        .then((data)=>{
            setProject(projectUpdated)
            setServices(servicesUpdate)
            setMessage('Serviço removido com sucesso')
        })
        .catch(err=> console.log(err))
    }
    

    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm(){
        setShowServiceForm(!showServiceForm)
    }

    function createService(project) {
        // last service
        const lastService = project.services[project.services.length - 1]
    
        lastService.id = uuidv4()
    
        const lastServiceCost = lastService.cost
    
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)
    
        // maximum value validation
        if (newCost > parseFloat(project.budget)) {
          setMessage('Orçamento ultrapassado, verifique o valor do serviço!')
          setType('error')
          project.services.pop()
          return false
        }

        project.cost = newCost

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        }).then((resp)=> resp.json())
        .then((data)=> {
            setShowServiceForm(false)
        })
        .catch(err => console.log(err))
    }

    return(
        <>
        {project.name ? (
            <div className='project_details'>
                    {message && <Message type={type} msg={message} />}
                    <div className='details_container'>
                        <h1>Projeto: {project.name}</h1>
                        <button className='btn' onClick={toggleProjectForm}>
                            {!showProjectForm ? 'Editar projeto' : 'Fechar'} 
                        </button>
                        {!showProjectForm ? (
                            <div className='project_info'>
                                <p>
                                    <span>Categoria:</span>{project.category.name}
                                </p>
                                <p>
                                    <span>Total de Orçamento:</span> R${project.budget}
                                </p>
                                <p>
                                    <span>Total Utilizados:</span>R${project.cost}
                                </p>
                            </div>
                        ) : (
                            <div className='project_info'>
                                <ProjectForm 
                                handleSubmit={editPost}
                                btnText="Concluir edição"
                                projectData={project}/>
                            </div>
                        )}
                    </div>
                    <div className='service_form_container'>
                            <h2>Adicionar um serviço:</h2>
                            <button className='btn' onClick={toggleServiceForm}>
                                {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                            </button>
                            <div className='project_info'>
                                {showServiceForm && (
                                    <ServiceForm 
                                    handleSubmit={createService}
                                    btnText="Adicionar Serviço"
                                    projectData={project}
                                    />
                                )}
                            </div>
                    </div>
                    <h2>Serviços</h2>
                    {services.length > 0 &&
                        services.map((service)=> (
                            <ServiceCard 
                                id={service.id}
                                name={service.name}
                                cost={service.cost}
                                description={service.description}
                                key={service.id}
                                handleRemove={removeService}
                            />
                        ))
                    }
                    {services.length === 0 && <p>Não há serviços cadastrados.</p>}
            </div>
        ) : (
            <Loading />
        ) }
        </>
    )
}

export default Project
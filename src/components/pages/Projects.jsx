import Message from "../layout/Message"
import Container from '../layout/Container'
import styles from './Projects.css'
import LinkButton from "../layout/LinkButton"
import Loading from "../layout/Loading"
import { useLocation } from 'react-router-dom'
import ProjectCard from "../Project/ProjectCard"
import { useState, useEffect } from "react"

function Projects( ){
    const [projects, setProjects] = useState([])
    const [removeLoading, setRemoveLoading] = useState(false)
    const [projectMessage, setProjectMessage] = useState("")

    const location = useLocation()
    let message = ''
    if(location.state) {
        message = location.state.message
    }

    useEffect(()=> {
        setTimeout(( )=> {
            fetch('http://localhost:5000/projects', {
                method:'GET',
                headers:{
                    'Content-Type': 'application/json'
                },
            }) .then((resp) => resp.json())
            .then((data) => {
                setProjects(data)
                setRemoveLoading(true)
            })
            .catch((err) => console.log(err))

        }, 300)
    }, [])


    function removeProject(id) {
        fetch(`http://localhost:5000/projects${id}`, {
            method:'DELETE',
            headers: {
                'Content-Type':'application/json'
            },
        })
        .then(resp => resp.json())
        .then(data => {
            setProjects(projects.filter((project) => project.id !== id))
            setProjectMessage('Projeto removido com sucesso!')
        })
        .catch(err=> console.log(err))
    }

    return(
        <div className="project_container">
            <div className="title_container">
                <h1>Meus Projetos</h1>
                <LinkButton to="/newproject" text="Criar Proejto" />
            </div>

            {message && <Message type='sucess' msg={message} />}
            {projectMessage && <Message type='sucess' msg={projectMessage} />}

            <div className="flex" >
                {projects.length > 0 && 
                projects.map((project)=> (<ProjectCard 
                    id={project.id} 
                    name={project.name}
                    budget={project.budget}
                    category={project?.category?.name}
                    key={project.id} 
                    handleRemove={removeProject}
                    />
                
                ))}

                {!removeLoading && <Loading />}
                {removeLoading && projects.length === 0 && (
                    <p>Não há projetos cadastrados!</p>
                )}
            </div>
        </div>
    )
}

export default Projects
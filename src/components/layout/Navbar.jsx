import { Link } from 'react-router-dom' 

import Container from './Container'

import styles from './Navbar.css'

import logo from '../../img/costs_logo.png'


function Navbar () {
return (

    <nav className='navbar'>
            <Link to="/">
                <img src={logo} alt="Costs" />
            </Link>
            <ul className='list'>
                <li className='item'><Link to="/">Home</Link></li>
                <li className='item'> <Link to="/projects">Projetos</Link></li>
                <li className='item'><Link to="/Company">Empresa</Link></li>
                <li className='item'><Link to="/contact">Contato</Link></li>
            </ul>
    </nav>
        
)
}

export default Navbar
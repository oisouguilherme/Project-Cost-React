import { FaFacebook, FaInstagram, FaLinkedin} from 'react-icons/fa'

import styles from './Footer.css'


function Footer () {
    return(
        <footer className='footer'>
            <ul className='social_list'>
                <li> <FaFacebook /> </li>
                <li> <FaInstagram /> </li>
                <li> <FaLinkedin /> </li>
            </ul>
            <p className='copy_right'>
                <span>Costs</span> &copy; 2021
            </p>
        </footer>
    )
}

export default Footer
import styles from './SubmitButton.css'

function SubmitButton( { text } ){
    return(
        <div>
            <button className='btn'> {text} </button>
        </div>
    )
}

export default SubmitButton
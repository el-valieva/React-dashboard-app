import React from 'react'
import styles from '../Modal/Modal.module.scss'
import classnames from 'classnames'

const Modal = ({closeModal, goalsList, deleteAllGoals}) => {

    const printGoals = () => {
        if (goalsList.length === 0) {
            return (<h4>No goals added yet</h4>)
        } else {
            return (<ul className={styles.goalsList}>
                {goalsList.map((item, index) => (
                <li key={index} className={styles.goalItem}>{item}</li>))}
                </ul>
            )
        }
    }

    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContainer}>
                <div className={styles.titleCloseButtonContainer}>
                    <button onClick={() => {closeModal(false)}} className={classnames(styles.modalButton, styles.modalButtonPrimary, styles.titleCloseButton)}> X </button>
                </div>
                <div className={styles.textContainer}>
                    <div className={styles.modalTitle}><h1>List of goals</h1></div>
                    <div className={styles.modalBody}>
                        {printGoals()}
                    </div>
                </div>
                <div className={styles.footerButtonsContainer}>
                    <button onClick={() => {closeModal(false)}} className={classnames(styles.modalButton, styles.modalButtonPrimary, styles.footerButton)}>Cancel</button>
                    <button 
                        className={classnames(styles.modalButton, styles.footerButton, styles.modalButtonSecondary)}
                        onClick={deleteAllGoals}>Clear goals list</button>
                </div>
            </div>
            
        </div>
    )
}

export default Modal


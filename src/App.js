import React,  { useState, useEffect } from 'react'
import styles from  './App.module.scss'
import classnames from 'classnames'
import Modal from './Modal/Modal'

const openWeatherApiKey = process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY


function App() {
  const [backgroundImage, setBackgroundImage] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [date, setDate] = useState(new Date())
  const [greetingStatus, setGreetingStatus] = useState('')
  const [iconUrl, setIconUrl] = useState('http://openweathermap.org/img/wn/02d@2x.png')
  const [cityName, setCityName] = useState('Auckland')
  const [temp, setTemp] = useState('>5 ℃')
  const [openModal, setOpenModal] = useState(false)
  const [goalItem, setGoalItem] = useState('')
  let defaultGoals = JSON.parse(localStorage.getItem("myGoals"))

  if (defaultGoals === null) {
    defaultGoals = []
  }

  const [myGoals, setMyGoals] = useState(defaultGoals)

  const isActive = goalItem !== ''

  const chooseBackgroundImage = async () => {
    try {
      const res = await fetch('https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature')
      if(!res.ok) {
        throw Error(`Something went wrong. Status: ${res.status}`)
      }
      const data = await res.json()
      if(data.urls === undefined) {
        throw Error(`Image not found`)
      }
        const imageUrl = data.urls.regular
        console.log(data)
        setBackgroundImage(`${imageUrl}`)
        setAuthorName(data.user.name)
    } catch (error) {
      console.error(error)
      setBackgroundImage("https://images.unsplash.com/photo-1565118531796-763e5082d113?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzQ1MzUzMDY&ixlib=rb-1.2.1&q=80&w=1080")
      setAuthorName("Nikola Majksner")
    }
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      fetch(`https://api.openweathermap.org/data/2.5/find?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${openWeatherApiKey}`)
      .then(res => {
        if (!res.ok) {
            throw Error("Weather data not available")
        }
        return res.json()
      })
      .then(data => {
        if(data.cod !== '200' || data.count < 1) {
          throw Error("Data is incorrect")
      }
        console.log(data)
        setCityName(`${data.list[0].name}`)
        setIconUrl(`http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`)
        setTemp(`${Math.round(data.list[0].main.temp)} ℃`)
      })
      .catch(err => {
        console.error(err)
      })
    }, err => {
      console.log("Couldn't detect location")
      console.error(err)
     })
 }, [])


  useEffect(() => {
    chooseBackgroundImage()
  }, [])

  useEffect(() => {
    let timerID = setInterval(tick, 10000 )
  
    return function cleanup() {
        clearInterval(timerID)
      };
   }, []);
  
   function tick() {
      setDate(new Date());
   }

  useEffect(() => {
    let hours = date.getHours();
    setGreetingStatus((hours < 12) ? "Morning" : ((hours >= 12 && hours <= 18) ? "Afternoon" : "Night"))
  }, [])

  function setGoal(e) {
    const goalValue = e.target.value
    setGoalItem(goalValue)
  }

  function addGoalToLocalStorage() {
    if(goalItem === '') {
      return
    }
    const newGoals = [...myGoals, goalItem]
    setMyGoals(newGoals)
    setGoalItem('')
    localStorage.setItem("myGoals", JSON.stringify(newGoals))
  }

  function deleteAllGoals() {
    localStorage.clear()
    setMyGoals([])
  }

  const currentGoal = () => {
    if (myGoals.length === 0) {
        return (`No goals added yet`)
    } else {
        return ( myGoals[myGoals.length - 1] )
    }
}

  return (
        <main className={styles.container} style={{ backgroundImage: `url(${backgroundImage})`}}>
            <div className={styles.top}>
              <p className={styles.cityName}>{cityName}</p>
              <div className={styles.weatherContainer}>
                <div className={styles.iconContainer}><img className={styles.icon} src={iconUrl} alt="weather-icon"/></div>
                <p>{temp}</p>
              </div>
            </div>
            <div className={styles.centerText}>
              <h1 className={styles.greeting}>{`Good ${greetingStatus}`}</h1>
              <h2 className={styles.time}>{date.toLocaleTimeString("en-us", {hour: '2-digit', minute:'2-digit'})}</h2>
              <h2 className={styles.goal}>Today: {currentGoal()}</h2>
            </div>
            <div className={styles.interactiveElementsContainer}>
              <input className={styles.input} type="text" placeholder="Type your goal for the day" value={goalItem} onChange={setGoal} autoFocus/>
              <div className={styles.buttonsContainer}>
                <button 
                  className={classnames(styles.btn, styles.saveButton, isActive ? styles.buttonActive : styles.buttonInactive)} 
                  onClick={addGoalToLocalStorage}
                  disabled={!isActive}>
                    Save the goal
                </button>
                <button 
                  className={classnames(styles.btn, styles.getArchiveButton)}
                  onClick={() => {
                    setOpenModal(true)
                  }}>
                    Goals archive
                </button>
              </div>
            </div>
            <div className={styles.bottom}>
              <p>{`By: ${authorName}`}</p>
            </div>
            {openModal && <Modal closeModal={setOpenModal} goalsList={myGoals} deleteAllGoals={deleteAllGoals}/>}
        </main>
  )}

export default App;

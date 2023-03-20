import { useNavigate } from 'react-router-dom'

import styles from './TestRoute.module.css'

export default function TestRoute() {
  const navigate = useNavigate()

  return (
    <div className={styles.testroute}>
      <div>
        <a href="https://bludood.com" target="_blank">
          <img className={[styles.logo, styles.bludood].join(' ')} src="https://cdn.bludood.com/assets/BluDood.png" alt="BluDood avatar" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img className={[styles.logo, styles.react].join(' ')} src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React logo" />
        </a>
      </div>
      <h1>Route</h1>
      <button onClick={() => navigate('/')}>Navigate to /</button>
    </div>
  )
}

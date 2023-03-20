import { useState } from 'react'

import styles from './App.module.css'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div className={styles.app}>
      <div>
        <a href="https://bludood.com" target="_blank">
          <img className={[styles.logo, styles.bludood].join(' ')} src="https://cdn.bludood.com/assets/BluDood.png" alt="BluDood avatar" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img className={[styles.logo, styles.react].join(' ')} src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React logo" />
        </a>
      </div>
      <h1>BluDood React Template</h1>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
    </div>
  )
}

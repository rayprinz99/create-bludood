import { useState } from "react"

import styles from "../styles/Home.module.css"

export default function Home({ title }) {
  const [count, setCount] = useState(0)

  return (
    <div className={styles.home}>
      <div>
        <a href="https://bludood.com" target="_blank">
          <img className={[styles.logo, styles.bludood].join(' ')} src="https://cdn.bludood.com/assets/BluDood.png" alt="BluDood avatar" />
        </a>
        <a href="https://nextjs.org" target="_blank">
          <img className={[styles.logo, styles.next].join(' ')} src="https://nextjs.org/static/favicon/safari-pinned-tab.svg" alt="Next logo" />
        </a>
      </div>
      <h1>{title}</h1>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
    </div>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      title: "BluDood Next Template"
    }
  }
}
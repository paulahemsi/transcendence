import type { NextPage } from 'next'
import Head from 'next/head'
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>ft_transcendence</title>
        <meta name="description" content="ft_transcendence" />
        <link rel="icon" href="/42.svg" />
      </Head>

      <main>
        <div className={styles.center}>
          <Card variant="outlined" sx={{ width: 500, height: 230, background: '#F5F5F5'}}>
            <CardContent style={{ paddingLeft: 35, paddingTop: 25 }}>
              <Typography align="left" sx={{ fontSize: 24}}>{'> transcend?'}</Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', paddingTop: 8 }}>
              <a href="http://localhost:4444/auth/login">
                <Button variant="contained" size="large" sx={{ width: 150, height: 55, background: '#9575CD'}}>
                  login
                </Button>
              </a>
            </CardActions>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Home

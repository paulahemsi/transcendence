import React from "react";
import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
// import { makeStyles, createStyles } from '@mui/styles'; não tá rolando importar essa lib aqui 

// const useStyles = makeStyles({
// 	nomeDaClasse: {
// 		//aqui vai a personalização CSS
// 	},
//   });

const LoginCardButton = () => {
	return (
		<>
			<a href="http://localhost:4444/auth/login">
				<Button variant="contained" size="large" sx={{ width: 150, height: 55, background: '#9575CD'}}>
				login
				</Button>
			</a>
		</>
	)
}

const LoginCardActions = () => {
	return (
		<>
			<CardActions sx={{ justifyContent: 'center', paddingTop: 8 }}>
				<LoginCardButton />
			</CardActions>
		</>
	)
}

const LoginCardContent = () => {
	return (
		<>
			<CardContent style={{ paddingLeft: 35, paddingTop: 25 }}>
			<Typography align="left" sx={{ fontSize: 24}}>{'> transcend?'}</Typography>
			</CardContent>
		</>
	)
}

const LoginCard = () => {
	//const classes = useStyles();

	return (
		<>
			<Card /*className={classes.nomeDaClasse}*/ variant="outlined" sx={{ width: 500, height: 230, background: '#F5F5F5'}}>
				<LoginCardContent />
				<LoginCardActions />
			</Card>
		</>
	)
}

export default LoginCard

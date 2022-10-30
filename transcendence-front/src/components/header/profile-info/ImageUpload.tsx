import React, { FunctionComponent, useEffect, useState } from "react";
import { Button, DialogActions, DialogContent, DialogTitle, TextField, } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

type tokenData = {
	id: string;
}

interface Props {
    setOpen: booleanSetState;
	setUserData: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>;
}

export const ImageUpload = () => {
	const changeHandler = () => {
		console.log('imagem selecionada');
	}
	const handleSubmition = () => {
		console.log('enviar imagem');
	}
	return(
		<div>
			<input type='file' name='file' onChange={changeHandler} />
				<button onClick={handleSubmition}>
					Submit
				</button>
		</div>
	)
}

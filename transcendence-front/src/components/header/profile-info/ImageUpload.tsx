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
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isFilePicked, setIsFilePicked] = useState(false);

	const handleChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		const filesList = event.target.files;
		if (filesList === null) return;
		setSelectedFile(filesList[0]);
		setIsFilePicked(true);
		console.log('imagem selecionada');
		console.log(filesList[0]);
	}

	const handleSubmition = () => {
		console.log('enviar imagem');
	}

	return(
		<div>
			<input type='file' name='file' onChange={handleChange} />
				<button onClick={handleSubmition}>
					Submit
				</button>
		</div>
	)
}

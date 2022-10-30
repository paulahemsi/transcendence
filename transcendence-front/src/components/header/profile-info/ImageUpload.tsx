import React, { useState } from "react";
import axios, { AxiosRequestHeaders } from 'axios';

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

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
		const formData = new FormData();
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};

		if (selectedFile === null) return;
		formData.append('image', selectedFile);
		axios.post('http://localhost:3000/images', formData, {headers: authToken}).then(
			() => {
				console.log('upload feito')
			}
		);
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

import React, { useState } from "react";
import axios, { AxiosRequestHeaders } from 'axios';

export const ImageUpload = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		const filesList = event.target.files;
		if (filesList === null) return;
		setSelectedFile(filesList[0]);
	}

	const handleSubmition = () => {
		const formData = new FormData();
		const authToken: AxiosRequestHeaders = {
			'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};

		if (selectedFile === null) return;
		formData.append('image', selectedFile);
		axios.post('http://localhost:3000/images', formData, {headers: authToken}).then(
			(response) => { console.log(response.data.url); }
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

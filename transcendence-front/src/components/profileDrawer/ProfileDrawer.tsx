import React, { useEffect, useState } from "react";
import { Drawer } from "@mui/material";
import axios, { AxiosRequestHeaders } from "axios";
import jwt from 'jwt-decode';
import { ProfileInfos } from "./ProfileInfos";
import { Loading } from "./Loading";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

type tokenData = {
	id: string;
}

const requestUserProfile = async ({ setUserProfile } : { setUserProfile: React.Dispatch<React.SetStateAction<{[key: string]: any}>>}) => {

	const tokenData: tokenData = jwt(document.cookie);
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	
	axios.get(`http://localhost:3000/users/${tokenData.id}/profile`, { headers: authToken }).then((response) => {
		setUserProfile(response.data);
	}).catch( () => {});
}

export const ProfileCard = ({ setOpenCard } : { setOpenCard: booleanSetState })  => {
	const [userProfile, setUserProfile] = useState<{[key: string]: any}>({});
	useEffect(() => {requestUserProfile({setUserProfile})}, []);
	return (
		<>
		<Drawer open={true} transitionDuration={500} onClose={() => setOpenCard(false)} anchor="left" PaperProps={{
            sx: { width: "40%", padding: '10vh'  },
          }}>
			{
				userProfile.image_url ? ( 
				<ProfileInfos userProfile={userProfile}/>
				) : ( 
				<Loading />
				)
			}
		</Drawer>
	  </>
	)
}

export default ProfileCard

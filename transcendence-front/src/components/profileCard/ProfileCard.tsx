import React, { useEffect, useState } from "react";
import { Box, Divider, Drawer, List, ListItem, Typography } from "@mui/material";
import axios, { AxiosRequestHeaders } from "axios";
import jwt from 'jwt-decode';

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

type tokenData = {
	id: string;
}

type matchInfos = {
	opponentName: string;
	userScore: number;
	opponentScore: number;
	isWinner: boolean;
}

const defineColor = (status: string) => {
	switch( status ) {
		case 'online':
			return '#4CAF50';
		case 'offline':
			return '#1E1E1E';
		case 'away':
			return '#F39810';
		case 'in_game':
			return '#9575CD';
		default: return '#FF0000';
	}
}

const UserImage = ({imageUrl} : {imageUrl: string}) => {
	return (
		<Box component='img' src={imageUrl} alt='Profile picture'
				sx={{
					height: '20vh',
					width: '20vh',
					borderRadius: 2,
					boxShadow: 1
				}}>
		</Box>
	)
}

const UserName = ({userName} : {userName : string}) => {
	return (
		<Typography sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '7vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
					{userName}
		</Typography>
	)
}

const UserStatus = ({statusColor} : {statusColor : string}) => {
	return (
		<Box
			sx={{ 
				backgroundColor: statusColor,
				height: '3vh',
				width: '3vh',
				borderRadius: 50,
				boxShadow: 1,
				alignSelf: 'center'}}>
		</Box>
	)
}

const MainInfos = ({userProfile} : {userProfile: {[key: string]: any}}) => {
	return (
		<Box display='flex' justifyContent='space-between'>
			<UserImage imageUrl={userProfile.image_url}/>
			<Box display='flex' flexDirection='column' justifyContent='space-between'>
				<UserName userName={userProfile.name} />
				<Box display='flex' alignSelf='flex-end'>
					<Typography sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
						Status: 
					</Typography>
					<Typography sx={{ color: '#212980', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
						{userProfile.status}
					</Typography>
					<UserStatus statusColor={defineColor(userProfile.status)}/>
				</Box>
			</Box>
		</Box>
	)
}

const getWinsAndLosses = (matchHistory : Array<matchInfos>) => {
	let wins : number = 0;
	let losses : number = 0;
	if (matchHistory) {
		matchHistory.forEach(match => {
			if (match.isWinner) {
				wins += 1;
			}
		})
		losses = matchHistory.length - wins;
	}
	return { wins, losses };
}

const Rating = ({ rating } : { rating: number }) => {
	return (
			<Box display='flex' justifyContent='center' flexDirection='column'>
				<Typography alignSelf='flex-start' sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
							Rating:
				</Typography>
				<Typography alignSelf='flex-end' sx={{ color: '#212980', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '8vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
							{rating}
				</Typography>
			</Box>
	)
}

const WinsAndLosses = ({ matchHistory } : { matchHistory : Array<matchInfos> }) => {
	const { wins, losses } = getWinsAndLosses(matchHistory);

	return (
		<Box display='flex' flexDirection='column' justifyContent='center'>
			<Typography alignSelf='flex-end' sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
				wins: {wins}
			</Typography>
			<Typography alignSelf='flex-end' sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
				losses: {losses}
			</Typography>
		</Box>
	)
}

const RatingInfos = ({userProfile} : {userProfile: {[key: string]: any}}) => {
	return (
		<Box display='flex' justifyContent='space-between' padding='4vh'>
			<Rating rating={userProfile.rating}/>
			<WinsAndLosses matchHistory={userProfile.matchHistory}/>
		</Box>
	)
}

const UserAvatar = ({imageUrl} : {imageUrl: string}) => {
	return (
		<Box component='img' src={imageUrl} alt='Profile picture'
				sx={{
					height: '5vh',
					width: '5vh',
					borderRadius: 2,
					boxShadow: 1
				}}>
		</Box>
	)
}

const MatchDetails = ({opponentName, opponentScore, opponentImage, userName, userScore, userImage } : {opponentName : string, opponentScore : number, opponentImage: string, userName : string, userScore : number, userImage: string}) => {
	return (
		<>
			<UserAvatar imageUrl={userImage}/>
			<Typography alignSelf='center' sx={{ color: '#212980', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '2.5vh', padding: '1.7vh'}}>
				{userName}  {userScore}  X  {opponentScore}  {opponentName}
			</Typography>
			<UserAvatar imageUrl={opponentImage}/>
		</>
	)
}

const MatchHistory = ({userProfile} : {userProfile: {[key: string]: any}}) => {
	const matchHistory = [] as JSX.Element[];
	if (userProfile.matchHistory) {
		userProfile.matchHistory.forEach((element : {[key: string]: any}) => {
			matchHistory.push(
			<ListItem key={element.id} sx={{paddingLeft: '15%', paddingTop: '3vh'}}> <MatchDetails opponentName={element.opponentName} opponentScore={element.opponentScore} userName={userProfile.name} userScore={element.userScore} userImage={userProfile.image_url} opponentImage={element.opponentImage}/> </ListItem>
			);
		})
	}
	return (
		<>
			<Divider variant='middle' sx={{ borderBottomWidth: 3, margin: 2,  border: "1px solid #B998FF" }} />
			<Typography alignSelf='flex-start' sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh', paddingBottom: '1.7vh'}}>
			match history:
			</Typography>
			<List sx={{width: '100%', maxHeight: '40%', position: 'relative', overflow: 'auto'}} subheader={<li />}>
				{matchHistory}
			</List>
		</>
	)
}

const requestUserProfile = async ({ setUserProfile } : { setUserProfile: React.Dispatch<React.SetStateAction<{[key: string]: any}>>}) => {

	const tokenData: tokenData = jwt(document.cookie);
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	
	axios.get(`http://localhost:3000/users/${tokenData.id}/profile`, { headers: authToken }).then((response) => {
		setUserProfile(response.data);
	})
}

export const ProfileCard = ({ setOpenCard } : { setOpenCard: booleanSetState })  => {
	const [userProfile, setUserProfile] = useState<{[key: string]: any}>({});
	useEffect(() => {requestUserProfile({setUserProfile})}, []);
	return (
		<>
		<Drawer open={true} transitionDuration={500} onClose={() => setOpenCard(false)} anchor="left" PaperProps={{
            sx: { width: "40%", padding: '10vh'  },
          }}>
			<MainInfos userProfile={userProfile}/>
			<RatingInfos userProfile={userProfile}/>
			<MatchHistory userProfile={userProfile}/>
		</Drawer>
	  </>
	)
}

export default ProfileCard

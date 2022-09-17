import React, { FunctionComponent } from "react";
import { Box, Drawer, Typography } from "@mui/material";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
    userData: {[key: string]: any};
    setOpenCard: booleanSetState;
}

const AVOCADO_TEMP = 'https://images.vexels.com/media/users/3/185791/isolated/preview/27c69d1413163918103a032d4951213e-abacate-kawaii-winking.png'

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
	if (imageUrl == null) {
		imageUrl = AVOCADO_TEMP
	}
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
				boxShadow: 1}}>
		</Box>
	)
}

const MainInfos = ({userData} : {userData: {[key: string]: any}}) => {
	return (
		<Box display='flex' justifyContent='space-between'>
			<UserImage imageUrl={userData.image_url}/>
			<Box display='flex' flexDirection='column' justifyContent='space-between'>
				<UserName userName={userData.username} />
				<Box display='flex' alignSelf='flex-end'>
					<Typography sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
						Status: Online
					</Typography>
					<UserStatus statusColor={defineColor(userData.status)}/>
				</Box>
			</Box>
		</Box>
	)
}

const RatingInfos = ({userData} : {userData: {[key: string]: any}}) => {
	return (
		<Box display='flex' justifyContent='space-between' padding='4vh'>
			<Box display='flex' justifyContent='center' flexDirection='column'>
				<Typography alignSelf='flex-start' sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
							Rating:
				</Typography>
				<Typography alignSelf='flex-end' sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '8vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
							{userData.rating}
				</Typography>
			</Box>
			<Box display='flex' flexDirection='column' justifyContent='center'>
				<Typography alignSelf='flex-end' sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
					wins: 9
				</Typography>
				<Typography alignSelf='flex-end' sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
					losses: 2
				</Typography>
			</Box>
		</Box>
	)
}

export const ProfileCard : FunctionComponent<Props> = ({ userData, setOpenCard })  => {
	return (
		<>
		<Drawer open={true} transitionDuration={500} onClose={() => setOpenCard(false)} anchor="left" PaperProps={{
            sx: { width: "40%", padding: '10vh'  },
          }}>
			<MainInfos userData={userData}/>
			<RatingInfos userData={userData}/>
		</Drawer>
	  </>
	)
}

export default ProfileCard

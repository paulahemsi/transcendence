import React, { FunctionComponent } from "react";
import { Box, Button, List, ListItem, Typography } from "@mui/material";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>

interface Props {
    groupsData: {[key: string]: any};
    setExtraContent : booleanSetState;
	setActiveChannel: numberSetState;
}

const notPart = "you are not part of any group chats :("
const joinOne =	"start or join one!"

const onHoverGroup = {
	'&:hover': {
		backgroundColor: '#B998FF',
	},
	width: '100%',
	textTransform: 'lowercase',
	borderRadius: '0'
}

const NoGroups = () => {
	return (
		<Box display="flex" alignItems="center" flexDirection="column" flexWrap="wrap" justifyContent="center" sx={{width: '100%', height: '100%'}}>
			<Typography sx={{ color: '#212980', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '4vh', paddingLeft: '1.7vh', padding: '1.7vh'}}>
						{notPart}
			</Typography>
			<Typography sx={{ color: '#212980', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '4vh', paddingLeft: '1.7vh', padding: '1.7vh'}}>
						{joinOne}
			</Typography>
		</Box>
	)
}

export const GroupsList : FunctionComponent<Props> = ({ groupsData, setExtraContent, setActiveChannel }) => {
	
	const groups = [] as JSX.Element[];
	groupsData.forEach((element : {[key: string]: any}) => {

		const handleClick = () => {
			setActiveChannel(element.id);
			setExtraContent(true);
		}

		groups.push(
		<ListItem disablePadding key={element.id} sx={{marginBottom: '1vh'}}> 
			<Button sx={onHoverGroup} onClick={handleClick}>
			<Box display='flex' width='100%' flexDirection='row' alignItems="center" alignSelf="flex-start">
				<Typography sx={{ color: '#212980', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '4vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
					{element.name}
				</Typography>
				</Box>
			</Button>
		</ListItem>);
	})

	return (
		<>
			{
				groupsData[0]
				? <List disablePadding>
					{groups}
				</List>
				: <NoGroups/>
			}
		</>
	)
}

export default GroupsList

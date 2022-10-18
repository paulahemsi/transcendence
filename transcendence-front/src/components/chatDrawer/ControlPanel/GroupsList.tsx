import React, { FunctionComponent } from "react";
import { Box, Button, List, ListItem, Typography } from "@mui/material";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>

interface Props {
    groupsData: {[key: string]: any};
    setExtraContent : booleanSetState;
	setActiveChannel: numberSetState;
	activeChannel: number;
}

const notPart = "you are not part of any group chats :("
const joinOne =	"start or join one!"

const listCss = { 
	width: '100%',  height: '64vh', position: 'relative', overflow: 'auto',   overflowY: "auto",
	margin: 0,
	padding: 0,
	listStyle: "none",
	'&::-webkit-scrollbar': {
	width: '0.4em',
	borderRadius: 5,
	},
	'&::-webkit-scrollbar-track': {
		boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
		webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
		borderRadius: 5,
	},
	'&::-webkit-scrollbar-thumb': {
		backgroundColor: '#212980',
		outline: 'none',
		borderRadius: 5,
	}
}

const groupCSS = ( isActiveGroup : boolean ) => {
	const bgColor = isActiveGroup ? '#B998FF' : '#F5F5F5';

	return {
		'&:hover': {
			backgroundColor: '#B998FF',
		},
		width: '100%',
		textTransform: 'lowercase',
		borderRadius: '0',
		backgroundColor: bgColor ,
	}
}

const typographyCSS = {
	color: '#212980',
	fontFamily: 'Orbitron',
	fontWeight: 600,
	fontSize: '4vh',
	paddingLeft: '1.7vh',
}

const NoGroups = () => {
	return (
		<Box 
			display="flex"
			alignItems="center"
			flexDirection="column"
			flexWrap="wrap"
			justifyContent="center"
			sx={{width: '100%', height: '100%'}}
		>
			<Typography sx={typographyCSS}>
						{notPart}
			</Typography>
			<Typography sx={typographyCSS}>
						{joinOne}
			</Typography>
		</Box>
	)
}

export const GroupsList : FunctionComponent<Props> = ({ groupsData, setExtraContent, activeChannel, setActiveChannel }) => {
	
	const groups = [] as JSX.Element[];
	groupsData.forEach((element : {[key: string]: any}) => {
		
		const isActiveGroup = element.id === activeChannel;
		const handleClick = () => {
			setActiveChannel(element.id);
			setExtraContent(true);
		}
		
		groups.push(
		<ListItem
			disablePadding key={element.id}
			sx={{marginBottom: '1vh'}}
		> 
			<Button sx={groupCSS(isActiveGroup)} onClick={handleClick}>
			<Box
				display='flex'
				width='100%'
				flexDirection='row'
				alignItems="center"
				alignSelf="flex-start"
			>
				<Typography sx={typographyCSS}>
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
				? <List disablePadding sx={listCss}>
					{groups}
				</List>
				: <NoGroups/>
			}
		</>
	)
}

export default GroupsList

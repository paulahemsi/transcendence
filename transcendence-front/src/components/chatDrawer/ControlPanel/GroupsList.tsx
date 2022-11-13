import React, { FunctionComponent } from "react";
import { Box, Button, List, ListItem, Typography } from "@mui/material";
import { LIST_CSS, typographyCSS } from "../../utils/constants";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>

interface Props {
    groupsData: {[key: string]: any};
    setExtraContent : booleanSetState;
	setActiveChannel: numberSetState;
	setChannelsAdminPanel: booleanSetState;
	activeChannel: number;
}

const noGroup = "you are not part of any group chats :( \r\n\r\n start or join one!"

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

const NoGroups = () => {
	return (
		<Box 
			display="flex"
			alignItems="center"
			flexDirection="column"
			flexWrap="wrap"
			justifyContent="center"
			sx={{width: '100%',  height: '50vh'}}
		>
			<Typography sx={typographyCSS}>
				{noGroup}
			</Typography>
		</Box>
	)
}

export const GroupsList : FunctionComponent<Props> = ({ groupsData, setChannelsAdminPanel, setExtraContent, activeChannel, setActiveChannel }) => {
	
	const groups = [] as JSX.Element[];
	groupsData.forEach((element : {[key: string]: any}) => {
		
		const isActiveGroup = element.id === activeChannel;
		const handleClick = () => {
			setActiveChannel(element.id);
			setExtraContent(true);
			setChannelsAdminPanel(false);
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
				?
				<List
					disablePadding
					sx={LIST_CSS}
				>
					{groups}
				</List>
				:
				<NoGroups/>
			}
		</>
	)
}

export default GroupsList

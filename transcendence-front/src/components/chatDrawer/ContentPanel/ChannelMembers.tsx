import { Button, List, ListItem } from "@mui/material";
import React from "react";
import MembersInfo from "./MembersInfo";

const LIST_CSS = { 
	height: '55vh',
	position: 'relative',
	margin: 0,
	padding: 0,
	alignSelf: 'flex-start',
	overflow: 'auto',
	overflowY: 'auto',
	'&::-webkit-scrollbar': {
	width: '0.4em',
	borderRadius: 5,
	},
	listStyle: "none",
	'&::-webkit-scrollbar-track': {
		boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
		webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
		borderRadius: 5,
	},

}

export const ChannelMembers = ({ channelMembers } : { channelMembers: {[key: string]: any} }) => {

	const members = [] as JSX.Element[];
	channelMembers.forEach((element : {[key: string]: any}) => {
		members.push(
		<ListItem disablePadding key={element.id} sx={{ padding: '1vh', marginRight: '10vh' }} > 
			<MembersInfo userData={element}/>
		</ListItem>);
	})
	
	return (
	<List 
		disablePadding 
		sx=	{LIST_CSS}
	>
		{members}
	</List>
	)
}

export default ChannelMembers

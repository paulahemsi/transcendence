import React, { useState, FunctionComponent } from "react"
import { Box, Button, Dialog } from "@mui/material"
import CreateChannelDialog from "./CreateChannelDialog";
import AddFriendsDialog from "./AddFriendsDialog";
import AddGroupsDialog from "./AddGroupsDialog";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>
type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>

interface Props {
	direct: boolean;
	setExtraContent : booleanSetState;
	setActiveChannel: numberSetState;
	setGroupsData: objectSetState;
	groupsData: {[key: string]: any};
	setFriendsData: objectSetState;
	friendsData: {[key: string]: any};
}

interface DirectButtonsProps {
	setExtraContent : booleanSetState;
	setActiveChannel: numberSetState;
	setOpenDialog: booleanSetState;
}

interface GroupsButtonsProps {
	setExtraContent : booleanSetState;
	setActiveChannel: numberSetState;
	setOpenDialog: booleanSetState;
	setOpenAddGroupsDialog: booleanSetState;
}

export const buttonConfig = (width: string) => {
	return {
		borderRadius: 0,
		textTransform: 'lowercase',
		background: '#212980',
		color: '#FFFFFF',
		':hover': { background: '#B998FF'},
		fontFamily: 'Orbitron',
		fontSize: '3vh',
		paddingLeft: '4vh',
		paddingRight: '4vh',
		width: width,
		height: '7vh',
	}
}

const directButton = buttonConfig("30vw")
const groupButton = buttonConfig("10vw")

export const DirectButtons : FunctionComponent<DirectButtonsProps> = ({ setOpenDialog, setExtraContent, setActiveChannel }) => {
	
	const handleClick = () => {
		setOpenDialog(true);
		setExtraContent(false);
	}
	
	return (
		<Box display="flex" sx={{width: "30vw"}}>
			<Button sx={directButton} onClick={handleClick}>
				add friend
			</Button>
		</Box>
	)
}

export const GroupsButtons :FunctionComponent<GroupsButtonsProps> = ({ setOpenDialog, setExtraContent, setActiveChannel, setOpenAddGroupsDialog }) => {
	
	const handleCreateClick = () => {
		setOpenDialog(true);
		setActiveChannel(0);
		setExtraContent(false);
	}

	const handleSearchClick = () => {
		setOpenAddGroupsDialog(true);
		setActiveChannel(0);
		setExtraContent(false);
	}
	
	return (
		<Box display="flex" sx={{width: "30vw"}}>
			<Button sx={groupButton}>
				manage	
			</Button>
			<Button sx={groupButton} onClick={handleCreateClick}>
				create
			</Button>
			<Button sx={groupButton} onClick={handleSearchClick}>
				search
			</Button>
		</Box>
	)
}

export const ChatAuxiliaryButton: FunctionComponent<Props> = ({ direct, setExtraContent, setActiveChannel, setGroupsData, groupsData, 	setFriendsData, friendsData }) => {
	const [openDialog, setOpenDialog] = useState(false);
	const [openAddFriendsDialog, setOpenAddFriendsDialog] = useState(false);
	const [openAddGroupsDialog, setOpenAddGroupsDialog] = useState(false);

	const handleClose = () => {
		setOpenDialog(false);
		setOpenAddGroupsDialog(false);
		setOpenAddFriendsDialog(false);
	};

	return (
		<>
		{
			direct
			? <DirectButtons setExtraContent={setExtraContent} setActiveChannel={setActiveChannel} setOpenDialog={setOpenAddFriendsDialog} />
			: <GroupsButtons setExtraContent={setExtraContent} setActiveChannel={setActiveChannel} setOpenDialog={setOpenDialog} setOpenAddGroupsDialog={setOpenAddGroupsDialog}/>
		}
		<Dialog open={openDialog} fullWidth maxWidth="sm" onClose={handleClose}>
			<CreateChannelDialog setOpenDialog={setOpenDialog} setGroupsData={setGroupsData} groupsData={groupsData}/>
		</Dialog>
		<Dialog open={openAddFriendsDialog} fullWidth maxWidth="sm" onClose={handleClose}>
			<AddFriendsDialog setOpenDialog={setOpenAddFriendsDialog} setFriendsData={setFriendsData}/>
		</Dialog>
		<Dialog open={openAddGroupsDialog} fullWidth maxWidth="sm" onClose={handleClose}>
			<AddGroupsDialog setOpenDialog={setOpenAddGroupsDialog} setGroupsData={setGroupsData}/>
		</Dialog>
		</>
	)
} 

export default ChatAuxiliaryButton

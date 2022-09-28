import React, { FunctionComponent } from "react";
import { Drawer, List, ListItem } from '@mui/material';
import FriendsInfo from "./FriendsInfo";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
    friendsData: {[key: string]: any};
    setOpenDrawer: booleanSetState;
}

export const FriendsDrawer : FunctionComponent<Props> = ({ friendsData, setOpenDrawer }) => {
	const friends = [] as JSX.Element[];
	friendsData.forEach((element : {[key: string]: any}) => {
		friends.push(<ListItem key={element.username}> <FriendsInfo userData={element}/> </ListItem>);
	})
	return (
		<>
		  <Drawer open={true} transitionDuration={500} onClose={() => setOpenDrawer(false)} anchor="right">
			<List>
				{friends}
			</List>
		  </Drawer>
		</>
	  )
}

export default FriendsDrawer

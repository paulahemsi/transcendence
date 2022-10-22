import { List, ListItem } from "@mui/material";
import React from "react";

const filterData = (query: string, data: string[]) => {
	if (!query) {
	  return data;
	} else {
	  return data.filter((d: string) => d.includes(query));
	}
};

export const UsersList = ({ usersName, searchQuery } : { usersName : string[], searchQuery : string }) => {
	if (searchQuery.length >= 1) {
		return (
			<List style={{ padding: 3 }}>
			{
				filterData(searchQuery, usersName).map((user) => (
				<ListItem
					sx={{
					padding: 'inherited',
					color: "gray",
					margin: 'inherited',
					}}
					key={user}
				>
					{user}
				</ListItem>
				))
			}
		</List>
		)
	}
	return (
		<>
		</>
	)
}

export default UsersList

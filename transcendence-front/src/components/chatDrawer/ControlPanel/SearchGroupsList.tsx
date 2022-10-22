import { List, ListItem } from "@mui/material";
import React from "react";

const filterData = (query: string, data: string[]) => {
	if (!query) {
	  return data;
	} else {
	  return data.filter((d: string) => d.includes(query));
	}
};

export const SearchGroupsList = ({ groupsName, searchQuery } : { groupsName : string[], searchQuery : string }) => {
	if (searchQuery.length >= 1) {
		return (
			<List style={{ padding: 3 }}>
			{
				filterData(searchQuery, groupsName).map((group) => (
				<ListItem
					sx={{
					padding: 'inherited',
					color: "gray",
					margin: 'inherited',
					}}
					key={group}
				>
					{group}
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

export default SearchGroupsList

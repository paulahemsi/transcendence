import { List, ListItem } from "@mui/material";
import React from "react";

const filterData = (query: string, data: {[key: string]: any}) => {
	console.log("data na filterData", data);
	if (!query) {
	  return data;
	} else {
	  return data.filter((d: {[key: string]: any}) => {
		console.log(d.name);
		return d.name.includes(query)
	  });
	}
};

export const SearchGroupsList = ({ groupsList, searchQuery } : { groupsList : {[key: string]: any}, searchQuery : string }) => {
	console.log("groups list dentro da search", groupsList)
	if (searchQuery.length >= 1) {
		return (
			<List style={{ padding: 3 }}>
			{
				filterData(searchQuery, groupsList).map((group : {[key: string]: any}) => (
				<ListItem
					sx={{
					padding: 'inherited',
					color: "gray",
					margin: 'inherited',
					}}
					key={group.name}
				>
					{group.name}
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

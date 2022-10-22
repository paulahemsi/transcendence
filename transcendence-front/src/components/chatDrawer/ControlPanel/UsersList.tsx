import React from "react";

const filterData = (query: string, data: string[]) => {
	if (!query) {
	  return data;
	} else {
	  return data.filter((d: string) => d.toLowerCase().includes(query));
	}
};

export const UsersList = ({ usersName, searchQuery } : { usersName : string[], searchQuery : string }) => {
	return (
		<div style={{ padding: 3 }}>
		{
			filterData(searchQuery, usersName).map((d) => (
			<div
				style={{
				padding: 5,
				justifyContent: "normal",
				fontSize: 20,
				color: "blue",
				margin: 1,
				width: "250px",
				borderWidth: "10px"
				}}
			>
				{d}
			</div>
			))
		}
	</div>
	)
}

export default UsersList

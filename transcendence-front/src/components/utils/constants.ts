
export const DEFAULT_TOAST_MSG = "ooops, something went wrong";

export const LIST_CSS = { 
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

export const typographyCSS = {
	color: '#212980',
	fontFamily: 'Orbitron',
	fontWeight: 600,
	fontSize: '5vh',
	paddingLeft: '1.7vh',
	whiteSpace: 'pre-wrap', overflowWrap: 'break-word', width: '24vw'
}

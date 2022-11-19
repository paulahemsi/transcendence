
export type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
export type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>
export type numberSetState = React.Dispatch<React.SetStateAction<number>>
export type arraySetState = React.Dispatch<React.SetStateAction<string[]>>
export type anchorSetState = React.Dispatch<React.SetStateAction<null | HTMLElement>>

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

export const messagesBorderCSS = {
	minWidth: '50vw',
	height: '64vh',
	background: '#F5F5F5',
	border: 4,
	borderColor: '#212980',
	borderRadius: 3,
	boxShadow: 5
}

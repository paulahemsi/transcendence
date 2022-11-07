import React, { FunctionComponent } from "react";
import { EnableTwoFactorAuthDialog } from "./EnableTwoFactorAuth";
import { DisableTwoFactorAuthDialog } from "./DisableTwoFactorAuth";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
    open: boolean;
    setOpen: booleanSetState;
	userData: { [key: string]: any; };
	setUserData: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>;
}

export const ConfigTwoFactorAuthDialog : FunctionComponent<Props> = ({ open, setOpen, userData, setUserData }) => {
	return (
		<>
		{
			userData.hasTwoFactorAuth ?
			<DisableTwoFactorAuthDialog
				open={open}
				setOpen={setOpen}
				userData={userData}
				setUserData={setUserData}
			/> :
			<EnableTwoFactorAuthDialog
				open={open}
				setOpen={setOpen}
				userData={userData}
				setUserData={setUserData}
			/>
		}
		</>
	)
}

import { type JSX } from "react";

import { Receipt } from "./_components/Receipt";

export default function Page(): JSX.Element {
	return (
		<div className={"mx-auto mt-4 max-w-100 px-2"}>
			<Receipt />
		</div>
	);
}

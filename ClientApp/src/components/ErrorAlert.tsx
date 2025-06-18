import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import * as v from 'valibot';

export function Erroralert({
	error,
}: {
	error: FetchBaseQueryError | SerializedError;
}) {
	const errorSchema = v.object({
		message: v.string(),
	});

	if ('data' in error) {
		const errorMsg = v.safeParse(errorSchema, error.data);
		if (errorMsg.success) {
			return (
				<div style={{ color: 'red', padding: '8px', margin: '8px 0' }}>
					{errorMsg.output.message}
				</div>
			);
		}
		return <div>erro ao procurar sala</div>;
	}
	return <div>erro ao procurar sala</div>;
}

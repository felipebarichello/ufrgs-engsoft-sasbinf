import { getAuthToken } from './auth';

export class HeaderBuilder {
	private headers: Record<string, string> = {};

	public withAuthToken(): this {
		this.headers['Authorization'] = `Bearer ${getAuthToken() ?? ''}`;
		return this;
	}

	public build(): Record<string, string> {
		return { ...this.headers };
	}
}

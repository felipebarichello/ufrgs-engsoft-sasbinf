export function getAuthToken(): string | null {
	return sessionStorage.getItem('authToken');
}

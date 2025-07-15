const baseUrl = 'http://localhost:8080/api';

export const loginService = async ({ email, password }) => {
    return await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        })
    }

export const fetchURLAnalysisData = async () => {
    return await fetch(`${baseUrl}/urldata`, {
        headers: {  'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    });
}
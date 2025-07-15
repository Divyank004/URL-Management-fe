import { URLAnalysisResult } from '../types';

const baseUrl = 'http://localhost:8080/api';

// TODO handle response data and add response types
export const loginService = async ({ email, password }) => {
    return await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        })
    }

export const fetchAllURLsAnalysisData = async () => {
    return await fetch(`${baseUrl}/urldata`, {
        headers: {  'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    });
}

export const fetchSingleURLAnalysisData = async (id: number) => {
    return await fetch(`${baseUrl}/urldata/${id}`, {
        headers: {  'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    });
}

export const postNewUrl = async (newEntry: URLAnalysisResult) => {
    return await fetch(`${baseUrl}/addurl`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
         },
        body: JSON.stringify(newEntry),
        })
}
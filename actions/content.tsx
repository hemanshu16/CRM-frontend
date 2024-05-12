import { APIResponseAllContent } from "../src/models/APIResponseAllContent";
import { Content } from "../src/models/content";

const baseURL: string = import.meta.env.BASE_URL;


export const fetchAllContent = async (): Promise<any> => {
    const requestOptions: RequestInit = {
        method: "GET"
    };

    const data: APIResponseAllContent = await _request(baseURL + "/api/content", requestOptions)

    return data.payload;

}

export const newContent = async (content: Content): Promise<any> => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(content);

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
    };

    return await _request(baseURL + "/api/content", requestOptions);
}

export const updateContent = async (content: Content,contentId:string): Promise<any> => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(content);

    const requestOptions: RequestInit = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
    };

    return await _request(baseURL + "/api/content/" + contentId, requestOptions)

}

export const deleteContent = async (contentId: string): Promise<any> => {

    const requestOptions: RequestInit = {
        method: "DELETE"
    };

    return await _request(baseURL + "/api/content/" + contentId, requestOptions);

}


const _request = async (url: string, requestOptions: RequestInit) => {

   
        const response = await fetch(url, requestOptions)
        const data = await response.json();
        if (response.status == 400 || response.status == 404 || response.status == 500) {
            throw new Error(data.payload);
        }
        return data;
    

}

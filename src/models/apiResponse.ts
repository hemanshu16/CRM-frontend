class APIResponse {
    payload: any;
    timestamp : string;
    constructor(payload : any) {
        this.payload = payload;
        this.timestamp = new Date().toISOString();
    }
}

export default APIResponse;
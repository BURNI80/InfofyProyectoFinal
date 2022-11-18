import Global from "../Global/Global";

const redirect_uri = Global.redirect_uri ;
const client_id = Global.client_id ;
const client_secret = Global.client_secret ;

export const spotyfyAuthCall = async (code) => {
    try {
        const searchParams = new URLSearchParams({
            code: code,
            grant_type: "authorization_code",
            redirect_uri: redirect_uri,
            client_id: client_id,
            client_secret: client_secret,
        });
        console.log("p:" + searchParams);
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: searchParams,
        });
        return await response.json();
    } catch (error) {
        console.log(error);
    }
};
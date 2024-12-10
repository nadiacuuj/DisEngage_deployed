async function getUserInfo(){
    const userId = localStorage.getItem("token");
    const response = await fetch("https://disengage-backend-270035954698.us-central1.run.app/api/getUserInfo", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${userId}`
        }
    })
    const data = await response.json()
    console.log("FETCH", data) //testing
    return data
  }

export default getUserInfo;
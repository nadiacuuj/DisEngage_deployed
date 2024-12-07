async function getUserInfo(){
    const userId = localStorage.getItem("token");
    const response = await fetch("http://127.0.0.1:8000/api/getUserInfo", {
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
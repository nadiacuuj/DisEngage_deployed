import getUserInfo from "./getUserInfo";

async function updateUser(event_id){
    let userInfo = getUserInfo();
    const userId = localStorage.getItem("token");

    const test_ids = event_id
    const updateUserBody = 
    {
      token: userId,
      google_id: userInfo['google_id'],
      event_ids:test_ids,
    };

    const response = await fetch("http://127.0.0.1:8000/api/updateEngageEvents", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
      },
        body: JSON.stringify(updateUserBody),
    });
    return response   
  }

export default updateUser;
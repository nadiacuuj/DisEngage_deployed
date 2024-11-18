import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OAuth2Callback() {
  const navigate = useNavigate();
  const [requestInProgress, setRequestInProgress] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    

    if (code) {
      console.log('Authorization code received:', code);
      
      const requestBody = { code: code };
      console.log('Request body being sent:', requestBody);

      if (requestInProgress) {
        console.warn('Request already in progress, skipping duplicate POST');
        return;
      }
  
      setRequestInProgress(true);

      fetch('http://localhost:8000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
      .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          return response.text().then(text => {
            console.error('Error response:', text);
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Success response:', data);
        localStorage.setItem('token', data['access_token']);
        const tokenTest = localStorage.getItem("token");
        console.log(`TOKENT TESTING: ${tokenTest}`)
        navigate('/landing');
      })
      .catch(error => {
        console.error('Fetch error:', error);
        navigate('/login');
      })
      .finally(() => {
        setRequestInProgress(false);
      });
    } else {
      console.error('No authorization code found in URL');
    }
  }, [navigate]);

  return <div>Processing login...</div>;
}
export default OAuth2Callback;
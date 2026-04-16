const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:5000/api';
let token = '';

async function runFullTest() {
    try{
        console.log('Running test...');
        //Test login

        const loginRes = await axios.post(`${BASE_URL}/users/login`, {
            email: "test3@gmail.com",
            password: "test3"
        });
        token = loginRes.data.token;
        console.log('Login Success! Token Acquired');

        const form = new FormData();
        form.append('username', 'Noah_Automated');
        form.append('bio', 'Tested by script at' + new Date().toLocaleTimeString());
        //Test image to be added
        form.append('profilePic', fs.createReadStream('./test-image.jpg'));

        const updateRes = await axios.post(`${BASE_URL}/profile/update`, {
            headers:{
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("PROFILE UPDATE SUCCESS", updateRes.data.username);

        //Test fresh data fetch (/me)

        const meRes = await axios.post(`${BASE_URL}/users/me`, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });

        if(meRes.data.user.profilePic && meRes.data.user.bio.includes('Tested')){
            console.log('DATA PERSISTENCE VERIFIED IN DATABASE');
        }

        console.log("ALL SYSTEMS NORMAL")

    }catch(err){
        console.log(err);
    }
}
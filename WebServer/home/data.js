import { fetchConversation, fetchAllMessage} from './chatScript.js';
function my_data()
{
    fetch('/api/data/')
    .then(response => {
        if (!response.ok) {
            window.location.href = "/";
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // console.log(data);
        const userData = JSON.parse(JSON.stringify(data));
        // Update user information in the DOM
        document.getElementById('login').textContent = userData.username;
        document.getElementById('login').classList.add(userData.id);
        document.getElementById('content_scor').textContent = userData.score;
        // console.log(data.id);
    
        fetchConversation(data.id, data.username);
        fetchAllMessage(data.id, data.username);
        if (userData.username ) {
            document.getElementById('nameprofile').textContent = userData.username;
        }
        document.getElementById('content_rank').textContent = userData.ranking;
        
        
        const settingsForm = document.getElementById('profil');
        if (document.querySelector('.profile-settings-img') == null)
        {
            const img3 = createProfileImage(userData.photo_profile, "2px solid black");
            img3.classList.add('profile-settings-img');
            settingsForm.prepend(img3);
        }
        else{
            document.querySelector('.profile-settings-img').src = userData.photo_profile
        }
        // Add user profile picture to profileid
        if (document.querySelector('.image-profile-id') == null){
            const imgpro = document.getElementById('profileid');
            const img2 = createProfileImage(userData.photo_profile, "2px solid cyan");
            img2.classList.add('image-profile-id');
            imgpro.appendChild(img2);
        }
        else{
            document.querySelector('.image-profile-id').src = userData.photo_profile
        }
        
        // Add user profile picture to imageprofile
        if (document.querySelector('.image-profile-user') == null){
            const profiles = document.getElementById('imageprofile');
            const img = createProfileImage(userData.photo_profile, "2px solid black");
            img.classList.add('image-profile-user')
            profiles.appendChild(img);
        }
        else{
            document.querySelector('.image-profile-user').src =  userData.photo_profile;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    my_data();
});



// Helper function to create profile image
function createProfileImage(src, border) {
    const img = document.createElement('img');
    img.src = src;
    img.style.borderRadius = "50%";
    img.style.border = border;
    return img;
}
export {my_data}
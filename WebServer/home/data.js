document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/data/')
        .then(response => {
            if (!response.ok) {
                window.location.href = "/";
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const userData = JSON.parse(JSON.stringify(data));
            // Update user information in the DOM
            document.getElementById('login').textContent = userData.username;
            document.getElementById('login').classList.add(userData.id);
            document.getElementById('content_scor').textContent = userData.score;
            if (userData.username ) {
                document.getElementById('nameprofile').textContent = userData.username;
            }
            document.getElementById('content_rank').textContent = userData.ranking;
            
            // Add user profile picture to settings form
            const settingsForm = document.getElementById('profil');
            const img3 = createProfileImage(userData.photo_profile, "2px solid black");
            img3.classList.add('profile-settings-img');
            settingsForm.prepend(img3);
            
            // Add user profile picture to profileid
            const imgpro = document.getElementById('profileid');
            const img2 = createProfileImage(userData.photo_profile, "2px solid cyan");
            img2.classList.add('image-profile-id');
            imgpro.appendChild(img2);
            
            // Add user profile picture to imageprofile
            const profiles = document.getElementById('imageprofile');
            const img = createProfileImage(userData.photo_profile, "2px solid black");
            img.classList.add('image-profile-user')
            profiles.appendChild(img);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// Helper function to create profile image
function createProfileImage(src, border) {
    const img = document.createElement('img');
    img.src = src;
    img.style.borderRadius = "50%";
    img.style.border = border;
    return img;
}

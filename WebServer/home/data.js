document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/data/')
        .then(response => {
            if (!response.ok) {
                window.location.href = "/";
            }
            return response.json();
        })
        .then(data => {
            const userData = JSON.parse(JSON.stringify(data));
            document.getElementById('login').textContent =  userData.username;
            document.getElementById('content_scor').textContent =  userData.score;
            document.getElementById('content_scor').style.color = "cyan";
            document.getElementById('content_scor').style.fontWeight = "bold";
            document.getElementById('content_scor').style.fontSize = "20px";
            document.getElementById('content_scor').style.marginLeft = "10px";
            document.getElementById('nameprofile').textContent =  userData.username;
            document.getElementById('content_rank').textContent = userData.ranking;
  
            var settingsform = document.getElementById('settings-form');
            var img3 = document.createElement('img');
            img3.src = userData.photo_profile;
            img3.style.borderRadius = "50%";
            img3.style.border = "2px solid black";
            settingsform.prepend(img3);
            /*  */
            var imgpro= document.getElementById('profileid');
            var img2 = document.createElement('img');
            img2.style.borderRadius = "50%";
            img2.style.border = "2px solid cyan";
            img2.src = userData.photo_profile;
            imgpro.appendChild(img2);
            // profileid.appendChild(img);
            var profiles = document.getElementById('imageprofile');
            var img = document.createElement('img');
            img.style.borderRadius = "50%";
            img.style.border = "2px solid black";
            img.src = userData.photo_profile;
            profiles.appendChild(img);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
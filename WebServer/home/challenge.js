function ft_show_profile()
{
    // document.getElementById('home').style.display = 'none';
    // document.getElementById('card-container').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/suggest/')
        .then(response => {
            if (!response.ok) {
                window.location.href = "/";
            }
            return response.json();
        })
        .then(data => {
            var reward = document.getElementById('challenge_friend');
            for (let i = 0; i < data.length; i++) {

                let container = document.createElement('div');
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                // var show_profile = document.createElement('button');

                let img = document.createElement('img');
                img.src = data[i].photo_profile;
                img.style.width = "40px";
                img.style.height = "40px";
                img.style.borderRadius = "50%";
                img.style.border = "2px solid black";
                let div = document.createElement('div');
                div.style.width = "30%";
                

                let username = document.createElement('p');
                username.textContent = data[i].username;
                div.appendChild(username);
                let addfriend = document.createElement('button');
                addfriend.textContent = "challenge friend";
                addfriend.id = data[i].username;

                // show_profile.appendChild(img);
                // show_profile.addEventListener('click', ft_show_profile);
                container.appendChild(img);
                container.appendChild(div);

                container.appendChild(addfriend);
                reward.appendChild(container);
                reward.appendChild(document.createElement('br'));
            }
        })

});
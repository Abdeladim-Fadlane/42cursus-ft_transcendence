
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.profile_photo_form').addEventListener('submit', (e)=>{
        e.preventDefault();
        // console.log(document.querySelector('.profile_photo_form'))
        fetch('/api/csrf-token/')
        .then(response => response.json())
        .then(data => {
            document.querySelector('#crcf_profileuser').value = data.csrfToken;
            const form = new FormData(document.querySelector('.profile_photo_form'));
            fetch('/change_profile/', {
                method: 'POST',
                body: form,
                headers: {
                    'X-CSRFToken': document.querySelector('#crcf_profileuser').value,
                }
            })
            .then(response => response.json())
            .then(data => {
                // console.log(data);image-profile-user  image-profile-id
                // fetchRequests();
                // document.querySelectorAll()
                document.querySelector('.profile-settings-img').src = data.photo_profile;
                document.querySelector('.image-profile-user').src = data.photo_profile;
                document.querySelector('.image-profile-id').src = data.photo_profile;
            })
        })
        
    })
})
document.querySelector('#image').addEventListener('input', (e)=>{
    e.preventDefault();
    let type_file = e.target.files[0].type.startsWith('image/');
    if (e.target.value.length != 0 && type_file)
        document.querySelector('#button_profile_click').click();
});

document.addEventListener('DOMContentLoaded', function() {
    
    fetch('/api/csrf-token/')
      .then(response => response.json())
      .then(data => {
          document.getElementById('crcf').value = data.csrfToken;
      })
      .catch(error => console.error('Error fetching CSRF token:', error));
    });
    document.getElementById('avatarForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const csrfToken = document.getElementById('crcf').value;
        fetch('/update_profile/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': csrfToken,
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === true) {
                    window.location.href = "/home/";
            } else {
                document.getElementById('messages').innerHTML =  data.message;
                document.getElementById('messages').style.color = 'red';
            }
        })
        .catch(error => {
            document.getElementById('messages').innerHTML = error;
            document.getElementById('messages').style.color = 'red';
        });
});

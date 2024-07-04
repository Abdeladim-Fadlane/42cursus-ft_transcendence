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

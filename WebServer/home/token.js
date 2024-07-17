document.addEventListener('DOMContentLoaded', function() {
    
    fetch('/api/csrf-token/')
      .then(response => response.json())
      .then(data => {
          document.getElementById('crcf').value = data.csrfToken;
        })
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
                var msg = document.getElementById('messages');
                msg.innerHTML = data.message;
            }
        })
});


document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/csrf-token/')
      .then(response => response.json())
      .then(data => {
          document.getElementById('crcf2').value = data.csrfToken;
      })
      .catch(error => console.error('Error fetching CSRF token:', error));
    });

    document.getElementById('passwordForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const csrfToken = document.getElementById('crcf2').value;
        fetch('/change_password/', {
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
                document.getElementById('messages1').innerHTML =  data.message;
            }
        })
});

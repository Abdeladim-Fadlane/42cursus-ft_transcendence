import { my_data } from './data.js';

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
        
            document.querySelector('.profile-settings-img').src = data.photo_profile;
            document.querySelector('.image-profile-user').src = data.photo_profile;
            document.querySelector('.image-profile-id').src = data.photo_profile;
        })
    })
    
})


let imageInput = document.querySelector('#image');
let buttonProfileClick = document.querySelector('#button_profile_click');



imageInput.addEventListener('input', (e) => {
    e.preventDefault();
    console.log('is here when you clicked')
    let type_file = e.target.files[0]?.type.startsWith('image/');
    if (e.target.value.length !== 0 && type_file) {
        buttonProfileClick.click();
    }
});


// from ba9a makhadmach 

// console.log('is one here======>');
// document.querySelector('.submit').addEventListener('click', ()=>{
//     console.log('donnene')
// })
// console.log(document.querySelector('.submit'))
// .addEventListener('click', function(event) {
//     console.log('dooone');
// }))

    // event.preventDefault();
    // console.log('is here when you submiting the form of setting');
    // const formData = new FormData(this);
    // const csrfToken = document.getElementById('crcf').value;
    // fetch('/update_profile/', {
    //     method: 'POST',
    //     body: formData,
    //     headers: {
    //         'X-CSRFToken': csrfToken,
    //     }
    // })
    // .then(response => response.json())
    // .then(data => {
    //     if (data.status === true) {
    //         document.getElementById('settings-modal').style.display = 'none';
    //         my_data();
    //     } else {
    //         var msg = document.getElementById('messages');
    //         msg.innerHTML = data.message;
    //     }
    // })
// });
// });


document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/csrf-token/')
      .then(response => response.json())
      .then(data => {
          document.getElementById('crcf2').value = data.csrfToken;
      })
      .catch(error => console.error('Error fetching CSRF token:', error));
    });

    document.addEventListener('DOMContentLoaded', function() {
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
                    document.getElementById('settings-modal').style.display = 'none';
                } else {
                    document.getElementById('messages1').innerHTML = data.message;
                }
            })
        });
    });
    

import { my_data } from './data.js';
console.log('989898989')
const form0 = document.querySelector('.profile_photo_form');
form0.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const csrfToken = document.querySelector('#crcf_profileuser');
    const dataForm = new FormData(e.target);
    await fetch('/api/csrf-token/')
    .then(response => response.json())
    .then(data => {
        csrfToken.value = data.csrfToken;
    })
    await fetch('/change_profile/', {
        method: 'POST',
        body: dataForm,
        headers: {
            'X-CSRFToken': csrfToken.value,
        }
    })
    .then(response => response.json())
    .then(data => {
    
        document.querySelector('.profile-settings-img').src = data.photo_profile;
        document.querySelector('.image-profile-user').src = data.photo_profile;
        document.querySelector('.image-profile-id').src = data.photo_profile;
    })
    
});
const imageSetting = document.querySelector('.edit');
const imageInput = document.querySelector('#image');
const buttonInput = document.querySelector('#button_profile_click')
// imageSetting.addEventListener('click', ()=>{
//     imageInput.click();
// })
console.log(imageInput);
imageInput.addEventListener('input', (e)=>{
    e.preventDefault();
    let type_file = e.target.files[0].type.startsWith('image/');
    if (e.target.value.length != 0 && type_file)
        buttonInput.click();
});


const  form1  = document.querySelector('#avatarFrom');
form1.addEventListener('submit', async (e)=>{
    const csrfToken1 = document.querySelector('#crcf')
    const dataFrom = new FormData(e.target);
    e.preventDefault();
    await fetch('/api/csrf-token/')
    .then(response => response.json())
    .then(data => { 
        csrfToken1.value = data.csrfToken
    })
    await fetch('/update_profile/', {
        method: "POST",
        body : dataFrom,
        headers : {
            'X-CSRFToken': csrfToken1.value,
        }
    })
    .then(response => response.json())
    .then(data=>{
        if (data.status === true) {
            document.getElementById('settings-modale').style.display = 'none';
            my_data();
        } else {
            var msg = document.getElementById('messages');
            msg.innerHTML = data.message;
        }
    })
})

const form2 =  document.querySelector('#passwordForm');

form2.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const csrfToken2 = document.querySelector('#crcf2');
    const  dataForm = new FormData(e.target);
    await fetch('/api/csrf-token/')
    .then(response => response.json())
    .then(data =>{
        csrfToken2.value = data.csrfToken 
    })
    await fetch('/change_password/', {
        method : 'POST',
        body : dataForm,
        headers : {
            'X-CSRFToken': csrfToken2.value,
        }
    })
    .then(response => response.json())
    .then(data =>{
        if (data.status === true) {
            document.getElementById('settings-modale').style.display = 'none';
        } else {
            document.getElementById('messages1').innerHTML = data.message;
        }
    })
})
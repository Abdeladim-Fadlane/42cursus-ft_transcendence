import { my_data } from './data.js';
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
const imageSetting = document.querySelector('.setting_profile');
const imageInput = document.querySelector('#image');
const buttonInput = document.querySelector('#button_profile_click')
imageSetting.addEventListener('click', ()=>{
    imageInput.click();
})
console.log(imageInput);
imageInput.addEventListener('input', (e)=>{
    e.preventDefault();
    let type_file = e.target.files[0].type.startsWith('image/');
    if (e.target.value.length != 0 && type_file)
        buttonInput.click();
});

const Setting_msg = document.querySelector('.setting-msg');
function display_status(status, error){
    const icon = Setting_msg.querySelector('i');
    const msg = Setting_msg.querySelector('.setting-msg-text')
    if (status === true){
        Setting_msg.style.border = '1px solid rgba(0, 180, 0, 0.219)';
        Setting_msg.style.backgroundColor = 'rgba(0, 128, 0, 0.219)';
        icon.className = 'fa-solid fa-circle-check';
        icon.style.color = 'green';
        msg.textContent =  'your information has been saved.';
        Setting_msg.borderColor = 'green';
        msg.style.color = 'green';
    }
    else {
        Setting_msg.style.border = '1px solid rgba(180, 0, 0, 0.219)';
        Setting_msg.style.backgroundColor = 'rgba(128, 0, 0, 0.219)';
        icon.className ='fa-solid fa-circle-exclamation';
        icon.style.color = 'red';
        msg.textContent = error;
        msg.style.color = 'red';
    }
    Setting_msg.style.transform = 'rotateX(0deg)';
    setTimeout(() => {
        Setting_msg.style.transform = 'rotateX(90deg)';
        
    }, 4000);
}

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
            my_data();
        }
        // else {
        //     var msg = document.getElementById('messages');
        //     msg.innerHTML = data.message;
        // }
        display_status(data.status, data.message)
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
        // if (data.status === true) {
        //     document.getElementById('settings-modale').style.display = 'none';
        // } 
        // else {
        //     document.getElementById('messages1').innerHTML = data.message;
        // }
        // console.log(data)
        display_status(data.status, data.message);
    })
})
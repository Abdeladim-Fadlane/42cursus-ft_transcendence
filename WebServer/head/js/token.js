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
        if (data.status == true)
            my_data();
        display_status(data.status, data.message);

    })
    
});
const imageSetting = document.querySelector('.setting_profile');
const imageInput = document.querySelector('#image');
const buttonInput = document.querySelector('#button_profile_click')
imageSetting.addEventListener('click', ()=>{
    imageInput.click();
})

imageInput.addEventListener('input', (e)=>{
    e.preventDefault();
    // type = ['']
    if (!e.target.files[0])
        return ;
    var type_file = e.target.files[0].type.startsWith('image/');
    var size_image = e.target.files[0].size;
    console.log(e.target.files[0].type);
    console.log(size_image);
    if (e.target.value.length != 0 && type_file  === true && size_image <= (1048576 * 2))
    {
        // console.log('is here when you go')
        buttonInput.click();
    }
    else
    {
        // console.log('is error when you go to have');
        display_status(false, 'Error try to chose another image');
    }
    // console.log('---------------------------------------')
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
    const regix_str = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!regix_str.test(form1.querySelector('#email').value))
    {
        display_status(false, 'Email not valid')
        return ;
    }
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
        display_status(data.status, data.message)
    })
})

const form2 =  document.querySelector('#passwordForm');

form2.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const inputs = document.querySelectorAll('input');
    console.log(inputs);
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
        display_status(data.status, data.message);
    })
})
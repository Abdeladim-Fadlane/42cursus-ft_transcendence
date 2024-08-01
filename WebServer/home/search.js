import { view_profile } from './userInformation.js';
let search = document.querySelector('.search-input')
function hasNonPrintableChars(inputString) {
    if (inputString.length == 0)
        return true;
    for (var i = 0; i < inputString.length; i++) {
        var code = inputString.charCodeAt(i);
        if (code <= 32 || code >= 126) 
        {
            return true;
        }
    }
    return false;
}
let div_user = document.querySelector('.users-search-bar')
let d = true;
let index = 0;
let text = 'Search ...'
function do_event(e)
{
    if (d == true)
    {
        search.placeholder += text[index++]
        if (search.placeholder.length == text.length)
            d = false;
    }
    else
    {
        search.placeholder = search.placeholder.substr(0, index--)
        if (search.placeholder.length == 0)
        {
            index = 0
            d = true;
        }
    }
}

let interval_serch = setInterval(do_event, 500);
search.addEventListener('blur', function() {
    index = 0;
    interval_serch = setInterval(do_event, 500);
});
search.addEventListener('focus', function(e) {
    e.target.placeholder = '';
    clearInterval(interval_serch);

});
search.addEventListener('keyup', ()=>{
    if (hasNonPrintableChars(search.value) == false)
    {
        // clearInterval(interval_serch);
      
        fetch('/api/users/')
        .then(response => {
            if (!response.ok) {
                window.location.href = "/";
            }
            return response.json();
        })
        .then(data => {
            div_user.textContent = "";
            console.log(data);
            for (let i = 0; i < data.length ;i++)
            {
                if (data[i].username.includes(search.value))
                {
                    let div = document.createElement('div');
                    div.classList.add('div-search-user');
                    div.style.display = 'block';
                    let username = document.createElement('p');
                    let img = document.createElement('img');
                    img.classList.add('search-photo_profile')
                    img.src = data[i].photo_profile;
                    div.id = data[i].username;
                    username.classList.add('search-username')
                    div.append(img ,username);
                    username.textContent = data[i].username;
                    div.addEventListener('click', view_profile);
                    div_user.append(div);
                }
            }
        })
        .catch(error=>{
            console.log(error);
        })
        div_user.style.display = 'inline';
    }
    else if (search.value.length == 0)
    {
        div_user.textContent = '';
    }
})


let icon_search = document.querySelector('#search-icon');
let isdone = false;
icon_search.addEventListener('click', () =>{
    if (!isdone)
    {
        // icon_search.style.display = 'none';
        // console.log(icon_search.style.display);
        search.style.transform = 'rotateY(0deg)';
        isdone = true;
    }
    else if (isdone){
        // icon_search.style.display = 'inline';
        search.style.transform = 'rotateY(90deg)';
        isdone = false;
    }
})

document.addEventListener('click', function(event) {
    let div_search =  document.querySelector('.nav-search');
    // icon_search.style.display = 'inline';
    if (!div_search.contains(event.target))
    {
        isdone = false;
        search.value = '';
        search.style.transform = 'rotateY(90deg)' 
        div_user.textContent = '';
    }
})
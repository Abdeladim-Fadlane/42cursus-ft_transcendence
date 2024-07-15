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
search.addEventListener('keyup', ()=>{
    div_user.textContent = "";
    if (hasNonPrintableChars(search.value) == false)
    {
        div_user.style.display = 'inline';
        let tab_user = [
            {
                'username' : 'akatfi'
            },
            {
                'username': 'mkatfi'
            }
        ];
        // fetch('/api/suggest/')
        // .then(response => {
        //     if (!response.ok) {
        //         window.location.href = "/";
        //     }
        //     return response.json();
        // })
        // .then(data => {
        //     console.log(data);
        // })
        // .catch(error=>{
        //     console.log(error);
        // })
        for (let i = 0; i < tab_user.length ;i++)
        {
            if (tab_user[i].username.includes(search.value))
            {
                console.log(tab_user[i].username)
                let div = document.createElement('div');
                div.classList.add('div-search-user');
                div.id = tab_user[i].username;
                div.style.display = 'block';
                let username = document.createElement('p');
                username.classList.add('search-username')
                div.append(username);
                username.textContent = tab_user[i].username;
                div_user.append(div);
                div.addEventListener('click', view_profile);
                // div_user.style.color = 'white';
            }
        }
    }
    else
        div_user.style.display = 'none';
})

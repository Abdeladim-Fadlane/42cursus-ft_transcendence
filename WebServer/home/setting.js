document.getElementById('profil').addEventListener('click', function() {
    document.getElementById('image').click();
});
function closedelete() {
    document.getElementById('modal_delete').style.display = 'none';
}
function delete_funcyion()
{
    document.getElementById('modal_delete').style.display = 'flex';
    document.getElementById('settings-modal').style.display = 'none';
}

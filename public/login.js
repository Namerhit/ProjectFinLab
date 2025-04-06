let isLoggedIn = false; 

$(document).ready(function() {
    updateUI();

    $('#login-form').on('submit', function(event) {
        event.preventDefault();

        isLoggedIn = true; 
        updateUI();
    });
});

function updateUI() {
    if (isLoggedIn) {
        $('.account-name').text('User Name'); 
        $('#login-button').hide(); 
        $('#profile-dropdown').append(`
            <ul>
                <li><a href="#settings" id="settings" style="color: black;">Налаштування</a></li>
                <li><a href="#logout" style="color: black;">Вийти</a></li>
                <li><a href="#signup" style="color: black;">Зареєструватися</a></li>
            </ul>
        `);
    } else {
        $('.account-name').text('Log In'); 
        $('#login-button').show(); 
        $('#profile-dropdown').empty(); 
    }
}
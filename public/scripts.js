$(document).ready(function(){
    const account = $('.account');
    const dropdownMenu = $('#profile-dropdown');
    const settingsPopup = $('.settings-popup');
    const settingsButton = $('#open-settings');
    const closeButton = $('#close-popup');
    const themeToggle = $('#theme-toggle');
    const root = $('html');
    const logoutButton = $('.logout');
    const userNameElement = $('.account-name');

    // Load components
    loadComponent("footer.html", "footer-container");

    // Initialize user name from cookie
    const userName = getCookie('userName') || 'Ім\'я Користувача';
    userNameElement.text(userName);

    // Account dropdown
    account.click(function(){
        dropdownMenu.show();
    });

    // Document click handler
    $(document).click(function(event){
        if(!account.is(event.target) && !dropdownMenu.is(event.target) && dropdownMenu.has(event.target).length === 0) {
            dropdownMenu.hide();
        }
    });
    
    // Theme toggle
    const savedTheme = localStorage.getItem('theme') || 'light';
    root.attr('data-theme', savedTheme);
    themeToggle.prop('checked', savedTheme === 'dark');

    themeToggle.change(function(){
        const newTheme = this.checked ? 'dark' : 'light';
        root.attr('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Settings popup
    settingsButton.click(function(event) {
        event.preventDefault();
        settingsPopup.show();
        $('body').css('overflow', 'hidden'); 
    });

    closeButton.click(function() {
        settingsPopup.hide();
        $('body').css('overflow', 'auto');
    });

    // Change login link to name change dialog
    $('a[href="#change-name"]').attr('href', '#').click(function(e) {
        e.preventDefault();
        showNameChangeDialog();
    });

    // Logout functionality
    logoutButton.click(function() {
        if(confirm('Ви впевнені, що хочете вийти? Це очистить ваше ім\'я та всі операції.')) {
            // Clear user name
            setCookie('userName', '', -1);
            userNameElement.text('Ім\'я Користувача');
            
            // Clear operations if on tracker page
            if(typeof window.clearAllOperations === 'function') {
                window.clearAllOperations();
            }
            
            // Close settings
            settingsPopup.hide();
            $('body').css('overflow', 'auto');
            
            alert('Ви успішно вийшли. Ваше ім\'я та дані очищено.');
        }
    });

    // Name change dialog
    function showNameChangeDialog() {
        const nameDialog = $(`
            <div class="popup-overlay" id="name-change-dialog">
                <div class="popup-content">
                    <button class="close-popup">&times;</button>
                    <h2>Введіть ваше ім'я</h2>
                    <input type="text" id="name-input" value="${userName}" placeholder="Ваше ім'я">
                    <button id="save-name">Зберегти</button>
                </div>
            </div>
        `);
        
        $('body').append(nameDialog);
        $('#name-change-dialog').css('display', 'flex');
        
        // Close dialog
        nameDialog.find('.close-popup').click(function() {
            nameDialog.remove();
        });
        
        // Save name
        $('#save-name').click(function() {
            const newName = $('#name-input').val().trim();
            if(newName) {
                setCookie('userName', newName, 365);
                userNameElement.text(newName);
                nameDialog.remove();
                alert('Ім\'я успішно збережено!');
            } else {
                alert('Будь ласка, введіть ваше ім\'я');
            }
        });
    }
});

// Cookie helper functions
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
}

function loadComponent(url, containerId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
        })
        .catch(error => console.error(`Помилка завантаження ${url}:`, error));
}
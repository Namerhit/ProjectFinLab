document.addEventListener('DOMContentLoaded', function() {
    
    const addItemButtons = document.querySelectorAll('.add-item');
    
    addItemButtons.forEach(button => {
        button.addEventListener('click', function() {
            const list = this.previousElementSibling;
            const newItem = document.createElement('li');
            newItem.className = 'item';
            newItem.innerHTML = `
                <div class="item-content" contenteditable="true">New item</div>
                <i class="fas fa-times remove-item"></i>
            `;
            list.appendChild(newItem);
            const contentDiv = newItem.querySelector('.item-content');
            contentDiv.focus();
            
            
            newItem.querySelector('.remove-item').addEventListener('click', function() {
                newItem.remove();
            });
        });
    });
    
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.parentElement.remove();
        });
    });
    
    const mainTitle = document.querySelector('h1');
    mainTitle.addEventListener('click', function() {
        this.focus();
    });
    
    
    const cardTitles = document.querySelectorAll('.card-title');
    cardTitles.forEach(title => {
        title.addEventListener('click', function() {
            this.focus();
        });
    });
});
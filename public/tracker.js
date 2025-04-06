$(document).ready(function(){
    const recommendationsElement = document.querySelector('.recommendations');   

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(nameEQ) === 0) return JSON.parse(c.substring(nameEQ.length));
        }
        return null;
    }

    const income_categories = $(".income-categories");
    const costs_categories = $(".costs-categories");

    let income_chart = [
        ['category', 'value'],
        ['Пусто', 0]
    ];
    let income_all = income_chart[1][1];

    $("#income-piechart").css({backgroundImage: `conic-gradient(var(--green-1) 0 360deg)`});
    income_categories.html('<div class="income-category" id="income-category1"></div>');
    $("#income").text("+" + income_all + " грн");
    $("#income-category1").html(`<div class="circle" id="income-cat1-li"></div> <p>${income_chart[1][0]}</p><p>${income_chart[1][1]} грн</p>`);
    $("#income-cat1-li").css({backgroundColor: 'var(--green-1)'});

    let costs_chart = [
        ['category', 'value'],
        ['Пусто', 0]
    ];
    let costs_all = costs_chart[1][1];

    $("#costs-piechart").css({backgroundImage: `conic-gradient(var(--red-1) 0 360deg)`});
    costs_categories.html('<div class="costs-category" id="costs-category1"></div>');
    $("#costs").text("-" + costs_all + " грн");
    $("#costs-category1").html(`<div class="circle" id="costs-cat1-li"></div> <p>${costs_chart[1][0]}</p><p>${costs_chart[1][1]} грн</p>`);
    $("#costs-cat1-li").css({backgroundColor: 'var(--red-1)'});

    let budget = income_all - costs_all;
    $("#budget").text(budget + " грн");

    let operations = getCookie('operations') || [];
    let currentIndex = 0;
    let editingIndex = null;

    if (operations.length > 0) {
        updatePieChart();
        updateBudget();
        renderOperations();
    }

    $("#operation-type-toggle").on("change", () => {
        if($("#operation-type-toggle").is(":checked")){
            $("#operation-category").html(`
                <option value="Заробітна плата">Заробітна плата</option>
                <option value="Премії та бонуси">Премії та бонуси</option>
                <option value="Підприємницька діяльність">Підприємницька діяльність</option>
                <option value="Державна допомога">Державна допомога</option>
                <option value="Пенсія">Пенсія</option>
                <option value="Стипендія">Стипендія</option>
                <option value="Відсотки по депозитах">Відсотки по депозитах</option>
                <option value="Дивіденди від інвестицій">Дивіденди від інвестицій</option>
                <option value="Орендна плата за майно">Орендна плата за майно</option>
                <option value="Продаж товарів або послуг">Продаж товарів або послуг</option>
                <option value="Грошові перекази">Грошові перекази</option>
                <option value="Доходи від фрілансу">Доходи від фрілансу</option>
                <option value="Виграші у конкурсах та лотереях">Виграші у конкурсах та лотереях</option>
                <option value="Авторські гонорари">Авторські гонорари</option>
                <option value="Криптовалюта та трейдинг">Криптовалюта та трейдинг</option>
            `);
        } else {
            $("#operation-category").html(`
                <option value="Продукти харчування">Продукти харчування</option>
                <option value="Комунальні послуги">Комунальні послуги</option>
                <option value="Оренда житла">Оренда житла</option>
                <option value="Транспортні витрати">Транспортні витрати</option>
                <option value="Одяг та взуття">Одяг та взуття</option>
                <option value="Лікування та медикаменти">Лікування та медикаменти</option>
                <option value="Освіта та курси">Освіта та курси</option>
                <option value="Розваги та відпочинок">Розваги та відпочинок</option>
                <option value="Побутова техніка та електроніка">Побутова техніка та електроніка</option>
                <option value="Мобільний зв'язок та інтернет">Мобільний зв'язок та інтернет</option>
                <option value="Страхування">Страхування</option>
                <option value="Податки та збори">Податки та збори</option>
                <option value="Благодійність">Благодійність</option>
                <option value="Косметика та догляд за собою">Косметика та догляд за собою</option>
                <option value="Ремонт житла та автомобіля">Ремонт житла та автомобіля</option>
            `);
        }
    });

    const addOperationForm = $("#add-operation-form");
    const addOperationButton = $("#add-operation");
    const closeFormButton = $("#close-form");
    const cancelFormButton = $("#cancel-form");

    addOperationButton.on("click", () => {
        addOperationForm.fadeIn(500);
        $("#add-operation-overlay").css("display", "flex");
        addOperationForm.css("display", "block");
        $("#add-operation-form h2").text("Створити операцію");
        editingIndex = null;
        operationForm.trigger("reset");
        $("#operation-type-toggle").prop("checked", false);
    });

    closeFormButton.on("click", () => {
        $(".popup-overlay").fadeOut(500);
        addOperationForm.css("display", "none");
        operationForm.trigger("reset");
    });

    cancelFormButton.on("click", () => {
        $(".popup-overlay").fadeOut(500);
        addOperationForm.css("display", "none");
        operationForm.trigger("reset"); 
    });

    const editOperationPopup = $("#edit-operation-popup");
    const editOperationButton = $("#edit-operation");
    const closeEditButton = $("#close-edit");
    const cancelEditButton = $("#cancel-edit");

    editOperationButton.on("click", () => {
        editOperationPopup.fadeIn(500);
        $("#edit-operation-overlay").css("display", "flex");
        editOperationPopup.css("display", "block");
        renderEditList();
    });

    closeEditButton.on("click", () => {
        $(".popup-overlay").fadeOut(500);
        editOperationPopup.css("display", "none");
    });

    cancelEditButton.on("click", () => {
        $(".popup-overlay").fadeOut(500);
        editOperationPopup.css("display", "none");
    });

    const operationForm = $("#operation-form");
    operationForm.on("submit", (e) => {
        e.preventDefault();
        $(".popup-overlay").fadeOut(500);

        const operation = {
            id: Date.now(),
            name: $("#operation-name").val(),
            description: $("#operation-description").val(),
            type: $("#operation-type-toggle").is(":checked") ? "income" : "expense",
            category: $("#operation-category").val(),
            date: $("#operation-date").val(),
            amount: parseFloat($("#operation-amount").val()),
            notes: $("#operation-notes").val(),
        };

        if (editingIndex !== null) {
            operations[editingIndex] = operation;
            editingIndex = null;
        } else {
            operations.push(operation);
        }

        setCookie('operations', operations, 30);
        renderOperations();
        updateBudget();
        updatePieChart();
        addOperationForm.css("display", "none");
        operationForm.trigger("reset");
    });

    function renderOperations() {
        const operationsList = $(".operations-list");
        operationsList.empty();

        for (let i = currentIndex; i < Math.min(currentIndex + 3, operations.length); i++) {
            const operation = operations[i];
            const operationBlock = $(`
                <div class="operation-block" data-id="${operation.id}">
                    <div class="operation-content">
                        <h3>${operation.name}</h3>
                        <p>${operation.description}</p>
                        <p>${operation.date}</p>
                        <span class="amount ${operation.type}">
                            ${operation.type === 'income' ? '+' : '-'}${operation.amount} грн
                        </span>
                    </div>
                    <button class="delete-operation" data-id="${operation.id}">×</button>
                </div>
            `);
            operationsList.append(operationBlock);
        }

        $(".delete-operation").click(function(e) {
            e.stopPropagation();
            const operationId = parseInt($(this).data("id"));
            if (confirm("Ви впевнені, що хочете видалити цю операцію?")) {
                operations = operations.filter(op => op.id !== operationId);
                setCookie('operations', operations, 30);
                renderOperations();
                updateBudget();
                updatePieChart();
            }
        });
    }

    $(document).on("click", ".operation-block", function() {
        const operationId = $(this).data("id");
        const operation = operations.find(op => op.id === operationId);

        if (operation) {
            const popupContent = $(`
                <div class="popup-overlay" id="popup-overlay">
                    <div class="popup-content">
                        <button class="close-popup">&times;</button>
                        <h3>${operation.name}</h3>
                        <p><strong>Опис:</strong> ${operation.description}</p>
                        <p><strong>Тип:</strong> ${operation.type === "income" ? "Дохід" : "Витрата"}</p>
                        <p><strong>Категорія:</strong> ${operation.category}</p>
                        <p><strong>Дата:</strong> ${operation.date}</p>
                        <p class="amount ${operation.type}">
                            <strong>Сума:</strong> ${operation.type === 'income' ? '+' : '-'}${operation.amount} грн
                        </p>
                        <p><strong>Нотатки:</strong> ${operation.notes}</p>
                        <button class="delete-btn" data-id="${operation.id}">Видалити операцію</button>
                    </div>
                </div>
            `);

            $("body").append(popupContent);
            $("#popup-overlay").css("display", "flex");

            popupContent.find(".close-popup").on("click", () => {
                $("#popup-overlay").fadeOut(() => popupContent.remove());
            });

            popupContent.find(".delete-btn").on("click", function() {
                if (confirm("Ви впевнені, що хочете видалити цю операцію?")) {
                    operations = operations.filter(op => op.id !== operation.id);
                    setCookie('operations', operations, 30);
                    $("#popup-overlay").fadeOut(() => popupContent.remove());
                    renderOperations();
                    updateBudget();
                    updatePieChart();
                }
            });
        }
    });

    function updateBudget() {
        let totalIncome = operations
            .filter(op => op.type === "income")
            .reduce((sum, op) => sum + op.amount, 0);

        let totalExpenses = operations
            .filter(op => op.type === "expense")
            .reduce((sum, op) => sum + op.amount, 0);

        let budget = totalIncome - totalExpenses;

        $("#income").text("+" + totalIncome + " грн");
        $("#costs").text("-" + totalExpenses + " грн");
        $("#budget").text(budget + " грн");
    }

    const leftArrow = $(".left-arrow");
    const rightArrow = $(".right-arrow");

    leftArrow.on("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            renderOperations();
        }
    });

    rightArrow.on("click", () => {
        if (currentIndex + 3 < operations.length) {
            currentIndex++;
            renderOperations();
        }
    });

    function renderEditList() {
        const editList = $(".edit-list");
        editList.empty();

        operations.forEach((operation, index) => {
            const editItem = $(`
                <div class="edit-item">
                    <p>
                        ${operation.name} - ${operation.date} - ${operation.category} - 
                        <span class="${operation.type}">${operation.type === 'income' ? '+' : '-'}${operation.amount} грн</span>
                    </p>
                    <div class="edit-buttons">
                        <button class="edit-btn" data-index="${index}">Редагувати</button>
                        <button class="delete-btn" data-index="${index}">Видалити</button>
                    </div>
                </div>
            `);
            editList.append(editItem);
        });

        $(".edit-btn").click(function() {
            const index = $(this).data("index");
            editOperation(index);
        });

        $(".delete-btn").click(function() {
            const index = $(this).data("index");
            if (confirm("Ви впевнені, що хочете видалити цю операцію?")) {
                operations.splice(index, 1);
                setCookie('operations', operations, 30);
                renderEditList();
                renderOperations();
                updateBudget();
                updatePieChart();
            }
        });
    }

    function editOperation(index) {
        const operation = operations[index];
        $("#operation-name").val(operation.name);
        $("#operation-description").val(operation.description);
        $("#operation-type-toggle").prop("checked", operation.type === "income");
        $("#operation-category").val(operation.category);
        $("#operation-date").val(operation.date);
        $("#operation-amount").val(operation.amount);
        $("#operation-notes").val(operation.notes);

        $("#edit-operation-overlay").fadeOut(); 
        $("#add-operation-overlay").css("display", "flex"); 
        addOperationForm.css("display", "block");
        $("#add-operation-form h2").text("Редагувати операцію");

        editingIndex = index;
    }

    function updatePieChart() {
        let incomeData = operations.filter(op => op.type === "income");
        let expenseData = operations.filter(op => op.type === "expense");

        let incomeGrouped = {};
        incomeData.forEach(op => {
            incomeGrouped[op.category] = (incomeGrouped[op.category] || 0) + op.amount;
        });

        let expenseGrouped = {};
        expenseData.forEach(op => {
            expenseGrouped[op.category] = (expenseGrouped[op.category] || 0) + op.amount;
        });

        let totalIncome = Object.values(incomeGrouped).reduce((sum, amount) => sum + amount, 0);
        let totalExpenses = Object.values(expenseGrouped).reduce((sum, amount) => sum + amount, 0);

        updateSinglePieChart(incomeGrouped, totalIncome, "income", ["var(--green-1)", "var(--green-2)", "var(--green-3)"]);

        updateSinglePieChart(expenseGrouped, totalExpenses, "costs", ["var(--red-1)", "var(--red-2)", "var(--red-3)"]);
    }

    function updateSinglePieChart(data, total, type, colors) {
        const piechartId = `#${type}-piechart`;
        const categoriesContainer = $(`.${type}-categories`);
        const totalElement = $(`#${type}`);

        if (Object.keys(data).length === 0) {

            $(piechartId).css({ backgroundImage: `conic-gradient(${colors[0]} 0 360deg)` });
            categoriesContainer.html(`
                <div class="${type}-category">
                    <div class="circle" style="background-color: ${colors[0]};"></div>
                    <p>Пусто</p>
                    <p>0 грн</p>
                </div>
            `);
            totalElement.text(`${type === 'income' ? '+' : '-'}0 грн`);
            return;
        }

        if (Object.keys(data).length === 1) {

            const category = Object.keys(data)[0];
            const amount = data[category];
            $(piechartId).css({ backgroundImage: `conic-gradient(${colors[0]} 0 360deg)` });
            categoriesContainer.html(`
                <div class="${type}-category">
                    <div class="circle" style="background-color: ${colors[0]};"></div>
                    <p>${category}</p>
                    <p>${amount} грн</p>
                </div>
            `);
            totalElement.text(`${type === 'income' ? '+' : '-'}${total} грн`);
            return;
        }

        let degrees = [];
        let cumulativeDegrees = 0;

        Object.entries(data).forEach(([category, amount], i) => {
            let degree = (360 * amount) / total;
            degrees.push({
                start: cumulativeDegrees,
                end: cumulativeDegrees + degree,
                category,
                color: colors[i % colors.length]
            });
            cumulativeDegrees += degree;
        });

        let gradient = degrees.map(slice => 
            `${slice.color} ${slice.start}deg ${slice.end}deg`
        ).join(", ");

        $(piechartId).css({ backgroundImage: `conic-gradient(${gradient})` });

        categoriesContainer.empty();
        Object.entries(data).forEach(([category, amount], i) => {
            const categoryItem = $(`
                <div class="${type}-category">
                    <div class="circle" style="background-color: ${colors[i % colors.length]};"></div>
                    <p>${category}</p>
                    <p>${amount} грн</p>
                </div>
            `);
            categoriesContainer.append(categoryItem);
        });

        totalElement.text(`${type === 'income' ? '+' : '-'}${total} грн`);
    }

    $("#generate-prompt").on('click', function(e) {
        e.preventDefault();

        const validateData = op => typeof op.amount === "number" && op.amount > 0 && op.category && op.category.trim().length > 0;

        const incomeData = operations
            .filter(op => op.type === "income" && validateData(op))
            .map(op => ({ category: op.category, value: parseFloat(op.amount) }));

        const costsData = operations
            .filter(op => op.type === "expense" && validateData(op))
            .map(op => ({ category: op.category, value: parseFloat(op.amount) }));

        console.log('Validated Income Data:', incomeData);
        console.log('Validated Costs Data:', costsData);

        fetch('https://blueberry-tiramisu-86600-e816cfc4fb69.herokuapp.com/analyze-budget', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                incomeCategories: incomeData,
                costsCategories: costsData
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            recommendationsElement.textContent = data.recommendations;
            console.log(data.recommendations);
        })
        .catch(error => {
            console.error('Помилка:', error);
        });
    });
});

function loadComponent(url, containerId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
        })
        .catch(error => console.error(`Помилка завантаження ${url}:`, error));
}
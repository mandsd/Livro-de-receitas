document.addEventListener('DOMContentLoaded', () => {
    const authManager = new AuthManager();
    const recipeManager = new RecipeManager(authManager);
    
    // Elementos de autenticação
    const authSection = document.getElementById('authSection');
    const appSection = document.getElementById('appSection');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const registerBox = document.getElementById('registerBox');
    const logoutBtn = document.getElementById('logoutBtn');

    // Elementos da aplicação
    const formSection = document.getElementById('formSection');
    const listSection = document.getElementById('listSection');
    const recipeForm = document.getElementById('recipeForm');
    const recipeList = document.getElementById('recipeList');
    const novaReceitaBtn = document.getElementById('novaReceitaBtn');
    const minhasReceitasBtn = document.getElementById('minhasReceitasBtn');

    // Verifica se o usuário já está logado
    if (authManager.isAuthenticated()) {
        showApp();
    }

    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            authManager.login(email, password);
            showApp();
        } catch (error) {
            showError(loginForm, error.message);
        }
    });

    // Registro
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        try {
            authManager.register(name, email, password);
            showLogin();
        } catch (error) {
            showError(registerForm, error.message);
        }
    });

    // Navegação entre login e registro
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRegister();
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLogin();
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        authManager.logout();
        showAuth();
    });

    // Navegação da aplicação
    novaReceitaBtn.addEventListener('click', () => showSection('form'));
    minhasReceitasBtn.addEventListener('click', () => showSection('list'));

    // Formulário de receita
    recipeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const recipeName = document.getElementById('recipeName').value;
        const ingredients = document.getElementById('ingredients').value
            .split('\n')
            .filter(ingredient => ingredient.trim() !== '');
        const instructions = document.getElementById('instructions').value;

        const recipe = {
            name: recipeName,
            ingredients,
            instructions
        };

        try {
            recipeManager.addRecipe(recipe);
            recipeForm.reset();
            showSection('list');
        } catch (error) {
            alert(error.message);
        }
    });

    // Funções auxiliares
    function showError(form, message) {
        const errorDiv = form.querySelector('.error-message') || document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        if (!form.querySelector('.error-message')) {
            form.appendChild(errorDiv);
        }
    }

    function showAuth() {
        authSection.classList.add('active');
        appSection.classList.remove('active');
        showLogin();
    }

    function showApp() {
        authSection.classList.remove('active');
        appSection.classList.add('active');
        showSection('form');
    }

    function showLogin() {
        registerBox.style.display = 'none';
        loginForm.parentElement.style.display = 'block';
    }

    function showRegister() {
        loginForm.parentElement.style.display = 'none';
        registerBox.style.display = 'block';
    }

    function showSection(section) {
        formSection.classList.remove('active');
        listSection.classList.remove('active');
        novaReceitaBtn.classList.remove('active');
        minhasReceitasBtn.classList.remove('active');

        if (section === 'form') {
            formSection.classList.add('active');
            novaReceitaBtn.classList.add('active');
        } else {
            listSection.classList.add('active');
            minhasReceitasBtn.classList.add('active');
            renderRecipes();
        }
    }

    function renderRecipes() {
        try {
            const recipes = recipeManager.getAllRecipes();
            recipeList.innerHTML = '';

            recipes.forEach(recipe => {
                const card = document.createElement('div');
                card.className = 'recipe-card';
                
                const content = `
                    <h3><i class="fas fa-utensils"></i> ${recipe.name}</h3>
                    <div class="recipe-content">
                        <h4><i class="fas fa-list"></i> Ingredientes:</h4>
                        <ul>
                            ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                        </ul>
                        <h4><i class="fas fa-book"></i> Modo de Preparo:</h4>
                        <p>${recipe.instructions}</p>
                        <button class="delete-btn" data-id="${recipe.id}">
                            <i class="fas fa-trash"></i> Excluir Receita
                        </button>
                    </div>
                `;

                card.innerHTML = content;

                // Toggle recipe details
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('.delete-btn')) {
                        const content = card.querySelector('.recipe-content');
                        content.classList.toggle('active');
                    }
                });

                // Delete recipe
                const deleteBtn = card.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm('Tem certeza que deseja excluir esta receita?')) {
                        try {
                            recipeManager.deleteRecipe(recipe.id);
                            renderRecipes();
                        } catch (error) {
                            alert(error.message);
                        }
                    }
                });

                recipeList.appendChild(card);
            });
        } catch (error) {
            alert(error.message);
        }
    }
});


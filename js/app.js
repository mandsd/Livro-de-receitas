document.addEventListener('DOMContentLoaded', () => {
    const recipeManager = new RecipeManager();
    const formSection = document.getElementById('formSection');
    const listSection = document.getElementById('listSection');
    const recipeForm = document.getElementById('recipeForm');
    const recipeList = document.getElementById('recipeList');
    const novaReceitaBtn = document.getElementById('novaReceitaBtn');
    const minhasReceitasBtn = document.getElementById('minhasReceitasBtn');

    // Navigation
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

    novaReceitaBtn.addEventListener('click', () => showSection('form'));
    minhasReceitasBtn.addEventListener('click', () => showSection('list'));

    // Form handling
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

        recipeManager.addRecipe(recipe);
        recipeForm.reset();
        showSection('list');
    });

    // Recipe rendering
    function renderRecipes() {
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
                    recipeManager.deleteRecipe(recipe.id);
                    renderRecipes();
                }
            });

            recipeList.appendChild(card);
        });
    }

    // Initial render
    showSection('form');
});

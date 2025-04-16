class RecipeManager {
    constructor(authManager) {
        this.authManager = authManager;
        this.recipes = [];
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        const savedRecipes = localStorage.getItem('recipes');
        if (savedRecipes) {
            this.recipes = JSON.parse(savedRecipes);
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('recipes', JSON.stringify(this.recipes));
    }

    addRecipe(recipe) {
        const user = this.authManager.getCurrentUser();
        if (!user) throw new Error('Usuário não autenticado');

        recipe.id = Date.now().toString();
        user.recipes.push(recipe);
        this.saveUserRecipes(user);
        return recipe;
    }

    deleteRecipe(id) {
        const user = this.authManager.getCurrentUser();
        if (!user) throw new Error('Usuário não autenticado');

        user.recipes = user.recipes.filter(recipe => recipe.id !== id);
        this.saveUserRecipes(user);
    }

    getAllRecipes() {
        const user = this.authManager.getCurrentUser();
        if (!user) throw new Error('Usuário não autenticado');
        return user.recipes;
    }

    getRecipe(id) {
        const user = this.authManager.getCurrentUser();
        if (!user) throw new Error('Usuário não autenticado');
        return user.recipes.find(recipe => recipe.id === id);
    }

    saveUserRecipes(user) {
        const authManager = this.authManager;
        const users = authManager.users;
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex !== -1) {
            users[userIndex] = user;
            authManager.users = users;
            authManager.saveUsers();
        }
    }
}


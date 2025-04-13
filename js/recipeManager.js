class RecipeManager {
    constructor() {
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
        recipe.id = Date.now().toString();
        this.recipes.push(recipe);
        this.saveToLocalStorage();
        return recipe;
    }

    deleteRecipe(id) {
        this.recipes = this.recipes.filter(recipe => recipe.id !== id);
        this.saveToLocalStorage();
    }

    getAllRecipes() {
        return this.recipes;
    }

    getRecipe(id) {
        return this.recipes.find(recipe => recipe.id === id);
    }
}

class Recipe {
  constructor(id, name, ingredients, instructions, author) {
    this.id = id;
    this.name = name;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.author = author;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  getRecipeDetails() {
    return {
      id: this.id,
      name: this.name,
      ingredients: this.ingredients,
      instructions: this.instructions,
      author: this.author,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Add method to update recipe details
  updateDetails(name, ingredients, instructions) {
    this.name = name;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.updatedAt = new Date();
  }
}

class User {
  constructor(id, username) {
    this.id = id;
    this.username = username;
    this.myRecipes = [];
  }
  addRecipe(recipe) {
    this.myRecipes.push(recipe);
  }
  getMyRecipes() {
    return this.myRecipes;
  }
  removeRecipe(recipeId) {
    this.myRecipes = this.myRecipes.filter((recipe) => recipe.id !== recipeId);
  }
  ownsRecipe(recipeId) {
    return this.myRecipes.some((recipe) => recipe.id === recipeId);
  }
}

// Implementing business logic here
class RecipeService {
  constructor() {
    this.recipes = new Map(); // id => recipe
    this.users = new Map(); // id => user
    this.recipeCounter = 1;
    this.userCounter = 1;
  }

  createUser(username) {
    const userId = this.userCounter++;
    const user = new User(userId, username);
    this.users.set(userId, user);
    return user;
  }

  getUser(userId) {
    return this.users.get(userId);
  }

  createRecipe(userId, recipeName, ingredients, instructions) {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const recipeId = this.recipeCounter++;
    let recipe = new Recipe(
      recipeId,
      recipeName,
      ingredients,
      instructions,
      user.username
    );
    this.recipes.set(recipeId, recipe);
    user.addRecipe(recipe);
    return recipe;
  }
  editRecipe(userId, recipeId, recipeName, ingredients, instructions) {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const recipe = this.getRecipe(recipeId);
    if (!recipe) {
      throw new Error("Recipe not found");
    }

    if (!user.ownsRecipe(recipeId)) {
      throw new Error("You can only edit your own recipes");
    }

    recipe.updateDetails(recipeName, ingredients, instructions);
    return recipe;
  }

  deleteRecipe(userId, recipeId) {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const recipe = this.getRecipe(recipeId);
    if (!recipe) {
      throw new Error("Recipe not found");
    }
    if (!user.ownsRecipe(recipeId)) {
      throw new Error("You can only delete your own recipes");
    }
    user.removeRecipe(recipeId);
    this.recipes.delete(recipeId);

    return true;
  }

  searchRecipes(searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    const matchingRecipes = [];
    for (const [id, recipe] of this.recipes) {
      if (recipe.name.toLowerCase().includes(searchLower)) {
        matchingRecipes.push(recipe);
      }
    }
    return matchingRecipes;
  }

  getRecipe(recipeId) {
    return this.recipes.get(recipeId);
  }

  getUserRecipes(userId) {
    const user = this.getUser(userId);
    return user ? user.getMyRecipes() : [];
  }

  getAllRecipes() {
    return Array.from(this.recipes.values());
  }
}

const service = new RecipeService();

const user1 = service.createUser("chef_john");
const user2 = service.createUser("baker_ann");

const recipe1 = service.createRecipe(
  user1.id,
  "Pasta",
  ["pasta", "eggs", "cheese", "bacon"],
  ["Boil pasta", "Cook bacon", "Mix eggs and cheese", "Combine all"]
);

const recipe2 = service.createRecipe(
  user2.id,
  "Chocolate Cake",
  ["flour", "sugar", "eggs", "cocoa"],
  ["Mix dry ingredients", "Add eggs", "Bake at 350F"]
);

const updatedRecipe = service.editRecipe(
  user1.id,
  recipe1.id,
  "Pasta Special",
  ["pasta", "eggs", "cheese", "bacon", "black pepper"],
  [
    "Boil pasta",
    "Cook bacon",
    "Mix eggs and cheese",
    "Add pepper",
    "Combine all",
  ]
);

try {
  service.editRecipe(user1.id, recipe2.id, "Chocolate Cake", [], []);
} catch (error) {
  console.log(error.message);
}

service.deleteRecipe(user1.id, recipe1.id);

console.log(service.getAllRecipes());

console.log(service.searchRecipes("chocolate"));
//bnch nm ch

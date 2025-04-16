class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = null;
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    register(name, email, password) {
        // Verifica se o email já está cadastrado
        if (this.users.some(user => user.email === email)) {
            throw new Error('Este email já está cadastrado');
        }

        const user = {
            id: Date.now().toString(),
            name,
            email,
            password,
            recipes: []
        };

        this.users.push(user);
        this.saveUsers();
        return user;
    }

    login(email, password) {
        const user = this.users.find(user => 
            user.email === email && user.password === password
        );

        if (!user) {
            throw new Error('Email ou senha incorretos');
        }

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
            }
        }
        return this.currentUser;
    }

    isAuthenticated() {
        return !!this.getCurrentUser();
    }
} 
export class EmailAlreadyExistsError extends Error { 
    constructor() {
        super("Email already exists");
    }
}

export class UserEmailNotFound extends Error { 
    constructor() {
        super("No user found with the email provided");
    }
}
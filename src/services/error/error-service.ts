export class EmailAlreadyExistsError extends Error { 
    constructor() {
        super("Email already exists");
    }
}

export class EmailNotFoundError extends Error { 
    constructor() {
        super("No user found with the email provided");
    }
}

export class InvalidCredentialsError extends Error { 
    constructor() {
        super("Invalid credentials");
    }
}

export class ResourceNotFound extends Error {
    constructor() {
        super("Resource not found.")
    }
}

export class MaxDistanceError extends Error {
    constructor() {
        super("Gym is too far away.")
    }
}

export class SameDayCheckInError extends Error {
    constructor() {
        super("You have already used your daily check-in.")
    }
}
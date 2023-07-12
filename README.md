# NodeJS Study App - Gympass like App

The main focus of this project is to provide an in-depth understanding of SOLID principles, <br>
Design Patterns, Docker for initializing the database, JWT (JSON Web Token) and Refresh Token authentication, <br>
RBAC (Role-Based Access Control), and many other key concepts. 
<br>

## **Features and Concepts**

- Implementation of SOLID principles to ensure a modular and maintainable codebase.
- Implemetation of tests to ensure the application won't break upon codebase changes.
- Utilization of Design Patterns to solve common software design challenges.
- Setting up a Docker environment for easy database initialization and management.
- Implementation of JWT and Refresh Token authentication for secure user authentication and authorization.
- Understanding and implementation of RBAC for fine-grained access control.
- Exploring various other concepts and technologies relevant to building robust and scalable applications.
<br><br>

## **App Requirements**
<br>

### **Functional Requirements**

- [x] It should be possible to register;
- [x] It should be possible to authenticate;
- [x] It should be possible to retrieve the profile of a logged-in user;
- [ ] It should be possible to retrieve the number of check-ins performed by the logged-in user;
- [ ] It should be possible for the user to retrieve their check-in history;
- [ ] It should be possible for the user to search for nearby gyms;
- [ ] It should be possible for the user to search for gyms by name;
- [x] It should be possible for the user to check-in at a gym;
- [ ] It should be possible to validate a user's check-in;
- [x] It should be possible to register a gym.
<br><br>

### **Business Rules**

- [x] The user should not be able to register with a duplicate email;
- [x] The user cannot make 2 check-ins on the same day;
- [x] The user cannot check-in if they are not close (100m) to the gym;
- [ ] The check-in can only be validated within 20 minutes after it is created;
- [ ] The check-in can only be validated by administrators;
- [ ] The gym can only be registered by administrators.
<br><br>

### **Non-Functional Requirements**

- [x] The user's password needs to be encrypted;
- [x] The application data needs to be persisted in a PostgreSQL database;
- [ ] All data lists need to be paginated with 20 items per page;
- [ ] The user should be identified by a JSON Web Token (JWT).

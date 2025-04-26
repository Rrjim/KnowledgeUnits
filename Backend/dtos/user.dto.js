export class RegisterUserDTO {
    constructor(email, password, confirm) {
      this.email = email;
      this.password = password;
      this.confirm = confirm;
    }
  }
  
  export class LoginUserDTO {
    constructor(email, password) {
      this.email = email;
      this.password = password;
    }
  }
  
  export class UserResponseDTO {
    constructor(user, isAuthenticated = false) {
      this.id = user?.id || null;
      this.email = user?.email || null;
      this.authenticated = isAuthenticated;
    }
  }

  
  
export class UserDTO {
    constructor(user, isAuthenticated = false) {
      this.id = user?.id || null;
      this.email = user?.email || null;
      this.authenticated = isAuthenticated;
    }
}
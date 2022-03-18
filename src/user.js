class User {
    constructor(email,firstName,lastName,id,birth_date){
      this.firstName=firstName;
      this.lastName=lastName
      this.id=id;
      this.birth_date=birth_date;
      this.email=email;
    }
}

/* we need to change it to a different implematation */
class UserList {
    constructor(users = []) {
        this.list = users;
    }

    addUser(user) {
        this.list.push(user);
    }

    getUserById(id) {
        return this.list.find(user => user.id == id);
    }
}
class User {
  constructor(email, firstName, lastName, birthDate, phoneNumber) {
    this.firstName=firstName;
    this.lastName=lastName;
    this.birth_date=birthDate;
    this.email=email;
    this.phoneNumber=phoneNumber;
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
    return this.list.find((user) => user.id == id);
  }
}

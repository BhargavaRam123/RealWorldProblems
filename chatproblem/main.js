class chatsystem {
  constructor() {
    this.users = [];
    this.messages = [];
  }
  addUser(id, name, contactnumber) {
    this.users.push({ id, name, contactnumber });
  }
  sendmessage(mid, message, sender, reciever) {
    this.messages.push({ mid, message, sender, reciever });
  }
  editmessage(mid, obj, newmessage) {
    let messageinfo = this.messages.filter((o) => o.mid === mid);
    if (messageinfo[0].sender === obj.name) {
      this.messages = this.messages.map((o) => {
        if (o.mid === mid) {
          o.message = newmessage;
        }
      });
      console.log("message successfully edited");
    } else {
      console.log("You are not the sender you cant edit this message");
    }
  }
  deletemessage(mid, obj) {
    let messageinfo = this.messages.filter((o) => o.mid === mid);
    if (messageinfo[0].sender === obj.name) {
      this.messages = this.messages.filter((o) => o.mid === mid);
      console.log("message deleted successfully ");
    } else {
      console.log("You are not the sender you cant delete this message");
    }
  }
}

class User {
  constructor(id, name, contactnumber) {
    this.id = id;
    this.name = name;
    this.contactnumber = contactnumber;
  }
}

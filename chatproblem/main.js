class ChatSystem {
  constructor() {
    this.users = [];
    this.messages = [];
  }

  addUser(id, name, contactNumber) {
    const newUser = new User(id, name, contactNumber);
    this.users.push(newUser);
    return newUser;
  }
  getUserById(id) {
    return this.users.find((user) => user.id === id);
  }

  sendMessage(mid, message, senderId, receiverId) {
    const sender = this.getUserById(senderId);
    const receiver = this.getUserById(receiverId);
    if (!sender || !receiver) {
      console.log("Sender or receiver not found");
      return false;
    }
    this.messages.push({
      mid,
      message,
      sender: sender.name,
      receiver: receiver.name,
      timestamp: new Date(),
    });
    return true;
  }

  editMessage(mid, userId, newMessage) {
    const messageIndex = this.messages.findIndex((msg) => msg.mid === mid);
    if (messageIndex === -1) {
      console.log("Message not found");
      return false;
    }
    const messageToEdit = this.messages[messageIndex];
    const user = this.getUserById(userId);
    if (!user) {
      console.log("User not found");
      return false;
    }
    if (messageToEdit.sender === user.name) {
      this.messages[messageIndex].message = newMessage;
      this.messages[messageIndex].edited = true;
      this.messages[messageIndex].editTimestamp = new Date();
      console.log("Message successfully edited");
      return true;
    } else {
      console.log("You are not the sender, you can't edit this message");
      return false;
    }
  }

  deleteMessage(mid, userId) {
    const messageIndex = this.messages.findIndex((msg) => msg.mid === mid);
    if (messageIndex === -1) {
      console.log("Message not found");
      return false;
    }
    const messageToDelete = this.messages[messageIndex];
    const user = this.getUserById(userId);
    if (!user) {
      console.log("User not found");
      return false;
    }
    if (messageToDelete.sender === user.name) {
      this.messages.splice(messageIndex, 1);
      console.log("Message deleted successfully");
      return true;
    } else {
      console.log("You are not the sender, you can't delete this message");
      return false;
    }
  }
  getMessageHistory(userId1, userId2) {
    const user1 = this.getUserById(userId1);
    const user2 = this.getUserById(userId2);
    if (!user1 || !user2) {
      console.log("One or both users not found");
      return [];
    }
    return this.messages.filter(
      (msg) =>
        (msg.sender === user1.name && msg.receiver === user2.name) ||
        (msg.sender === user2.name && msg.receiver === user1.name)
    );
  }
  getAllUsers() {
    return this.users;
  }
}

class User {
  constructor(id, name, contactNumber) {
    this.id = id;
    this.name = name;
    this.contactNumber = contactNumber;
  }

  updateContactNumber(newNumber) {
    this.contactNumber = newNumber;
  }
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      contactNumber: this.contactNumber,
    };
  }
}

function demonstrateChat() {
  const chatApp = new ChatSystem();
  chatApp.addUser(1, "Alice", "123-456-7890");
  chatApp.addUser(2, "Bob", "987-654-3210");
  chatApp.sendMessage("msg1", "Hello Bob!", 1, 2);
  chatApp.sendMessage("msg2", "Hi Alice, how are you?", 2, 1);
  chatApp.editMessage("msg1", 1, "Hello Bob! How's your day?");
  chatApp.editMessage("msg2", 1, "This edit should fail");
  chatApp.deleteMessage("msg1", 1);
  const conversation = chatApp.getMessageHistory(1, 2);
  console.log("Conversation history:", conversation);
  return chatApp;
}

demonstrateChat();

// Sample contacts
const contacts = [
  { id: 1, name: "Rahul Bose", avatar: "https://i.pravatar.cc/150?img=11", lastMsg: "Hey, are you free tomorrow?", time: "10:42" },
  { id: 2, name: "Priya Patel", avatar: "https://i.pravatar.cc/150?img=5", lastMsg: "Sure, see you then!", time: "Yesterday" },
  { id: 3, name: "Amit Kumar", avatar: "https://i.pravatar.cc/150?img=33", lastMsg: "Project files sent", time: "Monday" },
  { id: 4, name: "Sneha Gupta", avatar: "https://i.pravatar.cc/150?img=9", lastMsg: "Happy Birthday 🎉", time: "12/08" },
  { id: 5, name: "Vikram Singh", avatar: "https://i.pravatar.cc/150?img=15", lastMsg: "Call me when free", time: "09:15" },
];

// Sample messages per contact
const chatHistory = {
  1: [
    { text: "Hey Rahul!", type: "sent", time: "10:30" },
    { text: "Hi! How are you?", type: "received", time: "10:32" },
    { text: "I'm good. Are you free tomorrow?", type: "sent", time: "10:35" },
    { text: "Hey, are you free tomorrow?", type: "received", time: "10:42" },
  ],
  2: [
    { text: "Hi Priya", type: "sent", time: "Yesterday" },
    { text: "Hello!", type: "received", time: "Yesterday" },
    { text: "Can we meet at 5?", type: "sent", time: "Yesterday" },
    { text: "Sure, see you then!", type: "received", time: "Yesterday" },
  ],
  3: [
    { text: "Did you finish the report?", type: "sent", time: "Monday" },
    { text: "Yes, Project files sent", type: "received", time: "Monday" },
  ],
  4: [
    { text: "Happy Birthday Sneha! 🎉", type: "sent", time: "12/08" },
    { text: "Thank you so much ❤️", type: "received", time: "12/08" },
  ],
  5: [
    { text: "Hey Vikram", type: "sent", time: "09:00" },
    { text: "Call me when free", type: "received", time: "09:15" },
  ],
};

let currentChatId = null;

// Render chat list
function renderChatList(filter = "") {
  const list = document.getElementById("chatList");
  list.innerHTML = "";

  contacts
    .filter(c => c.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(contact => {
      const div = document.createElement("div");
      div.className = `chat-item ${currentChatId === contact.id ? "active" : ""}`;
      div.innerHTML = `
        <img src="${contact.avatar}" class="avatar">
        <div class="chat-info">
          <h4>${contact.name}</h4>
          <p>${contact.lastMsg}</p>
        </div>
        <span class="chat-time">${contact.time}</span>
      `;
      div.onclick = () => openChat(contact.id);
      list.appendChild(div);
    });
}

// Open a chat
function openChat(id) {
  currentChatId = id;
  const contact = contacts.find(c => c.id === id);

  document.getElementById("headerName").textContent = contact.name;
  document.getElementById("headerAvatar").src = contact.avatar;
  document.getElementById("headerStatus").textContent = "online";

  document.getElementById("messageInput").disabled = false;
  document.getElementById("sendBtn").disabled = false;

  renderMessages(id);
  renderChatList(document.getElementById("searchInput").value);
}

// Render messages
function renderMessages(id) {
  const container = document.getElementById("messages");
  container.innerHTML = "";

  const messages = chatHistory[id] || [];
  messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = `message ${msg.type}`;
    div.innerHTML = `${msg.text}<span class="time">${msg.time}</span>`;
    container.appendChild(div);
  });

  container.scrollTop = container.scrollHeight;
}

// Send message
function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text || !currentChatId) return;

  const now = new Date();
  const time = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

  if (!chatHistory[currentChatId]) chatHistory[currentChatId] = [];
  chatHistory[currentChatId].push({ text, type: "sent", time });

  // Update last message in contacts
  const contact = contacts.find(c => c.id === currentChatId);
  contact.lastMsg = text;
  contact.time = time;

  input.value = "";
  renderMessages(currentChatId);
  renderChatList();
}

// Event listeners
document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.getElementById("messageInput").addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

document.getElementById("searchInput").addEventListener("input", e => {
  renderChatList(e.target.value);
});

// Initial render
renderChatList();
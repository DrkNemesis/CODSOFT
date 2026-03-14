document.addEventListener("DOMContentLoaded", () => {
    const chatBody = document.getElementById("chat-body");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // Predefined rules for the chatbot
    const rules = [
        {
            patterns: ["hello", "hi", "hey", "greetings"],
            responses: ["Hello there!", "Hi! How can I help you?", "Greetings! What's on your mind?"]
        },
        {
            patterns: ["how are you", "how are you doing", "what's up"],
            responses: ["I'm just a bunch of code, but I'm doing great! How about you?", "I'm functioning perfectly. How can I assist you?"]
        },
        {
            patterns: ["what is your name", "who are you", "your name"],
            responses: ["I am RuleBot, a simple rule-based chatbot.", "You can call me RuleBot!"]
        },
        {
            patterns: ["bye", "goodbye", "see you", "cya"],
            responses: ["Goodbye! Have a great day!", "See you later!", "Bye! Feel free to chat again if you need anything."]
        },
        {
            patterns: ["help", "what can you do"],
            responses: ["I can answer simple greetings, tell you my name, and respond to basic questions based on my programming rules!"]
        },
        {
            patterns: ["weather", "temperature"],
            responses: ["I don't have access to the internet, so I can't check the weather. Look out the window! 🌤️"]
        },
        {
            patterns: ["joke", "funny"],
            responses: ["Why do programmers prefer dark mode? Because light attracts bugs!", "Why did the developer go broke? Because he used up all his cache!"]
        },
        {
            patterns: ["python", "javascript", "html", "css", "code"],
            responses: ["Programming is fun! I was actually built using HTML, CSS, and JavaScript."]
        }
    ];

    const defaultResponses = [
        "I'm not exactly sure what you mean by that.",
        "Could you rephrase that? My rule-based logic didn't catch it.",
        "Interesting! Tell me more.",
        "I don't have a rule for that yet, I'm still learning!"
    ];

    function getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    function getBotResponse(input) {
        const lowerInput = input.toLowerCase();

        // Check against rules
        for (const rule of rules) {
            for (const pattern of rule.patterns) {
                // simple word boundary match or exact substring match
                if (lowerInput.includes(pattern)) {
                    return getRandomResponse(rule.responses);
                }
            }
        }

        // Fallback response
        return getRandomResponse(defaultResponses);
    }

    function appendMessage(text, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);

        const bubbleDiv = document.createElement("div");
        bubbleDiv.classList.add("bubble");
        bubbleDiv.textContent = text;

        messageDiv.appendChild(bubbleDiv);
        chatBody.appendChild(messageDiv);

        // Auto scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleSend() {
        const text = userInput.value.trim();
        if (text === "") return;

        // Display user message
        appendMessage(text, "user");
        userInput.value = "";

        // Show typing indicator
        const typingIndicator = document.createElement("div");
        typingIndicator.classList.add("message", "bot");
        typingIndicator.id = "typing-msg";
        typingIndicator.innerHTML = `
            <div class="bubble">
                <div class="typing-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        `;
        chatBody.appendChild(typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Simulate thinking time before response
        setTimeout(() => {
            const botResponse = getBotResponse(text);
            const typingMsg = document.getElementById("typing-msg");
            if (typingMsg) {
                chatBody.removeChild(typingMsg);
            }
            appendMessage(botResponse, "bot");
        }, 800 + Math.random() * 700); // Random delay between 0.8s and 1.5s
    }

    sendBtn.addEventListener("click", handleSend);

    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    });

    // Initial greeting focus
    userInput.focus();
});

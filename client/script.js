import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

const content = document.getElementById("aboutpage");
const home = document.getElementById("home");
const about = document.getElementById("about");

// home.addEventListener("click", function() {
//   content.innerHTML = "<h2>Home</h2>";
// });

about.addEventListener("click", function () {
  document.getElementById("app").style.display = "none";

  content.innerHTML = `
    <h2>About</h2>
    <p>
    This is a demo project that utilizes the Da Vinci API from Open API.all of our fetch happens to this API via server built on express NodeJS and rendered in UI with VITE framework. 
    <br></br>
    Following is their interpretation of their API...
    We are using a combination of deep learning models such as BERT, GPT-2, and XLNet to build this API.    
    <br></br>
    Bert is a natural language processing (NLP) model developed by Google in 2018. It is based on a deep learning technique called Transformer and is used for a variety of tasks such as text classification, question answering, and language understanding. Bert has been shown to outperform existing NLP models on many tasks and has become the go-to model for many NLP applications.
    <br></br>
    GPT-2 (Generative Pre-trained Transformer 2) is a large-scale unsupervised language model developed by OpenAI. It is trained on a dataset of 8 million webpages and can generate human-like text when given a prompt. GPT-2 has been used for various natural language processing tasks such as summarization, question answering, and machine translation.
    <br></br>
    XLNet is a new state-of-the-art natural language processing (NLP) model developed by Google AI. It is an autoregressive language model that combines the advantages of both Transformer-XL and BERT models. XLNet uses a permutation language modeling objective to learn bidirectional contexts by maximizing the expected likelihood over all permutations of the factorization order. This allows it to capture longer-term dependencies than BERT, while still being more computationally efficient than Transformer-XL.
    <br></br>
    </p>
      
  `;
  content.style.display = "block";
});

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    // Update the text content of the loading indicator
    element.textContent += ".";

    // If the loading indicator has reached three dots, reset it
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
        <div class="wrapper ${isAi && "ai"}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? "bot" : "user"}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  // to clear the textarea input
  form.reset();

  // bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  // to focus scroll to the bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // specific message div
  const messageDiv = document.getElementById(uniqueId);

  // messageDiv.innerHTML = "..."
  loader(messageDiv);
  //http://localhost:5000/
  const response = await fetch("https://askzendao.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = " ";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";
    alert(err);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});

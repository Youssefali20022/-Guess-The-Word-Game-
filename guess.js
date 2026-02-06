// --- Setting Game Name & Footer ---
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
let currentYear = new Date().getFullYear();
document.querySelector("footer").innerHTML = `© ${currentYear} Guess The Word Game | Developed by Youssef`;

// --- Setting Game Options ---
let numberOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

// --- Manage Words ---
let wordToGuess = "";
const words = ["Create", "Update", "Delete", "Master", "Branch", "Mainly", "Yelgoo", "School"];
let messagArea = document.querySelector(".message");
const guessButton = document.querySelector(".check");
const getHintsbutton = document.querySelector(".hint");
const playAgainButton = document.querySelector(".play-again");

// --- 1. Start Game Function ---
function startGame() {
    // اختيار كلمة عشوائية
    wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
    numberOfLetters = wordToGuess.length; // تحديث عدد الحروف بناءً على الكلمة
    currentTry = 1;
    numberOfHints = 2;
    messagArea.innerHTML = "";
    
    // تفعيل الأزرار
    guessButton.disabled = false;
    guessButton.classList.remove("disabled");
    getHintsbutton.disabled = false;
    getHintsbutton.classList.remove("disabled");
    document.querySelector(".hint span").innerHTML = numberOfHints;

    // مسح وتوليد المربعات
    const inputsContainer = document.querySelector(".inputs");
    inputsContainer.innerHTML = "";
    generateInupt();
    
    console.log(`Word: ${wordToGuess}`); // للتأكد أثناء التطوير
}

// --- 2. Generate Inputs Function ---
function generateInupt() {
    const inputsContainer = document.querySelector(".inputs");
    for (let i = 1; i <= numberOfTries; i++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;
        if (i !== 1) tryDiv.classList.add("disabled-inputs");

        for (let j = 1; j <= numberOfLetters; j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength", "1");
            tryDiv.appendChild(input);
        }
        inputsContainer.appendChild(tryDiv);
    }
    
    // فوكس على أول مربع
    inputsContainer.children[0].children[1].focus();

    // تعطيل المربعات غير النشطة
    const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    inputsInDisabledDiv.forEach((input) => (input.disabled = true));

    // إضافة الـ Events لكل المربعات
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        // عند الكتابة
        input.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
            const nextInput = inputs[index + 1];
            if (nextInput && !nextInput.disabled && this.value !== "") nextInput.focus();
        });

        // عند الضغط على الأسهم
        input.addEventListener("keydown", function (event) {
            if (event.key === "ArrowRight") {
                const nextInput = index + 1;
                if (nextInput < inputs.length) inputs[nextInput].focus();
            }
            if (event.key === "ArrowLeft") {
                const prevInput = index - 1;
                if (prevInput >= 0) inputs[prevInput].focus();
            }
            if (event.key === "Enter" && !guessButton.disabled) {
                handleGuesses();
            }
        });
    });
}

// --- 3. Handle Guesses Function ---
function handleGuesses() {
    let successGuess = true;
    for (let i = 1; i <= numberOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];

        // منطق التلوين
        if (letter === actualLetter) {
            inputField.classList.add("yes-in-place");
        } else if (wordToGuess.includes(letter) && letter !== "") {
            inputField.classList.add("not-in-place");
            successGuess = false;
        } else {
            inputField.classList.add("no");
            successGuess = false;
        }
    }

    // فوز أو خسارة
    if (successGuess) {
        messagArea.innerHTML = `You Win! The Word Is <span>${wordToGuess.toUpperCase()}</span>`;
        disableGameActions();
    } else {
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
        const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((input) => (input.disabled = true));

        currentTry++;
        let nextTryDiv = document.querySelector(`.try-${currentTry}`);

        if (nextTryDiv) {
            nextTryDiv.classList.remove("disabled-inputs");
            const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
            nextTryInputs.forEach((input) => (input.disabled = false));
            nextTryDiv.children[1].focus();
        } else {
            messagArea.innerHTML = `You Lose! The Word Was <span>${wordToGuess.toUpperCase()}</span>`;
            disableGameActions();
        }
    }
}

// --- 4. Helper: Disable Buttons ---
function disableGameActions() {
    guessButton.disabled = true;
    guessButton.classList.add("disabled");
    getHintsbutton.disabled = true;
    getHintsbutton.classList.add("disabled");
}

// --- 5. Get Hint Function ---
function getHint() {
    if (numberOfHints > 0) {
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints;
        if (numberOfHints === 0) {
            getHintsbutton.disabled = true;
            getHintsbutton.classList.add("disabled");
        }
    }

    const enabledInputs = document.querySelectorAll(`.try-${currentTry} input:not([disabled])`);
    const emptyEnabledInput = Array.from(enabledInputs).filter((input) => input.value === "");

    if (emptyEnabledInput.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyEnabledInput.length);
        const randomInput = emptyEnabledInput[randomIndex];
        // معرفة مكان المربع في الصف الحالي لجلب الحرف الصحيح
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
}

// --- 6. Handle Backspace Function ---
function handleBackspace(event) {
    if (event.key === "Backspace") {
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        if (currentIndex >= 0) {
            const currentInput = inputs[currentIndex];
            const prevInput = inputs[currentIndex - 1];
            if (currentInput.value !== "") {
                currentInput.value = "";
            } else if (prevInput) {
                prevInput.value = "";
                prevInput.focus();
            }
        }
    }
}

// --- Event Listeners ---
getHintsbutton.addEventListener("click", getHint);
guessButton.addEventListener("click", handleGuesses);
playAgainButton.addEventListener("click", startGame);
document.addEventListener("keydown", handleBackspace);

// --- Run Game on Load ---
window.onload = startGame;
 // setting Game Name
 let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By Elzero Web School`;



// Setting Game Options
let numberOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;

function generateInupt() {
    let inputsContainer = document.querySelector(".inputs");
   
     // Create Main Try Div
    for(let i = 1; i <= numberOfTries; i++) {
    let tryDiv = document.createElement("div");
    tryDiv.classList = `try-${i}`;
    tryDiv.innerHTML = `<span>Try ${i}</span>`;


    if (i !== 1) tryDiv.classList.add("disabled-inputs");
         // Create Inputs
      for(let j = 1; j <= numberOfLetters; j++) {
        let input = document.createElement("input");
        input.type = "text";
        input.id = `guess-${i}-letter-${j}`
        input.setAttribute("maxlength" , "1");
        tryDiv.appendChild(input)
      }
     inputsContainer.appendChild(tryDiv)
    }
     document.getElementById("guess-1-letter-1").focus();
  
      let inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
      inputsInDisabledDiv.forEach((e) => (e.disabled = true));
      const inputs = document.querySelectorAll("input");
      inputs.forEach((input,index) => {
   input.addEventListener("input" , function () {
    input.value = input.value.toUpperCase();
    const nextInput = inputs[index + 1];
     if (nextInput) nextInput.focus();
   })
         input.addEventListener("keydown" , function (event) {
          // console.log(event);
             const nextInputApp = Array.from(inputs).indexOf(event.target);
             if (event.key === "ArrowRight") {
               const nextInputv = nextInputApp + 1;
               if (nextInputv < inputs.length)   inputs[nextInputv].focus();
             }
                   if (event.key === "ArrowLeft") {
               const nextInputb = nextInputApp - 1;
               if (nextInputb >= 0)   inputs[nextInputb].focus();
             }
                         if (event.key === "Backspace") {
                if (this.value === "") { // لو المربع فاضي، ارجع للي قبله
                    const prevInput = nextInputApp  - 1;
                    if (prevInput >= 0) {
                        inputs[prevInput].focus();
                    }
                }
            }
         })
      })
}
window.onload = function () {
    generateInupt();
};
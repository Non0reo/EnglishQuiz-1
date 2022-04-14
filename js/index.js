let questionTitle = document.getElementsByClassName("title")[0];
let skipButton = document.getElementById("skipButton");
let startDiv = document.getElementById("startDiv");
let endDiv = document.getElementById("endDiv");
let jobSpace = document.getElementById("job");
let jobsGot = [];
let jsonList;
let questionLength
let counter = 0;

//get list.json file using fetch
async function setContent(file, questionNumber) {  
  fetch(file)
  .then(response => response.json())
  .then(data => {
    //console.log(data, data["questions"][questionNumber][0].question)
    let questionInfos = data["questions"][questionNumber];
    questionTitle.innerHTML = questionInfos[0].question;
    let answers = questionInfos[1];
    answers = shuffleArrys(answers);
    questionLength = data["questions"].length;
    for (const iterator of answers) {
      if(iterator[0] != "") {
        let newButton = document.createElement("button");
        newButton.innerHTML = iterator[0];
        newButton.style.backgroundColor = `hsl(${Math.floor(Math.random() * 357)}, 30%, 40%)`;
        newButton.setAttribute("class", "rateButtons");
        iterator.shift();
        newButton.setAttribute("onclick", `clickAnswer(this, "${iterator.toString().replaceAll(",", "_")}")`);
        document.getElementById("buttons").appendChild(newButton);
      }
    }
  });
}

function clickAnswer(button, subject) {
  if(subject != null) {
    let subjectArray = subject.split("_");
    subjectArray.forEach(element => {
      jobsGot.push(element);
    });
  }
  counter++;
  let parent = document.getElementById("buttons");
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
  if(counter < questionLength) setContent("list.json", counter);
  else {
    skipButton.style.display = "none";
    endDiv.style.display = "unset";
    questionTitle.innerHTML = "";
    if(mostRecurentItemInArray(jobsGot) != null) {
      endDiv.children[0].innerHTML = `According to our quiz, you could be a<span id="job"></span>`;
      job.innerHTML = ` ${mostRecurentItemInArray(jobsGot)}`;
    }
    else {
      job.innerHTML = "";
      endDiv.children[0].innerHTML = `How do you want me to tell you what should your job if you keep clicking on skip?<span id="job"></span>`;
    }
    //endDiv.innerHTML = `<h1>${mostRecurentItemInArray(jobsGot)}</h1>`;
  }
}

function mostRecurentItemInArray(array) {
  let counts = {};
  let maxCount = 0;
  let maxItem = null;
  for (let i = 0; i < array.length; i++) {
    let item = array[i];
    if (counts[item] === undefined) counts[item] = 1;
    else counts[item]++;
    if (counts[item] > maxCount) {
      maxCount = counts[item];
      maxItem = item;
    }
  }
  return maxItem;
}


function shuffleArrys(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startQuiz() {
  setContent("list.json", counter);
  skipButton.style.display = "unset";
  startDiv.style.display = "none";
  while (startDiv.lastChild) {
    startDiv.removeChild(startDiv.lastChild);
  }
}

function restartQuiz() {
  endDiv.style.display = "none";
  counter = 0;
  jobsGot = [];
  startQuiz();
}

skipButton.style.display = "none";
startDiv.style.display = "unset";
endDiv.style.display = "none";
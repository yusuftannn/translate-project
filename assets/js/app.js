const dropdowns = document.querySelectorAll(".dropdown-container"),
  inputLanguageDropdown = document.querySelector("#input-language"),
  outputLanguageDropdown = document.querySelector("#output-language"),
  inputAlert = document.querySelector(".input-wrapper"),
  outputAlert = document.querySelector(".output-wrapper");

function populateDropdown(dropdown, options) {
  dropdown.querySelector("ul").innerHTML = "";
  options.forEach((option) => {
    const li = document.createElement("li");
    const title = option.name + " (" + option.native + ")";
    li.innerHTML = title;
    li.dataset.value = option.code;
    li.classList.add("option");
    dropdown.querySelector("ul").appendChild(li);
  });
}

populateDropdown(inputLanguageDropdown, languages);
populateDropdown(outputLanguageDropdown, languages);

dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", (e) => {
    dropdown.classList.toggle("active");
  });

  dropdown.querySelectorAll(".option").forEach((item) => {
    item.addEventListener("click", (e) => {
      // remove active class from current dropdowns
      dropdown.querySelectorAll(".option").forEach((item) => {
        item.classList.remove("active");
      });
      item.classList.add("active");
      const selected = dropdown.querySelector(".selected");
      selected.innerHTML = item.innerHTML;
      selected.dataset.value = item.dataset.value;
      translate();
    });
  });
});

document.addEventListener("click", (e) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
});

const inputTextElem = document.querySelector("#input-text"),
  outputTextElem = document.querySelector("#output-text"),
  inputLanguage = inputLanguageDropdown.querySelector(".selected"),
  outputLanguage = outputLanguageDropdown.querySelector(".selected"),
  swapBTN = document.querySelector(".swap-position");

// swap event
swapBTN.addEventListener("click", (e) => {
  const temp = inputLanguage.innerHTML
  inputLanguage.innerHTML = outputLanguage.innerHTML
  outputLanguage.innerHTML = temp

  const tempValue = inputLanguage.dataset.value
  inputLanguage.dataset.value = outputLanguage.dataset.value
  outputLanguage.dataset.value = tempValue

  // swap text
  const tempInputText = inputTextElem.value
  inputTextElem.value = outputTextElem.value
  outputTextElem.value = tempInputText

  translate()
})

// translate start
function translate() {
  const inputText = inputTextElem.value;
  const inputLanguage =
    inputLanguageDropdown.querySelector(".selected").dataset.value;
  const outputLanguage =
    outputLanguageDropdown.querySelector(".selected").dataset.value;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(
    inputText
  )}`;
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      outputTextElem.value = json[0].map((item) => item[0]).join("");
    })
    .catch((error) => {
      console.log(error);
    });
  outputTextElem.value = ""
}
// translate end

// limit input to 5000 characters
inputTextElem.addEventListener("input", (e) => {
  if (inputTextElem.value.length > 5000) {
    inputTextElem.value = inputTextElem.value.slice(0, 5000);
  }
  translate();
});

// upload event
const uploadDocument = document.querySelector("#upload-document"),
  uploadTitle = document.querySelector("#upload-title")

uploadDocument.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (
    file.type === "application/pdf" ||
    file.type === "text/plain" ||
    file.type === "application/msword" ||
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    uploadTitle.innerHTML = file.name;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      inputTextElem.value = e.target.result;
      translate();
      inputshowAlert("primary", "File added...")
    };
  } else {
    inputshowAlert("danger", "Please upload a valid file!")
  }
});

// input alert
function inputshowAlert(type, message) {
  const alert = document.createElement("div")
  alert.className = `alert alert-${type}`
  alert.textContent = message
  inputAlert.appendChild(alert)
  setTimeout(function () {
    alert.remove()
  }, 2000)
}

// output alert
function outputshowAlert(type, message) {
  const alert = document.createElement("div")
  alert.className = `alert alert-${type}`
  alert.textContent = message
  outputAlert.appendChild(alert)
  setTimeout(function () {
    alert.remove()
  }, 1500)
}

// download event
const downloadBtn = document.querySelector("#download-btn");

downloadBtn.addEventListener("click", (e) => {
  const outputText = outputTextElem.value,
    outputLanguage = outputLanguageDropdown.querySelector(".selected").dataset.value;
  if (outputText) {
    const blob = new Blob([outputText], { type: "text/plain" }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.download = `translated - to - ${outputLanguage}.txt`
    a.href = url
    a.click()
    outputshowAlert("primary", "File downloaded...")
  } else {
    outputshowAlert("warning", 'No translated text found!')
  }
})

// dark mode
const darkModeCheckBox = document.getElementById("dark-mode-btn");

darkModeCheckBox.addEventListener("change", (e) => {
  document.body.classList.toggle("dark-mode");
});

// counter
const inputChars = document.querySelector("#input-chars");

inputTextElem.addEventListener("input", (e) => {
  inputChars.innerHTML = inputTextElem.value.length;
});
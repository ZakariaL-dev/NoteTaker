// =================== DARK MODE ===================
let darkmode = localStorage.getItem("darkmode");
const togglebtn = document.getElementById("toggle-li_nightbtn");

const enableDarkmode = () => {
  document.body.classList.add("darkmode");
  localStorage.setItem("darkmode", "active");
};
const disableDarkmode = () => {
  document.body.classList.remove("darkmode");
  localStorage.setItem("darkmode", "inactive");
};

if (darkmode === "active") {
  enableDarkmode();
}

togglebtn.addEventListener("click", () => {
  darkmode = localStorage.getItem("darkmode");
  if (darkmode !== "active") {
    enableDarkmode();
  } else {
    disableDarkmode();
  }
});

// =================== ELEMENTS ===================
const TitleInp = document.getElementById("titleinp");
const ContentArea = document.getElementById("contentarea");
const CategorySelect = document.getElementById("categoryselect");
const taginp = document.getElementById("taginp");
const Pin = document.getElementById("checkinp");
let notes = [];
const noteDisplay = document.getElementById("displays");
let editingNoteId = null;

// =================== EVENT DELEGATION ===================
document.addEventListener("click", function (e) {
  // Save button
  if (e.target && e.target.id === "save") {
    handleSave();
  }

  // Clear button
  if (e.target && e.target.id === "clear") {
    handleClear();
  }
});

// =================== SAVE HANDLER ===================
function handleSave() {
  if (TitleInp.value.trim() === "" || ContentArea.value.trim() === "") {
    alert("Please enter a title and a content before saving !!!");
    return;
  }

  if (editingNoteId !== null) {
    const noteIndex = notes.findIndex(
      (note) => note.uniqueid === editingNoteId
    );
    if (noteIndex !== -1) {
      notes[noteIndex] = {
        ...notes[noteIndex],
        Title: TitleInp.value,
        Content: ContentArea.value,
        Category: CategorySelect.value,
        Tag: taginp.value,
        Pinned: Pin.checked,
        id:
          new Date().toLocaleString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }) + " (edited)",
      };
    }
    editingNoteId = null;
  } else {
    let note = {
      Title: TitleInp.value,
      Content: ContentArea.value,
      Category: CategorySelect.value,
      Tag: taginp.value,
      Pinned: Pin.checked,
      id: new Date().toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }),
      uniqueid: Date.now() + Math.floor(Math.random() * 24568),
    };

    notes.unshift(note);
  }
  savenotes();
  renderNotes();
  NoteCounters();

  // Clear fields
  TitleInp.value = "";
  ContentArea.value = "";
  CategorySelect.value = "General";
  taginp.value = "";
  Pin.checked = false;
}

// =================== CLEAR HANDLER ===================
function handleClear() {
  TitleInp.value = "";
  ContentArea.value = "";
  CategorySelect.value = "General";
  taginp.value = "";
  Pin.checked = false;
}

// =================== STORAGE ===================
function savenotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadnotes() {
  const savednotes = localStorage.getItem("notes");
  if (savednotes) {
    notes = JSON.parse(savednotes);
    renderNotes();
    NoteCounters();
  }
}

// =================== RENDERING ===================
function getCategoryColor(category) {
  if (category === "Work") return "#098EB3";
  if (category === "Personal") return "#EF4444";
  if (category === "Idea") return "#EAB308";
  return "var(--idk)";
}

function renderNotes() {
  if (notes.length === 0) {
    noteDisplay.innerHTML = `
            <h1>
                <i class="fa-solid fa-note-sticky"></i>
                <br>
                No notes found matching your criteria
            </h1>
        `;
    NoteCounters();
    return;
  }

  noteDisplay.innerHTML = "";
  notes.forEach((note) => addnewnote(note, noteDisplay));
}

function addnewnote(nt) {
  let bgColor = getCategoryColor(nt.Category);

  let noteHTML = `
        <div class="note1">
            <div class="noteupper">
                <div class="text">
                    <div>
                        <h2 style="margin-bottom: 5px;">${nt.Title}</h2>
                        <p>${nt.Content}</p>
                    </div>
                    ${nt.Pinned ? `<i class="fa-solid fa-thumbtack"></i>` : ""}
                </div>
                ${nt.Tag == "" ? `<div style="margin-top: 35px;"></div>` : ""}
                <div class="minicateg">
                    <h4 style="background-color: ${bgColor};">
                        <i class="fa-solid fa-note-sticky"></i>
                        ${nt.Category}
                    </h4>
                    <p>${nt.id}</p>
                </div>
                ${nt.Tag !== "" ? `<p class="tagsp">#${nt.Tag}</p>` : ""}
            </div>
            <div class="notelower">
                <p style="color: #67d4e7;" onclick="shownote(${
                  nt.uniqueid
                })">Show</p>
                <div style="display: flex; gap: 10px;">
                    <p onclick="editnote(${nt.uniqueid})">Edit</p>
                    <p style="color: red;" onclick="deletenote(${
                      nt.uniqueid
                    })">Delete</p>
                </div>
            </div>
        </div>
    `;

  noteDisplay.innerHTML += noteHTML;

  document.getElementById("AllNotesCount").textContent = notes.length;
  NoteCounters();
}

// =================== POPUP ===================
function shownote(noteId) {
  let nt = notes.find((nt) => nt.uniqueid === noteId);
  if (!nt) return;

  let bgColor = getCategoryColor(nt.Category);
  const page = document.getElementById("page");

  const popup = document.createElement("div");
  popup.id = "popup";
  popup.className = "notepopup";
  popup.innerHTML = `
        <div class="noteupper">
            <div class="text">
                <div>
                    <h2 style="margin-top: 10px; margin-bottom: 20px;">${
                      nt.Title
                    }</h2>
                    <p>${nt.Content}</p>
                </div>
                ${nt.Pinned ? `<i class="fa-solid fa-thumbtack"></i>` : ""}
            </div>
            ${nt.Tag == "" ? `<div style="margin-top: 20px;"></div>` : ""}
            <div class="minicateg">
                <h4 style="background-color: ${bgColor};">
                    <i class="fa-solid fa-note-sticky"></i>
                    ${nt.Category}
                </h4>
                <p>${nt.id}</p>
            </div>
            ${
              nt.Tag !== ""
                ? `<p class="tagsp">#${nt.Tag}</p>`
                : `<div style="margin-bottom: 33px;"></div>`
            }
        </div>
        <div class="notelower">
            <p style="color: #67d4e7;" onclick="hidenote()">Hide</p>
            <div style="display: flex; gap: 10px;">
                <p onclick="editnote(${nt.uniqueid})">Edit</p>
                <p style="color: red;" onclick="deleteNoteFromPopup(${
                  nt.uniqueid
                })">Delete</p>
            </div>
        </div>
    `;

  document.body.appendChild(popup);
  NoteCounters();
}

function hidenote() {
  let popup = document.getElementById("popup");
  if (popup) {
    popup.remove();
  }
  NoteCounters();
}

// =================== DELETE NOTE ===================
function deletenote(noteId) {
  notes = notes.filter((nt) => nt.uniqueid !== noteId);
  savenotes();
  renderNotes();
  NoteCounters();
}

function deleteNoteFromPopup(noteId) {
  hidenote();
  setTimeout(() => {
    notes = notes.filter((nt) => nt.uniqueid !== noteId);
    savenotes();
    renderNotes();
    NoteCounters();
  }, 50);
}

// =================== Edit NOTE ===================
function editnote(noteId) {
  let note = notes.find((nt) => nt.uniqueid === noteId);
  TitleInp.value = note.Title;
  ContentArea.value = note.Content;
  CategorySelect.value = note.Category;
  taginp.value = note.Tag;
  Pin.checked = note.Pinned;

  editingNoteId = noteId;
  hidenote();
  NoteCounters();
}

// =================== INIT ===================
document.addEventListener("DOMContentLoaded", function () {
  loadnotes();
});

//Counter
const NoteCounter = document.getElementById("NoteCounter");
const workcount = document.getElementById("workcount");
const PersonalCount = document.getElementById("PersonalCount");
const IdeaCount = document.getElementById("IdeaCount");
const generalcount = document.getElementById("generalcount");
function NoteCounters() {
  let Allnotes = notes.length;
  NoteCounter.innerHTML = Allnotes;

  const GeneralNotes = notes.filter((note) => note.Category === "General");
  generalcount.innerHTML = GeneralNotes.length;

  const WorkNotes = notes.filter((note) => note.Category === "Work");
  workcount.innerHTML = WorkNotes.length;

  const PersonalNotes = notes.filter((note) => note.Category === "Personal");
  PersonalCount.innerHTML = PersonalNotes.length;

  const IdeaNotes = notes.filter((note) => note.Category === "Idea");
  IdeaCount.innerHTML = IdeaNotes.length;
}

// FilterSelect
const FilterSelect = document.getElementById("FilterSelect");
FilterSelect.addEventListener("change", FilterNotes);

function FilterNotes() {
  const FilterValue = FilterSelect.value;
  noteDisplay.innerHTML = "";
  let notesToRender = [...notes];

  if (FilterValue === "All Notes") {
    renderNotes();
  } else if (FilterValue === "Pinned Note") {
    const PinnedNotes = notesToRender.filter((note) => note.Pinned);
    PinnedNotes.forEach((Pin) => {
      addnewnote(Pin);
    });
  } else if (FilterValue === "Title (A-Z)") {
    notesToRender.sort((a, b) =>
      a.Title.localeCompare(b.Title, "en", { sensitivity: "base" })
    );

    notesToRender.forEach((note) => {
      addnewnote(note);
    });
  } else if (FilterValue === "Newest First") {

    notesToRender.sort((a, b) => b.uniqueid - a.uniqueid);
    notesToRender.forEach((note) => {
      addnewnote(note);
    });
  }

  // 💡 OLDEST DATE SORT (if you want this option too):
  else if (FilterValue === "Oldest First") {
    notesToRender.sort((a, b) => a.uniqueid - b.uniqueid);
    notesToRender.forEach((note) => {
      addnewnote(note);
    });
  } else {
    noteDisplay.innerHTML = `
    <h1>
        <i class="fa-solid fa-note-sticky"></i>
        <br>
        No notes found matching your criteria
    </h1>
    `;
  }
}

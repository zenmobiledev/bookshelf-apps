document.addEventListener("DOMContentLoaded", function() {
    const inputBookForm = document.getElementById("inputBook");
    inputBookForm.addEventListener("submit", function(event) {
      event.preventDefault();
      addBook();
    });
  
    const searchForm = document.getElementById("searchBook");
    searchForm.addEventListener("submit", function(event) {
      event.preventDefault();
      searchBook();
    });
  
    loadDataFromStorage();
  });
  
  function addBook() {
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;
  
    const newBook = makeBook(title, author, year, isComplete);
    const bookshelfList = isComplete ? document.getElementById("completeBookshelfList") : document.getElementById("incompleteBookshelfList");
    bookshelfList.appendChild(newBook);
  
    updateDataToStorage();
  
    document.getElementById("inputBookTitle").value = "";
    document.getElementById("inputBookAuthor").value = "";
    document.getElementById("inputBookYear").value = "";
    document.getElementById("inputBookIsComplete").checked = false;
  }
  
  function makeBook(title, author, year, isComplete) {
    const bookContainer = document.createElement("article");
    bookContainer.classList.add("book_item");
  
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = title;
  
    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = `Penulis: ${author}`;
  
    const bookYear = document.createElement("p");
    bookYear.innerText = `Tahun: ${year}`;
  
    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");
  
    const actionButton = document.createElement("button");
    actionButton.classList.add(isComplete ? "green" : "red");
    actionButton.innerText = isComplete ? "Selesai dibaca" : "Belum selesai di Baca";
    actionButton.addEventListener("click", function() {
      if (isComplete) {
        moveBookToIncomplete(bookContainer);
      } else {
        moveBookToComplete(bookContainer);
      }
    });
  
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus buku";
    deleteButton.addEventListener("click", function() {
      bookContainer.remove();
      updateDataToStorage();
    });
  
    actionContainer.appendChild(actionButton);
    actionContainer.appendChild(deleteButton);
  
    bookContainer.appendChild(bookTitle);
    bookContainer.appendChild(bookAuthor);
    bookContainer.appendChild(bookYear);
    bookContainer.appendChild(actionContainer);
  
    return bookContainer;
  }
  
  function moveBookToIncomplete(bookElement) {
    const actionButton = bookElement.querySelector(".action > button");
    actionButton.classList.remove("green");
    actionButton.classList.add("red");
    actionButton.innerText = "Belum selesai di Baca";
    actionButton.removeEventListener("click", moveBookToIncomplete);
    actionButton.addEventListener("click", function() {
      moveBookToComplete(bookElement);
    });
  
    const incompleteBookshelf = document.getElementById("incompleteBookshelfList");
    incompleteBookshelf.appendChild(bookElement);
  
    updateDataToStorage();
  }
  
  function moveBookToComplete(bookElement) {
    const actionButton = bookElement.querySelector(".action > button");
    actionButton.classList.remove("red");
    actionButton.classList.add("green");
    actionButton.innerText = "Selesai dibaca";
    actionButton.removeEventListener("click", moveBookToComplete);
    actionButton.addEventListener("click", function() {
      moveBookToIncomplete(bookElement);
    });
  
    const completeBookshelf = document.getElementById("completeBookshelfList");
    completeBookshelf.appendChild(bookElement);
  
    updateDataToStorage();
  }
  
  function searchBook() {
    const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
    const incompleteBookshelf = document.getElementById("incompleteBookshelfList");
    const completeBookshelf = document.getElementById("completeBookshelfList");
  
    searchInBookshelf(searchTitle, incompleteBookshelf);
    searchInBookshelf(searchTitle, completeBookshelf);
  }
  
  function searchInBookshelf(searchTitle, bookshelf) {
    bookshelf.querySelectorAll(".book_item").forEach((bookElement) => {
      const title = bookElement.querySelector("h3").innerText.toLowerCase();
      if (title.includes(searchTitle)) {
        bookElement.style.display = "";
      } else {
        bookElement.style.display = "none";
      }
    });
  }
  
  function loadDataFromStorage() {
    let incompleteBooks = JSON.parse(localStorage.getItem("incompleteBooks")) || [];
    let completeBooks = JSON.parse(localStorage.getItem("completeBooks")) || [];
  
    incompleteBooks.forEach((book) => {
      const { title, author, year, isComplete } = book;
      const newBook = makeBook(title, author, year, isComplete);
      const incompleteBookshelf = document.getElementById("incompleteBookshelfList");
      incompleteBookshelf.appendChild(newBook);
    });
  
    completeBooks.forEach((book) => {
      const { title, author, year, isComplete } = book;
      const newBook = makeBook(title, author, year, isComplete);
      const completeBookshelf = document.getElementById("completeBookshelfList");
      completeBookshelf.appendChild(newBook);
    });
  
  }
  
  function updateDataToStorage() {
    const incompleteBookshelf = document.getElementById("incompleteBookshelfList");
    const completeBookshelf = document.getElementById("completeBookshelfList");
  
    let incompleteBooks = [];
    let completeBooks = [];
  
    incompleteBookshelf.querySelectorAll(".book_item").forEach((bookElement) => {
      const title = bookElement.querySelector("h3").innerText;
      const author = bookElement.querySelector("p:nth-of-type(1)").innerText.replace('Penulis: ', '');
      const year = bookElement.querySelector("p:nth-of-type(2)").innerText.replace('Tahun: ', '');
      incompleteBooks.push({ title, author, year, isComplete: false });
    });
  
    completeBookshelf.querySelectorAll(".book_item").forEach((bookElement) => {
      const title = bookElement.querySelector("h3").innerText;
      const author = bookElement.querySelector("p:nth-of-type(1)").innerText.replace('Penulis: ', '');
      const year = bookElement.querySelector("p:nth-of-type(2)").innerText.replace('Tahun: ', '');
      completeBooks.push({ title, author, year, isComplete: true });
    });
  
    localStorage.setItem("incompleteBooks", JSON.stringify(incompleteBooks));
    localStorage.setItem("completeBooks", JSON.stringify(completeBooks));
  }
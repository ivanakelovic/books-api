var searchField=document.getElementById("searchField");
var btn=document.getElementById("btn");
var container=document.getElementById("searchResults");

/**
 * @param searchField - element input
 * @param btn - element button
 * @param container - div element koji sadrzi rezultate pretrage
 * @param search  vrijednost koju korisnik unese u input elementu
 */

/**
 * eventlistener za input element omogucuje real time pretrazivanje
 */
searchField.addEventListener('keyup',function (event){
  event.preventDefault();
   var search=document.getElementById("searchField").value;
   if(search==='') {
       container.innerHTML='';
   }
   else {
       searchBooks(search);
   }
});

/**
 * eventlistener za button element koji generise rezultate pretrage
 */
btn.addEventListener('click',function (event){
   event.preventDefault();
    var search=document.getElementById("searchField").value;
    if(search==='') {
        container.innerHTML='';
        alert("Please enter something in the search bar...");
        return;
    }
    else {
        searchBooks(search);
    }
});

/**
 *@function searchBooks(searchTerm) vrsi pretragu knjiga po autoru ili naslovu i prikazuje korisniku
 * @param searchTerm uneseni pojam od strane korisnika
 */
function searchBooks(searchTerm) {
    //console.log("provjera pocetka");
    container.innerHTML='';
    var searchTerm = document.getElementById("searchField").value;

        var bookTitle = '';
        var bookAuthor = '';
        var bookCoverImg='';
        var bookPublicationDate='';
        var bookSummary='';
        var xhr;

        if(xhr&&xhr.readyState!=4){
            xhr.abort();
        }

        var xhr = new XMLHttpRequest();
        var searchQuery = '';

        // provjera postojanja : zbog kategorije- autor/naslov
        if (searchTerm.includes(':')) {
            var searchParams = searchTerm.split(':');
            var searchType = searchParams[0].trim().toLowerCase();
            var searchValue = searchParams[1].trim();

            if (searchType === 'author') {
                searchQuery = 'inauthor:' + encodeURIComponent(searchValue);
            } else if (searchType === 'title') {
                searchQuery = 'intitle:' + encodeURIComponent(searchValue);
            }
        } else {
            searchQuery = 'q=' + encodeURIComponent(searchTerm);
        }

        xhr.open("GET", "https://www.googleapis.com/books/v1/volumes?" + searchQuery);
        //   xhr.open("GET", "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent(searchTerm));
        //xhr.open("GET", "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent(searchTerm) + "&fields=items(volumeInfo(title,authors,imageLinks,description,publishedDate))");
      //  console.log("provjera poslije get");

        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
          //      console.log("provjera prije dobijanja info");
             //   console.log(this.responseText);

                var booksInformation = xhr.responseText;

                 container.innerHTML+='';
                if (booksInformation.length === 0) {
                    document.getElementById("searchResults").innerHTML += "Nothing found";
                }
                var parsed = JSON.parse(booksInformation);

                var bookContainer='';
                for (var i = 0; i < parsed.items.length; i++) {
                    if (parsed.items[i] && parsed.items[i].volumeInfo) {
                        console.log(parsed.items[i].volumeInfo);


                        bookTitle = parsed.items[i].volumeInfo.title || 'Unknown title';
                        bookAuthor = parsed.items[i].volumeInfo.authors || 'Unknown author(s)';
                        bookCoverImg = parsed.items[i].volumeInfo.imageLinks ? parsed.items[i].volumeInfo.imageLinks.thumbnail : "No cover image available";
                        bookPublicationDate = parsed.items[i].volumeInfo.publishedDate || 'Unknown publishing date';
                        bookSummary = parsed.items[i].volumeInfo.description || 'No summary available';

                        bookContainer+='<div class="book-container">';
                        bookContainer+= '<div class="box">';
                        bookContainer += '<div style="font-size: larger; font-weight: bolder;">' + bookTitle + '</div>';
                        bookContainer+= '<div style="font-style: italic;">By: ' + bookAuthor + '</div>';
                        bookContainer+='<img src="' + bookCoverImg + '" alt="' + bookTitle + '">';
                        bookContainer+= '<div>Publication Date: ' + bookPublicationDate + '</div>';
                        bookContainer += '<div>Summary: '+bookSummary + '</div><br>';

                       bookContainer += '</div>';
                        bookContainer+='</div>';

                    }
                    if(i<parsed.items.length-1){
                        bookContainer+='<div class="separator-box"></div>';
                    }
                }
                  container.innerHTML=bookContainer;
            }
        }

        xhr.send();

}

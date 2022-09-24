import './css/styles.css';
var debounce = require('lodash.debounce');
// import { debounce } from "lodash"
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const Key="30147719-e1b2444a4263e41728889e473";
const DEBOUNCE_DELAY = 300;
let page =1;

const searchBox = document.querySelector("[name='searchQuery']");
const search=document.querySelector("form");
const listItem=document.querySelector(".list");
let timerId = null;

search.addEventListener("submit", (e) => {
    e.preventDefault()
    console.log(e.target.searchQuery.value)
    fetchImages(e.target.searchQuery.value)
        .then((items) => renderList(items))
        .catch((error) => console.log(error));
});

function fetchImages(type) {
    return axios.get(`https://pixabay.com/api/?key=${Key}&_limit=20&q=${type}&page=${page}`)
    .then((response) => {
        if (response.ok)return response.json();
        page+=1;
        console.log(response.data.hits);
        return response.data.hits;
    });
}

// function renderList(nameList){
//     listItem.innerHTML=nameList.map((name)=>{
//         console.log("here",name)
//         return `<li class="item">
//                 <img src=${name.previewURL} class="image"></img>
//                 <div class="content">
//                     <p>like</br>${name.likes}</p>
//                     <p>comments</br>${name.comments}</p>
//                     <p>views</br>${name.views}</p>
//                     <p>downloads</br>${name.downloads}</p>
//                 </div>
//                 </li>`
//     }).join("")
    
// }

function renderList(nameList){
    listItem.innerHTML=nameList.map((name)=>{
        return `<li class="gallery__item">
                    <a class="gallery__link" href="${name.largeImageURL}">
                        <img src=${name.previewURL} class="gallery__image" preview="${name.tags}"></img>
                        <div class="content">
                            <p>like</br>${name.likes}</p>
                            <p>comments</br>${name.comments}</p>
                            <p>views</br>${name.views}</p>
                            <p>downloads</br>${name.downloads}</p>
                        </div>
                    </a>
                </li>`
    }).join("")
    
    new SimpleLightbox(".listItem a", {
        captionsData: "alt",
        captionDelay: 250,
        captionPosition: "bottom",
    });
}




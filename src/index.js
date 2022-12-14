import './css/styles.css';
var debounce = require('lodash.debounce');
// import { debounce } from "lodash"
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const Key="30147719-e1b2444a4263e41728889e473";

const searchBox = document.querySelector("[name='searchQuery']");
const search=document.querySelector("form");
const gallery=document.querySelector(".gallery");
const loadingScreen=document.querySelector(".animate");
let pageNumber=1;

const pageNext=(reset)=>{
    if(reset){
        pageNumber=0;
    }
    return pageNumber+=1;
}

search.addEventListener("submit", (e) => {
    gallery.innerHTML="";
    e.preventDefault()
    let word=e.target.searchQuery.value.trimEnd().trimStart();
    if(word!=""){
        loadingScreen.classList.toggle("hide");
        setTimeout(()=>{
            fetching(word,pageNext(true));
        },500)
    }
    else{Notify.warning("input field cant be empty")}
});


function fetching(e,page){
    fetchImages(e,page)
        .then((items) => renderList(items))
        .catch((error) => console.log(error));
}

function fetchImages(type,page) {
    let params = {
        page: page,
        per_page: 20
    }
    return axios.get(`https://pixabay.com/api/?key=${Key}&q=${type}&_sort=previewWidth&_order=ASC`,{params:params})
    .then((response)=>{
        console.log(page)
        loadingScreen.classList.toggle("hide")
        let result=response.data.hits;
        let total=response.data.total;
        if(result.length===0){
            if(params.page>0){Notify.failure("Sorry,there are no more results");}
            else{Notify.failure("Sorry, there are no images matching your search query. Please try again.");}
            return
        }
        
        return {result:result,total:total,page};
    })
    .then(({result:result,total:total,page}) => {
        // if (response.data.hits)return response.json();
        Notify.success(`Hooray! We found ${result.length*page} out of ${total} images.`)
        return result;
    })
    .catch((error) => {console.log(error);})
}

function renderList(nameList){
    gallery.innerHTML+=nameList.map((name)=>{
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
    
    new SimpleLightbox(".gallery a", {
        captionsData: "alt",
        captionDelay: 250,
        captionPosition: "bottom",
    });
}



document.addEventListener(
    "scroll",
    debounce(
        () => {

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {  
            loadingScreen.classList.toggle("hide")
            setTimeout(() => {
                fetching(searchBox.value,pageNext(false))
            }, 1000);
            }   
        },
    300,
    { trailing: true, leading: false }
    )
);

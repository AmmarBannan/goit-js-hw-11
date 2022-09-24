import './css/styles.css';
var debounce = require('lodash.debounce');
// import { debounce } from "lodash"
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector("#search-box");
const listItem=document.querySelector(".country-list");
const description=document.querySelector(".country-info");
let timerId = null;

searchBox.addEventListener("keyup",debounce(
    (e) => {
        listItem.innerHTML="";
        description.innerHTML="";
        fetchContries(e.target.value)
        .then((contry) => contry.length<6?renderCountriesList(contry):Notify.info("Too many matches found,Please enter a more specific name."))
        .catch((error) => console.log(error));
    }
,300));

function fetchContries(name) {
    const params = new URLSearchParams({
        _limit: 2,
        _page: 2
    });
    listItem.innerHTML="loading.."
    timerId=setInterval(()=>{
        let contents=listItem.innerHTML;
        contents=="loading.."?listItem.innerHTML="loading...":listItem.innerHTML=="loading.."
    },500)
    
    return fetch(`https://restcountries.com/v2/name/${name}`).then(
        (response) => {
            if (!response.ok) {
            Notify.failure(
                'Oops,there is no country with that name.'
            );
            listItem.innerHTML="";
        }
        clearInterval(timerId);
        return response.json();
    }
    );
}

function renderCountriesList(contries) {
        listItem.innerHTML = contries.map((contry)=>`
        <li>
            <div class="contry"> 
                <img  src="${contry.flags.png}" alt="${contry.name}">
                <h2 class="contry-name">${contry.name}</h2>
            </div>
        </li>`
        ).join("");
        
        if(contries.length==1){
            let contryLanguages="";
            contries[0].languages.map((language)=>{
                try {
                    contryLanguages+=language.name+", ";
                    console.log(language.name)
                } catch (error) {
                    error.massege;
                }
                
            })
            contryLanguages=contryLanguages.trimEnd().slice(0,-1)+".";
            const markup = contries.map((contry) => {
                // console.log(contry.languages[contry.languages.length-1])
                return `
                    <p><b>Name</b>: ${contry.capital}</p>
                    <p><b>poulation</b>: ${contry.population}</p>
                    <p><b>languages</b>: ${contryLanguages}</p>`;
            })
            .join("");
            description.innerHTML = markup;
        }
    helper()
    return contries;
}

function helper(){
    // document.querySelector(".contry-name").addEventListener("click",(e)=>{
    //     console.log(e.target.textContent);
    //     searchBox.value=e.target.textContent;
    // })
    document.querySelectorAll("h2").forEach((h2)=>h2.addEventListener("click",(e)=>{
        console.log(e.target.textContent);
        searchBox.value=e.target.textContent;
    }))
}

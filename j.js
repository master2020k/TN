// =========================
// SONG DATABASE
// =========================

let songs = [];


// =========================
// PLAYLIST
// =========================

let playlist = [
    {
        name:"Tamil Hits",
        songs:[]
    }
];



// =========================
// ELEMENTS
// =========================

const audio = document.getElementById("audio");

const songBox = document.getElementById("songs");

const title = document.getElementById("title");

const artist = document.getElementById("artist");

const cover = document.getElementById("cover");

const playBtn = document.getElementById("play");

const playlistBox = document.getElementById("playlist");


let current = 0;



// =========================
// GET AUTO IMAGE + ARTIST
// =========================

async function getSongDetails(songName){


    try{


        let response = await fetch(

        `https://itunes.apple.com/search?term=${encodeURIComponent(songName)}&media=music&limit=1`

        );


        let data = await response.json();



        if(data.results.length > 0){


            let result = data.results[0];


            return {


                artist: result.artistName,


                img:

                result.artworkUrl100

                .replace(
                    "100x100",
                    "600x600"
                )


            };


        }


    }


    catch(error){


        console.log(
            "Image Error:",
            error
        );


    }




    return {


        artist:"Unknown",


        img:"img/default.jpg"


    };


}






// =========================
// LOAD FROM GITHUB
// =========================


const githubAPI =

"https://api.github.com/repos/master2020k/songs";





async function loadGithubSongs(){



try{


let response = await fetch(githubAPI);


let files = await response.json();




songs = files


.filter(file =>


file.name.endsWith(".mp3") ||

file.name.endsWith(".m4a")


)


.map(file=>{


let songName = file.name


.replace(".mp3","")

.replace(".m4a","")

.replaceAll("-"," ");




return {


name:songName,


artist:"Loading...",


file:file.download_url,


img:"img/default.jpg"



};



});






// GET DETAILS

for(let song of songs){


let details = await getSongDetails(song.name);



song.artist = details.artist;


song.img = details.img;



}






playlist[0].songs =

songs.map(
(song,index)=>index
);





loadSongs();


loadPlaylist();



}

catch(error){


console.log(
"Github Error:",
error
);


}



}




loadGithubSongs();







// =========================
// SONG CARDS
// =========================


function loadSongs(){


songBox.innerHTML="";



songs.forEach((song,index)=>{


songBox.innerHTML += `


<div class="card"

data-index="${index}"

onclick="playSong(${index})">



<img loading="lazy"

src="${song.img}"

onerror="this.src='img/default.jpg'">



<h3>${song.name}</h3>


<p>${song.artist}</p>



</div>



`;



});


}







// =========================
// PLAY SONG
// =========================


async function playSong(index){


current=index;


let song=songs[index];



audio.src=song.file;



title.innerText=song.name;


artist.innerText=song.artist;


cover.src=song.img;



try{


await audio.play();



playBtn.innerHTML =

`

<i class="fa-solid fa-pause"></i>

`;



}

catch(error){


console.log(
"Play error:",
error
);


}



highlightSong();



}







// =========================
// PLAY PAUSE
// =========================


function playPause(){



if(!audio.src){


playSong(0);


return;


}



if(audio.paused){



audio.play();



playBtn.innerHTML =

`

<i class="fa-solid fa-pause"></i>

`;



}

else{


audio.pause();



playBtn.innerHTML =

`

<i class="fa-solid fa-play"></i>

`;



}



}







// =========================
// NEXT
// =========================


function next(){



current++;



if(current >= songs.length){


current = 0;


}



playSong(current);



}







// =========================
// PREVIOUS
// =========================


function previous(){



current--;



if(current < 0){


current = songs.length-1;


}



playSong(current);



}







// =========================
// AUTO NEXT
// =========================


audio.onended=function(){


next();


};






// =========================
// PLAYLIST
// =========================


function loadPlaylist(){


playlistBox.innerHTML="";



playlist.forEach((list,index)=>{


playlistBox.innerHTML += `


<div class="card"

onclick="openPlaylist(${index})">


<h3>${list.name}</h3>


<p>${list.songs.length} Songs</p>


</div>


`;



});


}





function openPlaylist(index){



songBox.innerHTML="";



playlist[index].songs.forEach(songIndex=>{


let song=songs[songIndex];



songBox.innerHTML += `


<div class="card"

onclick="playSong(${songIndex})">


<img src="${song.img}">


<h3>${song.name}</h3>


<p>${song.artist}</p>


</div>


`;



});



}







// =========================
// ACTIVE SONG
// =========================


function highlightSong(){



document
.querySelectorAll(".card")
.forEach(card=>{


card.classList.remove("active");


});




document
.querySelectorAll("#songs .card")
.forEach(card=>{


if(Number(card.dataset.index)===current){


card.classList.add("active");


}


});


}
// =========================
// PROGRESS BAR
// =========================

const progress = document.getElementById("progress");

const currentTime = document.getElementById("currentTime");

const duration = document.getElementById("duration");



audio.ontimeupdate = function(){


if(audio.duration){


progress.value =

(audio.currentTime / audio.duration) * 100;



currentTime.innerText =

formatTime(audio.currentTime);



duration.innerText =

formatTime(audio.duration);



}



};





progress.oninput=function(){


if(audio.duration){


audio.currentTime =

(progress.value / 100) *

audio.duration;


}


};







// =========================
// TIME FORMAT
// =========================

function formatTime(time){


let min = Math.floor(time / 60);


let sec = Math.floor(time % 60);



if(sec < 10){

sec = "0" + sec;

}



return `${min}:${sec}`;


}








// =========================
// VOLUME
// =========================

const volume = document.getElementById("volume");



volume.oninput=function(){


audio.volume = Number(volume.value);


};








// =========================
// SEARCH
// =========================

function searchSongs(){


let text =

document.getElementById("search")

.value

.toLowerCase();




document

.querySelectorAll("#songs .card")

.forEach(card=>{


let name =

card.innerText.toLowerCase();



if(name.includes(text)){


card.style.display="block";


}

else{


card.style.display="none";


}



});


}








// =========================
// LIKE SYSTEM
// =========================

const likeBtn = document.getElementById("likeBtn");





function like(){


let liked =

JSON.parse(

localStorage.getItem("liked")

)

||

[];





if(liked.includes(current)){



liked = liked.filter(

id=>id!==current

);



}

else{


liked.push(current);


}




localStorage.setItem(

"liked",

JSON.stringify(liked)

);



updateLikeButton();



}








function updateLikeButton(){



let liked =

JSON.parse(

localStorage.getItem("liked")

)

||

[];





if(liked.includes(current)){



likeBtn.innerHTML =

`

<i class="fas fa-heart"></i>

`;



}

else{


likeBtn.innerHTML =

`

<i class="far fa-heart"></i>

`;



}



}









// =========================
// SHOW LIKED SONGS
// =========================

function showLiked(){


let liked =

JSON.parse(

localStorage.getItem("liked")

)

||

[];




songBox.innerHTML="";




liked.forEach(index=>{


let song=songs[index];



songBox.innerHTML +=`



<div class="card"

onclick="playSong(${index})">



<img src="${song.img}">



<h3>${song.name}</h3>



<p>${song.artist}</p>



</div>



`;



});



}








// =========================
// KEYBOARD CONTROL
// =========================


document.addEventListener(

"keydown",

(e)=>{


if(e.code==="Space"){


e.preventDefault();


playPause();


}



if(e.code==="ArrowRight"){


next();


}



if(e.code==="ArrowLeft"){


previous();


}



}

);







// =========================
// AUDIO ERROR
// =========================


audio.onerror=function(){


alert(

"Song file error. Check GitHub path"

);


};

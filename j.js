// =========================
// SONG DATABASE
// =========================


const songs = [

{
    name:"Vaathi Coming",
    artist:"Anirudh Ravichander",
    img:"images/vaathi.jpg",
    file:""
},


{
    name:"Arabic Kuthu",
    artist:"Anirudh Ravichander",
    img:"images/arabic.jpg",
    file:"songs/arabic.mp3"
},


{
    name:"Enjoy Enjaami",
    artist:"Dhee & Arivu",
    img:"images/enjaami.jpg",
    file:"songs/enjaami.mp3"
}

];




// =========================
// PLAYLIST
// =========================


const playlist=[

{
    name:"Tamil Hits",
    songs:[0,1,2]
}

];





// =========================
// ELEMENTS
// =========================


const audio=document.getElementById("audio");

const songBox=document.getElementById("songs");

const title=document.getElementById("title");

const artist=document.getElementById("artist");

const cover=document.getElementById("cover");

const playBtn=document.getElementById("play");

const likeBtn=document.getElementById("likeBtn");

const progress=document.getElementById("progress");

const volume=document.getElementById("volume");

const playlistBox=document.getElementById("playlist");

const currentTime=document.getElementById("currentTime");

const duration=document.getElementById("duration");



let current=0;







// =========================
// LOAD SONG CARDS
// =========================


function loadSongs(){


songBox.innerHTML="";


songs.forEach((song,index)=>{


songBox.innerHTML += `


<div class="card"
data-index="${index}"
onclick="playSong(${index})">


<img loading="lazy" src="${song.img}" alt="${song.name}">


<h3>${song.name}</h3>

<p>${song.artist}</p>


</div>


`;


});


}



loadSongs();







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


playBtn.innerHTML=
`
<i class="fa-solid fa-pause"></i>
`;


}

catch(error){

console.log("Play error:",error);

}



updateLikeButton();

highlightSong();


}








// =========================
// PLAY / PAUSE
// =========================


function playPause(){


if(!audio.src){

playSong(0);

return;

}



if(audio.paused){


audio.play();


playBtn.innerHTML=
`
<i class="fa-solid fa-pause"></i>
`;


}

else{


audio.pause();


playBtn.innerHTML=
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


if(current>=songs.length){

current=0;

}


playSong(current);


}







// =========================
// PREVIOUS
// =========================


function previous(){


current--;


if(current<0){

current=songs.length-1;

}


playSong(current);


}







audio.onended=function(){

next();

};









// =========================
// PROGRESS
// =========================


audio.ontimeupdate=function(){


if(audio.duration){


progress.value=
(audio.currentTime/audio.duration)*100;


currentTime.innerText=
formatTime(audio.currentTime);


duration.innerText=
formatTime(audio.duration);



}


};





progress.oninput=function(){


if(audio.duration){


audio.currentTime=
(progress.value/100)
*
audio.duration;


}


};








// =========================
// FORMAT TIME
// =========================


function formatTime(time){


let min=Math.floor(time/60);


let sec=Math.floor(time%60);



if(sec<10){

sec="0"+sec;

}



return `${min}:${sec}`;


}







// =========================
// VOLUME
// =========================


volume.oninput=function(){


audio.volume=Number(volume.value);


};







// =========================
// SEARCH
// =========================


function searchSongs(){


let text=
document.getElementById("search")
.value
.toLowerCase();



document.querySelectorAll(".card")
.forEach(card=>{


let value=
card.innerText.toLowerCase();



card.style.display=
value.includes(text)
?
"block"
:
"none";



});


}







// =========================
// LIKE SYSTEM
// =========================


function like(){



let liked=
JSON.parse(localStorage.getItem("liked"))
||
[];




if(liked.includes(current)){


liked=liked.filter(
item=>item!==current
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


let liked=
JSON.parse(localStorage.getItem("liked"))
||
[];




if(liked.includes(current)){


likeBtn.innerHTML=
`
<i class="fas fa-heart"></i>
`;


}

else{


likeBtn.innerHTML=
`
<i class="far fa-heart"></i>
`;


}


}








// =========================
// SHOW LIKED
// =========================


function showLiked(){


let liked=
JSON.parse(localStorage.getItem("liked"))
||
[];



songBox.innerHTML="";



songs.forEach((song,index)=>{


if(liked.includes(index)){



songBox.innerHTML+=`


<div class="card"
onclick="playSong(${index})">


<img src="${song.img}">


<h3>${song.name}</h3>


<p>${song.artist}</p>


</div>


`;


}


});


}








// =========================
// PLAYLIST LOAD
// =========================


function loadPlaylist(){



playlistBox.innerHTML="";



playlist.forEach((list,index)=>{


playlistBox.innerHTML+=`

<div class="card"
onclick="openPlaylist(${index})">


<h3>${list.name}</h3>

<p>${list.songs.length} Songs</p>


</div>


`;

});


}



loadPlaylist();









function openPlaylist(index){


songBox.innerHTML="";



playlist[index].songs.forEach(songIndex=>{


let song=songs[songIndex];


songBox.innerHTML+=`

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
// SEARCH BUTTON FOCUS
// =========================


function focusSearch(){


document
.getElementById("search")
.focus();


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



});








// =========================
// AUDIO ERROR
// =========================


audio.onerror=function(){


alert(
"Audio file not found. Check songs folder path."
);


};

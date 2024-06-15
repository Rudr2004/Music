let currentSong = new Audio();
let songs;
let curFolder;
function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minute = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formatedminutes = String(minute).padStart(2, "0");
  const formatedseconds = String(remainingSeconds).padStart(2, "0");

  return `${formatedminutes}: ${formatedseconds}`;
}

async function getSongs(folder) {
  curFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  //Show the songs
  let songUl = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li> 

                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll( "%20", " ","%200")}
                                </div>                 
                                <div>Rudra</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">        
                            </div>
         </li>`;
  }

  //Attach eventlistener to songs
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${curFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {                                        
  let a = await fetch(`songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer")
  let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
  
    if(e.href.includes("songs/") && !e.href.includes(".htaccess")){
    let folder = e.href.split("songs/").slice(-2)[1]
    //Get the metadata of the folder
    let a = await fetch(`songs/${folder}/info.json`);
    let response = await a.json();
    cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
                                <!-- Outer green circle -->
                                <circle cx="12" cy="12" r="12" fill="#1ed760" />
                                <!-- Inner SVG with black color -->
                                <circle cx="12" cy="12" r="10" stroke-width="1.5" fill="none" />
                                <path
                                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                                    fill="black" />
                            </svg>
                        </div>
                        <img src="songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div> `
    }
    //Load the playlist whenever clicked on the card

    Array.from(document.getElementsByClassName("card")).forEach((e) => {
      e.addEventListener("click", async (items) => {
        songs = await getSongs(`songs/${items.currentTarget.dataset.folder}`);
      });
    }); 
  }
}
//Display all the albums on the page
displayAlbums();
async function main() {
  //Get the list of all the songs
  await getSongs("songs/ncs");
  playMusic(songs[0], true);
  //Attach Eventlistner for previous,play and next songs
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  //Time Update Listner
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secondsToMinutes(
      currentSong.currentTime
    )}/ ${secondsToMinutes(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //Event listner for seekbar

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    const seekbar = document.querySelector(".seekbar");
    const offsetX = e.offsetX;
    const width = seekbar.offsetWidth;
    const currentTime = (offsetX / width) * currentSong.duration;
    currentSong.currentTime = currentTime;
  });

  //Event listen for hamburger

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //Event listen for close
   document.querySelector(".close").addEventListener("click", ()=> {
    document.querySelector(".left").style.left = "-120%";
  });

  //Add Event listener for pre and nex buttons

  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  next.addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //Add Event to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
      if(currentSong.volume>0){
        document.querySelector(".volume>img").src =  document.querySelector(".volume>img").src.replace("img/mute.svg","img/volume.svg")
      }
    });

    //Add Event listen to mute the track
    document.querySelector(".volume>img").addEventListener("click",(e)=>{
      if(e.target.src.includes("img/volume.svg")){
        e.target.src =e.target.src.replace("img/volume.svg","img/mute.svg")
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
      }
      else{
        e.target.src =  e.target.src.replace("img/mute.svg","img/volume.svg")
        currentSong.volume = 0.2;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
      }
    })
}
main()

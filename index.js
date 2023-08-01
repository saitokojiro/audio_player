/*let uploadFile = async (music)=>{
    let file =  new FormData()
    file.append(music?.name, music)
    try {
        const response = await fetch("/upload", {
          method: "POST",
          body: file,
        });
        // Traitez la réponse du serveur ici si nécessaire
        console.log("Upload successful!", response);
      } catch (error) {
        console.error("Error during upload:", error);
      }
}*/
let files_music = document.querySelector(".music");
let title_music = document.querySelector(".title");

let cmd_prev = document.querySelector(".previousMusic");
let cmd_next = document.querySelector(".nextMusic");
let cmd_play = document.querySelector(".start_pause");

let endTime = document.querySelector(".time_end");
let startTime = document.querySelector(".current_timer");
let volume = document.querySelector(".vol");
let jauge = document.querySelector(".time_realtime");

let music = new Audio();
/*
function dataURLToBlob(dataURL) {
  const parts = dataURL.split(',');
  const contentType = parts[0].split(':')[1];
  const byteString = atob(parts[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([uint8Array], { type: contentType });
}*/

let fancyTimeFormat = duration => {
  // Hours, minutes and seconds
  const hrs = ~~(duration / 3600);
  const mins = ~~(duration % 3600 / 60);
  const secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;

  return ret;
};

let waitList = [] 
let indexActu = 0
// meta data
let updateData =(val)=>{
  music.addEventListener("loadedmetadata", () => {
    const fullDuration = music.duration;
    console.log(fancyTimeFormat(fullDuration));
    endTime.innerHTML = fancyTimeFormat(fullDuration);
    startTime.innerHTML = fancyTimeFormat(music.currentTime);
    title_music.innerHTML = val.name
    //title_music.innerHTML = files_music.files[0].name
  });
}

files_music.addEventListener('change',()=>{
  let file = files_music.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    // Le chargement du fichier est terminé avec succès ici.
    const contents = event.target.result;
   // console.log("Contenu du fichier chargé :", contents);
   
    waitList.push({
      file: file,
      contents: contents
    })
    file = null
    
  };

  reader.onerror = function() {
    console.error("Erreur lors du chargement du fichier.");
  };

  reader.readAsDataURL(file)
})

/*

let saveInArray  = ()=>{
  let read = new FileReader()
  read.onload = (e)=>{
    const audioContent = e.target.result;
    //waitList.push("./" + files_music.files[0].name)
    //console.log(e.target.result)
    sessionStorage.setItem("testing", audioContent)
    
  }
  read.readAsDataURL(files_music.files[0])
}*/

let loadMusic = ()=>{
  
  //saveInArray()
  //waitList.push(sessionStorage.getItem("testing"))
  //sessionStorage.removeItem("testing")
  console.log(waitList)

  //let blob = dataURLToBlob(waitList[0])
  music.src =  waitList[0].contents
  //music.src = "/" + files_music.files[0].name;
  //waitList.push("./" + files_music.files[0].name)
  console.log( files_music.value)
  music.play();
  updateData(waitList[0].file)

}

let addMusicWaitList =()=>{
  //waitList.push("./" + files_music.files[0].name)
  /*waitList.push(sessionStorage.getItem("testing"))
  sessionStorage.removeItem("testing")*/
  console.log(waitList)
}

let btn_load = async () => {
  
  let currentTime = music.currentTime
  setTimeout(() => {
    currentTime !== music.currentTime ? addMusicWaitList() : loadMusic() 
  }, 10);
  
};




//functionnalité player 



function updateHandler() {
  startTime.innerHTML = fancyTimeFormat(music.currentTime);
  let updateTime = music.currentTime / music.duration * 100;
  jauge.value = updateTime;
}

music.addEventListener("timeupdate", updateHandler);

jauge.addEventListener("input", e => {
  music.currentTime = jauge.value / 100 * music.duration;
});

volume.addEventListener("input", e=>{
  music.volume = volume.value
})



let  playMusic = ()=> {
  let currentTime = music.currentTime
  let setTime ;
  setTimeout(() => {
    console.log(currentTime !== music.currentTime)
    currentTime !== music.currentTime ? music.pause() : music.play() 
  }, 10);
  

}
let i = 0

let nextMusic= () =>{
  if(waitList.length !== 0){
    if(indexActu < waitList.length -1 ){
      indexActu++
      console.log(waitList[indexActu])
      music.src = waitList[indexActu ].contents
      music.load()
      
      updateData(waitList[indexActu ].file)
      music.play()
      
      
    }
  }
  
}

let prevMusic = ()=>{
  if(indexActu !== 0)
  {
    if( indexActu > 0 )
    {
      indexActu--
      console.log(waitList[indexActu])
      music.src = waitList[indexActu ].contents
      music.load()
      
      
      updateData(waitList[indexActu ].file)
      music.play()
      
      
    }
  }
}
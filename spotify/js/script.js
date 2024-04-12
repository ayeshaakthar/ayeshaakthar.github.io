let songs;
let currfolder;
async function getSongs(folder) {

    currfolder = folder;
    //get the html dom of songs folder
    let a = await fetch(`./${folder}/`);
    //turn the type of html dom into text)
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    //find all the a
    let as = div.getElementsByTagName('a');
    //find a that's href ends with .mp3
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            //push songname to songs and split the name into two parts, one that ends with /songs/ and another after songs/ and select the second on to get exact song name
            songs.push(element.href.split(`/${folder}/`)[1]);
        }

    }
    //put songs name in songList Div in library
    let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0];
    songUL.innerHTML = ''
    for (const song of songs) {
        //we put song name in ul of songList and replace %20 with spaces
        songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="./images/music.svg" alt="">
    <div class="info">
        <div>${song.replaceAll('%20', ' ')}</div>
        <div>Abir</div>
    </div>
    <div class="playnow">
        <span>Play now</span>
        <img class="invert" src="./images/play.svg" alt="">
    </div>  </li>`;
    }

    //Attach an event listener to each song
    Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click', () => {
            // getting the name of the song 
            // console.log(e.querySelector('.info').firstElementChild.innerHTML);
            // running the song function and trimming the song name because there's space in first of it 
            playMusic(e.querySelector('.info').firstElementChild.innerHTML.trim())
        })
    })

    return songs

}



//function to convert seconds to minutes:seconds
function secondsToMinutesSeconds(seconds) {

    if (isNaN(seconds) || seconds < 0) {
        return '00:00'
    }

    let minutes = Math.floor(seconds / 60)
    let remainingSeconds = Math.floor(seconds % 60);

    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

//global variable for current song
let currentSong = new Audio();

// function to play the song 
const playMusic = (track, pause = false) => {
    currentSong.src = `/${currfolder}/` + track;
    //if condition to automatically put the first song in playbar after reload
    if (!pause) {
        currentSong.play();
        play.src = './images/pause.svg'
    }
    //add spotify/songs/ to reach the exact link and track is the name of the file
    document.querySelector('.songInfo').innerHTML = decodeURI(track);
    document.querySelector('.songtime').innerHTML = '00:00 / 00:00';
}

//display the albums whenever its added to songs folder
async function displayAlbums() {
    // fetch the data of songs folder 
    let a = await fetch(`./songs/`);
    //turn the type of html dom into text)
    let response = await a.text();
    let div = document.createElement('div');
    // put songs folder into div 
    div.innerHTML = response;
    let cardContainer = document.querySelector('.cardContainer')
    // find all the a tags of div or songs folder //those a tags are location of the albums
    let anchors = div.getElementsByTagName('a')
    // make it array 
    let array = Array.from(anchors);

    // go through each value of array or album names
    for (let index = 0; index < array.length; index++) {
        let e = array[index];

        //extract the album name from album location or url
        if (e.href.includes('/songs/')) {
            let folder = (e.href.split('/').slice(-1))
            // get the metadaata of the folder from json 
            let a = await fetch(`./songs/${folder}/info.json`);
            let response2 = await a.json();
            //put album into cardContainer
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div  class="play">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="black" stroke="black" stroke-width="2">
                      <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke-linejoin="round" />
                    </svg>                              
            </div>
            <img src="./songs/${folder}/cover.jpg" alt="">
            <h2>${response2.title}</h2>
            <p>${response2.description}</p>
        </div>`
        }
    }

    //load the playlist whenever whatever card is clicked
    //get card element, make it an array cause it returns collection, then take each card element using for each,
    //add eventlistener to each card where if i click, it will change the url to its album folder
    //then songs will return collection of songs of that selected album
    Array.from(document.getElementsByClassName('card')).forEach(e => {
        e.addEventListener('click', async item => {
            //put all the names of the song in that selected album in songs variable
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`); //dataset-folder of html
            // play the first song of the album
            playMusic(songs[0])

        })
    })

}


async function main() {
    //get the list of all the songs
    await getSongs('songs/Arctic%20Monkeys');
    //display the albums
    displayAlbums()

    //put the first song in playbar after reload
    playMusic(songs[0], true);




    //Attach an event listener to play
    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = './images/pause.svg'
        }
        else {
            currentSong.pause();
            play.src = './images/play.svg'
        }


    })

    //listen for timeupdate event
    currentSong.addEventListener('timeupdate', () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector('.songtime').innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        //move the seekbar
        document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%';

        // go to next song when currentSong ends and if currentSong is the last song, change the pause button to play button
        if (currentSong.currentTime == currentSong.duration) {
            let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]) // currentSong.src.split('/songs/')[1] //same way
            if ((index + 1) < songs.length) {
                playMusic(songs[index + 1])
            }
            else{
                play.src = './images/play.svg'
            }

        }
    })

    //add eventlistener to the Seekbar
    document.querySelector('.seekbar').addEventListener('click', e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector('.circle').style.left = percent + '%';
        currentSong.currentTime = currentSong.duration * percent / 100;
    })

    //add eventlistener to hamburger
    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = '0';
    })

    //add eventlistener to close
    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.left').style.left = '-120%';
    })




    //add eventlistener to previous and next
    previous.addEventListener('click', () => {
        //find the index of current song
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]) // currentSong.src.split('/songs/')[1] //same way
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener('click', () => {
        //find the index of current song
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]) // currentSong.src.split('/songs/')[1] //same way
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })


    //add eventlistener to volume
    document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('change', (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector('.volume>img').src = document.querySelector('.volume>img').src.replace('mute.svg', 'volume.svg')
        }
    })

    //add eventlistener to mute the track
    document.querySelector('.volume>img').addEventListener('click', (e) => {
        if (e.target.src.includes('volume.svg')) {
            // find the src of targeted img of volume svg and replace them into mute svg
            e.target.src = e.target.src.replace('volume.svg', 'mute.svg')
            currentSong.volume = 0;
            document.querySelector('.range').getElementsByTagName('input')[0].value = currentSong.volume * 100;
        }
        else {
            // find the src of targeted img of mute svg and replace them into volume svg
            e.target.src = e.target.src.replace('mute.svg', 'volume.svg')
            currentSong.volume = 0.05;
            document.querySelector('.range').getElementsByTagName('input')[0].value = currentSong.volume * 100;
        }
    })





}

main()
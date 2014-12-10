//an object to hold a name for each sound and its associated buffer (memory holding the sound)
var audioBuffers={}
//required for managing and for playing any sound. Best practise is one per page.
//It is setup in init()
var audioContext;
//flag set once the sound is loaded
var soundLoaded = false;
function playSound(name) {
    if(audioBuffers[name] == undefined || !soundLoaded)
    if(!soundLoaded)
    {
    console.log("Sound doesn't exist or hasn't been loaded")
    return;
    }
    //retrieve the buffer we stored earlier
    audioBuffer = audioBuffers[name];
    //create a buffer source - used to play once and then a new one must be made
    var source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = false;
    source.connect(audioContext.destination);
    source.noteOn(0); // Play immediately.
}
function loadSoundFile(name, url) {
    console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
    //buffer containing sound returned by xhr
    var arrayBuffer=this.response;
    audioContext.decodeAudioData(arrayBuffer, function(buffer) {
    //associate the audio buffer with the sound name so can use the decoded audio later.
    audioBuffers[name]=buffer;
    soundLoaded = true;
    console.log(soundLoaded);
    //initSound(this.response); // this.response is an ArrayBuffer.
    }, function(e) {
    console.log('Error decoding file', e);
    });
};
//send the xhr request to download the sound file
    xhr.send();
}
//init the audio context
//This function is taken directly from http://www.html5rocks.com/en/tutorials/webaudio/intro/
function init() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        audioContext = new AudioContext();
        }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
        }
}
function main()
{
    //setup audio context
    window.addEventListener('load', init, false);
    //add touch listener to play sound on touch.
    //use of function() so that parameters can be passed to playSound
    //window.addEventListener('touchstart', function(){ playSound('explosion')} , false);
    //add click listener to play sound on touch.
    //window.addEventListener('click', function(){ playSound('explosion') }, false);
    //load sound
    loadSoundFile('explosion', "boom.mp3");
    //note this won't work because the sound won't have finished loading yet.
    //playSound('explosion');
    //This waits 2 seconds before trying to play the sound.
    //This will play (unless you have a very slow Internet connection
    //(in which case you need to up the time delay.)
    //What is interesting, and what you mightn't expect is that this does not play on the iPad
    //as this requires at least one interaction from the user first
    //then you can play as many sounds as you want.
    setTimeout( function() { playSound('explosion') }, 2000 );
}
//Thanks to https://github.com/D3vd/Meme_Api
let apiURL = "https://meme-api.com/gimme/";

let reditSub;
let defaultSub = "wholesomememes";
let memeImg, memeTitle, memeBtn, dropDown;

function init()
{
    memeImg = document.getElementById('memeImg');
    memeTitle = document.getElementById('memeTitle');
    memeBtn = document.getElementById("memeBtn");
    dropDown = document.getElementById("subDropDown");

    //won't initially have the value on page load
    reditSub = defaultSub;

    //events
    memeBtn.addEventListener("click", function ()
    {
        fetchMeme();
    });
    dropDown.addEventListener("change", function ()
    {
        reditSub = dropDown.value;
    });

    fetchMeme();
}

function fetchMeme()
{
    fetch(apiURL + reditSub)
        .then(response => response.json())
        .then(data =>
        {
            // Check if the meme is safe for work
            if (!data.nsfw)
            {
                memeImg.src = data.url;
                memeTitle.textContent = data.title; // Set the title
                memeImg.style.display = 'block'; // Make the image visible
                memeTitle.style.display = 'block'; // Make the title visible
            } else
            {
                console.warn('NSFW content detected. Skipping this meme.');
                fetchMeme(); // Try to fetch another meme if NSFW is true
            }
        })
        .catch(error => console.error('Error fetching meme:', error));
}

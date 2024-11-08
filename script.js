//Thanks to https://github.com/D3vd/Meme_Api
let redditURL = 'https://www.reddit.com/subreddits/search.json?q=memes';
let apiURL = "https://meme-api.com/gimme/";

let reditSub;
let defaultSub = "wholesomememes";
let memeImg, memeTitle, memeBtn, subredditSearch, dataList;

function init()
{
    memeImg = document.getElementById('memeImg');
    memeTitle = document.getElementById('memeTitle');
    memeBtn = document.getElementById("memeBtn");
    subredditSearch = document.getElementById("subredditSearch");
    dataList = document.getElementById('subreddits');

    //otherwise won't load on page load
    reditSub = defaultSub;

    //events
    memeBtn.addEventListener("click", function ()
    {
        fetchMeme();
    });
    subredditSearch.addEventListener("input", function (event)
    {
        reditSub = sanitizeInput(event.target.value);
        // redditSub = event.target.value;
        // console.log(sanitizeInput(event.target.value));
    });

    fetchSubreddits();
    fetchMeme();
}

function fetchSubreddits()
{
    // Fetch the list of meme subreddits from the Reddit API
    console.log("fetching:" + redditURL);
    fetch(redditURL)
        .then(response => response.json())
        .then(data =>
        {
            const subredditList = data.data.children; // Access the list of subreddits

            // Loop through each subreddit and add it to the datalist if it matches the keywords
            subredditList.forEach(sub =>
            {
                const option = document.createElement('option');
                option.value = sub.data.display_name; // Set the display name as the value
                dataList.appendChild(option); // Add option to the datalist
                console.log("appended");
            });
        })
        .catch(error => console.error('Error fetching subreddits:', error));
}

function fetchMeme()
{
    console.log("Fetching:" + apiURL + reditSub);
    fetch(apiURL + reditSub)
        .then(response => response.json())
        .then(data =>
        {
            if (!data || !data.url)
            {  // Check if 'data' is null/undefined or if it doesn't have the 'url' property
                memeTitle.textContent = 'No meme found';  // Update the title to reflect the error
                memeImg.src = "";
            } else
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
            }
        })
        .catch(error => console.error('Error fetching meme:', error));
}

function sanitizeInput(input)
{
    return input.replace(/[&<>"']/g, (match) =>
    {
        const escapeMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;"
        };
        return escapeMap[match];
    });
}
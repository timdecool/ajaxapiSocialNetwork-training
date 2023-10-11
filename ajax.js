let posts = [];
let users = [];
let comments = [];
let usersImg = [
    "https://picsum.photos/id/685/400/400",
    "https://picsum.photos/id/684/400/400",
    "https://picsum.photos/id/800/400/400",
    "https://picsum.photos/id/686/400/300",
    "https://picsum.photos/id/687/400/400",
    "https://picsum.photos/id/688/400/400",
    "https://picsum.photos/id/689/400/400",
    "https://picsum.photos/id/690/400/400",
    "https://picsum.photos/id/691/400/400",
    "https://picsum.photos/id/692/400/400",
];
const postsContainer = document.querySelector('.posts-container');

// EXERCICE 1 : POSTS
async function fetchUsersPosts() {
    await fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(data => posts = data)
    .catch(error => console.error("Error :", error));

    await fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(data => users = data)
    .catch(error => console.error("Error :", error));

    await fetch('https://jsonplaceholder.typicode.com/comments')
    .then(response => response.json())
    .then(data => comments = data)
    .catch(error => console.error("Error :", error));
};

(async function displayPosts() {
    if (posts.length == 0 || users.length == 0) {
        await fetchUsersPosts();
    }
    for (let post of posts) {
        let userName = users[post.userId-1].name;
        let userUsername = users[post.userId-1].username;
        let userImg = usersImg[post.userId-1];

        const postDiv = document.createElement('div');
        postDiv.classList.add('post-card');
        postDiv.id = `post-${post.id}`;
        postsContainer.appendChild(postDiv);

        postDiv.innerHTML = `
        <div class='post-author'>
            <img class='avatar' src='${userImg}' alt='Photo de profil de ${userName}'></img>
            <div>
                <p>${userName}</p>
                <p class='username'>@${userUsername.toLowerCase()}</p>
            </div>
        </div>
        <h2 class='post-title'>${post.title}</h2>
        <p>${post.body}</p>
        <div class='engagement'>
            <div class='commBtn'>Commentaires &darr;</div>
        </div>   
        `;
    }
    let commBtn = document.querySelectorAll('.commBtn')
    commBtn.forEach((btn) => {
        btn.addEventListener('click', toggleComments);
    })

    let postTitle = document.querySelectorAll('.post-title');
    postTitle.forEach((title) => {
        title.addEventListener('click', displayPostModal);
    })
})();

function displayPostModal(e) {
    let postId = e.target.parentNode.id.split('-')[1];

    // Production du fond du modal
    let modalBackground = document.createElement('div');
    modalBackground.classList.add("modal-background");
    document.body.appendChild(modalBackground);

    // Production du modal
    let modal = document.createElement('div');
    modal.classList.add('post-card');
    modalBackground.appendChild(modal);

    // Remplissage du modal
    modal.innerHTML = `
    <div class='post-author'>
        <img class='avatar' src='${usersImg[posts[postId-1].userId-1]}' alt='Photo de profil de ${e.target.parentNode.children[0].children[1].children[0].textContent}'></img>
        <div>
            <p>${e.target.parentNode.children[0].children[1].children[0].textContent}</p>
            <p class='username'>${e.target.parentNode.children[0].children[1].children[1].textContent}</p>
        </div>
        <div class='close-button'>
            <div class='close-1'></div>
            <div class='close-2'></div>
        </div>
    </div>
    <h2 class='post-title'>${e.target.textContent}</h2>
    <p>${e.target.nextElementSibling.textContent}</p>
    <div class='engagement'>
        <div class='commBtn'>Commentaires &darr;</div>
    </div> 
    `;
    let commBtn = document.querySelector('.modal-background .commBtn');
    commBtn.addEventListener('click',toggleComments);

    let closeBtn = document.querySelector('.close-button');
    closeBtn.addEventListener('click',hidePostModal);  
}

function hidePostModal() {
    
}

function toggleComments(e) {
    let post = e.target.parentNode.parentNode;
    if (post.children.length == 4) {
        // Récolter les commentaires correspondants
        let postId = post.id.split('-')[1];
        let postComments = [];
        for (let comment of comments) {
            if (comment.postId == postId) {
                postComments.push(comment);
            }               
        }
    
        // Afficher les commentaires
        const commentSection = document.createElement('div');
        commentSection.classList.add('comment-section');
        post.appendChild(commentSection);
        for (let postComment of postComments) {
            const commentBlock = document.createElement('div');
            commentBlock.classList.add('comment-block');
            commentSection.appendChild(commentBlock);

            commentBlock.innerHTML = `
            <span class='commentor'>${postComment.email.split('@')[0]}</span>
            <span class='comment'>${postComment.body}</span>
            `;
        }
        
        // Modifier le bouton commentaires
        post.children[3].children[0].innerHTML = `Commentaires &uarr;`
    }
    else {
        while (post.children[4].firstChild) {
            post.children[4].removeChild(post.children[4].firstChild)
        }
        post.removeChild(post.children[4]);
        // Modifier le bouton commentaires
        post.children[3].children[0].innerHTML = `Commentaires &darr;`
    }
    
}
console.log('Meet me at the park! ⚾️');
// Global Constants
const COMMENTS_API = `/`;
const userWall = document.getElementById('wall');
const newPostForm = document.getElementById('new-post-form');
const main = document.querySelector('main');
const formBlock = document.getElementsByClassName('new-post-form-block');
const form = document.querySelector('form');

// State variables
const comments = [];
const commentForm = document.getElementsByClassName('comment-form');

// Fetch functions
const postComment = (postId, data) => {
    // API Calls
    fetch(`/home/${postId}`, {
        method: `POST`,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(() => {
            window.location.reload();
        })
        .catch((err) => console.log(err));

}

const deletePost = data => {
    fetch(`/home/${data.postId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': `application/json`
        },
    })
        .then(() => {
            console.log(`Deleting ${data.postId}`)
            window.location.reload();
        })
}

const joinPost = (data) => {
    console.log(data)
    fetch(`/home/${data.postId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': `application/json`
        },
        body: JSON.stringify(data),
    })
        .then(() => {
            console.log(`You joined a group!`)
            window.location.reload();
        })
}

const appendForm = event => {
    if (event.target.classList.contains('button-on')) {
        event.target.innerHTML = `New Post`;
        event.target.classList.remove(`button-on`);
        event.target.parentNode.parentNode.removeChild(event.target.parentNode.parentNode.childNodes[3])
    } else {
        event.target.innerHTML = `Cancel`;
        event.target.classList.add(`button-on`)
        const newPostContainer = event.target.parentNode;
        const template = `
        <div class="form-to-be-appended" id="form-to-be-appended">
                <div class="form-title">New Post</div>
                <form id="new-post-form" method="POST">
                    <div class="form-group">
                        <label for="sport">Sport</label>
                        <input type="text" id="sportInput" name="sport" />
                    </div>
                    <div class="form-group">
                        <label for="location">Location</label>
                        <input type="text" id="locationInput" name="location" />
                    </div>
                    <div class="form-group">
                        <label for="date_time">Date and Time</label>
                        <input type="datetime-local" id="date_timeInput" name="date_time" />
                    </div>
                    <div class="form-group">
                        <label for="descr">Description</label>
                        <input type="text" id="descrInput" name="descr" />
                    </div>
                    <div class="submit-btn-container">
                    <input type="submit" class="submit-btn" value="Submit" />
                    </div>
                </form>
            </div>
        `;
        newPostContainer.insertAdjacentHTML('afterend', template);
    }
}

const errorMessage = target => {
    target.insertAdjacentHTML('afterend', `
        <div class="alert alert-${target.id}">
            Please enter your ${target.name}
        </div>
    `)
}
// Event Listeners
main.addEventListener('click', event => {
    if (event.target.tagName === 'BUTTON' && event.target.className === "comment-button") {
        event.preventDefault();
        console.log(event.target.parentNode.parentNode.childNodes[1].value);
        console.log(event.target.id);
        data = {
            content: event.target.parentNode.parentNode.childNodes[1].value,
            post_id: event.target.id
        };
        postComment(data.post_id, data);
    }
    if (event.target.className === 'delete-button') {
        event.preventDefault();
        data = {
            postId: event.target.parentNode.parentNode.parentNode.id
        }
        deletePost(data);
    }
    if (event.target.className === "join-button") {
        event.preventDefault();
        data = {
            postId: event.target.parentNode.parentNode.parentNode.id
        }
        joinPost(data);
    }
    if (event.target.id === "new-post-button") {

        appendForm(event);
    }
}, false);

document.addEventListener('blur', event => {
    if (event.target.value === '') {
        event.target.classList.add('empty-form');
        errorMessage(event.target);
    }
}, true)

// Clear Form Errors on Focus
document.addEventListener('focus', event => {
    event.target.classList.remove('input-error');
    const inputMessage = document.querySelector(`.alert-${event.target.id}`);
    if (inputMessage) {
        inputMessage.parentNode.removeChild(inputMessage);
    }
}, true)











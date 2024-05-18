document.addEventListener("DOMContentLoaded", () => {
    const filterInput = document.getElementById("postFilter");
    const postsContainer = document.getElementById("postContainer");
    const loader = document.getElementById("loadingSpinner");

    let limit = 20;
    let page = 1;

    async function getPosts() {
        try {
            const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`);
            return await res.json();
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    }
    async function displayPosts() {
        const posts = await getPosts();
        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("col-12", "mb-4");

            postElement.innerHTML = `
                <div class="post-card p-3 border rounded bg-white shadow-sm position-relative">
                    <div class="post-id d-flex justify-content-center align-items-center bg-white text-primary rounded-circle border border-primary position-absolute">${post.id}</div>
                    <h2 class="post-title">${post.title}</h2>
                    <p class="post-body">${post.body}</p>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });
    }

    function showLoader() {
        loader.classList.add("show");

        setTimeout(() => {
            loader.classList.remove("show");

            setTimeout(() => {
                page++;
                displayPosts();
            }, 300);
        }, 1000);
    }

    function filterPosts(event) {
        const filterTerm = event.target.value.toUpperCase();
        const posts = document.querySelectorAll(".post-card");
        posts.forEach(post => {
            const title = post.querySelector(".post-title").innerText.toUpperCase();
            const body = post.querySelector(".post-body").innerText.toUpperCase();

            if (title.includes(filterTerm) || body.includes(filterTerm)) {
                post.parentElement.style.display = "block";
            } else {
                post.parentElement.style.display = "none";
            }
        });
    }

    displayPosts();

    window.addEventListener("scroll", () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            showLoader();
        }
    });
    filterInput.addEventListener("input", filterPosts);
});

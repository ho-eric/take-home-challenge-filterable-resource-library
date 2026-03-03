const state = {
    resources: [],
    filters: {
        search: '',
        types: [],
        sort: 'newest'
    }
};

async function loadResources() {
    try {
        const response = await fetch('./data/resources.json');
        const data = await response.json();
        state.resources = data;
        renderResources(state.resources);
    } catch (error) {
        console.error("Failed to load resources:", error);
    }
}

function renderResources(resources) {
    const grid = document.getElementById('resource-grid');
    const template = document.getElementById('card-template');
    const countDisplay = document.getElementById('result-count');

    resources.forEach(item => {
        const clone = template.content.cloneNode(true);

        clone.querySelector('.post-date').textContent = new Date(item.date).toLocaleDateString();
        clone.querySelector('.resource-title').textContent = item.title;
        clone.querySelector('.resource-excerpt').textContent = item.excerpt;
        clone.querySelector('.read-more').textContent = item.url;

        grid.appendChild(clone);
    });
}

loadResources();
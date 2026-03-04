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
        clone.querySelector('.resource-content-type').textContent = item.contentType;
        clone.querySelector('.resource-condition').textContent = item.condition;
        clone.querySelector('.resource-author').textContent = item.author;
        clone.querySelector('.read-more').href = item.url;

        grid.appendChild(clone);
    });
}

function applyFilters() {
    
}

loadResources();
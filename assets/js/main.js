const state = {
    resources: [],
    filteredResources: [],
    filters: {
        search: '',
        contentType: [],
        condition: [],
        sort: 'all'
    }
};

async function loadResources() {
    try {
        const response = await fetch('./data/resources.json');
        const data = await response.json();
        state.resources = data;
        initEventListeners();
        renderResources(state.resources);
    } catch (error) {
        console.error("Failed to load resources:", error);
    }
}

function renderResources(resources) {
    const grid = document.getElementById('resource-grid');
    const template = document.getElementById('card-template');
    const countDisplay = document.getElementById('result-count');
    grid.innerHTML = ''; // resets the grid 

    if(resources.length === 0) {
        countDisplay.textContent = "No results found";
    } else {
        countDisplay.textContent = `Showing ${resources.length}  of ${state.resources.length} results`;
    }

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
    const query = state.filters.search.toLowerCase();

    state.filteredResources = state.resources.filter(item => {
        const matchesContentType = state.filters.contentType.length === 0 || state.filters.contentType.includes(item.contentType);
        const matchesCondition = state.filters.conditions.length === 0 || state.filters.conditions.includes(item.condition);
        const matchesSearch = query === '' || item.title.toLowerCase().includes(query) || item.excerpt.toLowerCase().includes(query);

        return matchesContentType && matchesCondition && matchesSearch;
    });

    filterResults();
    renderResources(state.filteredResources);
}

function filterResults() {
    const { sort } = state.filters;

    state.filteredResources.sort((a, b) => {
        if(sort === "newest") {
            return new Date(b.date) - new Date(a.date);
        } else if(sort === "oldest") {
            return new Date(a.date) - new Date(b.date);
        } else if (sort === "alpha") {
            return a.title.localeCompare(b.title);
        } else if(sort === "alphaRev") {
            return b.title.localeCompare(a.title);
        }
        return 0;
    });
}

function initEventListeners() {
    const filters = document.querySelector('.filters-sidebar');
    const sortSelect = document.querySelector('#sort-select');
    const searchBar = document.querySelector('#search-input');

    filters.addEventListener('change', (e) => {
        state.filters.contentType = Array.from(document.querySelectorAll('#content-type-filters input:checked')).map(cb => cb.value);
        state.filters.conditions = Array.from(document.querySelectorAll('#condition-filters input:checked')).map(cb => cb.value);
        applyFilters();
    });

    sortSelect.addEventListener('change', (e) => {
        state.filters.sort = e.target.value;
        applyFilters();
    })

    searchBar.addEventListener('input', (e) => {
        state.filters.search = e.target.value;
        applyFilters();
    })
}

loadResources();
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

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function loadResources() {
    const loadingIndicator = document.getElementById("loading-indicator")
    loadingIndicator.innerHTML = '<span class="loading-dots">Loading resources</span>';

    try {
        const response = await fetch('./data/resources.json');

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        await sleep(750); // Creates an artificial 750ms delay to simulate loading in the resources
        const data = await response.json();
        state.resources = data;
        renderResources(state.resources);
        loadingIndicator.innerHTML = '';
    } catch (error) {
        loadingIndicator.innerHTML = 'Failed to load resources';
        console.error("Failed to load resources:", error);
    }
}

function renderResources(resources) {
    const grid = document.getElementById('resource-grid');
    const template = document.getElementById('card-template');
    const countDisplay = document.getElementById('result-count');
    grid.innerHTML = ''; // Resets the grid so that the cards will not keep adding up as new filters are selected

    if(resources.length === 0) {
        countDisplay.textContent = "No results found, please try adjusting the filters or search terms";
    } else {
        countDisplay.textContent = `Showing ${resources.length}  of ${state.resources.length} results`;
    }

    // Injects the resource data into the card template
    resources.forEach(item => {
        const clone = template.content.cloneNode(true);
        const cardLinkWrapper = clone.querySelector('.card-link-wrapper');

        cardLinkWrapper.href = item.url;
        clone.querySelector('.post-date').textContent = new Date(item.date).toLocaleDateString();
        clone.querySelector('.resource-title').textContent = item.title;
        clone.querySelector('.resource-excerpt').textContent = item.excerpt;
        clone.querySelector('.resource-content-type').textContent = item.contentType;
        clone.querySelector('.resource-condition').textContent = item.condition;
        clone.querySelector('.resource-author').textContent = item.author;

        grid.appendChild(clone);
    });
}

function applyFilters() {
    const query = state.filters.search.trim().toLowerCase();

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
    let debounceTimer;

    filters.addEventListener('change', (e) => {
        state.filters.contentType = Array.from(document.querySelectorAll('#content-type-filters input:checked')).map(cb => cb.value);
        state.filters.conditions = Array.from(document.querySelectorAll('#condition-filters input:checked')).map(cb => cb.value);
        applyFilters();
    });

    sortSelect.addEventListener('change', (e) => {
        state.filters.sort = e.target.value;
        applyFilters();
    })

    // Adds debounce to not overload the system if there are more items in the resources.json
    searchBar.addEventListener('input', (e) => {
        clearTimeout(debounceTimer); // Reset the timer every time they hit a key
    
        debounceTimer = setTimeout(() => {
            state.filters.search = e.target.value.trim().toLowerCase();
            applyFilters();
        }, 300); // Wait 300ms after the last keystroke
    })
}

function sanitizeInputField(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return str.trim().toLowerCase();    
}

initEventListeners();
loadResources();
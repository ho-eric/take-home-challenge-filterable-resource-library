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
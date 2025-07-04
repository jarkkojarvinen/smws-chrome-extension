async function loadDistilleryData() {
    const response = await fetch(chrome.runtime.getURL("assets/data/smws_codes.csv"));
    const text = await response.text();
    return text
        .split("\n")
        .slice(1) // Skip header
        .reduce((mapping, line) => {
            const [code, distillery] = line.split(";").map(part => part?.trim());
            if (code && distillery) mapping[code] = distillery;
            return mapping;
        }, {});
}

function appendDistilleryToElement(element, distillery) {
    if (element && !element.textContent.includes(`(${distillery})`)) {
        const distilleryElement = document.createElement("span");
        distilleryElement.style.display = "block";
        distilleryElement.textContent = `(${distillery})`;
        element.appendChild(distilleryElement);
    }
}

function addDistilleryToProductPage(mapping) {
    const productElement = document.querySelector(".productView-product .caskNo");
    if (productElement) {
        const caskCode = productElement.textContent
            .replace("CASK NO.", "")
            .trim()
            .split(".")[0];
        const distillery = mapping[caskCode];

        if (distillery && !productElement.textContent.includes(`(${distillery})`)) {
            productElement.textContent += ` (${distillery})`;
        }
    }
}

function addDistilleryToListPage(mapping) {
    const items = document.querySelectorAll(".itemInfoWrap");

    items.forEach(item => {
        const ulElement = item.querySelector("ul");
        const caskNameElement = ulElement?.querySelector("li.small > span.name");
        const caskCodeElement = caskNameElement?.nextElementSibling;

        if (
            caskNameElement?.textContent.trim() === "CASK NO." &&
            caskCodeElement?.classList.contains("value")
        ) {
            const caskCode = caskCodeElement.textContent.trim().split(".")[0];
            const distillery = mapping[caskCode];

            if (distillery) {
                // Check if distillery already exists
                const existingDistilleryElement = Array.from(
                    ulElement.querySelectorAll("li > span.name")
                ).find(span => span.textContent.trim() === "Distillery");

                if (!existingDistilleryElement) {
                    // Create new distillery list item
                    const distilleryItem = document.createElement("li");
                    const nameSpan = document.createElement("span");
                    nameSpan.classList.add("name");
                    nameSpan.textContent = "Distillery";

                    const valueSpan = document.createElement("span");
                    valueSpan.classList.add("value");
                    valueSpan.textContent = distillery;

                    distilleryItem.appendChild(nameSpan);
                    distilleryItem.appendChild(valueSpan);

                    // Insert as the first <li> in the <ul>
                    ulElement.prepend(distilleryItem);
                }
            }
        }
    });
}

function addDistilleryToRelatedProducts(mapping) {
    // Check if related products block exists
    const relatedProductsBlock = document.querySelector(".relatedProductsBlock");
    if (!relatedProductsBlock) return;

    // Find all items in the related products list
    const items = relatedProductsBlock.querySelectorAll(".relatedProductsList .card-body");
    items.forEach(item => {
        // Get the CASK NO. element
        const caskNoElement = item.querySelector(".caskNo");
        if (caskNoElement) {
            const caskCode = caskNoElement.textContent.trim().split(" ").pop().split(".")[0];
            const distillery = mapping[caskCode];
            if (distillery && !caskNoElement.textContent.includes(`(${distillery})`)) {
                // Append distillery name directly to the caskNo element
                caskNoElement.textContent += ` (${distillery})`;
            }
        }
    });
}

function addDistilleryToProductDescription(mapping) {
    const descriptionBlock = document.querySelector("#productView-description");
    if (!descriptionBlock) return;

    const strongTags = descriptionBlock.querySelectorAll("strong");
    strongTags.forEach(strong => {
        const text = strong.textContent.trim();
        const match = text.match(/^(\d+)\.\d+/); // Match cask codes like 13.110
        if (match) {
            const codePrefix = match[1];
            const distillery = mapping[codePrefix];

            if (distillery && !text.includes(distillery)) {
                strong.textContent += ` (${distillery})`;
            }
        }
    });
}

function observeRelatedProductsChanges(mapping) {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const callback = () => {
        const relatedProductsBlock = document.querySelector(".relatedProductsBlock");
        if (relatedProductsBlock) {
            addDistilleryToRelatedProducts(mapping);
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}

function observePageChanges(mapping) {
    const observer = new MutationObserver(() => {
        if (document.querySelector(".productView-product")) {
            addDistilleryToProductPage(mapping);
        } else {
            addDistilleryToListPage(mapping);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

function addGitHubLink() {
    const linkElement = document.createElement("div");
    linkElement.innerHTML = `
        <a href="https://github.com/jarkkojarvinen/smws-chrome-extension" target="_blank" style="text-decoration: none; color: white;">
            Distillery names added by SMWS Chrome Extension
        </a>
    `;
    linkElement.style.position = "fixed";
    linkElement.style.top = "0";
    linkElement.style.right = "0";
    linkElement.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    linkElement.style.color = "white";
    linkElement.style.padding = "5px 10px";
    linkElement.style.fontSize = "12px";
    linkElement.style.zIndex = "10000";
    linkElement.style.borderBottomRightRadius = "5px";
    linkElement.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.5)";

    document.body.appendChild(linkElement);
}
addGitHubLink();

(async () => {
    const mapping = await loadDistilleryData();

    // Initial population
    if (document.querySelector(".productView-product")) {
        addDistilleryToProductPage(mapping);
    } else if (document.querySelector(".itemInfoWrap")) {
        addDistilleryToListPage(mapping);
    }
    addDistilleryToRelatedProducts(mapping);
    addDistilleryToProductDescription(mapping);

    // Observe for dynamic changes
    observePageChanges(mapping);
    observeRelatedProductsChanges(mapping);
})();



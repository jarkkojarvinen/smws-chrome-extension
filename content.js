async function loadDistilleryData() {
    const response = await fetch(chrome.runtime.getURL("smws_codes.csv"));
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

function getCaskCodeFromItem(item) {
    const caskNameElement = item.querySelector("span.name");
    const caskCodeElement = caskNameElement?.nextElementSibling;
    if (
        caskNameElement?.textContent.trim() === "CASK NO." &&
        caskCodeElement?.classList.contains("value")
    ) {
        return caskCodeElement.textContent.trim().split(".")[0];
    }
    return null;
}

function addDistilleryToProductPage(mapping) {
    const productElement = document.querySelector(".productView-product .caskNo");
    if (productElement) {
        const caskCode = productElement.textContent.split(" ").pop().trim().split(".")[0];
        const distillery = mapping[caskCode];
        const titleElement = document.querySelector(".productView-title");
        appendDistilleryToElement(titleElement, distillery);
    }
}

function addDistilleryToListPage(mapping) {
    const items = document.querySelectorAll(".itemInfoWrap");
    items.forEach(item => {
        const caskCode = getCaskCodeFromItem(item);
        if (caskCode) {
            const distillery = mapping[caskCode];
            const titleElement = item
                .closest(".card-body")
                .querySelector(".card-title a");
            appendDistilleryToElement(titleElement, distillery);
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
        <a href="https://github.com/your-repo-name" target="_blank" style="text-decoration: none; color: white;">
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

    // Observe for dynamic changes
    observePageChanges(mapping);
    observeRelatedProductsChanges(mapping);
})();


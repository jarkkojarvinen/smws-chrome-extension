# SMWS Chrome Extension

This Chrome extension enhances the user experience on the [SMWS](https://www.smws.eu) website by displaying the distillery names associated with CASK NO. values. It dynamically updates distillery information on the product, list, and related product pages.

## Features

- Adds distillery names near `CASK NO.` values on product pages, list pages, and related products sections.
- Dynamically updates data even for content loaded after the initial page load.

## Installation Instructions

### Step 1: Download the Extension

1. Clone or download this repository to your local machine:
   ```bash
   git clone https://github.com/jarkkojarvinen/smws-chrome-extension
   ```
   Alternatively, download the `.zip` file (under green Code button above) and extract it.

### Step 2: Load the Extension into Chrome

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** using the toggle in the top-right corner.
3. Click the **Load unpacked** button.
4. Browse to the folder where the extension is located and select it.

### Step 3: Verify the Installation

1. Once the extension is loaded, it will appear in the list of extensions with the name **SMWS Chrome Extension**.
2. Open [SMWS](https://www.smws.eu) and check if the distillery names are displayed next to `CASK NO.` values.

## File Structure

```
smws-chrome-extension/
│
├── assets
│   └── icons
│      └── logo.png        # Logo
│   └── data
│      └── smws_codes.csv  # Distillery mapping file
├── src
│   └── content.js         # Main JavaScript file that adds distillery names
├── LICENCE                # Licence
├── manifest.json          # Chrome extension configuration
└── README.md              # Documentation
```

## SMWS Codes

This project uses Scotch Malt Whisky Society (SMWS) codes from the webpage [https://whiskygospel.com/smws-codes/](https://whiskygospel.com/smws-codes/). The web page content has been consolidated into a semicolon separated CSV file for example:

```csv
SMWS Code;Distillery;Region/Country
1;Glenfarclas;Speyside
2;Glenlivet;Speyside
...
```

## Updating the Extension

If you make changes to the extension's files:
1. Go to `chrome://extensions/`.
2. Click the **Reload** button under the **SMWS Chrome Extension** entry.

## Known Issues

- The extension relies on dynamic content loading and may occasionally experience delays on slower networks.

## Contributing

Feel free to fork this repository and contribute. Pull requests are welcome.

## License

This project is licensed under the [MIT License](LICENSE).

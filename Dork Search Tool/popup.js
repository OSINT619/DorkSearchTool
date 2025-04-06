document.addEventListener('DOMContentLoaded', function () {
    const paymentStatusDiv = document.getElementById('paymentStatus');
    const searchButton = document.getElementById('searchButton');
    const premiumFeaturesDiv = document.getElementById('premiumFeatures');
    const dorkTypeSelect = document.getElementById('dorkType');
    const tipButton = document.getElementById('tipButton');

    // Unlock all premium features by default
    unlockPremiumFeatures();

    // Handle Tip Me button click
    tipButton.addEventListener('click', function () {
        window.open('https://buy.stripe.com/fZeg2X7ue2gR11u5kn', '_blank');
    });
});

function unlockPremiumFeatures() {
    const paymentStatusDiv = document.getElementById('paymentStatus');
    const searchButton = document.getElementById('searchButton');
    const premiumFeaturesDiv = document.getElementById('premiumFeatures');
    const dorkTypeSelect = document.getElementById('dorkType');

    paymentStatusDiv.textContent = "Happy Dorking!";
    searchButton.disabled = false;  // Enable search button

    if (premiumFeaturesDiv) {
        premiumFeaturesDiv.style.display = 'block';  // Show premium features
    } else {
        console.error('premiumFeaturesDiv not found in the DOM');
    }

    // Add premium dork options to dropdown
    addPremiumDorks(dorkTypeSelect);
}

function addPremiumDorks(selectElement) {
    const premiumDorks = [
        { value: 'loginPages', text: 'Finding Login Pages' },
        { value: 'configFiles', text: 'Exposed Configuration Files' },
        { value: 'exposedDatabases', text: 'Finding Exposed Databases' },
        { value: 'directoryListing', text: 'Directory Listing Enabled' },
        { value: 'htaccessFiles', text: 'Exposed .htaccess Files' },
        { value: 'sensitiveDocs', text: 'Sensitive Documents' },
        { value: 'backupFiles', text: 'Finding Backup Files' },
        { value: 'vulnerableSites', text: 'Identifying Vulnerable Sites Using Specific Technologies' },
        { value: 'exposedEmails', text: 'Finding Publicly Exposed Email Addresses' },
        { value: 'webcams', text: 'Finding Webcams' },
        { value: 'vulnerableFiles', text: 'Finding Vulnerable Files' },
        { value: 'openFTP', text: 'Finding Open FTP Servers' },
        { value: 'unprotectedPlugins', text: 'Finding Unprotected WordPress Plugins' },
        { value: 'exposedLogs', text: 'Finding Exposed Error Logs' },
        { value: 'xss', text: 'Finding Sites Vulnerable to XSS' },
        { value: 'lfi', text: 'Finding Pages Vulnerable to LFI' },
        { value: 'unsecuredWebcams', text: 'Finding Unsecured Webcams' },
        { value: 'openDirectories', text: 'Finding Open Directories' },
        { value: 'svnRepos', text: 'Finding Exposed SVN Repositories' },
        { value: 'openWiFiCameras', text: 'Finding Open Wi-Fi Cameras' }
    ];

    premiumDorks.forEach(function (dork) {
        const option = document.createElement('option');
        option.value = dork.value;
        option.textContent = dork.text;
        selectElement.appendChild(option);
    });
}

// Your existing search logic...
document.getElementById('searchButton').addEventListener('click', function () {
    const domain = document.getElementById('domainInput').value.trim();
    const dorkType = document.getElementById('dorkType').value;
    const dateRange = document.getElementById('dateRange').value;

    if (domain) {
        let query;

        switch(dorkType) {
            case "loginPages":
                query = `site:${domain} inurl:admin login OR site:${domain} inurl:login intext:"username"`;
                break;
            case "configFiles":
                query = `site:${domain} inurl:"config.php" filetype:php`;
                break;
            case "exposedDatabases":
                query = `site:${domain} filetype:sql "DROP TABLE" intext:"-- phpMyAdmin SQL Dump"`;
                break;
            case "directoryListing":
                query = `site:${domain} intitle:index.of "parent directory"`;
                break;
            case "htaccessFiles":
                query = `site:${domain} inurl:".htaccess" filetype:htaccess`;
                break;
            case "sensitiveDocs":
                query = `site:${domain} filetype:pdf "Confidential"`;
                break;
            case "backupFiles":
                query = `site:${domain} inurl:backup filetype:bak OR inurl:backup filetype:zip`;
                break;
            case "vulnerableSites":
                query = `site:${domain} intitle:"Welcome to WordPress" "Just another WordPress site"`;
                break;
            case "exposedEmails":
                query = `site:${domain} intext:"@domain.com" intext:"email" OR intext:"e-mail"`;
                break;
            case "webcams":
                query = `site:${domain} inurl:/view/view.shtml`;
                break;
            case "vulnerableFiles":
                query = `site:${domain} filetype:php inurl:"id="`;
                break;
            case "openFTP":
                query = `site:${domain} intitle:"index of" inurl:ftp`;
                break;
            case "unprotectedPlugins":
                query = `site:${domain} inurl:wp-content/plugins/ intitle:index.of`;
                break;
            case "exposedLogs":
                query = `site:${domain} filetype:log intext:"error"`;
                break;
            case "xss":
                query = `site:${domain} inurl:"search.php?q=" OR inurl:"search.php?q=" script`;
                break;
            case "lfi":
                query = `site:${domain} inurl:"index.php?page="`;
                break;
            case "unsecuredWebcams":
                query = `site:${domain} inurl:"/control/userimage.html"`;
                break;
            case "openDirectories":
                query = `site:${domain} intitle:index.of "/admin"`;
                break;
            case "svnRepos":
                query = `site:${domain} inurl:".svn" intext:"entries"`;
                break;
            case "openWiFiCameras":
                query = `site:${domain} inurl:"viewerframe?mode=motion"`;
                break;
            default:
                query = `"${domain}" -site:${domain}`;
        }

        if (dateRange) {
            query += ` after:${getDateRange(dateRange)}`;
        }

        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

        // Delay opening the new window slightly to prevent the popup from closing too soon
        setTimeout(() => {
            chrome.windows.create({ url: url, type: 'popup' });
        }, 100);

        // Save the search to history
        chrome.storage.sync.get({ searchHistory: [] }, function(data) {
            let searchHistory = data.searchHistory;
            searchHistory.unshift({ domain, dorkType, id: Date.now() });
            if (searchHistory.length > 5) searchHistory.pop();
            chrome.storage.sync.set({ searchHistory }, function() {
                displayHistory();  // Ensure history is refreshed
            });
        });

    } else {
        alert("Please enter a valid domain.");
    }
});

// Function to convert date range to a format compatible with Google search
function getDateRange(range) {
    const today = new Date();
    let startDate;

    switch(range) {
        case 'yesterday':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 1);
            break;
        case 'week':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 7);
            break;
        case 'month':
            startDate = new Date(today);
            startDate.setMonth(today.getMonth() - 1);
            break;
        case 'year':
            startDate = new Date(today);
            startDate.setFullYear(today.getFullYear() - 1);
            break;
        default:
            startDate = today;
    }

    const year = startDate.getFullYear();
    const month = (startDate.getMonth() + 1).toString().padStart(2, '0');
    const day = startDate.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// Display search history on load
window.onload = function() {
    displayHistory();
};

function displayHistory() {
    chrome.storage.sync.get({ searchHistory: [] }, function(data) {
        const searchHistoryList = document.getElementById('searchHistoryList');
        searchHistoryList.innerHTML = '';
        data.searchHistory.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.dorkType}: ${item.domain}`;
            
            // Create a delete button for each item
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.className = 'deleteButton';
            deleteButton.addEventListener('click', function () {
                deleteSearch(item.id);
            });

            li.appendChild(deleteButton);
            searchHistoryList.appendChild(li);
        });

        // Check if the number of history items exceeds 4
        const container = document.getElementById('searchHistoryListContainer');
        if (data.searchHistory.length > 4) {
            container.style.overflowY = 'auto';  // Enable scroll bar
        } else {
            container.style.overflowY = 'hidden';  // Disable scroll bar
        }
    });
}

function deleteSearch(id) {
    chrome.storage.sync.get({ searchHistory: [] }, function(data) {
        const newHistory = data.searchHistory.filter(item => item.id !== id);
        chrome.storage.sync.set({ searchHistory: newHistory }, function() {
            displayHistory();
        });
    });
}

document.getElementById('clearAllButton').addEventListener('click', function () {
    chrome.storage.sync.set({ searchHistory: [] }, function() {
        displayHistory();
    });
});

// Export search history to CSV
document.getElementById('exportButton').addEventListener('click', function () {
    chrome.storage.sync.get({ searchHistory: [] }, function(data) {
        const searchHistory = data.searchHistory;
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Dork Type,Domain\n";
        searchHistory.forEach(item => {
            csvContent += `${item.dorkType},${item.domain}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "search_history.csv");
        document.body.appendChild(link); // Required for FF

        link.click();
        link.remove();
    });
});

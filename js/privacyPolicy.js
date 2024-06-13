 function initPrivacyPolicy(){
    includeHTML().then(() => {
        hideNavBar()
        hideHeaderIcons();
        highlightPrivacyPolicy();
    });
}

function goBack() {
    window.history.back();
}


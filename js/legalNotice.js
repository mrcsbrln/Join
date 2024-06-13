function initLegalNotice() {
    includeHTML().then(() => {
        hideNavBar();
        hideHeaderIcons();
        highlightLegalNotice();
 });
}


function goBack() {
    window.history.back();
}

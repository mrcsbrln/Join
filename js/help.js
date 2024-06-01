function initHelp() {
    includeHTML().then(hideHelpIcon);
}


function goBack() {
    window.history.back();
}


function hideHelpIcon() {
    document.getElementById('hide-help-icon').classList.add('d-none');
}
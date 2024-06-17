"use strict";


function initIndex() {

    checkForCurrentUser() ? redirectToSummary() : redirectToLogin();

}


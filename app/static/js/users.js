document.querySelector('[data-login-button]').onclick = () => {login()}

function login() {
    const inputFields = document.querySelectorAll('input');
    const location = inputFields.length < 3 ? 'login' : 'register';
    let data = {};

    for (i = 0; i < inputFields.length; i++) {
        const inputField = inputFields[i];
        inputField.oninput = () => {inputField.setCustomValidity('')}

        if (inputField.value === '') {
            returnError(inputField, 'Field required.');
            return;
        }

        if (inputField.type === 'email' && !inputField.value.includes('@')) {
            returnError(inputField, "Invalid email. Email must include '@'.");
            return;
        }

        data[inputField.name] = inputField.value;
    }

    fetch(`/api/${location}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'X-CSRFToken': getCookie('csrftoken')}
    })
    .then(response => response.json())
    .then(request => {
        if (request.successful) {document.location.href = request.path}
        else {returnError(document.querySelector(`[data-${request.error_field}]`), request.error_message)}
    });
}

function returnError(inputField, message) {
    inputField.setCustomValidity(message);
    inputField.reportValidity();
}

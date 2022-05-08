loginButton = document.querySelector('[data-login-button]');

if (loginButton) {
    document.querySelector('[data-login-button]').onclick = () => {
        const inputFields = [
            document.querySelector('[data-username]'),
            document.querySelector('[data-password]')
        ]

        checkForErrors(inputFields, 'login');
    }
}

registerButton = document.querySelector('[data-register-button]');

if (registerButton) {
    document.querySelector('[data-register-button]').onclick = () => {
        const inputFields = [
            document.querySelector('[data-username]'),
            document.querySelector('[data-email]'),
            document.querySelector('[data-password]'),
            document.querySelector('[data-confirmation]')
        ]

        checkForErrors(inputFields, 'register');
    }
}

function checkForErrors(inputFields, location) {
    let data = {};

    for (i = 0; i < inputFields.length; i++) {
        const inputField = inputFields[i];

        inputField.oninput = () => {
            inputField.setCustomValidity('');
        }

        if (inputField.value === '') {
            inputField.setCustomValidity('Field required.');
            inputField.reportValidity();
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
        if (request.successful) {
            document.location.href = request.path;
        } else {
            const inputField = document.querySelector(`[data-${request.error_field}]`);
            inputField.setCustomValidity(request.error);
            inputField.reportValidity();
        }
    });
}

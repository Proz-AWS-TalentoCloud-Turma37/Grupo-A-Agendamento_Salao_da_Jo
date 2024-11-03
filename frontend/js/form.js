class Validator {
    constructor() {
        this.validations = [
            'data-min-length',
            'data-max-length',
            'data-only-letters',
            'data-email-validate',
            'data-required',
            'data-equal',
        ];
    }

    validate(form) {
        let currentValidations = document.querySelectorAll('form .error-validation');

        if (currentValidations.length) {
            this.cleanValidations(currentValidations);
        }

        let inputs = form.getElementsByTagName('input');
        let inputsArray = [...inputs];

        inputsArray.forEach(function(input) {
            for (let i = 0; this.validations.length > i; i++) {
                if (input.getAttribute(this.validations[i]) != null) {
                    let method = this.validations[i].replace("data-", "").replace("-", "");
                    let value = input.getAttribute(this.validations[i]);
                    this[method](input, value);
                }
            }
        }, this);
    }

    minlength(input, minValue) {
        let inputLength = input.value.length;
        let errorMessage = `O campo precisa ter pelo menos ${minValue} caracteres`;

        if (inputLength < minValue) {
            this.printMessage(input, errorMessage);
        }
    }

    maxlength(input, maxValue) {
        let inputLength = input.value.length;
        let errorMessage = `O campo precisa ter menos que ${maxValue} caracteres`;

        if (inputLength > maxValue) {
            this.printMessage(input, errorMessage);
        }
    }

    onlyletters(input) {
        const regex = /^[A-Za-z]+$/;
        let errorMessage = 'Este campo aceita apenas letras.';

        if (!regex.test(input.value)) {
            this.printMessage(input, errorMessage);
        }
    }

    emailvalidate(input) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let errorMessage = 'Por favor, insira um endereço de e-mail válido.';

        if (!regex.test(input.value)) {
            this.printMessage(input, errorMessage);
        }
    }

    required(input) {
        if (!input.value) {
            this.printMessage(input, 'Este campo é obrigatório.');
        }
    }

    equal(input, inputToCompare) {
        const inputCompare = document.querySelector(`input[name="${inputToCompare}"]`);
        if (input.value !== inputCompare.value) {
            this.printMessage(input, 'Os campos não são iguais.');
        }
    }

    printMessage(input, message) {
        let errorValidation = input.parentNode.querySelector('.error-validation');
        errorValidation.style.display = 'block';
        errorValidation.innerHTML = message;
    }

    cleanValidations(validations) {
        validations.forEach(el => el.innerHTML = '');
    }
}

// Alternar a visibilidade da senha
function alternarSenha() {
    const senhaInput = document.getElementById('senha');
    const showPasswordCheckbox = document.getElementById('showPassword');

    if (showPasswordCheckbox.checked) {
        senhaInput.type = 'text'; // Mostra a senha
    } else {
        senhaInput.type = 'password'; // Esconde a senha
    }
}

// Aguarde o carregamento do DOM antes de adicionar o event listener
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    const validator = new Validator();

    // Adiciona o evento de submit
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Previne o envio do formulário
        validator.validate(form); // Valida o formulário
    });

    // Adiciona o evento para alternar a senha
    const showPasswordCheckbox = document.getElementById('showPassword');
    showPasswordCheckbox.addEventListener('click', alternarSenha);
});

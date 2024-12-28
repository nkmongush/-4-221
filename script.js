document.addEventListener('DOMContentLoaded', function () {
    let registrationForm,
        nameInput,
        dateInput,
        genderMale,
        genderFemale,
        nameError,
        dateError,
        genderError,
        profileSlide,
        nameDiv,
        dateDiv,
        genderDiv,
        registrationModal,
        editForm,
        editNameInput,
        editDateInput,
        editGenderMale,
        editGenderFemale,
        images,
        currentIndex = 0,
        checkTestButton,
        resetTestButton,
        quizDiv,
        resultsDiv,
        galleryContainer,
        galleryImages,
        prevButton,
        nextButton,
        searchInput,
        searchButton,
        endSearchButton,
        glossaryItems,
        currentPath = window.location.pathname,
        loginInput,
        birthdateInput,
        authGenderMale,
        authGenderFemale,
        authForm,
        authModal,
        loginError,
        birthdateError,
        isLoggedIn = false;

    // Function to display an error message
    function showCustomError(message, element, errors) {
        if (!element) {
            console.error("Element is null, cannot show custom error:", message);
            return;
        }

        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        element.parentNode.insertBefore(errorElement, element.nextSibling);

        if (errors && element) {
            for (const key in errors) {
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = errors[key];
                if (element.parentNode)
                    element.parentNode.insertBefore(errorElement, element.nextSibling);
                setTimeout(() => errorElement.remove(), 5000);
            }
        } else {
            setTimeout(() => errorElement.remove(), 5000);
        }

    }
    // Function to display a success message
    function showCustomSuccess(message, element) {
        if (!element) {
            console.error("Element is null, cannot show custom success message:", message);
            return;
        }
        const successElement = document.createElement('div');
        successElement.className = 'custom-success';
        successElement.textContent = message;
        element.parentNode.insertBefore(successElement, element.nextSibling);
        setTimeout(() => successElement.remove(), 3000);
    }
    // Function to validate form fields
    function validateField(field, errorElement, message) {
        if (!field.value.trim() || !field.validity.valid) {
            errorElement.textContent = message;
            return false;
        } else {
            errorElement.textContent = "";
            return true;
        }
    }
    function setupValidation(loginInput, birthdateInput, loginError, birthdateError) {
        const loginPattern = /^[А-Яа-я0-9]{4,10}$/;
        const minDate = new Date("1950-01-01");
        const maxDate = new Date();
        function validateLogin() {
            if (!loginInput.value.trim()) {
                loginError.textContent = "Введите логин.";
                return false;
            }
            if (!loginPattern.test(loginInput.value)) {
                loginError.textContent = "Логин должен состоять из символов русского алфавита и цифр, иметь длину от 4 до 10 символов.";
                return false;
            }
            loginError.textContent = "";
            return true;
        }
        function validateBirthdate() {
            if (!birthdateInput.value.trim()) {
                birthdateError.textContent = "Выберите дату рождения.";
                return false;
            }
            const selectedDate = new Date(birthdateInput.value);
            if (selectedDate < minDate) {
                birthdateError.textContent = 'Дата рождения не может быть раньше 01.01.1950.';
                return false;
            }
            if (selectedDate > maxDate) {
                birthdateError.textContent = 'Дата рождения не может быть позже текущей даты.';
                return false;
            }
            birthdateError.textContent = "";
            return true;
        }
        loginInput.addEventListener('input', validateLogin);
        birthdateInput.addEventListener('input', validateBirthdate);
        return { validateLogin, validateBirthdate };
    }
    function initRegistration() {
        registrationForm = document.getElementById('registrationForm');
        nameInput = document.getElementById('nameInput');
        dateInput = document.getElementById('dateInput');
        genderMale = document.getElementById('genderMale');
        genderFemale = document.getElementById('genderFemale');
        registrationModal = document.getElementById('registrationModal');
        nameError = document.getElementById('nameError');
        dateError = document.getElementById('dateError');
        genderError = document.getElementById('genderError');
        if (registrationForm && registrationModal) {
            registrationForm.addEventListener('submit', handleRegistration);
        }
    }
    function handleRegistration(event) {
        event.preventDefault();
        let isValid = true;
        nameError = document.getElementById('nameError');
        dateError = document.getElementById('dateError');
        genderError = document.getElementById('genderError');
        isValid = validateField(nameInput, nameError, "Error: Пожалуйста, введите имя на русском языке, начиная с заглавной буквы.");
        isValid = validateField(dateInput, dateError, "Error: Пожалуйста, выберите настоящую дату рождения.") && isValid;
        let selectedGender;
        if (genderMale.checked) {
            selectedGender = genderMale.value;
        } else if (genderFemale.checked) {
            selectedGender = genderFemale.value;
        } else {
            isValid = false;
            showCustomError("Пожалуйста, выберите пол.", registrationForm, {
                gender: "Пожалуйста, выберите пол."
            });
            genderError.textContent = "Пожалуйста, выберите пол.";
        }
        if (isValid) {
            const registrationData = {
                name: nameInput.value,
                date: dateInput.value,
                gender: selectedGender,
            };
            localStorage.setItem('registrationData', JSON.stringify(registrationData));
            if (registrationModal)
                registrationModal.style.display = 'none';
            updateProfileDisplay();
            showCustomSuccess('Регистрация прошла успешно!', registrationForm);
        }
    }
    function checkAuth() {
        const registrationData = localStorage.getItem('registrationData');
        if (registrationData) {
            isLoggedIn = true;
            updateProfileDisplay();
            if (registrationModal)
                registrationModal.style.display = 'none';
        } else {
            isLoggedIn = false;
            updateProfileDisplay();
            if (registrationModal)
                registrationModal.style.display = 'block';
            if (profileSlide)
                profileSlide.style.display = 'none';
        }
    }
    function updateProfileDisplay() {
        profileSlide = document.getElementById('profile-slide');
        nameDiv = document.getElementById('name');
        dateDiv = document.getElementById('date');
        genderDiv = document.getElementById('gender');
        if (!profileSlide || !nameDiv || !dateDiv || !genderDiv) {
            console.error('Не удалось найти элементы профиля.');
            return;
        }
        try {
            const registrationData = localStorage.getItem('registrationData');
            if (registrationData) {
                const userData = JSON.parse(registrationData);
                if (userData.name)
                    nameDiv.textContent = `Имя: ${userData.name}`;
                else nameDiv.textContent = '';
                if (userData.date)
                    dateDiv.textContent = `Дата рождения: ${userData.date}`;
                else dateDiv.textContent = '';
                if (userData.gender)
                    genderDiv.textContent = `Пол: ${userData.gender}`;
                else genderDiv.textContent = '';
                if (isLoggedIn)
                    profileSlide.style.display = 'block';
            } else {
                if (profileSlide)
                    profileSlide.style.display = 'none';
            }
        } catch (error) {
            showCustomError("Ошибка загрузки данных профиля.", profileSlide);
            console.error("Error parsing registration data:", error);
            if (profileSlide)
                profileSlide.style.display = 'none';
        }
    }
    function initGallery() {
        galleryContainer = document.querySelector('.gallery-container');
        if (!galleryContainer) return;
        galleryImages = galleryContainer.querySelector('.gallery-images');
        prevButton = document.getElementById('prevButton');
        nextButton = document.getElementById('nextButton');
        if (galleryImages && prevButton && nextButton) {
            images = galleryContainer.querySelectorAll('.gallery-images img');
            if (images) {
                currentIndex = 0;
                updateGallery();
                prevButton.onclick = () => {
                    // Листаем слайды назад
                    currentIndex = Math.max(0, currentIndex - 1);
                    updateGallery();
                };
                nextButton.onclick = () => {
                    // Листаем слайды вперёд
                    currentIndex = Math.min(images.length - 1, currentIndex + 1);
                    updateGallery();
                };
            }
        }
    }
    function updateGallery() {
        if (!galleryContainer) return;
        images = images || galleryContainer.querySelectorAll('.gallery-images img');
        if (!images || images.length === 0) return;
        const offset = -currentIndex * 100;
        galleryImages.style.transform = `translateX(${offset}%)`;
    }
    function handleCheckTest(event) {
        event.preventDefault();
        if (!quizDiv || !resultsDiv) {
            showCustomError("Ошибка: Элементы quiz и results не найдены!", quizDiv);
            return;
        }
        resultsDiv.innerHTML = '';
        const answers = {
            q1: 'солдат-76',
            q2: 'молот, щит, рывок',
            q3: 'C',
            q4: 'A',
            q5: 'D',
            q6: 'A'
        };
        let score = 0;
        let feedback = '';
        for (let i = 1; i <= 6; i++) {
            const question = `q${i}`;
            let userAnswer;
            if (question === 'q1' || question === 'q2') {
                userAnswer = quizDiv.querySelector(`input[name="${question}"]`).value?.toLowerCase();
            } else {
                userAnswer = quizDiv.querySelector(`input[name="${question}"]:checked`)?.value;
            }
            if (userAnswer) {
                if (question === 'q1' || question === 'q2') {
                    if (userAnswer.includes(answers[question].toLowerCase())) {
                        score++;
                        feedback += `<p>Вопрос ${i}: Верно!</p>`;
                    } else {
                        feedback += `<p>Вопрос ${i}: Неверно. Правильный ответ: ${answers[question]}</p>`;
                    }
                } else {
                    if (userAnswer === answers[question]) {
                        score++;
                        feedback += `<p>Вопрос ${i}: Верно!</p>`;
                    } else {
                        feedback += `<p>Вопрос ${i}: Неверно. Правильный ответ: ${answers[question]}</p>`;
                    }
                }
            } else {
                feedback += `<p>Вопрос ${i}: Не был дан ответ</p>`;
            }
        }
        resultsDiv.innerHTML = `<h2>Ваш результат: ${score} из 6</h2>${feedback}`;
        if (checkTestButton) {
            checkTestButton.style.display = 'none';
        }
        if (resetTestButton) {
            resetTestButton.style.display = 'block';
        }
    }
    function handleResetTest(event) {
        event.preventDefault();
        if (!quizDiv || !resultsDiv) {
            showCustomError('Невозможно найти элементы теста.', quizDiv);
            return;
        }
        resultsDiv.innerHTML = '';
        const inputs = quizDiv.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type === 'radio') input.checked = false;
            else if (input.type === 'text') input.value = '';
        });
        if (checkTestButton) {
            checkTestButton.style.display = 'block';
        }
        if (resetTestButton) {
            resetTestButton.style.display = 'none';
        }
    }
    function handleSearch() {
        if (!searchInput) return;
        const searchTerm = searchInput.value.toLowerCase();
        glossaryItems.forEach(item => {
            const term = item.querySelector('.term')?.textContent?.toLowerCase();
            item.style.display = term?.includes(searchTerm) ? 'flex' : 'none';
        });
        searchButton.style.display = 'none';
        endSearchButton.style.display = 'inline-block';
    }
    function handleEndSearch() {
        if (!searchInput) return;
        searchInput.value = '';
        glossaryItems.forEach(item => {
            item.style.display = 'flex';
        });
        searchButton.style.display = 'inline-block';
        endSearchButton.style.display = 'none';
    }
    function handleEditForm(event) {
        event.preventDefault();
        editNameInput = document.getElementById('editName');
        editDateInput = document.getElementById('editDate');
        editGenderMale = document.getElementById('editGenderMale');
        editGenderFemale = document.getElementById('editGenderFemale');
        let gender = 'не указан';
        if (editGenderMale.checked) gender = 'мужской';
        if (editGenderFemale.checked) gender = 'женский';
        const registrationData = { name: editNameInput.value, date: editDateInput.value, gender };
        localStorage.setItem('registrationData', JSON.stringify(registrationData));
        updateProfileDisplay();
        if (editForm) {
            editForm.style.display = 'none';
        }
        if (profileSlide) {
            profileSlide.style.display = 'block';
        }
        showCustomSuccess("Профиль изменён!", editForm);
    }
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetTab = button.dataset.tab;
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });
    function handleAuthSubmit(event) {
        event.preventDefault();
        let isValid = true;
        const loginError = document.getElementById('loginError');
        const birthdateError = document.getElementById('birthdateError');
        isValid = setupValidation(loginInput, birthdateInput, loginError, birthdateError).validateLogin();
        isValid = setupValidation(loginInput, birthdateInput, loginError, birthdateError).validateBirthdate() && isValid;
        let selectedGender;
        if (authGenderMale.checked) {
            selectedGender = authGenderMale.value;
        } else if (authGenderFemale.checked) {
            selectedGender = authGenderFemale.value;
        } else {
            isValid = false;
            showCustomError("Выберите пол.", authForm);
        }
        if (isValid) {
            isLoggedIn = true;
            localStorage.setItem('isLoggedIn', 'true');
            const login = loginInput.value;
            document.title = login;
            document.getElementById('authModal').style.display = 'none';
            document.getElementById('content').style.display = 'block';
            document.querySelector('header').innerHTML += `<button id="logoutButton">Выйти</button>`;
            const logoutButton = document.getElementById('logoutButton');
            if (logoutButton) {
                logoutButton.addEventListener('click', handleLogout);
            }
        }
    }
    function handleLogout() {
        isLoggedIn = false;
        localStorage.removeItem('isLoggedIn');
        document.title = 'Главное';
        document.getElementById('content').style.display = 'none';
        document.getElementById('authModal').style.display = 'block';
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton)
            logoutButton.remove();
    }
    function checkAuthStatus() {
        const authStatus = localStorage.getItem('isLoggedIn');
        if (authStatus === 'true') {
            isLoggedIn = true;
            const login = document.getElementById('loginInput')?.value || 'Главное';
            document.title = login;
            const authModalElement = document.getElementById('authModal')
            if (authModalElement)
                authModalElement.style.display = 'none';
            const contentElement = document.getElementById('content');
            if (contentElement)
                contentElement.style.display = 'block';
            document.querySelector('header').innerHTML += `<button id="logoutButton">Выйти</button>`;
            const logoutButton = document.getElementById('logoutButton');
            if (logoutButton) {
                logoutButton.addEventListener('click', handleLogout);
            }
        } else {
            isLoggedIn = false;
            const contentElement = document.getElementById('content');
            if (contentElement)
                contentElement.style.display = 'none';
            const authModalElement = document.getElementById('authModal');
            if (authModalElement)
                authModalElement.style.display = 'block';
        }
    }
    authForm = document.getElementById('authForm');
    authModal = document.getElementById('authModal');
    loginInput = document.getElementById('loginInput');
    birthdateInput = document.getElementById('birthdateInput');
    authGenderMale = document.getElementById('authGenderMale');
    authGenderFemale = document.getElementById('authGenderFemale');
    loginError = document.getElementById('loginError');
    birthdateError = document.getElementById('birthdateError');
    checkAuthStatus();
    if (authForm) {
        authForm.addEventListener('submit', handleAuthSubmit);
    }
    if (currentPath.includes('index.html')) {
        checkAuth();
        initRegistration();
        updateProfileDisplay();
        editForm = document.getElementById('editForm');
        const editProfileButton = document.getElementById('editProfile');
        if (editProfileButton && isLoggedIn) {
            editProfileButton.addEventListener('click', function () {
                if (profileSlide && editForm) {
                    profileSlide.style.display = 'none';
                    editForm.style.display = 'block';
                }
            });
        }
        if (editForm && isLoggedIn) {
            editForm.addEventListener('submit', handleEditForm);
        }
    }
    if (document.querySelector('.gallery-container'))
        initGallery();
    if (currentPath.includes('test.html')) {
        quizDiv = document.getElementById('quiz');
        resultsDiv = document.getElementById('results');
        checkTestButton = document.getElementById('checkTestButton');
        resetTestButton = document.getElementById('resetTestButton');
        if (checkTestButton) {
            checkTestButton.addEventListener('click', handleCheckTest);
        }
        if (resetTestButton) {
            resetTestButton.addEventListener('click', handleResetTest);
            resetTestButton.style.display = 'none';
        }
    }
    if (currentPath.includes('glossary.html')) {
        searchInput = document.getElementById('search-term');
        searchButton = document.getElementById('search-button');
        endSearchButton = document.getElementById('end-search-button');
        glossaryItems = document.querySelectorAll('#glossary-list li');
        if (searchButton && endSearchButton && searchInput && glossaryItems) {
            searchButton.addEventListener('click', handleSearch);
            endSearchButton.addEventListener('click', handleEndSearch);
        }
    }
});
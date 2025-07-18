// Student Registration Form JavaScript

class StudentRegistrationSystem {
    constructor() {
        this.form = document.getElementById('studentForm');
        this.successMessage = document.getElementById('successMessage');
        this.clearButton = document.getElementById('clearForm');
        this.registerAnotherButton = document.getElementById('registerAnother');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setDefaultDate();
    }

    bindEvents() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.clearButton.addEventListener('click', this.clearForm.bind(this));
        this.registerAnotherButton.addEventListener('click', this.showForm.bind(this));
        
        // Add real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', this.validateField.bind(this));
            input.addEventListener('input', this.clearFieldError.bind(this));
        });

        // Auto-generate student ID
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const studentIdInput = document.getElementById('studentId');
        
        [firstNameInput, lastNameInput].forEach(input => {
            input.addEventListener('input', () => {
                this.generateStudentId(firstNameInput.value, lastNameInput.value, studentIdInput);
            });
        });
    }

    setDefaultDate() {
        const enrollmentDateInput = document.getElementById('enrollmentDate');
        const today = new Date().toISOString().split('T')[0];
        enrollmentDateInput.value = today;
    }

    generateStudentId(firstName, lastName, studentIdInput) {
        if (firstName && lastName) {
            const year = new Date().getFullYear();
            const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
            const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const studentId = `STU${year}${initials}${randomNum}`;
            studentIdInput.value = studentId;
        }
    }

    validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        this.clearFieldError(event);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Date validation
        if (field.type === 'date' && value) {
            const selectedDate = new Date(value);
            const today = new Date();
            
            if (field.id === 'dateOfBirth') {
                if (selectedDate >= today) {
                    isValid = false;
                    errorMessage = 'Date of birth must be in the past';
                }
            }
        }

        // Classes validation
        if (field.name === 'classes') {
            const checkedClasses = this.form.querySelectorAll('input[name="classes"]:checked');
            if (checkedClasses.length === 0) {
                isValid = false;
                errorMessage = 'Please select at least one class';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.style.borderColor = '#dc3545';
        field.style.backgroundColor = '#fff5f5';
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(event) {
        const field = event.target;
        field.style.borderColor = '#e1e5e9';
        field.style.backgroundColor = 'white';
        
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    validateForm() {
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const fieldValid = this.validateField({ target: field });
            if (!fieldValid) {
                isValid = false;
            }
        });

        // Validate classes selection
        const checkedClasses = this.form.querySelectorAll('input[name="classes"]:checked');
        if (checkedClasses.length === 0) {
            isValid = false;
            const classesContainer = this.form.querySelector('.checkbox-group');
            this.showFieldError(classesContainer, 'Please select at least one class');
        }

        return isValid;
    }

    handleSubmit(event) {
        event.preventDefault();
        
        if (!this.validateForm()) {
            this.showNotification('Please correct the errors before submitting', 'error');
            return;
        }

        // Collect form data
        const formData = new FormData(this.form);
        const studentData = {};
        
        // Process regular fields
        for (let [key, value] of formData.entries()) {
            if (key !== 'classes') {
                studentData[key] = value;
            }
        }
        
        // Process classes (checkboxes)
        const selectedClasses = [];
        const classCheckboxes = this.form.querySelectorAll('input[name="classes"]:checked');
        classCheckboxes.forEach(checkbox => {
            selectedClasses.push(checkbox.value);
        });
        studentData.classes = selectedClasses;

        // Simulate form submission
        this.submitStudent(studentData);
    }

    async submitStudent(studentData) {
        try {
            // Show loading state
            const submitButton = this.form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Registering...';
            submitButton.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Store student data (in real app, this would be sent to server)
            this.saveStudentData(studentData);

            // Show success message
            this.showSuccessMessage(studentData);

            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;

        } catch (error) {
            console.error('Error submitting student data:', error);
            this.showNotification('An error occurred while registering the student. Please try again.', 'error');
        }
    }

    saveStudentData(studentData) {
        // In a real application, this would send data to a server
        // For demo purposes, we'll store in localStorage
        let students = JSON.parse(localStorage.getItem('students') || '[]');
        
        studentData.id = Date.now().toString();
        studentData.registrationDate = new Date().toISOString();
        
        students.push(studentData);
        localStorage.setItem('students', JSON.stringify(students));
        
        console.log('Student registered:', studentData);
    }

    showSuccessMessage(studentData) {
        this.form.parentElement.style.display = 'none';
        this.successMessage.classList.remove('hidden');
        
        // Update success message with student name
        const studentName = `${studentData.firstName} ${studentData.lastName}`;
        const successText = this.successMessage.querySelector('p');
        successText.textContent = `${studentName} has been successfully registered with ID: ${studentData.studentId}`;
    }

    showForm() {
        this.form.parentElement.style.display = 'block';
        this.successMessage.classList.add('hidden');
        this.clearForm();
    }

    clearForm() {
        this.form.reset();
        this.setDefaultDate();
        
        // Clear all error messages
        const errorMessages = this.form.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        // Reset field styles
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.style.borderColor = '#e1e5e9';
            field.style.backgroundColor = 'white';
        });

        // Clear student ID
        document.getElementById('studentId').value = '';
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;
        
        if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
        } else if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StudentRegistrationSystem();
});
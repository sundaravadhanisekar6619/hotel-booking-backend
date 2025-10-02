$(document).ready(function(){

			// Phone masking
			$('#phone').mask('(999) 999-9999', {placeholder:'x'});

			// Validation
		// 	$( "#j-pro" ).justFormsPro({
		// 		rules: {
		// 			name: {
		// 				required: true
		// 			},
		// 			password: {
		// 				required: true
		// 			},
		// 			confirmPassword: {
		// 				required: true,
		// 			},
		// 			type: {
		// 				required: true
		// 			},
		// 			organization: {
		// 				required: true
		// 			},
		// 			email: {
		// 				required: true,
		// 				email: true
		// 			},
					
		// 		},
		// 		messages: {
		// 			name: {
		// 				required: "Add your User name"
		// 			},
		// 			password: {
		// 				required: "Add your Password"
		// 			},
		// 			confirmPassword: {
		// 				required: "Add your Confirm Password"
		// 			},
		// 			type: {
		// 				required: "Select your user type"
		// 			},
		// 			organization: {
		// 				required: "Select your organization"
		// 			},
		// 			email: {
		// 				required: "Add your email",
		// 				email: "Incorrect email format"
		// 			},
		// 		},
		// 		debug: true,
		// 		afterInit: function (jfp) {
		// 			// Define a custom validation function
		// 			jfp.validatePasswordMatch = function () {
		// 			  const password = jfp.$fields.password.val();
		// 			  const confirmPassword = jfp.$fields.confirmPassword.val();
				
		// 			  if (password !== confirmPassword) {
		// 				jfp.addError(jfp.$fields.confirmPassword, "Passwords do not match.");
		// 				return false;
		// 			  }
				
		// 			  return true;
		// 			};
				
		// 			// Add the custom validation to the submit event
		// 			jfp.$form.on("submit", function (event) {
		// 			  if (!jfp.validatePasswordMatch()) {
		// 				event.preventDefault();
		// 			  }
		// 			});
		// 		},
		// 	});
		// });

		
		document.addEventListener('DOMContentLoaded', function () {
			const passwordInput = document.getElementById('password');
			const confirmPasswordInput = document.getElementById('confirmPassword');
			const submitButton = document.getElementById('submitButton');
			const passwordError = document.getElementById('passwordError');
			const confirmPasswordError = document.getElementById('confirmPasswordError');
			
			submitButton.addEventListener('click', function () {
			  const password = passwordInput.value;
			  const confirmPassword = confirmPasswordInput.value;
			  
			  passwordError.textContent = ''; // Clear previous error message
			  confirmPasswordError.textContent = ''; // Clear previous error message
			  
			  if (password.trim() === '') {
				passwordError.textContent = 'Password is required.';
			  }
			  
			  if (confirmPassword.trim() === '') {
				confirmPasswordError.textContent = 'Confirm Password is required.';
			  }
			  
			  if (password !== confirmPassword) {
				confirmPasswordError.textContent = 'Passwords do not match.';
				return;
			  }
			  
			  // If validation passes, submit the form
			  document.getElementById('myForm').submit();
			});
		  });

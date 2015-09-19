$(function() {
	/* получаем значение полей первой формы */ 
	var allInformation = store.get('allInformation'); 

	/* курсы валют */
	var currencyValues = { eur: 0.88, rub: 21.80};

	/* если объект со значениями пустой - показываем первый шаг */ 
	if ($.isEmptyObject(allInformation)) {
		allInformation = {};
		$('.customer-information').show();
		location.hash = "step1";
	} else {
	/* если объект со значениями существует - смотрим на флаг второго шага и показываем соответствующий шаг
	также заполняем поля, сохраненные в хранилище
	 */ 
		$('#name').val(allInformation.name);
		$('#email').val(allInformation.email);
		$('#country').val(allInformation.country);
		$('#company-name').val(allInformation.companyName);
		$('#company-description').val(allInformation.companyDescription);
		if (allInformation.secondStep) {
			$('.proposition-information').show();
			location.hash = "step2";
		} else {
			$('.customer-information').show();
			location.hash = "step1";
		}
	}


	/* сохраняем значение полей в хранилище */ 
	$('.firstStepForm input, textarea').on('change', function() {
		allInformation.name = $('#name').val();
		allInformation.email = $('#email').val();
		allInformation.country = $('#country').val();
		allInformation.companyName = $('#company-name').val();
		allInformation.companyDescription = $('#company-description').val();
		store.set('allInformation', allInformation);
	});

	/* валидирования полей, если все ок - на второй шаг */ 
	$('.firstStepForm').validator().on('submit', function (e) {
	  	if (e.isDefaultPrevented()) {
	   		return false;
	  	} else {
	    	$('.proposition-information').show();
	    	$('.customer-information').hide();
	    	allInformation = store.get('allInformation');
	    	allInformation.secondStep = true;
	    	store.set('allInformation', allInformation);
	    	location.hash = "step2";
	  	}
	  	e.preventDefault();
	});

	


	/* выбор валюты, изменение значений  */ 
	$('.select-currency').on('change', function() {
		var currency = $(this).parents('.proposition').find('option:selected').text();
		var defaultPrice = parseInt($(this).parents('.proposition').find('.default-price').val());
		var finalPrice = defaultPrice;
		var finalCurrency = '$';
		if (currency === 'UAH') {
			finalPrice = defaultPrice * currencyValues.rub;
			finalCurrency = '₴';
		} else if (currency === 'EUR') {
			finalPrice = defaultPrice * currencyValues.eur;
			finalCurrency = "€";
		}
		$(this).parents('.proposition').find('.price').text(finalPrice);
		$(this).parents('.proposition').find('.currency').text(finalCurrency);

		$(this).parents('.proposition').find('.form-price').val(finalPrice);
		$(this).parents('.proposition').find('.form-currency').val(currency);
	});


	/* выбор предложения и отправка на создания ордера  */
	$('.select-proposition').on('click', function() {
		allInformation = store.get('allInformation');
		allInformation.price = $(this).parents('.proposition').find('.form-price').val();
		allInformation.currency = $(this).parents('.proposition').find('.form-currency').val();
		allInformation.proposition = $(this).parents('.proposition').find('.form-proposition-number').val();
		store.set('allInformation', allInformation);
		var sentInformation = JSON.stringify(allInformation);
		console.log(sentInformation);

		/* отправка данных  */
		$.ajax({
			type: 'post',
	        url: "order/create",
	        data:{	name: sentInformation.name, email: sentInformation.email, country: sentInformation.country,
	        		companyName: sentInformation.companyName, companyDescription: sentInformation.companyDescription, 
	        		propositionType: sentInformation.proposition, propositionPrice: sentInformation.price, 
	        		propositionCurrency: sentInformation.currency  	
	        	 },
	        success: function(data) {

	        },
	        error: function() {
	            console.log("ajax time error");
	        }
	    });
	    
	});

	/* Обработка кнопки возврата к 1му шагу */
	$('.back-to-first-step').on('click', function() {
		allInformation = store.get('allInformation');
		allInformation.secondStep = false;
		store.set('allInformation', allInformation);
		$('.proposition-information').hide();
	   	$('.customer-information').show();
	   	setTimeout(function(){
	   		location.hash = "step1";
	   	}, 0);
	   	
	});
});
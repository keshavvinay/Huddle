var now_reload = new Date();
var night_reload = new Date(
	now_reload.getFullYear(),
	now_reload.getMonth(),
	now_reload.getDate() + 1,
	0, 0, 0
);
setTimeout(function () {
	location.reload();
}, night_reload.getTime() - now_reload.getTime())
$(document).ready(function () {
	var today = new Date();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	console.log('page refreshed at ' + today + time)
var totalTime=50
setTimeout(countdown,1000)
function countdown(){
totalTime--
if(totalTime>0){
setTimeout(countdown,1000)
$('.timer').text(Math.trunc(100/totalTime)+'%')
}

}
	setTimeout(function () {
		$('.timer').text('100%')
		$('.loading').css('display','none')
		$('.timer').css('display','none')
		$('.flexslider').flexslider({

			animation: "slide",
      			slideshowSpeed: 10000,
			randomize: true
		});
	}, 60000);
	var conversationApis = ['cafK5UruYrUJHsvZXJULNR27mmAni2BuCpPx6YEJOcmD8', 'caOdLoPFn67mTfy73mMnJ0N5wJi5PnDv8sUwhtVPr8CsI']
	conversationApis.forEach(function (pelement) {

		var url = 'https://api.bazaarvoice.com/data/products.json?apiversion=5.4&passkey=' + pelement + '&Locale=&filter=IsActive:true&Limit=100'
		var lastIndex
		var productId = []
		var productId100 = []
		var count = 1
		var countForReview = 1
		var totalProductsNumber;
		$.get(url, function (data, status) {
			totalProductsNumber = data['TotalResults']
			var productResults = data.Results
			if (totalProductsNumber > 100) {
				productResults.forEach(function (element) {
					productId.push({
						"ProductName": element.Name,
						"ProductId": element.Id,
						"ProductUrl": element.ImageUrl
					})
				});
				lastIndex = Math.floor(totalProductsNumber / 100)
				while (totalProductsNumber > 100) {
					var urlForRemain = url
					totalProductsNumber = totalProductsNumber - 100
					urlForRemain = url + '&Offset=' + 100 * count
					$.get(urlForRemain, function (data, status) {
						productResults = data.Results
						productResults.forEach(function (element) {
							productId100.push({
								"ProductName": element.Name,
								"ProductId": element.Id,
								"ProductUrl": element.ImageUrl
							})

						})
						Array.prototype.push.apply(productId, productId100)
						if (lastIndex == countForReview) {
							getReviews(productId, pelement)
						}
						productId100 = []
						countForReview++
					})

					count++;
				}
			} else if (totalProductsNumber < 100) {
				productResults.forEach(function (element) {

					productId.push({
						"ProductName": element.Name,
						"ProductId": element.Id,
						"ProductUrl": element.ImageUrl
					})
				});

				getReviews(productId, pelement)

			}

		})

	})


	var jsonobject_productData = {
		"ProductData": []
	}

	function getReviews(productIds, conversationApi) {
		var count1 = 0
		var secondsSinceEpoch
		var secondsSinceEpoch_30
		var now = new Date()
		var now_30 = new Date()
		now.setHours(5, 1, 0, 0, 0)
		now_30.setHours(5, 1, 0, 0, 0)
		now_30.setDate(now.getDate() - 31)
		if (now.getTimezoneOffset() < 0) {
			secondsSinceEpoch = Math.round(now.getTime() / 1000) + Math.abs(now.getTimezoneOffset()) * 60
			secondsSinceEpoch_30 = Math.round(now_30.getTime() / 1000) + Math.abs(now_30.getTimezoneOffset()) * 60
		} else if (now.getTimezoneOffset() > 0) {
			secondsSinceEpoch = Math.round(now.getTime() / 1000) - Math.abs(now.getTimezoneOffset()) * 60
			secondsSinceEpoch_30 = Math.round(now_30.getTime() / 1000) - Math.abs(now_30.getTimezoneOffset()) * 60
		} else {
			secondsSinceEpoch = Math.round(now.getTime() / 1000)
			secondsSinceEpoch_30 = Math.round(now_30.getTime() / 1000)
		}
		var urlForReviews = 'https://api.bazaarvoice.com/data/reviews.json?apiversion=5.4&passkey=' + conversationApi + '&Stats=Reviews&Limit=100&filter=SubmissionTime:gt:' + secondsSinceEpoch_30 + '&filter=SubmissionTime:lt:' + secondsSinceEpoch + '&filter=ProductId:'
		var jsonobject_productReviews = {
			"Reviews": []
		}
		var jsonobject_product = {
			"Product": []
		}
		var productReviews = [];
		var productUrl = [];
		var totalResults;
		var totalCount = 0;
		var totalCountelif = 0;
		productIds.forEach(function (element) {
			jQuery.ajaxSetup({
				async: false
			});
			$.get(urlForReviews + element.ProductId, function (data, status) {
				if (data.TotalResults > 0 && data.TotalResults < 100) {

					for (var i = 0; i < data.TotalResults; i++) {
						if ((data.Results[i].Title && data.Results[i].ReviewText && data.Results[i].Rating) != null) {
							if (totalCount % 2 == 0)
								jsonobject_productReviews.Reviews.push({
									'ProductName': element.ProductName,
									'ImageUrl': element.ProductUrl,
									'ReviewTitle': data.Results[i].Title,
									'ReviewText': data.Results[i].ReviewText,
									'Rating': data.Results[i].Rating,
									'UserNickname': data.Results[i].UserNickname,
									'UserLocation': data.Results[i].UserLocation

								})
							else
								jsonobject_productReviews.Reviews.unshift({
									'ProductName': element.ProductName,
									'ImageUrl': element.ProductUrl,
									'ReviewTitle': data.Results[i].Title,
									'ReviewText': data.Results[i].ReviewText,
									'Rating': data.Results[i].Rating,
									'UserNickname': data.Results[i].UserNickname,
									'UserLocation': data.Results[i].UserLocation
								})
							productDisplay(jsonobject_productReviews)
							totalCount++

						}
					}


				} else if (data.TotalResults > 0 && data.TotalResults > 100) {
					var countReviewsOffset = 1;
					for (var i = 0; i < 100; i++) {
						if ((element.ProductName && data.Results[i].Title && data.Results[i].ReviewText && data.Results[i].Rating) != null) {
							if (totalCountelif % 2 == 0)
								jsonobject_productReviews.Reviews.push({
									'ProductName': element.ProductName,
									'ImageUrl': element.ProductUrl,
									'ReviewTitle': data.Results[i].Title,
									'ReviewText': data.Results[i].ReviewText,
									'Rating': data.Results[i].Rating,
									'UserNickname': data.Results[i].UserNickname,
									'UserLocation': data.Results[i].UserLocation

								})
							else
								jsonobject_productReviews.Reviews.unshift({
									'ProductName': element.ProductName,
									'ImageUrl': element.ProductUrl,
									'ReviewTitle': data.Results[i].Title,
									'ReviewText': data.Results[i].ReviewText,
									'Rating': data.Results[i].Rating,
									'UserNickname': data.Results[i].UserNickname,
									'UserLocation': data.Results[i].UserLocation
								})
							productDisplay(jsonobject_productReviews)
							totalCountelif++

						}
					}
					var resultsGt100 = data.TotalResults

					while (resultsGt100 > 100) {
						var totalCountelifwhile = 0;
						resultsGt100 = resultsGt100 - 100
						$.get(urlForReviews + element.ProductId + '&Offset=' + 100 * countReviewsOffset, function (data_100, status) {
							for (var i = 0; i < data_100.Results.length; i++) {
								if ((element.ProductName && data_100.Results[i].Title && data_100.Results[i].ReviewText && data_100.Results[i].Rating) != null) {

									if (totalCountelifwhile % 2 == 0)
										jsonobject_productReviews.Reviews.push({
											'ProductName': element.ProductName,
											'ImageUrl': element.ProductUrl,
											'ReviewTitle': data_100.Results[i].Title,
											'ReviewText': data_100.Results[i].ReviewText,
											'Rating': data_100.Results[i].Rating,
											'UserNickname': data_100.Results[i].UserNickname,
											'UserLocation': data_100.Results[i].UserLocation

										})
									else
										jsonobject_productReviews.Reviews.unshift({
											'ProductName': element.ProductName,
											'ImageUrl': element.ProductUrl,
											'ReviewTitle': data_100.Results[i].Title,
											'ReviewText': data_100.Results[i].ReviewText,
											'Rating': data_100.Results[i].Rating,
											'UserNickname': data_100.Results[i].UserNickname,
											'UserLocation': data_100.Results[i].UserLocation
										})
									productDisplay(jsonobject_productReviews)

									totalCountelifwhile++

								}


							}


						})
						countReviewsOffset++;
					}
				}

			})
		})

	}

	var finalProduct = []
	var count1 = 0

	function productDisplay(jsonobject_productReviews) {
		var backImg = '<div  class="background-image">'
		if (jsonobject_productReviews.Reviews[jsonobject_productReviews.Reviews.length - 1].UserLocation != null) {
			var imgUrl = '<div class="container"><div class="logos"><div class="logo-image"><img src="HBL_RatingsAndReviews_HuddleArea_R6-04.png"></div><div class="live-feed"><img src="HBL_RatingsAndReviews_HuddleArea_R6-05.png"></div></div><div class="rating"><img src="./Ratings/' + jsonobject_productReviews.Reviews[jsonobject_productReviews.Reviews.length - 1].Rating + '.png"></div><div class="product-info"><div class="product-image"><img src=' + jsonobject_productReviews.Reviews[jsonobject_productReviews.Reviews.length - 1].ImageUrl + ' alt="no image found"></div><div class="review-info"><h2 class="review-title">' + '&ldquo;' + jsonobject_productReviews.Reviews[jsonobject_productReviews.Reviews.length - 1].ReviewTitle + '&rdquo;' + '</h2><p class="review-text">' + '&ldquo;' + jsonobject_productReviews.Reviews[jsonobject_productReviews.Reviews.length - 1].ReviewText + '&rdquo;' + '</p><p class="reviewer">' + '-' + jsonobject_productReviews.Reviews[jsonobject_productReviews.Reviews.length - 1].UserNickname + ', ' + jsonobject_productReviews.Reviews[jsonobject_productReviews.Reviews.length - 1].UserLocation + '</p></div></div></div></div></div>';
		} else if (jsonobject_productReviews.Reviews[jsonobject_productReviews.Reviews.length - 1].UserLocation == null) {
			var imgUrl = '<div class="container"><div class="logos"><div class="logo-image"><img src="HBL_RatingsAndReviews_HuddleArea_R6-04.png"></div><div class="live-feed"><img src="HBL_RatingsAndReviews_HuddleArea_R6-05.png"></div></div><div class="rating"><img src="./Ratings/' + jsonobject_productReviews.Reviews[jsonobject_productReviews.Reviews.length - 1].Rating + '.png"></div><div class="product-info"><div class="product-image"><img src=' + jsonobject_productReviews.Reviews[jsonobject_productReviews.Reviews.length - 1].ImageUrl + ' alt="no image found"></div><div class="review-info"><h2 class="review-title">' + '&ldquo;' + jsonobject_productReviews.Reviews[jsonobject_productReviews.Reviews.length - 1].ReviewTitle + '&rdquo;' + '</h2><p class="review-text">' + '&ldquo;' + jsonobject_productReviews.Reviews[jsonobject_productReviews.Reviews.length - 1].ReviewText + '&rdquo;' + '</p><p class="reviewer">' + '-' + jsonobject_productReviews.Reviews[jsonobject_productReviews.Reviews.length - 1].UserNickname + '</p></div></div></div></div></div>';
		}
		if (count1 % 2 == 0)
			$('.slides').append('<li>' + backImg + imgUrl + '</li>')
		else
			$('.slides').prepend('<li>' + backImg + imgUrl + '</li>')

		count1++
	}


})

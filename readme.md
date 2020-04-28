# Pizza delivery API Example using Node.js
	# Payment is done via Stripe sandbox account and mail is sent via mailgun sandbox
	User can fill his/her cart with hard-coded menu option, and can then checkout and after successful payment will 	receive invoice via mail

# user flow to interact with backend using POSTMAN

# step 1:- start the server using command 'node index.js'

# step 2:- create user
	/POST request to 'http://localhost:3000/users
	Body: {
		"name": "user name",
		"password": "password",
		"emailId": "user emailId",
		"street_Address": "street A"
	}
	

# step 3:- create token (expiry is 1 hour from the creation time)
	/POST request to http://localhost:3000/tokens
	Body: {
		"emailId": "user emailID used to create user in step 2",
		"password": "password"
	}

# step 4:- get specific user
	/GET request to http://localhost:3000/users?emailId=userEmailID (userEmailId used while creating user)
	Hederers - 'token': 'valid tokenId'            (tokenId created in step 3)

# step 5:- update user details
	/PUT request to http://localhost:3000/users?emailId=userEmailId
	Body can contain all the fields used while creating the user
	Hederers - 'token': 'valid tokenId'            (tokenId created in step 3)

# step 6:- get the list of menu
	/GET request to http://localhost:3000/menu?emailId=userEmailId
	Hederers - 'token': 'valid tokenId'            (tokenId created in step 3)
	
# step 7:- add menu to cart - one item can be added at a time, cartItem in body is a string value received in step 5 (only menu options can be added  rest will be ignored)
	/PUT request to http://localhost:3000/users?emailId=userEmailId
	Body: {
		"emailId": "user email Id used in step 2",
		"cartItem": "veg loaded"
	}
	Hederers - 'token': 'valid tokenId'            (tokenId created in step 3)

# step 8:- checkout or making payment
	/GET request to http://localhost:3000/checkout?emailId=userEmailId
	Hederers - 'token': 'valid tokenId'            (tokenId created in step 3)

step 2 till step 8 is the ueser journey from creating order to checkout


# get a token
	/GET request to http://localhost:3000/tokens?id=tokenID  (tokenId as created in step 3)

# destroy a token
	/DELETE request to http://localhost:3000/tokens?id=tokenID   (tokenId as created in step 3)

# extend the expiry time of a token
	/PUT request to http://localhost:3000/tokens
	Body: {
		"id": "tokenId as created in step 3",
		"extend": true
	}


# NOTE:- mail from mailgun sandbox is sent only to restricted recepient (please create a testing aacount in mailgun, and add email aadress for testing, for details refer their sandbox documentation.)

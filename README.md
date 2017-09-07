# TheHustler
The Hustler App


Pull the Repo to your local device.
$ cd Hustler
$ npm install
$ node server.js
This will start the server on your local device.

Email is the unique identifier.

End-point: - 
1.  localhost:8080/api/signup
    type:- POST
    desc:- This is used for SignUp.
    ex:- BODY { x-www-form-urlencoded;
                 name: AJAY,
                 password: ajay,
                 date_of_birth: 08/06/1992,
                 email:example@gmail.com,
                 status: "Hello!!!! "}
 2. localhost:8080/api/authenticate
    type:- POST
    desc:- This is used to loggin & generate token.
    ex:- BODY { x-www-form-urlencoded;
                 email: example@gmail.com,
                 password: ajay "}
3.  localhost:8080/api/memberinfo
    type: GET
    desc:- This is used to verify the token.
     ex:- HEADERS { x-www-form-urlencoded;
                 Authorization: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX "}
4.  localhost:8080/api/deleteUser
    type: DELETE
    desc:- Used to delete the user with email and password.
    ex:- BODY { x-www-form-urlencoded;
                 email: example@gmail.com,
                 password: ajay "}
5.  localhost:8080/api/updateUser
    type: PUT
    desc:- Used to update a user. (Email and password are constant).
    ex:- BODY { x-www-form-urlencoded;
                 name: AJAY_new,
                 password: ajay,
                 date_of_birth: 07/09/2017,
                 email:example@gmail.com,
                 status: "NEW_Hello!!!! "}
          {All the fields except email and password will be updated}.
 6. localhost:8080/api/viewUserDetails
    type: POST
    desc:- Get user information.
    ex:- BODY { x-www-form-urlencoded;
                 email: example@gmail.com,
                 password: ajay "}

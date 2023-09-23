const swagger = `
openapi: 3.0.0
info:
  title: Free Lunch API
  description: Documentation for Free Lunch API
  version: 1.0.0

paths:
  /api/auth/user/signup:
    post:
      summary: Creates a user.
      
      description: Endpoint for user signup. 
      requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  email:
                    type: string
                    example: aduak@yahoo.com
                  password:
                    type: string
                    example: aduak124
                  first_name:
                    type: string
                    example: aduak
                  last_name:
                    type: string
                    example: aduakwuna
                  phone_number:
                    type: string
                    example: 0916255625265
      responses:
        '201':    # status code
          description: successful
        '400':
          description: Bad request (e.g., validation error)
        '500':
          description: Internal server error
        
           
       


 
           
  /api/auth/login:
    post:
      summary: Logs in a user.
      
      description: Endpoint for user login. 
      requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  email:
                    type: string
                    example: aduak@yahoo.com
                  password:
                    type: string
                    example: aduak124
      responses:
        '201':    # status code
          description: successful
        '400':
          description: Bad request (e.g., validation error)
        '500':
          description: Internal server error
        
  /api/user/profile:
    get:
      summary: Fetches a user profile.
      parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
      description: Endpoint to fetch a user profile. 
      requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  user_id:
                    type: string
                    example: user_id
      responses:
        '200':    # status code
          description: successful
        '400':
          description: Bad request (e.g., validation error)
        '500':
          description: Internal server error
        
  /api/user/bank:
    patch:
      summary: adds a user's bank to profile.
      parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
      description: Endpoint to add a user's bank to profile. 
      requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  
                  bank_name:
                    type: string
                    example: bank
                  bank_number:
                    type: string
                    example: 10023456789
                  bank_code:
                    type: string
                    example: 123456
                  bank_region:
                    type: string
                    example: Nigeria
                  
      responses:
        '200':    # status code
          description: successful
        '400':
          description: Bad request (e.g., validation error)
        '401':
          description: Unauthorised (e.g., Bad Token)
        '500':
          description: Internal server error
  /api/user/all:
    get:
      summary: Fetches all users.
      parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
      description: Endpoint for user signup. 
      requestBody:
          required: false
      responses:
        '200':    # status code
          description: successful
        '400':
          description: Bad request (e.g., validation error)
        '500':
          description: Internal server error
        
  /api/user/search/<nameoremail>:
    get:
      summary: Search a user by name or email.
      parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
      description: Endpoint for user signup. 
      requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  email:
                    type: string
                    example: aduak@yahoo.com
      responses:
        '200':    # status code
          description: User fetched
        '400':
          description: Bad request (e.g., validation error)
        '500':
          description: Internal server error
        
  /api/user/redeem:
    post:
      summary: Redeems a user lunch.
      parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
      description: Allows a user to add launch credit to launch credit balance. A token must be redeemed before it can be withdrawn 
      requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  user_id:
                    type: string
                    example: user_id
      responses:
        '200':    # status code
          description: success
        '400':
          description: Bad request (e.g., validation error)
        '500':
          description: Internal server error
        
  /api/lunch/send:
    post:
      description: Create a new lunch request.
      parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
          schema:
            type: string
            format: token
      
      requestBody:
          required: true
          content:
           application/json:
            schema:
             type: object
             properties:
              receivers:
                type: string
                example: user_id
              quantities:
                type: number
                example: 5
              note:
                type: string
                example: Special instructions for the lunch
      responses:
        '201':
         description: Lunch request created successfuly.
        
        
  /api/lunch/all:
    get:
      description: Get all Lunches.
      parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
          schema:
            type: string
            format: token
      
      
      responses:
        '201':
         description: Lunch data fetched successfuly
        
  /api/lunch/:id:
    get:
     description: Gets a specific lunch.
     parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
          schema:
            type: string
            format: token
     
     responses:
      '201':
       description: Lunch request created successfuly
      
  
    
      
  /api/organization/create:
    put:
      description: Allows an admin user to create and update the organization name and lunch price 
      parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
          schema:
            type: string
            format: token
      
      requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  organization_name:
                    type: string
                    example: myorg
                  lunch_price:
                    type: string
                    example: 500
      responses:
        '200':    #status code
          description: Success
        '400':
          description: bad request
        '401':
          description: Unauthorised (e.g., Bad Token)
        '500':
          description: Internal server error
        Authorization:  
          description:   Bearer access_token
        
  /api/organization/invite:
    post:
      description: Allows an admin user to send an invitation to join the organization.
      parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
          schema:
            type: string
            format: token
      
      requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  email:
                    type: string
                    example: myuniquemail@gmail.com
      
      responses:
        '200':    #status code
          description: Success
        '400':
          description: bad request
        '401':
          description: Unauthorised (e.g., Bad Token)
        '500':
          description: Internal server error
        
  /api/organization/staff/signup:
    post:
      description: An  OTP code would be sent to user email, the token sent would be used within the otp_token field
      requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  email:
                    type: string
                    example: myuniquemail@gmail.com
                    
                  password:
                    type: string
                    example: password123

                  otp_token:
                    type: string 
                    example: 123455
                  first_name:
                    type: string
                    example: myFirstName
                  last_name:
                    type: string
                    example: myLastName
                  phone_number:
                    type: string
                    example: 11222233344
      responses:
        '200':    #status code
          description: Success
        '400':
          description: bad request (e.g., Wrong OTP)
        '500':
          description: Internal server error
        
  /api/organization/wallet/update:
    patch:
      description: Allows an admin user to update wallet balance.
      parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
          schema:
            type: string
            format: token
      
      requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  amount:
                    type: string
                    example: 100
      responses:
        '200':    #status code
          description: Success
        '400':
          description: bad request
        '401':
          description: Unauthorised (e.g., Bad Token)
        '500':
          description: Internal server error
        Authorization:  
          description:   Bearer access_token
        
  /api/organization/launch/update:
    patch:
      description: Allows an admin user to update launch balance.
      parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
          schema:
            type: string
            format: token
      
      requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  launch_price:
                    type: string
                    example: 500
      responses:
        '200':    #status code
          description: Success
        '400':
          description: bad request
        '401':
          description: Unauthorised (e.g., Bad Token)
        '500':
          description: Internal server error
        Authorization:  
          description:   Bearer access_token
        
  /api/withdrawal/request:
    post:
      description: Allows an admin user to update launch balance.
      parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
          schema:
            type: string
            format: token
      
      requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  bank_name:
                    type: string
                    example: bank
                  bank_number:
                    type: string
                    example: 10023456789
                  bank_code:
                    type: string
                    example: 123456
                  amount:
                    type: string
                    example: 2000
      responses:
        '201':
          description: Withdrawal request created successfuly.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Withdrawal request created successfuly
                  statusCode:
                    type: integer
                    example: 201
                  data:
                    type: object
                    properties:
                      id:
                        type: string
                        example: unique-withdrawal-id
                      user_id:
                        type: string
                        example: user-id
                      status:
                        type: string
                        example: success
                      amount:
                        type: number
                        example: 100
                      created_at:
                        type: string
                        format: date-time
                        example: '2023-09-19T12:00:00Z'
        '400':
          description: Bad request. Invalid input.
        '401':
          description: Unauthorised (e.g., Bad Token)
        
                    
    
`;
module.exports = swagger;

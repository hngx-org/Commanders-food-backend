const swagger = `
openapi: 3.0.0
info:
  title: My Node.js API
  description: Documentation for My Node.js API
  version: 1.0.0

  components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

paths:
 
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
      security:
      - bearerAuth: []
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
         description: Lunch request created successfully.
        
        
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
      security:
      - bearerAuth: []
      
      responses:
        '201':
         description: Lunch data fetched successfully
        
  /api/lunch/:user_id:
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
     security:
      - bearerAuth: []
     responses:
      '201':
       description: Lunch request created successfully
      
  
    
      
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
      security:
      - bearerAuth: []
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
      security:
      - bearerAuth: []
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
      security:
      - bearerAuth: []
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
      security:
      - bearerAuth: []
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
      summary: Logs in a user.
      description: Allows an admin user to update launch balance.
      parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
      description: Endpoint for user login. 
      responses:
        '201':    # status code
          description: successfull
        '400':
          description: Bad request (e.g., validation error)
        '500':
          description: Internal server error
        requestBody:
          schema:
            type: string
            format: token
      security:
      - bearerAuth: []
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
  /api/user/profile:
    get:
      summary: Fetches a user profile.
      parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
      description: Endpoint to fetch a user profile. 
      responses:
        '200':    # status code
          description: successfull
        '400':
          description: Bad request (e.g., validation error)
        '500':
          description: Internal server error
        requestBody:
          required: true
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
          description: Withdrawal request created successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  user_id:
                    type: string
                    example: user_id
  
  /api/user/all:
    get:
      summary: Fetches all users.
      parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
      description: Endpoint for user signup. 
      responses:
        '200':    # status code
          description: successfull
        '400':
          description: Bad request (e.g., validation error)
        '500':
          description: Internal server error
        requestBody:
          required: false
  /api/user/search/<nameoremail>:
    get:
      summary: Search a user by name or email.
      parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
      description: Endpoint for user signup. 
      responses:
        '200':    # status code
          description: User fetched
        '400':
          description: Bad request (e.g., validation error)
        '500':
          description: Internal server error
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
  /api/user/redeem:
    post:
      summary: Redeems a user lunch.
      parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
      description: Allows a user to add launch credit to launch credit balance. A token must be redeemed before it can be withdrawn 
      responses:
        '200':    # status code
          description: success
        '400':
          description: Bad request (e.g., validation error)
        '500':
          description: Internal server error
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
                

                  message:
                    type: string
                    example: Withdrawal request created successfully
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

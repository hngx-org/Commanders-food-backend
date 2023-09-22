const swagger = `
openapi: 3.0.0
info:
  title: My Node.js API
  description: Documentation for My Node.js API
  version: 1.0.0

paths:
  /api/auth/user/signup:
    post:
      description: Endpoint for user registration.
      responses:
        '200':    # status code
          description: successfully
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
                  password:
                    type: string
                  first_name:
                    type: string
                  last_name:
                    type: string
                  phone_number:
                    type: string
  /api/auth/login:
    post:
      description: Endpoint for user login.
      responses:
        '201':    # status code
          description: successfully logged in
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
                  password:
                    type: string
  /api/user/profile:
    get:
      description: Fetch user Profile by Id.
      responses:
        '200':    #status code
          description: User data fetched successfully
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
  /api/organization/create:
    put:
      description: Allows an admin user to create the organization.
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
        requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  organization_name:
                    type: string
                  lunch_price:
                    type: string
  /api/organization/invite:
    post:
      description: Allows an admin user to send an invitation to join the organization.
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
        requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  email:
                    type: string
  /api/organization/staff/signup:
    post:
      description: An  OTP code would be sent to user email, the token sent would be used within the otp_token field
      responses:
        '200':    #status code
          description: Success
        '400':
          description: bad request
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
                    
                  password:
                    type: string

                  otp_token:
                    type: string 
                  first_name:
                    type: string
                  last_name:
                    type: string
                  phone_number:
                    type: string
  /api/organization/wallet/update:
    patch:
      description: Allows an admin user to update wallet balance.
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
        requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  amount:
                    type: string
                    example: balance
  /api/organization/launch/update:
    patch:
      description: Allows an admin user to update launch balance.
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
        requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  launch_price:
                    type: string
                    example: launch_price
  /api/withdrawal/request:
    patch:
      description: Allows an admin user to update launch balance.
      responses:
        '200':    #status code
          description: Withdrawal request created successfully
        '400':
          description: bad request
        '401':
          description: Unauthorised (e.g., Bad Token)
        '500':
          description: Internal server error
        Authorization:  
          description:   Bearer access_token
        requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  bank_name:
                    type: string
                  bank_number:
                    type: string
                  bank_code:
                    type: string
                  amount:
                    type: string
                    
    
`;
module.exports = swagger;

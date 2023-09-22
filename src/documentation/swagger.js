const swagger = `
openapi: 3.0.0
info:
  title: My Node.js API
  description: Documentation for My Node.js API
  version: 1.0.0

 

paths:
  /api/auth/user/signup:
    post:
      summary: Creates a user.
      parameters:
        - name: Authorization
          in: header
          description: Bearer token for authentication
          required: true
      description: Endpoint for user signup. 
      responses:
        '201':    # status code
          description: successfull
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
           
       


 
           
  /api/auth/login:
    post:
    summary: Logs in a user.
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
                

                    
    
`;
module.exports = swagger;

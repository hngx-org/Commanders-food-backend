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
  /api/auth/user/signup:
    post:
      description: Endpoint for user registration.
      security:
      - bearerAuth: []
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
      security:
      - bearerAuth: []
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
      security:
      - bearerAuth: []
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
  /api/lunch/send:
    post:
      description: Create a new lunch request.
      security:
      - bearerAuth: []
      responses:
        '201':
         description: Lunch request created successfully.
        requestBody:
          required: true
          content:
           application/json:
            schema:
             type: object
             properties:
              receivers:
                type: string
              quantities:
                type: number
              note:
                type: string
  /api/lunch/all:
    get:
      description: Get all Lunches.
      security:
      - bearerAuth: []
      responses:
        '201':
         description: Lunch data fetched successfully
  /api/lunch/:user_id:
    get:
     description: Gets a specific lunch.
     security:
      - bearerAuth: []
     responses:
      '201':
       description: Lunch request created successfully
  /api/user/all:
    get:
      description: Fetches all users.
      security:
      - bearerAuth: []
      responses:
         '200':
          description: All Users
  /api/user/search/<nameoremail>:
    get:
      description: Get a user by query params
      security:
      - bearerAuth: []
      responses:
        '200': #status code
          descriptions: User Found
  /api/user/redeem:
    post:
      description: Allows a user to add launch credit to launch credit balance. A token must be redeemed before it can be withdrawn
      security:
      - bearerAuth: []
      responses:
        '200': #status code
           description: Successful
        requestBody:
           required: true
           content:
             application/json:
               schema:
                 type: object
                 properties:
                   user_id:
                     type:string



      
    
      
    
`;
module.exports = swagger;

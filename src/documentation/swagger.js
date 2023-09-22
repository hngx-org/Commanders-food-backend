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

    
      
    
`;
module.exports = swagger;

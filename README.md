# Local Machine Deployment

## Testing

1. Download or clone the repository on your local machine.
2. Open Terminal and `cd` to the project_folder.
3. Run `npm install` to install dependencies. This project has three dependencies:
  * [leveldb](https://github.com/Level/level)
  * [crypto.js](https://www.npmjs.com/package/crypto-js)
  * [express.js](https://expressjs.com/)
4. Run `npm start` to start server on port **8000**.

# RESP API Documentation

**Base Path**: `/`

**Content-Type**: `application/json`

## GET /block/:blockheight

**Description**: Read block information by height

**Request-Type**: GET

**Path Parameter**:
  
  * blockheight: Number

**Response-Type**: JSON

**Response**:

  * Success
  
    **Status-Code**: 200
    
    **Response-Body**:
    ```
    {
        "hash": "7cc783e152529dafe9de683b4220c65995b33e437bd1f16f17fda4e43c591cbf",
        "height": 4,
        "body": "Test block in blockchain",
        "time": "1538462271",
        "previousBlockHash": "dfa92fabcc050f5107dbf4388a21a61fcef418e86d8e03398d70c8c5133e5b54"
    }
    ```
  
  * Error
  
    **Status-Code**: 400
    
    **Response-Body**:
    ```
    {
        "error": "Block not found in the database."
    }
    ```
    
## POST /block

**Description**: Append new block if valid to the blockchain

**Request-Type**: POST

**Request-Body**:
```
{
	  "body": "Test block in blockchain"
}
```

**Response-Type**: JSON

**Response**:

  * Success
  
    **Status-Code**: 200
    
    **Response-Body**:
    ```
    {
        "hash": "7cc783e152529dafe9de683b4220c65995b33e437bd1f16f17fda4e43c591cbf",
        "height": 4,
        "body": "Test block in blockchain",
        "time": "1538462271",
        "previousBlockHash": "dfa92fabcc050f5107dbf4388a21a61fcef418e86d8e03398d70c8c5133e5b54"
    }
    ```
  
  * Error : If body of response is invalid
  
    **Status-Code**: 400
    
    **Response-Body**:
    ```
    {
        "error": "Cannot create block"
    }
    ```

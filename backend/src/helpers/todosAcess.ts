import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { INSPECT_MAX_BYTES } from 'buffer';
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import {APIGatewayProxyEvent} from "aws-lambda"
// import { getUserId } from '../lambda/utils';
// import { TodoUpdate } from '../models/TodoUpdate';
const AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)
const todoTable = process.env.TODOS_TABLE;
const todoIndex = process.env.TODOS_CREATED_AT_INDEX;

// const logger = createLogger('TodosAccess')
 const docClient: DocumentClient = createDynamoDBClient();

// // TODO: Implement the dataLayer logic
export async function createTodo  (todo: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: todoTable,
      Item: todo
    }).promise()

    return todo
  }



  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }

  export  async function  getAllTodoByUser (userId: string): Promise<TodoItem[]>{
    const result = await docClient.query({
      TableName: todoTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues:{
        ':userId': userId
      }
    }).promise()
    // return  result.Items as TodoItem
    return result.Items as TodoItem[]

  } 

  export  async function  getTodoById (todoId: string): Promise<TodoItem>{
    const result = await docClient.query({
      TableName: todoTable,
      IndexName: todoIndex,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues:{
        ':todoId': todoId
      }
    }).promise()
    if(result.Items.length > 0){
        return result.Items[0] as TodoItem
    }
    return null
  } 


  export  async function  updateTodo (todo: TodoItem): Promise<TodoItem>{
    const result = await docClient.update({
      TableName: todoTable,
      Key:{
        userId: todo.userId,
        todoId: todo.todoId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues:{
        ':attachmentUrl': todo.attachmentUrl
      }
    }).promise()
   
        return result.Attributes as TodoItem
  } 

  export  async function  deleteTodo (todoId: string, userId: string): Promise<{}>{
    // const todoId = event.pathParameters.todoId
  // const userId = getUserId(event);
  // const userId = getUserId(event)
     await docClient.delete({
      TableName: todoTable,
      Key:{
        todoId: todoId,
        userId: userId,
      }
    }).promise()
   
        return  {}
        // return result.Attributes as TodoItem
  } 



